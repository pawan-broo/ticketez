import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../index';
import { db } from '@ticketez/db';
import { booking, bookingMember } from '@ticketez/db/schema/booking';
import { eq } from 'drizzle-orm';

import { sendBookingConfirmation } from '@ticketez/email';

export const bookingRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        placeSlug: z.string(),
        placeName: z.string(),
        placeLocation: z.string(),
        destinationType: z.enum(['monument', 'museum']),
        country: z.string(),
        state: z.string(),
        city: z.string(),
        visitDate: z.string().optional(),
        members: z
          .array(
            z.object({
              name: z.string().min(1, 'Name is required'),
              age: z
                .number()
                .min(1, 'Age must be at least 1')
                .max(120, 'Age must be valid'),
              email: z.string().email('Valid email is required'),
            }),
          )
          .min(1, 'At least one member is required'),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Create booking
      const [newBooking] = await db
        .insert(booking)
        .values({
          userId,
          placeSlug: input.placeSlug,
          placeName: input.placeName,
          placeLocation: input.placeLocation,
          destinationType: input.destinationType,
          country: input.country,
          state: input.state,
          city: input.city,
          visitDate: input.visitDate ? new Date(input.visitDate) : null,
          totalMembers: input.members.length,
          status: 'confirmed',
          paymentStatus: 'pending',
        })
        .returning();

      console.log('newBooking', newBooking);
      if (!newBooking) {
        throw new Error('Failed to create booking');
      }

      // Create booking members
      await db.insert(bookingMember).values(
        input.members.map((member) => ({
          bookingId: newBooking.id,
          name: member.name,
          age: member.age,
          email: member.email,
        })),
      );

      // Send confirmation emails
      const confirmationUrl = `${process.env.BETTER_AUTH_URL}/tickets/confirmation/${newBooking.id}`;
      const memberEmails = input.members.map((m) => m.email);

      // Import and call email service (you can do this async without awaiting)
      await sendBookingConfirmation({
        to: memberEmails,
        bookingId: newBooking.id,
        placeName: input.placeName,
        placeLocation: input.placeLocation,
        members: input.members,
        bookingDate: newBooking.bookingDate,
        visitDate: newBooking.visitDate,
        totalMembers: input.members.length,
        confirmationUrl,
      });

      return {
        success: true,
        bookingId: newBooking.id,
      };
    }),

  getById: publicProcedure
    .input(z.object({ bookingId: z.string().uuid() }))
    .query(async ({ input }) => {
      const [bookingData] = await db
        .select()
        .from(booking)
        .where(eq(booking.id, input.bookingId))
        .limit(1);

      if (!bookingData) {
        throw new Error('Booking not found');
      }

      const members = await db
        .select()
        .from(bookingMember)
        .where(eq(bookingMember.bookingId, input.bookingId));

      return {
        booking: bookingData,
        members,
      };
    }),

  getUserBookings: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const bookings = await db
      .select()
      .from(booking)
      .where(eq(booking.userId, userId))
      .orderBy(booking.createdAt);

    return bookings;
  }),
});
