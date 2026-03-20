import { z } from 'zod';
import { router, protectedProcedure } from '../index';
import { db } from '@ticketez/db';
import { savedPlace } from '@ticketez/db/schema/savedPlace';
import { eq, and } from 'drizzle-orm';

export const savedPlacesRouter = router({
  save: protectedProcedure
    .input(
      z.object({
        placeSlug: z.string().min(1),
        placeName: z.string().min(1),
        placeLocation: z.string().min(1),
        destinationType: z.enum(['monument', 'museum']),
        country: z.string().min(1),
        state: z.string().min(1),
        city: z.string().min(1),
        placeId: z.string().uuid().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      await db
        .insert(savedPlace)
        .values({
          userId,
          placeId: input.placeId ?? null,
          placeSlug: input.placeSlug,
          placeName: input.placeName,
          placeLocation: input.placeLocation,
          destinationType: input.destinationType,
          country: input.country,
          state: input.state,
          city: input.city,
        })
        .onConflictDoNothing();

      return { success: true };
    }),

  unsave: protectedProcedure
    .input(z.object({ placeSlug: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      await db
        .delete(savedPlace)
        .where(
          and(
            eq(savedPlace.userId, userId),
            eq(savedPlace.placeSlug, input.placeSlug),
          ),
        );

      return { success: true };
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const results = await db
      .select()
      .from(savedPlace)
      .where(eq(savedPlace.userId, userId))
      .orderBy(savedPlace.createdAt);

    return results;
  }),

  isSaved: protectedProcedure
    .input(z.object({ placeSlug: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const [existing] = await db
        .select({ id: savedPlace.id })
        .from(savedPlace)
        .where(
          and(
            eq(savedPlace.userId, userId),
            eq(savedPlace.placeSlug, input.placeSlug),
          ),
        )
        .limit(1);

      return { saved: !!existing };
    }),
});
