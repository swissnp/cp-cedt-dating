import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const userManageRouter = createTRPCRouter({
    deleteUser: protectedProcedure
    .input(z.object({}))
    .mutation(async ({ ctx }) => {
        const user = await prisma.user
        .delete({
            where: {
                id: ctx.session.user.id,
            },
        })
        .catch(() => {
            throw new TRPCError({ code: "NOT_FOUND" });
        });
        return user;
    })
});