import { protectedProcedure, publicProcedure, router } from '../index';
import { bookingRouter } from './booking';

export const appRouter = router({
  healthCheck: publicProcedure.query(() => {
    return 'OK';
  }),
  privateData: protectedProcedure.query(({ ctx }) => {
    return {
      message: 'This is private',
      user: ctx.session.user,
    };
  }),
  booking: bookingRouter,
});
export type AppRouter = typeof appRouter;
