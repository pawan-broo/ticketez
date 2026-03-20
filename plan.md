# Ticketez — Implementation Plan

## Table of Contents

1. [DB Schema Updates](#1-db-schema-updates)
2. [Email Service Migration — Resend → Nodemailer + Google SMTP](#2-email-service-migration)
3. [2-Step Booking Flow + UPI Payment](#3-2-step-booking-flow--upi-payment)
4. [Admin Panel](#4-admin-panel)
5. [Profile Page](#5-profile-page)
6. [Static Pages — About & Contact](#6-static-pages--about--contact)
7. [Places Near Me Page](#7-places-near-me-page)
8. [Environment Variables](#8-environment-variables)
9. [File-by-File Execution Order](#9-file-by-file-execution-order)

---

## 1. DB Schema Updates

> **Do NOT run migrations. Update schema files only and ask before migrating.**

### 1.1 `packages/db/src/schema/auth.ts`

Add a `role` column to the `user` table:

```ts
role: text('role').notNull().default('USER'), // 'USER' | 'ADMIN'
```

Better-auth needs to be told about this extra field via `additionalFields` in `packages/auth/src/index.ts`:

```ts
user: {
  additionalFields: {
    role: {
      type: 'string',
      defaultValue: 'USER',
      input: false, // not settable by the user at sign-up
    },
  },
},
```

And the auth-client in `apps/web/src/lib/auth-client.ts` already uses `inferAdditionalFields<typeof auth>()`, so `data.user.role` will be typed automatically.

---

### 1.2 `packages/db/src/schema/places.ts` *(new file)*

We currently store place data in a static `database.ts` constant. We need to persist places in the DB so admins can CRUD them and so we can do geo-queries.

```ts
export const place = pgTable('place', {
  id:              uuid('id').primaryKey().defaultRandom(),
  name:            text('name').notNull(),
  slug:            text('slug').notNull().unique(),
  type:            text('type').notNull(),           // 'monument' | 'museum'
  country:         text('country').notNull(),
  state:           text('state').notNull(),
  city:            text('city').notNull(),
  location:        text('location').notNull(),        // human-readable address
  latitude:        real('latitude'),                  // for geo-queries
  longitude:       real('longitude'),                 // for geo-queries
  googleMapLink:   text('google_map_link'),
  images:          text('images').array().notNull().default([]),
  videos:          text('videos').array().notNull().default([]),
  shortDesc:       text('short_desc'),
  longDesc:        text('long_desc'),
  precautionAndSafety: text('precaution_and_safety').array().notNull().default([]),
  metadata:        jsonb('metadata').default([]),     // [{label, data}]
  ticketPrice:     integer('ticket_price').notNull().default(0), // in paise (₹ × 100)
  isActive:        boolean('is_active').notNull().default(true),
  createdAt:       timestamp('created_at').notNull().defaultNow(),
  updatedAt:       timestamp('updated_at').notNull().defaultNow(),
});
```

Imports needed: `pgTable, text, uuid, timestamp, boolean, integer, real, jsonb`.

---

### 1.3 `packages/db/src/schema/booking.ts` *(update)*

Significant changes to support the new 2-step payment flow:

```ts
export const booking = pgTable('booking', {
  id:              uuid('id').primaryKey().defaultRandom(),
  userId:          uuid('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  placeId:         uuid('place_id').references(() => place.id, { onDelete: 'set null' }),  // NEW — soft link to places table
  placeSlug:       text('place_slug').notNull(),
  placeName:       text('place_name').notNull(),
  placeLocation:   text('place_location').notNull(),
  destinationType: text('destination_type').notNull(),  // 'monument' | 'museum'
  country:         text('country').notNull(),
  state:           text('state').notNull(),
  city:            text('city').notNull(),
  bookingDate:     timestamp('booking_date').notNull().defaultNow(),
  visitDate:       timestamp('visit_date'),
  totalMembers:    integer('total_members').notNull(),
  totalAmount:     integer('total_amount').notNull().default(0), // in paise
  // Booking status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  status:          text('status').notNull().default('pending'),
  // Payment status: 'unverified' | 'verified' | 'failed'
  paymentStatus:   text('payment_status').notNull().default('unverified'),
  transactionId:   text('transaction_id'),            // UPI transaction ID entered by user
  upiQrData:       text('upi_qr_data'),               // UPI payment string shown to user
  adminNote:       text('admin_note'),                // optional note from admin on verify/reject
  createdAt:       timestamp('created_at').notNull().defaultNow(),
  updatedAt:       timestamp('updated_at').notNull().defaultNow(),
});
```

Key changes from the current schema:
- `status` default changed from `'confirmed'` → `'pending'`
- `paymentStatus` default changed from `'pending'` → `'unverified'`
- Added `transactionId`, `upiQrData`, `adminNote`, `totalAmount`, `placeId`

---

### 1.4 `packages/db/src/index.ts` *(update)*

Export all schemas:

```ts
export * from './schema/auth';
export * from './schema/booking';
export * from './schema/places';
```

---

## 2. Email Service Migration

Replace **Resend** with **Nodemailer + Google SMTP** across the project.

### 2.1 `packages/email/package.json`

- Remove: `"resend"`
- Add: `"nodemailer": "^6.x"`, `"@types/nodemailer": "^6.x"` (dev)

### 2.2 `packages/email/src/index.ts` *(full rewrite)*

Create a transporter using Google SMTP:

```ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD, // 16-char Google App Password
  },
});
```

Export the following functions (all use the same HTML template system):

#### `sendBookingPendingEmail(params)`

Sent immediately after booking submission. Subject: `"We've received your booking — payment verification in progress"`.

Template content:
- Booking details (place, date, members)
- Total amount paid
- Transaction ID the user entered
- Message: "We have received your booking request. We are verifying your payment. You will receive an update within 1 hour."
- QR code image linking to `/tickets/confirmation/{bookingId}` — **status shows Pending / Unverified**
- CTA button: "View Ticket Status"

#### `sendBookingConfirmedEmail(params)`

Sent by admin after manually confirming the transaction. Subject: `"Your booking is confirmed! 🎉"`.

Template content:
- Same structure as above but with a green "Confirmed" badge
- "Your payment has been verified and your booking is confirmed."
- QR code linking to same confirmation page — **status now shows Confirmed / Verified**
- Important visit notes

Both functions return `Promise<{ success: boolean; error?: unknown }>`.

---

### 2.3 `apps/web/lib/email.ts` *(update)*

This file currently uses Resend too. Update it to call the functions from `packages/email` (or delete it and only use the package). Decide on a single source of truth — use `packages/email` exclusively.

---

## 3. 2-Step Booking Flow + UPI Payment

### 3.1 Overview

The `BookingDialog` currently shows a single `BookingForm`. We restructure it into a two-step wizard:

```
Step 1 → BookingInfoStep   (visitor details, visit date)
Step 2 → PaymentStep       (QR code + UPI amount + transaction ID input)
```

State lives in `BookingDialog`. On step-1 completion, data is stored in local state (not yet submitted to DB). On step-2 submission, the tRPC `booking.create` mutation fires.

---

### 3.2 `apps/web/src/components/feature/BookingDialog.tsx` *(rewrite)*

```tsx
type Step = 1 | 2;
const [step, setStep] = useState<Step>(1);
const [bookingInfo, setBookingInfo] = useState<BookingInfo | null>(null);

// Step 1 → collect info, call setBookingInfo, advance to step 2
// Step 2 → show QR, collect transactionId, submit mutation
```

The dialog title changes per step:
- Step 1: "Book Your Tickets" / "Fill in visitor details"
- Step 2: "Complete Payment" / "Scan QR and enter transaction ID"

---

### 3.3 `apps/web/src/components/feature/BookingInfoStep.tsx` *(new, extracted from BookingForm)*

Identical to current `BookingForm` but instead of calling the mutation directly, it calls `onNext(data)` prop.

Fields: visitDate (optional), members (name, age, email).

---

### 3.4 `apps/web/src/components/feature/PaymentStep.tsx` *(new)*

Props received from parent:
- `placeSlug`, `placeName`, `totalMembers`, all booking info from step 1
- `ticketPrice` (from places DB or static default)
- `onBack: () => void`

Computed:
```ts
const totalAmount = ticketPrice * totalMembers; // in paise
const upiString = `upi://pay?pa=${UPI_VPA}&pn=Ticketez&am=${totalAmount / 100}&cu=INR&tn=${placeName}`;
```

UI:
```
┌─────────────────────────────────────┐
│  Total Amount: ₹{totalAmount/100}   │
│                                     │
│  [QR Code — UPI deep link]          │
│                                     │
│  Scan with any UPI app to pay       │
│                                     │
│  Transaction ID                     │
│  [________________________]         │
│                                     │
│  [← Back]        [Submit Booking]   │
└─────────────────────────────────────┘
```

On submit:
- Validates `transactionId` is non-empty
- Calls `trpc.booking.create.mutate({ ...bookingInfo, transactionId, totalAmount })`
- On success: redirect to `/tickets/confirmation/{bookingId}`

---

### 3.5 `packages/api/src/routers/booking.ts` *(update)*

#### `booking.create` mutation — changes:

Input additions:
```ts
transactionId: z.string().min(1, 'Transaction ID is required'),
totalAmount: z.number().int().min(0),
```

DB insert changes:
```ts
status: 'pending',          // was 'confirmed'
paymentStatus: 'unverified', // was 'pending'
transactionId: input.transactionId,
totalAmount: input.totalAmount,
```

After DB insert:
- Call `sendBookingPendingEmail(...)` instead of `sendBookingConfirmation(...)`

#### New `booking.confirmPayment` mutation — admin only:

```ts
confirmPayment: adminProcedure
  .input(z.object({
    bookingId: z.string().uuid(),
    adminNote: z.string().optional(),
  }))
  .mutation(async ({ input }) => {
    // 1. Update booking: status → 'confirmed', paymentStatus → 'verified'
    // 2. Fetch booking + members
    // 3. Call sendBookingConfirmedEmail(...)
    // 4. Return success
  })
```

#### New `booking.rejectPayment` mutation — admin only:

```ts
rejectPayment: adminProcedure
  .input(z.object({
    bookingId: z.string().uuid(),
    adminNote: z.string().optional(),
  }))
  .mutation(async ({ input }) => {
    // 1. Update booking: status → 'cancelled', paymentStatus → 'failed'
    // 2. Optionally send a rejection email
  })
```

#### New `booking.getAllBookings` query — admin only:

```ts
getAllBookings: adminProcedure
  .input(z.object({
    status: z.string().optional(),
    paymentStatus: z.string().optional(),
    limit: z.number().default(50),
    offset: z.number().default(0),
  }))
  .query(async ({ input }) => {
    // Return all bookings with optional status filters + pagination
    // Join with user table to get user name/email
  })
```

---

### 3.6 `apps/web/src/app/(default)/tickets/confirmation/[id]/page.tsx` *(update)*

Update the status badges to reflect new statuses:

| `booking.status` | `booking.paymentStatus` | Display |
|---|---|---|
| `pending` | `unverified` | 🟡 Pending verification |
| `confirmed` | `verified` | 🟢 Confirmed |
| `cancelled` | `failed` | 🔴 Cancelled |

The QR code already works. No structural changes needed to the QR display — just the badge colors/labels.

---

## 4. Admin Panel

### 4.1 Middleware — `apps/web/src/middleware.ts` *(new)*

```ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@ticketez/auth';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') return NextResponse.next();

    const session = await auth.api.getSession({ headers: req.headers });

    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
    if (session.user.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
```

---

### 4.2 `adminProcedure` in `packages/api/src/index.ts` *(new)*

```ts
export const adminProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  if (ctx.session.user.role !== 'ADMIN') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx: { ...ctx, session: ctx.session } });
});
```

---

### 4.3 Admin Layout — `apps/web/src/app/(admin)/layout.tsx` *(new)*

A separate layout without the main `Header`/`Footer`. Contains:
- Sidebar with navigation links
- Top bar with admin user info + logout button
- No `Providers` duplication (it's inherited from root layout, so root layout must be checked)

Actually — the root layout currently wraps `(default)`. The `(admin)` group needs its own root. Restructure:

```
app/
  layout.tsx           ← minimal root: html/body, fonts, theme, Providers
  (default)/
    layout.tsx         ← Header + Footer
    page.tsx           ← home
    ...
  (admin)/
    layout.tsx         ← Admin sidebar layout (no Header/Footer)
    admin/
      login/page.tsx
      dashboard/page.tsx
      places/page.tsx
      bookings/page.tsx
```

The current `(default)/layout.tsx` has `<html><body>` — that needs to move to `app/layout.tsx` (true root). Verify this and refactor if needed.

**Admin sidebar links:**
- Dashboard (`/admin/dashboard`)
- Places (`/admin/places`)
- Bookings (`/admin/bookings`)

---

### 4.4 `/admin/login` — `apps/web/src/app/(admin)/admin/login/page.tsx` *(new)*

Visually identical to the user login page (`/login`). Same Google OAuth button. After successful OAuth, the middleware checks the role — if not ADMIN, redirect to `/` with an error toast. If ADMIN, redirect to `/admin/dashboard`.

Difference from user login:
- Title: "Admin Portal"
- Subtitle: "Access restricted to administrators"
- On `authClient.signIn.social({ provider: 'google' })`, pass `callbackURL: '/admin/dashboard'`

---

### 4.5 `/admin/dashboard` — `apps/web/src/app/(admin)/admin/dashboard/page.tsx` *(new)*

#### Stats Cards (top row):

Fetched via `trpc.admin.getStats`:

```
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ Total       │ │ Pending     │ │ Confirmed   │ │ Total       │
│ Bookings    │ │ Bookings    │ │ Bookings    │ │ Revenue     │
│ 124         │ │ 18          │ │ 98          │ │ ₹24,600     │
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘
```

#### Top Places by Bookings (table):

```
Place Name          | Type     | City      | Bookings | Revenue
--------------------|----------|-----------|----------|---------
Taj Mahal           | Monument | Agra      | 45       | ₹9,000
Sarnath Museum      | Museum   | Varanasi  | 22       | ₹4,400
```

Fetched via `trpc.admin.getPlaceStats`.

#### Recent Bookings (last 10):

Quick view table with booking ID, place, user, status, payment status, and action buttons.

---

### 4.6 `/admin/places` — `apps/web/src/app/(admin)/admin/places/page.tsx` *(new)*

Full CRUD interface for the `place` table.

**List View:**
- Searchable, filterable table (type: monument/museum, state, city, isActive toggle)
- Columns: Name, Type, City, State, Ticket Price, Active, Actions (Edit, Delete)
- "Add New Place" button

**Add/Edit Form (in a Dialog or slide-over):**
- Fields mirroring the DB schema: name, slug (auto-generated from name), type, country, state, city, location, latitude, longitude, googleMapLink, images (textarea, one URL per line), videos, shortDesc, longDesc, precautionAndSafety (textarea), metadata (dynamic key-value pairs), ticketPrice, isActive

**Delete:**
- Soft delete (set `isActive = false`) OR hard delete with confirmation dialog

**tRPC procedures needed** (new `admin` router in `packages/api/src/routers/admin.ts`):

```ts
getPlaces:    adminProcedure — list all places with filters
getPlaceById: adminProcedure — single place
createPlace:  adminProcedure — insert
updatePlace:  adminProcedure — update by id
deletePlace:  adminProcedure — hard delete (or soft)
getStats:     adminProcedure — booking counts, revenue totals
getPlaceStats: adminProcedure — per-place booking count + revenue
```

---

### 4.7 `/admin/bookings` — `apps/web/src/app/(admin)/admin/bookings/page.tsx` *(new)*

Full booking management view.

**Table columns:**
- Booking ID (truncated)
- User (name + email)
- Place
- Visit Date
- Members
- Total Amount
- Transaction ID
- Status badge
- Payment Status badge
- Actions

**Filters:** status (All / Pending / Confirmed / Cancelled), payment status, date range, search by place/user name.

**Actions per row:**
- **Verify & Confirm**: Opens a small modal showing the entered Transaction ID with an "Approve" button → calls `booking.confirmPayment` → updates status, sends confirmed email
- **Reject**: Calls `booking.rejectPayment` with optional note → updates status

**Action modal for Verify:**
```
┌────────────────────────────────────────┐
│ Verify Payment                         │
│                                        │
│ Booking: TAJ-001 · Taj Mahal           │
│ User: Prashant Singh                   │
│ Amount: ₹200                           │
│ Transaction ID: UPI123456789ABC        │
│                                        │
│ Admin Note (optional):                 │
│ [________________________________]     │
│                                        │
│ [Cancel]        [Confirm & Notify]     │
└────────────────────────────────────────┘
```

---

### 4.8 `packages/api/src/routers/admin.ts` *(new)*

Contains all admin-specific tRPC procedures using `adminProcedure`:

- `getStats` — total bookings, pending, confirmed, total revenue
- `getPlaceStats` — group bookings by placeSlug, count + sum amount
- `getPlaces` — with filters (type, state, city, isActive, search)
- `getPlaceById`
- `createPlace`
- `updatePlace`
- `deletePlace`
- `getAllBookings` — with filters + pagination + join user info
- `confirmPayment` — update booking + send email
- `rejectPayment` — update booking + optionally send email

Update `packages/api/src/routers/index.ts` to include:
```ts
import { adminRouter } from './admin';
export const appRouter = router({
  ...
  admin: adminRouter,
});
```

---

## 5. Profile Page

### 5.1 `apps/web/src/app/(default)/profile/page.tsx` *(new)*

Similar layout to the Activity page. Protected — redirect to `/login` if not authenticated (client-side check with `authClient.useSession()`).

**Sections:**

#### User Info Card:
```
┌──────────────────────────────────────┐
│  [Avatar]  Prashant Singh            │
│            prashant@gmail.com        │
│            Member since Jan 2025     │
│            [Edit Profile]            │
└──────────────────────────────────────┘
```

Fields displayed: avatar (from Google), name, email, member since (createdAt).

"Edit Profile" opens a dialog — only `name` is editable (email is from Google OAuth, can't be changed). Call `authClient.updateUser({ name: '...' })` (better-auth built-in).

#### Stats Strip:
```
Total Bookings: 12   |   Confirmed: 8   |   Pending: 3   |   Cancelled: 1
```

Fetched from `trpc.booking.getUserBookings` (already exists), computed on the client.

#### Recent Bookings (last 4):

Same card grid as `ActivityPage` but limited to 4 with a "View All" link to `/activity`.

---

### 5.2 Header update — `apps/web/src/components/layout/Header/Header.tsx` *(update)*

Update the "Profile" dropdown item to point to `/profile` instead of `/`:

```tsx
<DropdownMenuItem asChild>
  <Link href='/profile'>Profile</Link>
</DropdownMenuItem>
```

---

## 6. Static Pages — About & Contact

### 6.1 `/about` — `apps/web/src/app/(default)/about/page.tsx` *(new)*

Simple static page. Sections:
1. **Hero**: "About Ticketez" with a tagline
2. **Our Mission**: Short paragraph about the project
3. **How It Works**: 3-step cards (Discover → Book → Visit)
4. **Tech Stack / Credits** (optional for demo)

Design: consistent with home page — full-width sections, container with border-x, same typography.

---

### 6.2 `/contact` — `apps/web/src/app/(default)/contact/page.tsx` *(new)*

Simple static page. Sections:
1. **Hero**: "Get in Touch"
2. **Contact Info**: Email address, a fake phone, office location (all placeholder for demo)
3. **Contact Form**: Name, Email, Subject, Message — client-side only, no backend submission needed for demo (show a toast on submit: "Thanks! We'll get back to you soon.")

---

### 6.3 Header nav link fix — `apps/web/src/components/layout/Header/Header.tsx` *(update)*

Currently all nav links point to `href='/'`. Fix them to use the actual `navLink.href`:

```tsx
// Change:
<Link href='/'>{navLink.label}</Link>
// To:
<Link href={navLink.href}>{navLink.label}</Link>
```

---

## 7. Places Near Me Page

### 7.1 `apps/web/src/app/(default)/places/page.tsx` *(new)*

This is the `/places` route referenced in `navLinks`.

#### Flow:
1. On mount, call `navigator.geolocation.getCurrentPosition()`
2. Show a loading state while fetching location
3. If permission denied, show a fallback UI with manual state/city filters
4. Once coords obtained, call `trpc.places.getNearby({ lat, lng, radiusKm: 200 })`
5. Render results in a grid of place cards

#### Filters (sidebar or top filter bar):
- **Search**: text input filtering by name/city
- **Type**: All / Monuments / Museums (radio/tab)
- **State**: dropdown populated from fetched results
- **Sort**: Nearest first / Name A–Z

#### Place Card:
```
┌──────────────────────────┐
│  [Image]                 │
│  Taj Mahal               │
│  🏛 Monument · Agra      │
│  ~45 km away             │
│  [Book Tickets]          │
└──────────────────────────┘
```

Distance calculated client-side using Haversine formula from user's coords to `place.latitude`/`place.longitude`.

---

### 7.2 `packages/api/src/routers/places.ts` *(new)*

```ts
export const placesRouter = router({
  getNearby: publicProcedure
    .input(z.object({
      lat: z.number(),
      lng: z.number(),
      radiusKm: z.number().default(500),
      type: z.enum(['monument', 'museum', 'all']).default('all'),
      search: z.string().optional(),
      state: z.string().optional(),
    }))
    .query(async ({ input }) => {
      // Fetch all active places from DB
      // Filter by type and search server-side
      // Return all matches — distance calc done client-side (simpler, no PostGIS needed)
    }),

  getAll: publicProcedure
    .input(z.object({
      type: z.enum(['monument', 'museum', 'all']).default('all'),
      state: z.string().optional(),
      city: z.string().optional(),
      search: z.string().optional(),
    }))
    .query(async ({ input }) => {
      // Used by home page or search — no geo needed
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      // Single place details for the monument/museum detail page
    }),
});
```

Add to `packages/api/src/routers/index.ts`:
```ts
import { placesRouter } from './places';
export const appRouter = router({
  ...
  places: placesRouter,
});
```

---

### 7.3 DB Seeder *(optional utility)*

Create `packages/db/src/seed.ts` that reads from `database.ts` (or a JSON equivalent) and inserts into the `place` table. **Do not run automatically.** This is a one-time script invoked manually:

```
npx ts-node packages/db/src/seed.ts
```

The seeder maps `MonumentOrMuseum` fields to the `place` table columns. Latitude/longitude will need to be added manually or via a geocoding call for existing entries (can be null initially — geo-query degrades gracefully).

---

## 8. Environment Variables

Add these to `apps/web/.env` (the single `.env` used by all packages via `drizzle.config.ts`):

```env
# ─── Existing ────────────────────────────────
DATABASE_URL=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
CORS_ORIGIN=
NEXT_PUBLIC_APP_URL=

# ─── Remove ──────────────────────────────────
# RESEND_API_KEY=   ← delete this

# ─── New: Email via Google SMTP ───────────────
GMAIL_USER=                     # your Gmail address e.g. noreply@yourdomain.com
GMAIL_APP_PASSWORD=             # 16-char Google App Password (NOT your Gmail password)
EMAIL_FROM_NAME=Ticketez

# ─── New: UPI Payment ────────────────────────
NEXT_PUBLIC_UPI_VPA=            # UPI VPA/address e.g. ticketez@upi
NEXT_PUBLIC_UPI_NAME=Ticketez

# ─── New: Admin ──────────────────────────────
# No new env vars needed for admin — role is stored in DB.
# To make a user admin: UPDATE "user" SET role = 'ADMIN' WHERE email = 'your@email.com';
```

**Google App Password setup:**
1. Enable 2FA on the Gmail account
2. Go to Google Account → Security → App Passwords
3. Create an app password for "Mail"
4. Paste the 16-character password as `GMAIL_APP_PASSWORD`

---

## 9. File-by-File Execution Order

Execute in this order to avoid dependency issues:

### Phase 1 — Foundation

| # | File | Action |
|---|------|--------|
| 1 | `packages/db/src/schema/auth.ts` | Add `role` column |
| 2 | `packages/db/src/schema/places.ts` | Create new file |
| 3 | `packages/db/src/schema/booking.ts` | Update columns |
| 4 | `packages/db/src/index.ts` | Export new schemas |
| 5 | `packages/auth/src/index.ts` | Add `additionalFields.role` |
| 6 | `apps/web/.env` | Add new env vars (placeholders) |
| **→ ASK USER TO RUN MIGRATION** | | |

### Phase 2 — Email Service

| # | File | Action |
|---|------|--------|
| 7 | `packages/email/package.json` | Swap resend → nodemailer |
| 8 | `packages/email/src/index.ts` | Rewrite with nodemailer + two email functions |
| 9 | `apps/web/lib/email.ts` | Remove (or update to re-export from package) |

### Phase 3 — API Layer

| # | File | Action |
|---|------|--------|
| 10 | `packages/api/src/index.ts` | Add `adminProcedure` |
| 11 | `packages/api/src/routers/booking.ts` | Update create + add confirmPayment, rejectPayment, getAllBookings |
| 12 | `packages/api/src/routers/places.ts` | New file |
| 13 | `packages/api/src/routers/admin.ts` | New file |
| 14 | `packages/api/src/routers/index.ts` | Register new routers |

### Phase 4 — Booking Flow

| # | File | Action |
|---|------|--------|
| 15 | `apps/web/src/components/feature/BookingInfoStep.tsx` | New (extracted from BookingForm) |
| 16 | `apps/web/src/components/feature/PaymentStep.tsx` | New |
| 17 | `apps/web/src/components/feature/BookingDialog.tsx` | Rewrite as 2-step wizard |
| 18 | `apps/web/src/components/feature/BookingForm.tsx` | Delete (replaced by steps above) |
| 19 | `apps/web/src/app/(default)/tickets/confirmation/[id]/page.tsx` | Update status badges |

### Phase 5 — Admin Panel

| # | File | Action |
|---|------|--------|
| 20 | `apps/web/src/middleware.ts` | New — route guard |
| 21 | Refactor `app/layout.tsx` / `(default)/layout.tsx` | Move html/body to true root if needed |
| 22 | `apps/web/src/app/(admin)/layout.tsx` | New admin layout with sidebar |
| 23 | `apps/web/src/app/(admin)/admin/login/page.tsx` | New admin login |
| 24 | `apps/web/src/app/(admin)/admin/dashboard/page.tsx` | New dashboard |
| 25 | `apps/web/src/app/(admin)/admin/places/page.tsx` | New places CRUD |
| 26 | `apps/web/src/app/(admin)/admin/bookings/page.tsx` | New bookings management |

### Phase 6 — User-Facing Pages

| # | File | Action |
|---|------|--------|
| 27 | `apps/web/src/components/layout/Header/Header.tsx` | Fix nav hrefs + profile link |
| 28 | `apps/web/src/app/(default)/about/page.tsx` | New static page |
| 29 | `apps/web/src/app/(default)/contact/page.tsx` | New static page |
| 30 | `apps/web/src/app/(default)/profile/page.tsx` | New profile page |
| 31 | `apps/web/src/app/(default)/places/page.tsx` | New places near me page |

### Phase 7 — Seeder (Optional)

| # | File | Action |
|---|------|--------|
| 32 | `packages/db/src/seed.ts` | New — seed places from static data |

---

## Notes & Decisions

### Why move away from Resend?
Per user's requirement. Nodemailer with Google SMTP is free for low-volume transactional emails and gives full control. The trade-off is Gmail rate limits (~500 emails/day for personal accounts, or use Google Workspace for higher limits). For a demo project, this is more than sufficient.

### Why not real PostGIS for geo-queries?
PostGIS requires a specific Postgres extension and makes migrations more complex. Since the `place` table will have at most ~50–100 entries for a demo, fetching all from DB and filtering/sorting by Haversine distance on the client is perfectly fine and simpler to implement.

### Role promotion to ADMIN
No UI for this — as this is a demo. To promote a user, run directly in the DB:
```sql
UPDATE "user" SET role = 'ADMIN' WHERE email = 'admin@example.com';
```

### UPI QR for demo
The QR code in PaymentStep encodes a standard UPI deep link URI. Any real UPI app (GPay, PhonePe, Paytm) will be able to scan it and initiate a payment. The transaction ID entered by the user is manually cross-checked by the admin in the bookings panel.

### Place data migration strategy
Initially, the `place` table can be populated via the seeder from `database.ts`. Going forward, all additions/updates happen through the Admin CRUD UI. The static `database.ts` becomes read-only legacy reference.

### `ticketPrice` per place
Currently, the home page / booking flow treats all places as free. With the new `place.ticketPrice` (in paise), admins can set individual prices. Default is `0` (free) for backward compatibility. The `PaymentStep` handles `₹0` gracefully by skipping the QR and going straight to a "free ticket" confirmation.
