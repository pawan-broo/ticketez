import { z } from 'zod';
import { router, publicProcedure, adminProcedure } from '../index';
import { db } from '@ticketez/db';
import { place } from '@ticketez/db/schema/places';
import { eq, and, ilike, or } from 'drizzle-orm';

export const placesRouter = router({
  getNearby: publicProcedure
    .input(
      z.object({
        lat: z.number(),
        lng: z.number(),
        radiusKm: z.number().default(500),
        type: z.enum(['monument', 'museum', 'all']).default('all'),
        search: z.string().optional(),
        state: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      const conditions = [eq(place.isActive, true)];

      if (input.type !== 'all') {
        conditions.push(eq(place.type, input.type));
      }

      if (input.state) {
        conditions.push(ilike(place.state, `%${input.state}%`));
      }

      if (input.search) {
        conditions.push(
          or(
            ilike(place.name, `%${input.search}%`),
            ilike(place.city, `%${input.search}%`),
            ilike(place.location, `%${input.search}%`),
          )!,
        );
      }

      const places = await db
        .select()
        .from(place)
        .where(and(...conditions));

      return places;
    }),

  getAll: publicProcedure
    .input(
      z.object({
        type: z.enum(['monument', 'museum', 'all']).default('all'),
        state: z.string().optional(),
        city: z.string().optional(),
        search: z.string().optional(),
        limit: z.number().int().min(1).max(200).default(100),
      }),
    )
    .query(async ({ input }) => {
      const conditions = [eq(place.isActive, true)];

      if (input.type !== 'all') {
        conditions.push(eq(place.type, input.type));
      }

      if (input.state) {
        conditions.push(ilike(place.state, `%${input.state}%`));
      }

      if (input.city) {
        conditions.push(ilike(place.city, `%${input.city}%`));
      }

      if (input.search) {
        conditions.push(
          or(
            ilike(place.name, `%${input.search}%`),
            ilike(place.city, `%${input.search}%`),
            ilike(place.location, `%${input.search}%`),
          )!,
        );
      }

      const places = await db
        .select()
        .from(place)
        .where(and(...conditions))
        .limit(input.limit);

      return places;
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const [result] = await db
        .select()
        .from(place)
        .where(and(eq(place.slug, input.slug), eq(place.isActive, true)))
        .limit(1);

      if (!result) {
        throw new Error('Place not found');
      }

      return result;
    }),

  // Admin procedures for CRUD
  adminGetAll: adminProcedure
    .input(
      z.object({
        type: z.enum(['monument', 'museum', 'all']).default('all'),
        state: z.string().optional(),
        city: z.string().optional(),
        search: z.string().optional(),
        isActive: z.boolean().optional(),
        limit: z.number().int().min(1).max(200).default(100),
        offset: z.number().int().min(0).default(0),
      }),
    )
    .query(async ({ input }) => {
      const conditions = [];

      if (input.type !== 'all') {
        conditions.push(eq(place.type, input.type));
      }

      if (input.state) {
        conditions.push(ilike(place.state, `%${input.state}%`));
      }

      if (input.city) {
        conditions.push(ilike(place.city, `%${input.city}%`));
      }

      if (input.isActive !== undefined) {
        conditions.push(eq(place.isActive, input.isActive));
      }

      if (input.search) {
        conditions.push(
          or(
            ilike(place.name, `%${input.search}%`),
            ilike(place.city, `%${input.search}%`),
            ilike(place.state, `%${input.search}%`),
          )!,
        );
      }

      const places = await db
        .select()
        .from(place)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .limit(input.limit)
        .offset(input.offset);

      return places;
    }),

  adminGetById: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      const [result] = await db
        .select()
        .from(place)
        .where(eq(place.id, input.id))
        .limit(1);

      if (!result) {
        throw new Error('Place not found');
      }

      return result;
    }),

  adminCreate: adminProcedure
    .input(
      z.object({
        name: z.string().min(1),
        slug: z.string().min(1),
        type: z.enum(['monument', 'museum']),
        country: z.string().min(1),
        state: z.string().min(1),
        city: z.string().min(1),
        location: z.string().min(1),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
        googleMapLink: z.string().optional(),
        images: z.array(z.string()).default([]),
        videos: z.array(z.string()).default([]),
        shortDesc: z.string().optional(),
        longDesc: z.string().optional(),
        precautionAndSafety: z.array(z.string()).default([]),
        metadata: z
          .array(z.object({ label: z.string(), data: z.string() }))
          .default([]),
        ticketPrice: z.number().int().min(0),
        isActive: z.boolean().default(true),
      }),
    )
    .mutation(async ({ input }) => {
      const [newPlace] = await db
        .insert(place)
        .values({
          name: input.name,
          slug: input.slug,
          type: input.type,
          country: input.country,
          state: input.state,
          city: input.city,
          location: input.location,
          latitude: input.latitude ?? null,
          longitude: input.longitude ?? null,
          googleMapLink: input.googleMapLink ?? null,
          images: input.images,
          videos: input.videos,
          shortDesc: input.shortDesc ?? null,
          longDesc: input.longDesc ?? null,
          precautionAndSafety: input.precautionAndSafety,
          metadata: input.metadata,
          ticketPrice: input.ticketPrice,
          isActive: input.isActive,
        })
        .returning();

      if (!newPlace) {
        throw new Error('Failed to create place');
      }

      return newPlace;
    }),

  adminUpdate: adminProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().min(1).optional(),
        slug: z.string().min(1).optional(),
        type: z.enum(['monument', 'museum']).optional(),
        country: z.string().min(1).optional(),
        state: z.string().min(1).optional(),
        city: z.string().min(1).optional(),
        location: z.string().min(1).optional(),
        latitude: z.number().nullable().optional(),
        longitude: z.number().nullable().optional(),
        googleMapLink: z.string().nullable().optional(),
        images: z.array(z.string()).optional(),
        videos: z.array(z.string()).optional(),
        shortDesc: z.string().nullable().optional(),
        longDesc: z.string().nullable().optional(),
        precautionAndSafety: z.array(z.string()).optional(),
        metadata: z
          .array(z.object({ label: z.string(), data: z.string() }))
          .optional(),
        ticketPrice: z.number().int().min(0).optional(),
        isActive: z.boolean().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const { id, ...rest } = input;

      const updateData: Record<string, unknown> = {
        updatedAt: new Date(),
      };

      // Only include provided fields
      for (const [key, value] of Object.entries(rest)) {
        if (value !== undefined) {
          updateData[key] = value;
        }
      }

      const [updated] = await db
        .update(place)
        .set(updateData)
        .where(eq(place.id, id))
        .returning();

      if (!updated) {
        throw new Error('Place not found');
      }

      return updated;
    }),

  adminDelete: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
      const [deleted] = await db
        .delete(place)
        .where(eq(place.id, input.id))
        .returning();

      if (!deleted) {
        throw new Error('Place not found');
      }

      return { success: true };
    }),

  adminToggleActive: adminProcedure
    .input(z.object({ id: z.string().uuid(), isActive: z.boolean() }))
    .mutation(async ({ input }) => {
      const [updated] = await db
        .update(place)
        .set({ isActive: input.isActive, updatedAt: new Date() })
        .where(eq(place.id, input.id))
        .returning();

      if (!updated) {
        throw new Error('Place not found');
      }

      return updated;
    }),
});
