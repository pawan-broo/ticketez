import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { booking, bookingMember } from './schema/booking';
import { savedPlace } from './schema/savedPlace';
import { randomUUID } from 'crypto';

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({
  path: path.resolve(__dirname, '../../../apps/web/.env'),
});

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

// ─── Users ────────────────────────────────────────────────────────────────────

const USERS = [
  {
    id: '5c09d0db-8ef2-4d80-852e-32c6b3346106',
    name: 'Prashant Singh',
    email: 'prashant.s2922@gmail.com',
  },
  {
    id: '068b35c9-4a45-4e0a-bfa4-99768f9fc21f',
    name: 'Sahiba Taneja',
    email: 'sahibataneja1@gmail.com',
  },
  {
    id: 'f9f5c4c1-6bd2-42c0-a995-7289158cd956',
    name: 'Rajeshwer Singh',
    email: 'rajeshwersingh9479@gmail.com',
  },
  {
    id: '51612f33-79df-42f0-979c-baf04bcc9394',
    name: 'Gate Wallah',
    email: 'gatewallah396@gmail.com',
  },
] as const;

// ─── Places (with booking weight — higher = more bookings) ────────────────────

const PLACES = [
  // ── Monuments ──
  {
    id: 'e450f0c2-8c59-43d8-b199-9052cfce375c',
    slug: 'amber-fort',
    name: 'Amber Fort',
    type: 'monument' as const,
    city: 'Jaipur',
    state: 'Rajasthan',
    country: 'India',
    location: 'Devisinghpura, Amer, Jaipur, Rajasthan 302028',
    ticketPrice: 10000,
    weight: 45,
  },
  {
    id: '4dcf2d44-cd1f-4cc4-aedb-5f97a0184770',
    slug: 'hawa-mahal',
    name: 'Hawa Mahal',
    type: 'monument' as const,
    city: 'Jaipur',
    state: 'Rajasthan',
    country: 'India',
    location: 'Hawa Mahal Rd, Badi Choupad, J.D.A. Market, Jaipur, Rajasthan 302002',
    ticketPrice: 5000,
    weight: 38,
  },
  {
    id: '8ad48a44-5a00-4eb1-b499-5abd93407cb3',
    slug: 'mehrangarh-fort',
    name: 'Mehrangarh Fort',
    type: 'monument' as const,
    city: 'Jodhpur',
    state: 'Rajasthan',
    country: 'India',
    location: 'P.B. No 165, The Fort, Jodhpur, Rajasthan 342006',
    ticketPrice: 20000,
    weight: 35,
  },
  {
    id: '8f5b1db9-064b-4bee-b7c8-84b442b4ab58',
    slug: 'jantar-mantar',
    name: 'Jantar Mantar',
    type: 'monument' as const,
    city: 'Jaipur',
    state: 'Rajasthan',
    country: 'India',
    location: 'Gangori Bazaar, J.D.A. Market, Jaipur, Rajasthan 302002',
    ticketPrice: 5000,
    weight: 30,
  },
  {
    id: '3d685356-5157-4d0a-9054-fee4742824d1',
    slug: 'jaisalmer-fort',
    name: 'Jaisalmer Fort',
    type: 'monument' as const,
    city: 'Jaisalmer',
    state: 'Rajasthan',
    country: 'India',
    location: 'Fort Road, Jaisalmer, Rajasthan 345001',
    ticketPrice: 5000,
    weight: 22,
  },
  {
    id: 'e8130fe2-6307-4c22-b875-3b7d1f9b4579',
    slug: 'junagarh-fort',
    name: 'Junagarh Fort',
    type: 'monument' as const,
    city: 'Bikaner',
    state: 'Rajasthan',
    country: 'India',
    location: 'Junagarh Fort Rd, Bikaner, Rajasthan 334001',
    ticketPrice: 5000,
    weight: 15,
  },
  {
    id: '3c79da4f-3c87-4516-ad4e-2311c1e26450',
    slug: 'kumbhalgarh-fort',
    name: 'Kumbhalgarh Fort',
    type: 'monument' as const,
    city: 'Rajsamand',
    state: 'Rajasthan',
    country: 'India',
    location: 'Kumbhalgarh, Rajasthan 313325',
    ticketPrice: 4000,
    weight: 15,
  },
  {
    id: '5c214b81-148f-4e7c-aa24-77b9982b9532',
    slug: 'chittorgarh-fort',
    name: 'Chittorgarh Fort',
    type: 'monument' as const,
    city: 'Chittorgarh',
    state: 'Rajasthan',
    country: 'India',
    location: 'Chittorgarh, Rajasthan 312001',
    ticketPrice: 5000,
    weight: 14,
  },
  {
    id: 'daeaf6ef-9c9b-49bf-8b6b-7450cc673716',
    slug: 'jaigarh-fort',
    name: 'Jaigarh Fort',
    type: 'monument' as const,
    city: 'Jaipur',
    state: 'Rajasthan',
    country: 'India',
    location: 'Above Amer Fort, Jaipur, Rajasthan 302001',
    ticketPrice: 10000,
    weight: 14,
  },
  {
    id: 'e1256a73-f30c-46aa-b0ef-f2d6a747a4ea',
    slug: 'vijay-stambha',
    name: 'Vijay Stambha',
    type: 'monument' as const,
    city: 'Chittorgarh',
    state: 'Rajasthan',
    country: 'India',
    location: 'Inside Chittorgarh Fort, Chittorgarh, Rajasthan 312001',
    ticketPrice: 0,
    weight: 6,
  },
  // ── Museums ──
  {
    id: '9a012c9c-ea69-40f1-a0cb-5925502e53fb',
    slug: 'city-palace-museum-jaipur',
    name: 'City Palace Museum Jaipur',
    type: 'museum' as const,
    city: 'Jaipur',
    state: 'Rajasthan',
    country: 'India',
    location: 'Tulsi Marg, Gangori Bazaar, Jaipur, Rajasthan 302002',
    ticketPrice: 20000,
    weight: 30,
  },
  {
    id: '72a3d667-7b9f-41d1-a788-c6b756bb3583',
    slug: 'albert-hall-museum',
    name: 'Albert Hall Museum',
    type: 'museum' as const,
    city: 'Jaipur',
    state: 'Rajasthan',
    country: 'India',
    location: 'Ram Niwas Garden, Ashok Nagar, Jaipur, Rajasthan 302001',
    ticketPrice: 4000,
    weight: 25,
  },
  {
    id: '1bbbae2d-e7cc-4430-8df3-290f185adda8',
    slug: 'vintage-car-museum-udaipur',
    name: 'Vintage Car Museum',
    type: 'museum' as const,
    city: 'Udaipur',
    state: 'Rajasthan',
    country: 'India',
    location: 'Gulab Bagh Rd, Udaipur, Rajasthan 313001',
    ticketPrice: 40000,
    weight: 20,
  },
  {
    id: '61218230-8883-4952-9ef0-17487c32fcfd',
    slug: 'bagore-ki-haveli',
    name: 'Bagore Ki Haveli Museum',
    type: 'museum' as const,
    city: 'Udaipur',
    state: 'Rajasthan',
    country: 'India',
    location: 'Gangaur Ghat Marg, Udaipur, Rajasthan 313001',
    ticketPrice: 6000,
    weight: 18,
  },
  {
    id: 'e547fd68-b5cc-49e5-a1ce-38b997a567f0',
    slug: 'anokhi-museum',
    name: 'Anokhi Museum of Hand Printing',
    type: 'museum' as const,
    city: 'Jaipur',
    state: 'Rajasthan',
    country: 'India',
    location: 'Anokhi Haveli, Kheri Gate, Amer, Jaipur, Rajasthan 302028',
    ticketPrice: 3000,
    weight: 18,
  },
  {
    id: 'f36c3743-fb3d-4473-957b-0c5886657a4b',
    slug: 'sardar-government-museum',
    name: 'Sardar Government Museum',
    type: 'museum' as const,
    city: 'Jodhpur',
    state: 'Rajasthan',
    country: 'India',
    location: 'Umaid Bagh, Jodhpur, Rajasthan 342001',
    ticketPrice: 2000,
    weight: 12,
  },
  {
    id: 'dbe59f1e-ad0d-4c00-903a-3f41eda2e269',
    slug: 'ganga-museum-bikaner',
    name: 'Ganga Government Museum',
    type: 'museum' as const,
    city: 'Bikaner',
    state: 'Rajasthan',
    country: 'India',
    location: 'Public Park, Bikaner, Rajasthan 334001',
    ticketPrice: 2000,
    weight: 10,
  },
  {
    id: '92f4a521-52d5-4d1b-b1dd-0bd9254a94ee',
    slug: 'fateh-prakash-museum-chittorgarh',
    name: 'Fateh Prakash Palace Museum',
    type: 'museum' as const,
    city: 'Chittorgarh',
    state: 'Rajasthan',
    country: 'India',
    location: 'Chittorgarh Fort, Rajasthan 312001',
    ticketPrice: 1000,
    weight: 10,
  },
  {
    id: '93694ac3-63e9-4adf-a354-57823b436d15',
    slug: 'jaisalmer-war-museum',
    name: 'Jaisalmer War Museum',
    type: 'museum' as const,
    city: 'Jaisalmer',
    state: 'Rajasthan',
    country: 'India',
    location: 'Jaisalmer-Jodhpur Highway, Rajasthan 345001',
    ticketPrice: 0,
    weight: 8,
  },
  {
    id: 'd9ab2781-d3ce-4782-ac44-ea71ceb62c18',
    slug: 'ahar-museum-udaipur',
    name: 'Ahar Archaeological Museum',
    type: 'museum' as const,
    city: 'Udaipur',
    state: 'Rajasthan',
    country: 'India',
    location: 'Ahar, Udaipur, Rajasthan 313001',
    ticketPrice: 300,
    weight: 8,
  },
];

