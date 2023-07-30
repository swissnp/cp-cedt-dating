import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";
import { onBoardingSchema } from "~/utils/validator/userInput";

export const onBoardingRouter = createTRPCRouter({
  checkOnboarded: protectedProcedure
    .input(z.object({}))
    .query(async ({ ctx }) => {
      const user = await prisma.user.findFirst({
        where: {
          id: ctx.session.user.id,
        },
        select: {
          isOnboarded: true,
        },
      });
      if (user) {
        return user.isOnboarded;
      } else {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
    }),
  setOnboarded: protectedProcedure
    .input(onBoardingSchema)
    .mutation(async ({ input, ctx }) => {
      const user = await prisma.user
        .update({
          where: {
            id: ctx.session.user.id,
          },
          data: {
            bio: input.bio,
            soad: input.soad,
            isOnboarded: true,
          },
        })
        .catch(() => {
          throw new TRPCError({ code: "NOT_FOUND" });
        });
      return user;
    }),
});
