import { pgTable, text, uuid, timestamp, unique } from 'drizzle-orm/pg-core';
import { user } from './auth';
import { place } from './places';

export const savedPlace = pgTable(
  'saved_place',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    placeId: uuid('place_id').references(() => place.id, {
      onDelete: 'cascade',
    }),
    placeSlug: text('place_slug').notNull(),
    placeName: text('place_name').notNull(),
    placeLocation: text('place_location').notNull(),
    destinationType: text('destination_type').notNull(), // 'monument' | 'museum'
    country: text('country').notNull(),
    state: text('state').notNull(),
    city: text('city').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => [unique('uq_user_place_slug').on(table.userId, table.placeSlug)],
);