// ─── Name / Email Pools ───────────────────────────────────────────────────────

const FIRST_NAMES = [
  'Raj', 'Priya', 'Amit', 'Sneha', 'Vikram', 'Neha', 'Arjun', 'Pooja',
  'Rahul', 'Divya', 'Sanjay', 'Anita', 'Deepak', 'Kavita', 'Rohit', 'Sunita',
  'Manoj', 'Geeta', 'Vivek', 'Rekha', 'Aditya', 'Meena', 'Sachin', 'Seema',
  'Manish', 'Ritu', 'Nitin', 'Usha', 'Akash', 'Swati', 'Ravi', 'Nisha',
  'Suresh', 'Asha', 'Pankaj', 'Smita', 'Gaurav', 'Ankita', 'Yash', 'Priti',
  'Kiran', 'Suman', 'Ajay', 'Nidhi', 'Harsh', 'Shruti', 'Tarun', 'Madhuri',
];

const LAST_NAMES = [
  'Sharma', 'Verma', 'Singh', 'Kumar', 'Patel', 'Gupta', 'Joshi', 'Mishra',
  'Tiwari', 'Agarwal', 'Yadav', 'Sinha', 'Pandey', 'Chauhan', 'Rawat',
  'Meena', 'Choudhary', 'Jain', 'Saxena', 'Dubey', 'Shukla', 'Trivedi',
  'Kulkarni', 'Nair', 'Reddy', 'Pillai', 'Bose', 'Das', 'Mehta', 'Shah',
];

