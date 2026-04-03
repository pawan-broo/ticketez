import { z } from 'zod';
import { router, publicProcedure, protectedProcedure, adminProcedure } from '../index';
import { db } from '@ticketez/db';
import { booking, bookingMember } from '@ticketez/db/schema/booking';
import { place } from '@ticketez/db/schema/places';
import { user } from '@ticketez/db/schema/auth';
import { eq, and, desc, inArray } from 'drizzle-orm';

import { sendBookingPendingEmail, sendBookingConfirmedEmail } from '@ticketez/email';

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
        totalAmount: z.number().int().min(0),
        transactionId: z.string().min(1, 'Transaction ID is required'),
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
          totalAmount: input.totalAmount,
          status: 'pending',
          paymentStatus: 'unverified',
          transactionId: input.transactionId,
        })
        .returning();

      if (!newBooking) {
        throw new Error('Failed to create booking');
      }

      await db.insert(bookingMember).values(
        input.members.map((member) => ({
          bookingId: newBooking.id,
          name: member.name,
          age: member.age,
          email: member.email,
        })),
      );

      const confirmationUrl = `${process.env.BETTER_AUTH_URL}/tickets/confirmation/${newBooking.id}`;
      const memberEmails = input.members.map((m) => m.email);

      await sendBookingPendingEmail({
        to: memberEmails,
        bookingId: newBooking.id,
        placeName: input.placeName,
        placeLocation: input.placeLocation,
        members: input.members,
        bookingDate: newBooking.bookingDate,
        visitDate: newBooking.visitDate,
        totalMembers: input.members.length,
        totalAmount: input.totalAmount,
        transactionId: input.transactionId,
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

      const [placeData] = await db
        .select({ images: place.images })
        .from(place)
        .where(eq(place.slug, bookingData.placeSlug))
        .limit(1);

      return {
        booking: bookingData,
        members,
        placeImages: placeData?.images ?? [],
      };
    }),

  getUserBookings: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const bookings = await db
      .select()
      .from(booking)
      .where(eq(booking.userId, userId))
      .orderBy(desc(booking.createdAt));

    const slugs = [...new Set(bookings.map((b) => b.placeSlug))];

    const placeImages: Record<string, string[]> = {};

    if (slugs.length > 0) {
      const places = await db
        .select({ slug: place.slug, images: place.images })
        .from(place)
        .where(inArray(place.slug, slugs));

      for (const p of places) {
        placeImages[p.slug] = p.images;
      }
    }

    return bookings.map((b) => ({
      ...b,
      placeImages: placeImages[b.placeSlug] ?? [],
    }));
  }),

  getAllBookings: adminProcedure
    .input(
      z.object({
        status: z.string().optional(),
        paymentStatus: z.string().optional(),
        search: z.string().optional(),
        limit: z.number().int().min(1).max(100).default(50),
        offset: z.number().int().min(0).default(0),
      }),
    )
    .query(async ({ input }) => {
      const conditions = [];

      if (input.status && input.status !== 'all') {
        conditions.push(eq(booking.status, input.status));
      }

      if (input.paymentStatus && input.paymentStatus !== 'all') {
        conditions.push(eq(booking.paymentStatus, input.paymentStatus));
      }

      const bookings = await db
        .select({
          id: booking.id,
          placeSlug: booking.placeSlug,
          placeName: booking.placeName,
          placeLocation: booking.placeLocation,
          destinationType: booking.destinationType,
          country: booking.country,
          state: booking.state,
          city: booking.city,
          bookingDate: booking.bookingDate,
          visitDate: booking.visitDate,
          totalMembers: booking.totalMembers,
          totalAmount: booking.totalAmount,
          status: booking.status,
          paymentStatus: booking.paymentStatus,
          transactionId: booking.transactionId,
          adminNote: booking.adminNote,
          createdAt: booking.createdAt,
          updatedAt: booking.updatedAt,
          userId: booking.userId,
          userName: user.name,
          userEmail: user.email,
          userImage: user.image,
        })
        .from(booking)
        .leftJoin(user, eq(booking.userId, user.id))
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(booking.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      // Apply search filter in JS since it spans joined columns
      const filtered = input.search
        ? bookings.filter((b) => {
            const q = input.search!.toLowerCase();
            return (
              b.placeName.toLowerCase().includes(q) ||
              b.userName?.toLowerCase().includes(q) ||
              b.userEmail?.toLowerCase().includes(q) ||
              b.id.toLowerCase().includes(q)
            );
          })
        : bookings;

      return filtered;
    }),

  confirmPayment: adminProcedure
    .input(
      z.object({
        bookingId: z.string().uuid(),
        adminNote: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const [updated] = await db
        .update(booking)
        .set({
          status: 'confirmed',
          paymentStatus: 'verified',
          adminNote: input.adminNote ?? null,
          updatedAt: new Date(),
        })
        .where(eq(booking.id, input.bookingId))
        .returning();

      if (!updated) {
        throw new Error('Booking not found');
      }

      const members = await db
        .select()
        .from(bookingMember)
        .where(eq(bookingMember.bookingId, input.bookingId));

      const confirmationUrl = `${process.env.BETTER_AUTH_URL}/tickets/confirmation/${updated.id}`;
      const memberEmails = members.map((m) => m.email);

      await sendBookingConfirmedEmail({
        to: memberEmails,
        bookingId: updated.id,
        placeName: updated.placeName,
        placeLocation: updated.placeLocation,
        members: members.map((m) => ({ name: m.name, age: m.age, email: m.email })),
        bookingDate: updated.bookingDate,
        visitDate: updated.visitDate,
        totalMembers: updated.totalMembers,
        totalAmount: updated.totalAmount,
        transactionId: updated.transactionId ?? '',
        confirmationUrl,
      });

      return { success: true };
    }),

  rejectPayment: adminProcedure
    .input(
      z.object({
        bookingId: z.string().uuid(),
        adminNote: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const [updated] = await db
        .update(booking)
        .set({
          status: 'cancelled',
          paymentStatus: 'failed',
          adminNote: input.adminNote ?? null,
          updatedAt: new Date(),
        })
        .where(eq(booking.id, input.bookingId))
        .returning();

      if (!updated) {
        throw new Error('Booking not found');
      }

      return { success: true };
    }),
});
