import { TRPCError } from "@trpc/server";
import { onBoardedProcedure, createTRPCRouter } from "../trpc";
import { z } from "zod";
import { prisma } from "~/server/db";
const getAttemptsLeft = async (userId: string) => {
  const today = new Date();
  const todayAttempt = await prisma.attempt
    .count({
      where: {
        userId: userId,
        createdAt: {
          gte: new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
          ),
        },
      },
    })
    .catch(() => {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Internal Server Error",
      });
    });
  const todayAttemptLeft = 3 - todayAttempt;
  return todayAttemptLeft;
}
export const getUserRouter = createTRPCRouter({
  getUserInfo: onBoardedProcedure
    .input(z.object({ handle: z.string() }))
    .query(async({ input }) => {
      const user =  await prisma.user.findFirst({
        where: {
          name: input.handle,
        },
        select: {
          name: true,
          bio: true,
          isOnboarded: true,
          interests: true,
        },
      }).catch(() => {
        throw new TRPCError({code: 'INTERNAL_SERVER_ERROR', message: 'Internal Server Error'})
      })
      if (user === null || user.isOnboarded === false) {
        throw new TRPCError({code: 'NOT_FOUND', message: 'This user haven\'t onboarded yet'})
      }
      console.log(user)
      return user;
    }),
  getAttemptsLeft: onBoardedProcedure
    .input(z.object({}))
    .query(async ({ ctx }) => {
      return await getAttemptsLeft(ctx.session.user.id);
    }),
  useEye: onBoardedProcedure
    .input(z.object({ for: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const attemptsleft = await getAttemptsLeft(ctx.session.user.id)
      if (attemptsleft <= 0) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Run out of 👁️",
        });
      }
      const userIdFor = await prisma.user.findFirst({
        where: {
          name: input.for,
        },
        select: {
          id: true,
        },
      });
      const isForUserSoad = await prisma.user
        .update({
          where: {
            id: ctx.session.user.id,
          },
          data: {
            attempts: {
              create: {
                forUser: {
                  connect: {
                    id: userIdFor?.id,
                  },
                },
              },
            },
          },
          select: {
            attempts: {
              select: {
                forUser: {
                  select: {
                    soad: true,
                  }
                },
              },
            },
          },
        })
        .catch(() => {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Internal Server Error",
          });
        });
      // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
      if (typeof isForUserSoad?.attempts[0] === 'undefined' || isForUserSoad?.attempts[0].forUser.soad === null) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal Server Error",
        });
      }
      return isForUserSoad.attempts[0].forUser.soad;
    }),
});
