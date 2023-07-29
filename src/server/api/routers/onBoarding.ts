import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const onBoardingRouter = createTRPCRouter({
  checkOnboarded: protectedProcedure
    .input(z.object({}))
    .query(async ({ctx}) => {
      const user = await prisma.user.findFirst({
        where: {
          id: ctx.session.user.id,
        },
        select: {
          isOnboarded: true,
        }
      })
      console.log(user?.isOnboarded,ctx.session.user.id)
      if (user) {
        return user.isOnboarded
      } else {
        throw new TRPCError({code: 'UNAUTHORIZED'})
      }
    }, 
    ), 
    
});
