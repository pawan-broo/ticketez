import {
  pgTable,
  text,
  uuid,
  timestamp,
  boolean,
  integer,
  real,
  jsonb,
} from 'drizzle-orm/pg-core';

export const place = pgTable('place', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  type: text('type').notNull(), // 'monument' | 'museum'
  country: text('country').notNull(),
  state: text('state').notNull(),
  city: text('city').notNull(),
  location: text('location').notNull(), // human-readable address
  latitude: real('latitude'), // for geo-queries
  longitude: real('longitude'), // for geo-queries
  googleMapLink: text('google_map_link'),
  images: text('images').array().notNull().default([]),
  videos: text('videos').array().notNull().default([]),
  shortDesc: text('short_desc'),
  longDesc: text('long_desc'),
  precautionAndSafety: text('precaution_and_safety').array().notNull().default([]),
  metadata: jsonb('metadata').$type<{ label: string; data: string }[]>().default([]),
  ticketPrice: integer('ticket_price').notNull().default(0), // in paise (₹ × 100)
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
