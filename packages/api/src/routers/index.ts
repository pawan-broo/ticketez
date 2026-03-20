import { protectedProcedure, publicProcedure, router } from '../index';
import { bookingRouter } from './booking';
import { placesRouter } from './places';
import { adminRouter } from './admin';
import { savedPlacesRouter } from './savedPlaces';
import { contactRouter } from './contact';

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
  places: placesRouter,
  admin: adminRouter,
  savedPlaces: savedPlacesRouter,
  contact: contactRouter,
});

export type AppRouter = typeof appRouter;
