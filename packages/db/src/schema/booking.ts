import { pgTable, text, timestamp, uuid, integer } from 'drizzle-orm/pg-core';
import { user } from './auth';
import { place } from './places';

export const booking = pgTable('booking', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  placeId: uuid('place_id').references(() => place.id, { onDelete: 'set null' }), // soft link to places table
  placeSlug: text('place_slug').notNull(),
  placeName: text('place_name').notNull(),
  placeLocation: text('place_location').notNull(),
  destinationType: text('destination_type').notNull(), // 'monument' | 'museum'
  country: text('country').notNull(),
  state: text('state').notNull(),
  city: text('city').notNull(),
  bookingDate: timestamp('booking_date').notNull().defaultNow(),
  visitDate: timestamp('visit_date'),
  totalMembers: integer('total_members').notNull(),
  totalAmount: integer('total_amount').notNull().default(0), // in paise (₹ × 100)
  // 'pending' | 'confirmed' | 'cancelled' | 'completed'
  status: text('status').notNull().default('pending'),
  // 'unverified' | 'verified' | 'failed'
  paymentStatus: text('payment_status').notNull().default('unverified'),
  transactionId: text('transaction_id'), // UPI transaction ID entered by user
  upiQrData: text('upi_qr_data'), // UPI payment string shown to user
  adminNote: text('admin_note'), // optional note from admin on verify/reject
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
