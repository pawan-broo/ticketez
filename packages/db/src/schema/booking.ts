import { pgTable, text, timestamp, uuid, integer } from 'drizzle-orm/pg-core';
import { user } from './auth';

export const booking = pgTable('booking', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  placeSlug: text('place_slug').notNull(),
  placeName: text('place_name').notNull(),
  placeLocation: text('place_location').notNull(),
  destinationType: text('destination_type').notNull(), // 'monument' or 'museum'
  country: text('country').notNull(),
  state: text('state').notNull(),
  city: text('city').notNull(),
  bookingDate: timestamp('booking_date').notNull().defaultNow(),
  visitDate: timestamp('visit_date'),
  status: text('status').notNull().default('confirmed'), // confirmed, cancelled, completed
  paymentStatus: text('payment_status').notNull().default('pending'), // pending, completed, failed
  totalMembers: integer('total_members').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const bookingMember = pgTable('booking_member', {
  id: uuid('id').primaryKey().defaultRandom(),
  bookingId: uuid('booking_id')
    .notNull()
    .references(() => booking.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  age: integer('age').notNull(),
  email: text('email').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});