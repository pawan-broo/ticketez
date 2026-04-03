import { z } from 'zod';
import { router, adminProcedure } from '../index';
import { db } from '@ticketez/db';
import { booking } from '@ticketez/db/schema/booking';

import { user } from '@ticketez/db/schema/auth';
import { eq, count, sum, sql, desc, and, gte, lt } from 'drizzle-orm';

export const adminRouter = router({
  getStats: adminProcedure.query(async () => {
    const [totalResult] = await db
      .select({ count: count() })
      .from(booking);

    const [pendingResult] = await db
      .select({ count: count() })
      .from(booking)
      .where(eq(booking.status, 'pending'));

    const [confirmedResult] = await db
      .select({ count: count() })
      .from(booking)
      .where(eq(booking.status, 'confirmed'));

    const [cancelledResult] = await db
      .select({ count: count() })
      .from(booking)
      .where(eq(booking.status, 'cancelled'));

    const [unverifiedResult] = await db
      .select({ count: count() })
      .from(booking)
      .where(eq(booking.paymentStatus, 'unverified'));

    const [revenueResult] = await db
      .select({ total: sum(booking.totalAmount) })
      .from(booking)
      .where(eq(booking.paymentStatus, 'verified'));

    const [totalUsersResult] = await db
      .select({ count: count() })
      .from(user);

    return {
      totalBookings: totalResult?.count ?? 0,
      pendingBookings: pendingResult?.count ?? 0,
      confirmedBookings: confirmedResult?.count ?? 0,
      cancelledBookings: cancelledResult?.count ?? 0,
      unverifiedPayments: unverifiedResult?.count ?? 0,
      totalRevenuePaise: Number(revenueResult?.total ?? 0),
      totalUsers: totalUsersResult?.count ?? 0,
    };
  }),

  getPlaceStats: adminProcedure.query(async () => {
    const stats = await db
      .select({
        placeSlug: booking.placeSlug,
        placeName: booking.placeName,
        city: booking.city,
        state: booking.state,
        destinationType: booking.destinationType,
        totalBookings: count(booking.id),
        confirmedBookings: sql<number>`count(case when ${booking.status} = 'confirmed' then 1 end)::int`,
        pendingBookings: sql<number>`count(case when ${booking.status} = 'pending' then 1 end)::int`,
        totalRevenuePaise: sql<number>`coalesce(sum(case when ${booking.paymentStatus} = 'verified' then ${booking.totalAmount} else 0 end), 0)::int`,
        totalMembers: sql<number>`coalesce(sum(${booking.totalMembers}), 0)::int`,
      })
      .from(booking)
      .groupBy(
        booking.placeSlug,
        booking.placeName,
        booking.city,
        booking.state,
        booking.destinationType,
      )
      .orderBy(desc(sql`count(${booking.id})`));

    return stats;
  }),

  getRecentBookings: adminProcedure
    .input(
      z.object({
        limit: z.number().int().min(1).max(50).default(10),
      }),
    )
    .query(async ({ input }) => {
      const bookings = await db
        .select({
          id: booking.id,
          placeName: booking.placeName,
          placeLocation: booking.placeLocation,
          destinationType: booking.destinationType,
          city: booking.city,
          state: booking.state,
          bookingDate: booking.bookingDate,
          visitDate: booking.visitDate,
          totalMembers: booking.totalMembers,
          totalAmount: booking.totalAmount,
          status: booking.status,
          paymentStatus: booking.paymentStatus,
          transactionId: booking.transactionId,
          adminNote: booking.adminNote,
          createdAt: booking.createdAt,
          userId: booking.userId,
          userName: user.name,
          userEmail: user.email,
          userImage: user.image,
        })
        .from(booking)
        .leftJoin(user, eq(booking.userId, user.id))
        .orderBy(desc(booking.createdAt))
        .limit(input.limit);

      return bookings;
    }),

  getBookingChartData: adminProcedure
    .input(z.object({ month: z.number().int().min(1).max(12), year: z.number().int().min(2020).max(2100) }))
    .query(async ({ input }) => {
      const { month, year } = input;
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 1);

      const rows = await db
        .select({
          date: sql<string>`DATE(${booking.bookingDate})::text`,
          total: sql<number>`COUNT(*)::int`,
          pending: sql<number>`COUNT(CASE WHEN ${booking.status} = 'pending' THEN 1 END)::int`,
          confirmed: sql<number>`COUNT(CASE WHEN ${booking.status} = 'confirmed' THEN 1 END)::int`,
          cancelled: sql<number>`COUNT(CASE WHEN ${booking.status} = 'cancelled' THEN 1 END)::int`,
          unverifiedPayment: sql<number>`COUNT(CASE WHEN ${booking.paymentStatus} = 'unverified' THEN 1 END)::int`,
        })
        .from(booking)
        .where(and(gte(booking.bookingDate, start), lt(booking.bookingDate, end)))
        .groupBy(sql`DATE(${booking.bookingDate})`)
        .orderBy(sql`DATE(${booking.bookingDate})`);

      return rows;
    }),

  getRevenueChartData: adminProcedure
    .input(z.object({ month: z.number().int().min(1).max(12), year: z.number().int().min(2020).max(2100) }))
    .query(async ({ input }) => {
      const { month, year } = input;
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 1);

      const rows = await db
        .select({
          date: sql<string>`DATE(${booking.bookingDate})::text`,
          revenue: sql<number>`COALESCE(SUM(CASE WHEN ${booking.paymentStatus} = 'verified' THEN ${booking.totalAmount} ELSE 0 END), 0)::int`,
        })
        .from(booking)
        .where(and(gte(booking.bookingDate, start), lt(booking.bookingDate, end)))
        .groupBy(sql`DATE(${booking.bookingDate})`)
        .orderBy(sql`DATE(${booking.bookingDate})`);

      return rows;
    }),

  getPlacePerformanceChartData: adminProcedure
    .input(z.object({ month: z.number().int().min(1).max(12), year: z.number().int().min(2020).max(2100) }))
    .query(async ({ input }) => {
      const { month, year } = input;
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 1);

      const rows = await db
        .select({
          date: sql<string>`DATE(${booking.bookingDate})::text`,
          placeName: booking.placeName,
          bookings: sql<number>`COUNT(*)::int`,
          members: sql<number>`COALESCE(SUM(${booking.totalMembers}), 0)::int`,
        })
        .from(booking)
        .where(and(gte(booking.bookingDate, start), lt(booking.bookingDate, end)))
        .groupBy(sql`DATE(${booking.bookingDate})`, booking.placeName)
        .orderBy(sql`DATE(${booking.bookingDate})`);

      return rows;
    }),
});