const EMAIL_DOMAINS = [
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'rediffmail.com',
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randItem<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function randomName(): string {
  return `${randItem(FIRST_NAMES)} ${randItem(LAST_NAMES)}`;
}

function randomEmail(name: string): string {
  const clean = name.toLowerCase().replace(/\s+/g, '.');
  return `${clean}${randInt(1, 999)}@${randItem(EMAIL_DOMAINS)}`;
}

function randomUTR(): string {
  const prefix = randItem(['UTR', 'ICICI', 'HDFC', 'PAYTM', 'GPAY', 'PHPE', 'YESB', 'AXISI', 'SBIN'] as const);
  return `${prefix}${randInt(100000000000, 999999999999)}`;
}

function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

/** Iterate every calendar day from start to end (inclusive). */
function* eachDay(start: Date, end: Date): Generator<Date> {
  const cur = new Date(start);
  while (cur <= end) {
    yield new Date(cur);
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
}

/** Build a weighted pool so that randItem gives natural popularity skew. */
function buildWeightedPool() {
  const pool: (typeof PLACES)[number][] = [];
  for (const p of PLACES) {
    for (let i = 0; i < p.weight; i++) pool.push(p);
  }
  return pool;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function seedAnalytics() {
  console.log('🌱  Seeding analytics data…\n');
  console.log('    Range  : Feb 1, 2026 → Apr 4, 2026');
  console.log(`    Users  : ${USERS.length}`);
  console.log(`    Places : ${PLACES.length}\n`);

  const placePool = buildWeightedPool();

  // Feb 1 → Apr 4 2026  (63 days)
  const START = new Date('2026-02-01T00:00:00.000Z');
  const END   = new Date('2026-04-04T23:59:59.000Z');

  const allBookings:  (typeof booking.$inferInsert)[]       = [];
  const allMembers:   (typeof bookingMember.$inferInsert)[]  = [];

  let userCursor = 0;

  for (const day of eachDay(START, END)) {
    // More bookings on weekends, naturally noisy weekdays
    const baseCount = isWeekend(day) ? randInt(9, 13) : randInt(5, 9);

    for (let i = 0; i < baseCount; i++) {
      const place = randItem(placePool);
      const user  = USERS[userCursor % USERS.length]!;
      userCursor++;

      const memberCount   = randInt(1, 4);
      const totalAmount   = place.ticketPrice * memberCount;

      // Status split: 60 % confirmed/verified | 25 % pending/unverified | 15 % cancelled/failed
      const roll = Math.random();
      let status:        string;
      let paymentStatus: string;

      if (roll < 0.60) {
        status = 'confirmed'; paymentStatus = 'verified';
      } else if (roll < 0.85) {
        status = 'pending';   paymentStatus = 'unverified';
      } else {
        status = 'cancelled'; paymentStatus = 'failed';
      }

      // Booking time: random moment between 9:30 AM and 9:00 PM IST (UTC+5:30)
      // IST 09:30 = UTC 04:00 | IST 21:00 = UTC 15:30
      const bookingDate = new Date(day);
      bookingDate.setUTCHours(randInt(4, 15), randInt(0, 59), randInt(0, 59), 0);

      // Visit date: 1–7 days later for ~70 % of bookings
      let visitDate: Date | null = null;
      if (Math.random() > 0.30) {
        visitDate = new Date(bookingDate);
        visitDate.setUTCDate(visitDate.getUTCDate() + randInt(1, 7));
      }

      const bookingId = randomUUID();

      allBookings.push({
        id:              bookingId,
        userId:          user.id,
        placeId:         place.id,
        placeSlug:       place.slug,
        placeName:       place.name,
        placeLocation:   place.location,
        destinationType: place.type,
        country:         place.country,
        state:           place.state,
        city:            place.city,
        bookingDate,
        visitDate,
        totalMembers:    memberCount,
        totalAmount,
        status,
        paymentStatus,
        transactionId:   randomUTR(),
        adminNote:
          status === 'cancelled'
            ? 'Payment not received within 24 hours.'
            : null,
      });

      // One bookingMember row per visitor
      for (let m = 0; m < memberCount; m++) {
        const memberName = randomName();
        allMembers.push({
          id:        randomUUID(),
          bookingId,
          name:      memberName,
          age:       randInt(18, 65),
          email:     randomEmail(memberName),
        });
      }
    }
  }

  // ── Print summary ──────────────────────────────────────────────────────────
  const nConfirmed  = allBookings.filter(b => b.status === 'confirmed').length;
  const nPending    = allBookings.filter(b => b.status === 'pending').length;
  const nCancelled  = allBookings.filter(b => b.status === 'cancelled').length;
  const grossRev    = allBookings
    .filter(b => b.paymentStatus === 'verified')
    .reduce((s, b) => s + (b.totalAmount as number), 0);

  console.log(`📊  Generated ${allBookings.length} bookings / ${allMembers.length} members`);
  console.log(`    ✅ Confirmed : ${nConfirmed}`);
  console.log(`    ⏳ Pending   : ${nPending}`);
  console.log(`    ❌ Cancelled : ${nCancelled}`);
  console.log(`    💰 Revenue   : ₹${(grossRev / 100).toLocaleString('en-IN')}\n`);

  // ── Insert bookings in batches of 50 ──────────────────────────────────────
  const BATCH = 50;

  console.log('📝  Inserting bookings…');
  for (let i = 0; i < allBookings.length; i += BATCH) {
    await db.insert(booking).values(allBookings.slice(i, i + BATCH));
    process.stdout.write(
      `\r    ${String(Math.min(i + BATCH, allBookings.length)).padStart(4)} / ${allBookings.length}`,
    );
  }
  console.log('\n    ✅  Done');

  // ── Insert booking members in batches of 50 ───────────────────────────────
  console.log('👥  Inserting booking members…');
  for (let i = 0; i < allMembers.length; i += BATCH) {
    await db.insert(bookingMember).values(allMembers.slice(i, i + BATCH));
    process.stdout.write(
      `\r    ${String(Math.min(i + BATCH, allMembers.length)).padStart(4)} / ${allMembers.length}`,
    );
  }
  console.log('\n    ✅  Done');

  // ── Saved places (6–7 per user, different mix per person) ─────────────────
  console.log('🔖  Inserting saved places…');

  // Shuffle once so each user gets a unique slice
  const shuffled = [...PLACES].sort(() => Math.random() - 0.5);

  const savedAssignments: { user: typeof USERS[number]; places: typeof PLACES }[] = [
    { user: USERS[0], places: shuffled.slice(0, 7)  },   // Prashant  — 7 places
    { user: USERS[1], places: shuffled.slice(5, 12) },   // Sahiba    — 7 places
    { user: USERS[2], places: shuffled.slice(10, 16) },  // Rajeshwer — 6 places
    { user: USERS[3], places: shuffled.slice(13, 20) },  // Gate      — 7 places
  ];

  const savedRows: (typeof savedPlace.$inferInsert)[] = [];

  for (const { user, places } of savedAssignments) {
    for (const p of places) {
      savedRows.push({
        id:              randomUUID(),
        userId:          user.id,
        placeId:         p.id,
        placeSlug:       p.slug,
        placeName:       p.name,
        placeLocation:   p.location,
        destinationType: p.type,
        country:         p.country,
        state:           p.state,
        city:            p.city,
      });
    }
  }

  await db.insert(savedPlace).values(savedRows);
  console.log(`    ✅  ${savedRows.length} rows inserted`);

  // ── Final summary ──────────────────────────────────────────────────────────
  console.log('\n✨  All done!');
  console.log(`    🎫  Bookings        : ${allBookings.length}`);
  console.log(`    👥  Members         : ${allMembers.length}`);
  console.log(`    🔖  Saved places    : ${savedRows.length}`);
  console.log(
    `    💰  Verified rev.  : ₹${(grossRev / 100).toLocaleString('en-IN')}\n`,
  );

  await pool.end();
}

seedAnalytics().catch((err) => {
  console.error('❌  Seed failed:', err);
  process.exit(1);
});
