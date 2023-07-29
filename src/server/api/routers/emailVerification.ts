import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { randomBytes } from "crypto";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";
import { sendVerificationEmail } from "~/server/email";

export const emailVerificationRouter = createTRPCRouter({
  checkVerification: publicProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ input }) => {
      const verification = await prisma.verificationToken.findFirst({
        where: {
          token: input.token,
        },
        select: {
          identifier: true,
        },
      }).catch(() => {
        throw new TRPCError({ code: "NOT_FOUND" });
      })
      if (!verification) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      await prisma.user.update({
        where: {
          email: verification.identifier,
        },
        data: {
          emailVerified: {
            set: new Date(),
          },
        },
      }).catch(() => {
        throw new TRPCError({ code: "NOT_FOUND" });
      })
      await prisma.verificationToken.delete({
        where: {
          token: input.token,
        },
      });
      return true;
    }),

  sendVerificationEmail: protectedProcedure
    .input(z.object({ email: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (!input.email.endsWith("@student.chula.ac.th")) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Email must be @student.chula.ac.th",
        });
      }

      const user = await prisma.user.update({
        where: {
          id: ctx.session.user.id,
          NOT: {
            emailVerified: { not: null },
          },
        },
        data: {
          email: {
            set: input.email,
          },
          emailVerified: {
            set: null,
          },
        },
      }).catch(() => {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: 'This email is already verified',
        })
      })

      if (user.emailVerified) {
        // fix later: it might set new email on
        throw new TRPCError({
          code: "CONFLICT",
          message: "Email already verified",
        });
      }
      if (!user.email) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Email not set",
        });
      }

      const token = await prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          verificationTokens: {
            upsert: {
              where: {
                identifier: user.email,
                id: user.id,
              },
              create: {
                id: user.id,
                token: randomBytes(32).toString("hex"),
                identifier: user.email,
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
              },
              update: {
                token: randomBytes(32).toString("hex"),
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
              },
            },
          },
        },
        select: {
          verificationTokens: {
            select: {
              token: true,
              identifier: true,
            },
          },
        },
      }).catch(() => {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: 'Something went wrong',
        })
      })

      if (!token.verificationTokens[0]) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Token not found",
        });
      }
      if (token?.verificationTokens.length != 1) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Token already exists",
        });
      }

      sendVerificationEmail(
        token.verificationTokens[0].identifier,
        token.verificationTokens[0].token
      );
      return true;
    }),
});
