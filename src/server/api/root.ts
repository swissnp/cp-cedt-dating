import { exampleRouter } from "~/server/api/routers/example";
import { createTRPCRouter } from "~/server/api/trpc";
import { onBoardingRouter } from "~/server/api/routers/onBoarding";
// import { emailVerificationRouter } from "~/server/api/routers/emailVerification";
import { userManageRouter } from "~/server/api/routers/userManage";
import { getUserRouter } from "~/server/api/routers/getUser";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  onBoarding: onBoardingRouter,
  // verify: emailVerificationRouter,
  user: userManageRouter,
  getUser: getUserRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
