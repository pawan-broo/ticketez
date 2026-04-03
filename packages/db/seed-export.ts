// ─────────────────────────────────────────────────────────────────────────────
// Auto-generated seed data — exported from the database on 2026-04-03T20:15:13.154Z
// Total places: 20 (10 monuments, 10 museums)
//
// Usage:
//   1. Replace the `places` array in packages/db/src/seed.ts with this data.
//   2. Run:  pnpm --filter @ticketez/db db:seed
// ─────────────────────────────────────────────────────────────────────────────

import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import  { place } from './src';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({
  path: path.resolve(__dirname, '../../../apps/web/.env'),
});

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

const places: (typeof place.$inferInsert)[] = [
  // ─── MONUMENTS (10) ────────────────────────────────────────────────────
    {
      name: 'Amber Fort',
      slug: 'amber-fort',
      type: 'monument',
      country: 'India',
      state: 'Rajasthan',
      city: 'Jaipur',
      location: 'Devisinghpura, Amer, Jaipur, Rajasthan 302028',
      latitude: 26.9855,
      longitude: 75.8513,
      googleMapLink: 'https://maps.app.goo.gl/GLk8rQGhn2kEc5TQA',
      images: [
        'https://1qcn7f9d7l.ufs.sh/f/AQzTCCjJrmHyyglDQUvQ20gndzRheV3WqpA8jtFCuUNTJvZo',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLAYhE7QDnI8H0el1wSOxvWjfZuNhMr2i35yCV',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLm4sXJUuCfsNGR5BreY0FHAlugDypqcKJbdiX',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatL8ONIcF70KUJLz3fk7wCnAsjHTGhxDNO8ma21',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLxBe3PevEqUeiPcoCOb64HsaI8AR7L5hMldtu',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLYRpRoFc8Xeu0nQyjrFSM8WCplDxHOcBU1w3T',
      ],
      videos: [],
      shortDesc: 'A majestic hilltop fort known for its artistic Hindu-style elements and Sheesh Mahal.',
      longDesc: 'Built by Raja Man Singh I in 1592, Amber Fort is a UNESCO World Heritage site. It is famous for its large ramparts, series of gates, and cobbled paths. The Maota Lake provides a stunning reflection of the fort.',
      precautionAndSafety: ['Wear comfortable shoes for uphill walking.', 'Carry water.', 'Watch out for monkeys.'],
      metadata: [
        {
          data: 'October to March',
          label: 'Best Time',
        },
        {
          data: '8:00 AM',
          label: 'Open Time',
        },
        {
          data: '5:30 PM',
          label: 'Close Time',
        },
        {
          data: '₹100 (Indians), ₹500 (Foreigners)',
          label: 'Entry Fees',
        },
      ],
      ticketPrice: 10000,
      isActive: true,
    },
    {
      name: 'Chittorgarh Fort',
      slug: 'chittorgarh-fort',
      type: 'monument',
      country: 'India',
      state: 'Rajasthan',
      city: 'Chittorgarh',
      location: 'Chittorgarh, Rajasthan 312001',
      latitude: 24.8879,
      longitude: 74.6451,
      googleMapLink: 'https://maps.app.goo.gl/1g1e2PXAXgDj6NmZ7',
      images: [
        'https://1qcn7f9d7l.ufs.sh/f/AQzTCCjJrmHymUNyQAbFdlxCyzS468soagvOiZtA2KMfQnNU',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLMKZWghBowsdr2zk49ypjKTDYXuSflQWhcUAI',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLZDnEuNhmTSF1vkBJEGd3gyVM80XWs5ucYH2U',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLPpCL0AxQ5GtfoSd2K9Ab86aNTUcIRCELwDg1',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatL8jpmbS70KUJLz3fk7wCnAsjHTGhxDNO8ma21',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLKeJmMesQwFoblHsIWP3Bg8Ov7Eak01NCMhnr',
      ],
      videos: [],
      shortDesc: 'The largest fort in India and the grandest in Rajasthan.',
      longDesc: 'Spanning 700 acres, this UNESCO site is a symbol of Rajput bravery. Key highlights include the Vijay Stambha (Tower of Victory) and the Padmini Palace.',
      precautionAndSafety: ['The fort is massive; use a vehicle to move between points.', 'Hire a licensed guide.'],
      metadata: [
        {
          data: '9:30 AM',
          label: 'Open Time',
        },
        {
          data: '6:30 PM',
          label: 'Close Time',
        },
        {
          data: '₹50 (Indians), ₹200 (Foreigners)',
          label: 'Entry Fees',
        },
      ],
      ticketPrice: 5000,
      isActive: true,
    },
    {
      name: 'Hawa Mahal',
      slug: 'hawa-mahal',
      type: 'monument',
      country: 'India',
      state: 'Rajasthan',
      city: 'Jaipur',
      location: 'Hawa Mahal Rd, Badi Choupad, J.D.A. Market, Jaipur, Rajasthan 302002',
      latitude: 26.9239,
      longitude: 75.8267,
      googleMapLink: 'https://maps.app.goo.gl/Q3CsvpDLkcGgPiYV7',
      images: [
        'https://1qcn7f9d7l.ufs.sh/f/AQzTCCjJrmHyWHGaV7CZIOuFGARlaH2ns1bzfvw6jTEMLCqD',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLvNYnkjMyxNoGuvX5KWntUqJlw42skarjhCcB',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLV0tPg3k5wCLeHXsPr0ODv6iJuWYN49Sc1oMf',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLJnCfVI2YFUmbpaRcKSgDGJWynxsXBAE0OqhH',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLG5g2uETpAgeSl6xz0don8cr5bOuPBpiFWysJ',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatL3bJy7lYyHGNQWTUq2aECORuhw67SeLso0BzP',
      ],
      videos: [],
      shortDesc: 'The "Palace of Breeze" with 953 honeycombed windows.',
      longDesc: 'Constructed in 1799 by Maharaja Sawai Pratap Singh, its unique five-story exterior is akin to the honeycomb of a beehive. It allowed royal women to observe street festivals without being seen.',
      precautionAndSafety: ['Stairs are steep and narrow.', 'Stay hydrated.'],
      metadata: [
        {
          data: '9:00 AM',
          label: 'Open Time',
        },
        {
          data: '5:00 PM',
          label: 'Close Time',
        },
        {
          data: '₹50 (Indians), ₹200 (Foreigners)',
          label: 'Entry Fees',
        },
      ],
      ticketPrice: 5000,
      isActive: true,
    },
    {
      name: 'Jaigarh Fort',
      slug: 'jaigarh-fort',
      type: 'monument',
      country: 'India',
      state: 'Rajasthan',
      city: 'Jaipur',
      location: 'Above Amer Fort, Jaipur, Rajasthan 302001',
      latitude: 26.9908,
      longitude: 75.8475,
      googleMapLink: 'https://maps.app.goo.gl/hEUxJpthp3x5U2Xn8',
      images: [
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLvuSdfCMyxNoGuvX5KWntUqJlw42skarjhCcB',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLko2w19dceSb8TmM3dtI2RXoDWvjYG0Zhp4nN',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLLdF7LbGDNG6HCbXlkYZMURAVdwEetiO4Iv50',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatL8oZskd70KUJLz3fk7wCnAsjHTGhxDNO8ma21',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLZuWTyUhmTSF1vkBJEGd3gyVM80XWs5ucYH2U',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLujVYjAZRM6rPVShF8di1XGzlZjIavcWpwgBN',
      ],
      videos: [],
      shortDesc: 'Home to the Jaivana, the world\'s largest cannon on wheels.',
      longDesc: 'Built to protect the Amber Fort complex, it offers panoramic views of the Aravalli hills and Maota Lake.',
      precautionAndSafety: ['Large area; be prepared for significant walking.'],
      metadata: [
        {
          data: '9:00 AM',
          label: 'Open Time',
        },
        {
          data: '4:30 PM',
          label: 'Close Time',
        },
        {
          data: '₹100 (Indians), ₹200 (Foreigners)',
          label: 'Entry Fees',
        },
      ],
      ticketPrice: 10000,
      isActive: true,
    },
    {
      name: 'Jaisalmer Fort',
      slug: 'jaisalmer-fort',
      type: 'monument',
      country: 'India',
      state: 'Rajasthan',
      city: 'Jaisalmer',
      location: 'Fort Road, Jaisalmer, Rajasthan 345001',
      latitude: 26.9137,
      longitude: 70.9165,
      googleMapLink: 'https://maps.app.goo.gl/9yKM2wQEfFem2JdQ8',
      images: [
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLdLh6KTzxrBp5KhQW31o0PnE7IswGSVmcJivA',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLQX4WVmPg97zCepb1OtZmyrnRTvWEx0uhYH5g',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLGcArR3pAgeSl6xz0don8cr5bOuPBpiFWysJG',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLwWWGp4rtaifpUm83v1DqstjxyLcI5lY0MEhH',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLCUdw92IXt0zBFblaHfrQ4wLMuIhYpXgeRDd3',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLFjje0waC7NUJBpr5KRxogAPq4au0ivneMSb6',
      ],
      videos: [],
      shortDesc: 'A "Living Fort" made of golden sandstone.',
      longDesc: 'Built in 1156, it is one of the few forts in the world where people still live and run shops within the ramparts.',
      precautionAndSafety: ['Respect the residents\' privacy.', 'Avoid peak noon hours.'],
      metadata: [
        {
          data: '9:00 AM',
          label: 'Open Time',
        },
        {
          data: '6:00 PM',
          label: 'Close Time',
        },
        {
          data: '₹50 (Indians), ₹250 (Foreigners)',
          label: 'Entry Fees',
        },
      ],
      ticketPrice: 5000,
      isActive: true,
    },
    {
      name: 'Jantar Mantar',
      slug: 'jantar-mantar',
      type: 'monument',
      country: 'India',
      state: 'Rajasthan',
      city: 'Jaipur',
      location: 'Gangori Bazaar, J.D.A. Market, Jaipur, Rajasthan 302002',
      latitude: 26.9247,
      longitude: 75.8242,
      googleMapLink: 'https://maps.app.goo.gl/39UZVnzQBrGCrARQ6',
      images: [
        'https://1qcn7f9d7l.ufs.sh/f/AQzTCCjJrmHy0eUeT86zfrbpwtjeBnG0W8sZvx75kR4moTyc',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLf2jhcRex8piPbQthr5ewFHWTaGS9A0BJ7vId',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLG5NFWfDpAgeSl6xz0don8cr5bOuPBpiFWysJ',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLJszjbx2YFUmbpaRcKSgDGJWynxsXBAE0OqhH',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLg4zR7SMCx7qSiGZROQhkCyHfM6umB5t0sebr',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLPcys3FxQ5GtfoSd2K9Ab86aNTUcIRCELwDg1',
      ],
      videos: [],
      shortDesc: 'A collection of nineteen architectural astronomical instruments.',
      longDesc: 'A UNESCO World Heritage site featuring the world\'s largest stone sundial. It was built by Rajput King Sawai Jai Singh II to measure time and track celestial bodies.',
      precautionAndSafety: ['Hire a guide to understand the instruments.', 'Avoid touching the structures.'],
      metadata: [
        {
          data: '9:00 AM',
          label: 'Open Time',
        },
        {
          data: '4:30 PM',
          label: 'Close Time',
        },
        {
          data: '₹50 (Indians), ₹200 (Foreigners)',
          label: 'Entry Fees',
        },
      ],
      ticketPrice: 5000,
      isActive: true,
    },
    {
      name: 'Junagarh Fort',
      slug: 'junagarh-fort',
      type: 'monument',
      country: 'India',
      state: 'Rajasthan',
      city: 'Bikaner',
      location: 'Junagarh Fort Rd, Bikaner, Rajasthan 334001',
      latitude: 28.0229,
      longitude: 73.3119,
      googleMapLink: 'https://maps.app.goo.gl/RhmXodr96kvLoZNm7',
      images: [
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatL7sdZ3HRlKVAOU5miM4pWQPnDZN6xzsChg7T0',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLHLWgbkmIqNnfK23p5gVBSy4HZF1bRod0QiAM',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLFmf41rDaC7NUJBpr5KRxogAPq4au0ivneMSb',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatL9abiCQwfpbcWJXBLqemQ4oraYh20GZuHgOI5',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLKTOEjkdsQwFoblHsIWP3Bg8Ov7Eak01NCMhn',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLkTN2budceSb8TmM3dtI2RXoDWvjYG0Zhp4nN',
      ],
      videos: [],
      shortDesc: 'A rare fort not built on a hill, featuring mixed architectural styles.',
      longDesc: 'Originally called Chintamani, it was built by Raja Rai Singh in 1589 and was never conquered throughout its history.',
      precautionAndSafety: ['Guides are available in multiple languages.'],
      metadata: [
        {
          data: '10:00 AM',
          label: 'Open Time',
        },
        {
          data: '4:30 PM',
          label: 'Close Time',
        },
        {
          data: '₹50 (Indians), ₹300 (Foreigners)',
          label: 'Entry Fees',
        },
      ],
      ticketPrice: 5000,
      isActive: true,
    },
    {
      name: 'Kumbhalgarh Fort',
      slug: 'kumbhalgarh-fort',
      type: 'monument',
      country: 'India',
      state: 'Rajasthan',
      city: 'Rajsamand',
      location: 'Kumbhalgarh, Rajasthan 313325',
      latitude: 25.1485,
      longitude: 73.5875,
      googleMapLink: 'https://maps.app.goo.gl/212AH6T6yNPrpKoq7',
      images: [
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLvtqJVxMyxNoGuvX5KWntUqJlw42skarjhCcB',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatL7SakxqRlKVAOU5miM4pWQPnDZN6xzsChg7T0',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatL7xrloohRlKVAOU5miM4pWQPnDZN6xzsChg7T',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLtGC6Rwi7uVaQdpZgEo4cL3sXM5ln1BUtFiDk',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLKfnA5HsQwFoblHsIWP3Bg8Ov7Eak01NCMhnr',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLcyPvcQ1HiatLm3KhUYMxbwq2N0Wo9IXyZvDV',
      ],
      videos: [],
      shortDesc: 'Known for its 36km long wall, the second longest in the world.',
      longDesc: 'Built by Rana Kumbha, it is the birthplace of Maharana Pratap. Its wall is thick enough for eight horses to ride abreast.',
      precautionAndSafety: ['Steep incline while walking to Badal Mahal.', 'Carry drinking water.'],
      metadata: [
        {
          data: '9:00 AM',
          label: 'Open Time',
        },
        {
          data: '6:00 PM',
          label: 'Close Time',
        },
        {
          data: '₹40 (Indians), ₹600 (Foreigners)',
          label: 'Entry Fees',
        },
      ],
      ticketPrice: 4000,
      isActive: true,
    },
    {
      name: 'Mehrangarh Fort',
      slug: 'mehrangarh-fort',
      type: 'monument',
      country: 'India',
      state: 'Rajasthan',
      city: 'Jodhpur',
      location: 'P.B. No 165, The Fort, Jodhpur, Rajasthan 342006',
      latitude: 26.298,
      longitude: 73.0188,
      googleMapLink: 'https://maps.app.goo.gl/UZh1Zifkq1sAbtRF9',
      images: [
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLYQhUA68Xeu0nQyjrFSM8WCplDxHOcBU1w3TK',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLPMvejkixQ5GtfoSd2K9Ab86aNTUcIRCELwDg',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatL8Px6RY470KUJLz3fk7wCnAsjHTGhxDNO8ma2',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLRfVdfoPmDqCQLTkc9vXlV4bNJorYez3jhFsa',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLcf4F5i1HiatLm3KhUYMxbwq2N0Wo9IXyZvDV',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLd87ftJzxrBp5KhQW31o0PnE7IswGSVmcJivA',
      ],
      videos: [],
      shortDesc: 'A formidable fort rising 410 feet above the "Blue City".',
      longDesc: 'Founded by Rao Jodha in 1459, it features thick walls and several palaces known for their intricate carvings and expansive courtyards.',
      precautionAndSafety: ['Use the elevator to reach the top if needed.', 'Wear sun hats.'],
      metadata: [
        {
          data: '9:00 AM',
          label: 'Open Time',
        },
        {
          data: '5:30 PM',
          label: 'Close Time',
        },
        {
          data: '₹200 (Indians), ₹600 (Foreigners)',
          label: 'Entry Fees',
        },
      ],
      ticketPrice: 20000,
      isActive: true,
    },
    {
      name: 'Vijay Stambha',
      slug: 'vijay-stambha',
      type: 'monument',
      country: 'India',
      state: 'Rajasthan',
      city: 'Chittorgarh',
      location: 'Inside Chittorgarh Fort, Chittorgarh, Rajasthan 312001',
      latitude: 24.8879,
      longitude: 74.6451,
      googleMapLink: 'https://maps.app.goo.gl/o9AaT1G1p8pTTzi1A',
      images: [
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLLa8TDuGDNG6HCbXlkYZMURAVdwEetiO4Iv50',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatL8eWJbe70KUJLz3fk7wCnAsjHTGhxDNO8ma21',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLq0YcYNkftXxjyZTus1g4hLlra5pSJQfC8EwN',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLdES25JzxrBp5KhQW31o0PnE7IswGSVmcJivA',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLn9eLtjOBGed17amTyzvgVPH3oQuYxLfO9WUi',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLQ8VIC2g97zCepb1OtZmyrnRTvWEx0uhYH5gw',
      ],
      videos: [],
      shortDesc: 'A massive victory tower commemorating Rana Kumbha\'s win.',
      longDesc: 'Standing nine stories high, this 15th-century tower is dedicated to Lord Vishnu and is covered in intricate carvings of Hindu deities.',
      precautionAndSafety: ['The internal staircase is very narrow and dark.'],
      metadata: [
        {
          data: '9:30 AM',
          label: 'Open Time',
        },
        {
          data: '5:00 PM',
          label: 'Close Time',
        },
        {
          data: 'Entry included in Fort ticket.',
          label: 'Note',
        },
      ],
      ticketPrice: 0,
      isActive: true,
    },

  // ─── MUSEUMS (10) ──────────────────────────────────────────────────────
    {
      name: 'Ahar Archaeological Museum',
      slug: 'ahar-museum-udaipur',
      type: 'museum',
      country: 'India',
      state: 'Rajasthan',
      city: 'Udaipur',
      location: 'Ahar, Udaipur, Rajasthan 313001',
      latitude: 24.5902,
      longitude: 73.7145,
      googleMapLink: 'https://maps.app.goo.gl/HHdaYQHwUZJUPtZT8',
      images: [
        'https://1qcn7f9d7l.ufs.sh/f/AQzTCCjJrmHyxrE6cx1Z4FzVksYq3CIGvidnBeOyulTbSJW9',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLGkXBwRpAgeSl6xz0don8cr5bOuPBpiFWysJG',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatL57xn069oKS34bYtyvrUCzhOm8gMZxsGDPI70',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatL89ljin70KUJLz3fk7wCnAsjHTGhxDNO8ma21',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLZIjQXwhmTSF1vkBJEGd3gyVM80XWs5ucYH2U',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLpfGis1yKGQsNRYgZtWdobLUSFV6rMCeyaExf',
      ],
      videos: [],
      shortDesc: 'Exhibits items from the 4,000-year-old Ahar culture.',
      longDesc: 'Houses a rare collection of earthen pots, iron objects, and sculptures dating back to the 10th century.',
      precautionAndSafety: ['Wear shoes suitable for walking in the adjacent cenotaphs.'],
      metadata: [
        {
          data: '10:00 AM',
          label: 'Open Time',
        },
        {
          data: '4:30 PM',
          label: 'Close Time',
        },
        {
          data: '₹3 (Indians), ₹10 (Foreigners)',
          label: 'Entry Fees',
        },
      ],
      ticketPrice: 300,
      isActive: true,
    },
    {
      name: 'Albert Hall Museum',
      slug: 'albert-hall-museum',
      type: 'museum',
      country: 'India',
      state: 'Rajasthan',
      city: 'Jaipur',
      location: 'Ram Niwas Garden, Ashok Nagar, Jaipur, Rajasthan 302001',
      latitude: 26.9124,
      longitude: 75.8178,
      googleMapLink: 'https://maps.app.goo.gl/KUn47HYeAV1DuTLq5',
      images: [
        'https://1qcn7f9d7l.ufs.sh/f/AQzTCCjJrmHyvk2rJuHr0xUFHRpcuE7d59Y46Z2tgjVkQqNT',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatL3ER8bXYyHGNQWTUq2aECORuhw67SeLso0BzP',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLE3JMkJRcHRFDpwrqXt9iYOIZ3CjxbKvMPU8l',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLjeUja3La08DWVnTAUJNoEFRHBq7Zu5GbgQ9K',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLsAfY3746OSnPTALeNiDcW79R5qHxfVuahByv',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLeQnmub00glDmPZWtMoTfneipLAhyVFEu5aXz',
      ],
      videos: [],
      shortDesc: 'Rajasthan\'s oldest museum featuring an Egyptian mummy.',
      longDesc: 'An Indo-Saracenic architectural masterpiece housing a rich collection of artifacts, pottery, and carpets.',
      precautionAndSafety: ['Photography requires a separate ticket.', 'Flash is prohibited.'],
      metadata: [
        {
          data: '9:00 AM',
          label: 'Open Time',
        },
        {
          data: '5:00 PM',
          label: 'Close Time',
        },
        {
          data: '₹40 (Indians), ₹300 (Foreigners)',
          label: 'Entry Fees',
        },
      ],
      ticketPrice: 4000,
      isActive: true,
    },
    {
      name: 'Anokhi Museum of Hand Printing',
      slug: 'anokhi-museum',
      type: 'museum',
      country: 'India',
      state: 'Rajasthan',
      city: 'Jaipur',
      location: 'Anokhi Haveli, Kheri Gate, Amer, Jaipur, Rajasthan 302028',
      latitude: 26.988,
      longitude: 75.85,
      googleMapLink: 'https://maps.app.goo.gl/CKvBKYB9NME66Q9P8',
      images: [
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLqKSYMbftXxjyZTus1g4hLlra5pSJQfC8EwNc',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLtmR5H3i7uVaQdpZgEo4cL3sXM5ln1BUtFiDk',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatL5U6W8Z9oKS34bYtyvrUCzhOm8gMZxsGDPI70',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLZ07JwUhmTSF1vkBJEGd3gyVM80XWs5ucYH2U',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLfTJAxIex8piPbQthr5ewFHWTaGS9A0BJ7vId',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLP2s5QyxQ5GtfoSd2K9Ab86aNTUcIRCELwDg1',
      ],
      videos: [],
      shortDesc: 'Dedicated to the traditional art of woodblock printing.',
      longDesc: 'Located in a restored haveli, this museum preserves the complex craft of hand-block printing through live demonstrations.',
      precautionAndSafety: ['Photography of certain exhibits is restricted.'],
      metadata: [
        {
          data: '10:30 AM',
          label: 'Open Time',
        },
        {
          data: '4:30 PM',
          label: 'Close Time',
        },
        {
          data: '₹30 (Indians), ₹80 (Foreigners)',
          label: 'Entry Fees',
        },
      ],
      ticketPrice: 3000,
      isActive: true,
    },
    {
      name: 'Bagore Ki Haveli Museum',
      slug: 'bagore-ki-haveli',
      type: 'museum',
      country: 'India',
      state: 'Rajasthan',
      city: 'Udaipur',
      location: 'Gangaur Ghat Marg, Udaipur, Rajasthan 313001',
      latitude: 24.5794,
      longitude: 73.6828,
      googleMapLink: 'https://maps.app.goo.gl/YzGQqkiQg4pU6Bo19',
      images: [
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatL3JfBKMYyHGNQWTUq2aECORuhw67SeLso0BzP',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLmhSxN24uCfsNGR5BreY0FHAlugDypqcKJbdi',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLkKaDna9dceSb8TmM3dtI2RXoDWvjYG0Zhp4n',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLG5yqRZapAgeSl6xz0don8cr5bOuPBpiFWysJ',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLMXCpQrBowsdr2zk49ypjKTDYXuSflQWhcUAI',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLe2YEYR00glDmPZWtMoTfneipLAhyVFEu5aXz',
      ],
      videos: [],
      shortDesc: 'An 18th-century palace showcasing Mewar culture.',
      longDesc: 'Houses the world\'s largest turban and features evening Dharohar folk dance performances.',
      precautionAndSafety: ['Visit in the evening for the dance show.'],
      metadata: [
        {
          data: '10:00 AM',
          label: 'Open Time',
        },
        {
          data: '7:00 PM',
          label: 'Close Time',
        },
        {
          data: '₹60 (Indians), ₹100 (Foreigners)',
          label: 'Entry Fees',
        },
      ],
      ticketPrice: 6000,
      isActive: true,
    },
    {
      name: 'City Palace Museum Jaipur',
      slug: 'city-palace-museum-jaipur',
      type: 'museum',
      country: 'India',
      state: 'Rajasthan',
      city: 'Jaipur',
      location: 'Tulsi Marg, Gangori Bazaar, Jaipur, Rajasthan 302002',
      latitude: 26.9258,
      longitude: 75.8237,
      googleMapLink: 'https://maps.app.goo.gl/grAPbKAWyvjNPwRSA',
      images: [
        'https://1qcn7f9d7l.ufs.sh/f/AQzTCCjJrmHysqgCpPVuCSMTey4UJvqmZRnjgzoPXk26HOi9',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLFQ8OXBaC7NUJBpr5KRxogAPq4au0ivneMSb6',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLvIzK5JMyxNoGuvX5KWntUqJlw42skarjhCcB',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLjpQ1XknLa08DWVnTAUJNoEFRHBq7Zu5GbgQ9',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLLyQsMxzGDNG6HCbXlkYZMURAVdwEetiO4Iv5',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatL6nN54uTVEqSv4Pzy18RDdj3bJiMxKWmp9Bo5',
      ],
      videos: [],
      shortDesc: 'Showcases royal textiles, weapons, and paintings.',
      longDesc: 'Known officially as the Maharaja Sawai Man Singh II Museum, it houses two world-record-sized silver urns.',
      precautionAndSafety: ['Some areas restricted (private residence).', 'Online booking recommended.'],
      metadata: [
        {
          data: '9:30 AM',
          label: 'Open Time',
        },
        {
          data: '5:00 PM',
          label: 'Close Time',
        },
        {
          data: '₹200 (Indians), ₹700 (Foreigners)',
          label: 'Entry Fees',
        },
      ],
      ticketPrice: 20000,
      isActive: true,
    },
    {
      name: 'Fateh Prakash Palace Museum',
      slug: 'fateh-prakash-museum-chittorgarh',
      type: 'museum',
      country: 'India',
      state: 'Rajasthan',
      city: 'Chittorgarh',
      location: 'Chittorgarh Fort, Rajasthan 312001',
      latitude: 24.89,
      longitude: 74.646,
      googleMapLink: 'https://maps.app.goo.gl/3aE4rNyEeDBw52PL7',
      images: [
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLB2VoTHrHps3Cauzihk51YqrZFnR4dflEyQWU',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLPMQTDc5xQ5GtfoSd2K9Ab86aNTUcIRCELwDg',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatL9YedtEQwfpbcWJXBLqemQ4oraYh20GZuHgOI',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLq0YUrE9ftXxjyZTus1g4hLlra5pSJQfC8EwN',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLJqdcs32YFUmbpaRcKSgDGJWynxsXBAE0OqhH',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatL3ojddNYyHGNQWTUq2aECORuhw67SeLso0BzP',
      ],
      videos: [],
      shortDesc: 'A palace converted into a museum within Chittorgarh Fort.',
      longDesc: 'Displays a large collection of weapons, shields, and sculptures from the medieval period.',
      precautionAndSafety: ['Check for holiday closures.'],
      metadata: [
        {
          data: '10:00 AM',
          label: 'Open Time',
        },
        {
          data: '4:30 PM',
          label: 'Close Time',
        },
        {
          data: '₹10 (Indians), ₹50 (Foreigners)',
          label: 'Entry Fees',
        },
      ],
      ticketPrice: 1000,
      isActive: true,
    },
    {
      name: 'Ganga Government Museum',
      slug: 'ganga-museum-bikaner',
      type: 'museum',
      country: 'India',
      state: 'Rajasthan',
      city: 'Bikaner',
      location: 'Public Park, Bikaner, Rajasthan 334001',
      latitude: 28.016,
      longitude: 73.315,
      googleMapLink: 'https://maps.app.goo.gl/ercADkESfvXR9Vxo8',
      images: [
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLBnBKJ4rHps3Cauzihk51YqrZFnR4dflEyQWU',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLvwmKBgMyxNoGuvX5KWntUqJlw42skarjhCcB',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatL3jZPosYyHGNQWTUq2aECORuhw67SeLso0BzP',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatL07WBDOwPT5xpmLX3nlgCesZ72tOr1K6ifjWI',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLYsTlpZ8Xeu0nQyjrFSM8WCplDxHOcBU1w3TK',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatL3ER8bXYyHGNQWTUq2aECORuhw67SeLso0BzP',
      ],
      videos: [],
      shortDesc: 'Known for its Harappan artifacts and Silk Road textiles.',
      longDesc: 'Built in 1937, it is one of the best museums in the state for historical research and prehistoric findings.',
      precautionAndSafety: ['Guided tours are recommended for researchers.'],
      metadata: [
        {
          data: '10:00 AM',
          label: 'Open Time',
        },
        {
          data: '5:00 PM',
          label: 'Close Time',
        },
        {
          data: '₹20 (Indians), ₹100 (Foreigners)',
          label: 'Entry Fees',
        },
      ],
      ticketPrice: 2000,
      isActive: true,
    },
    {
      name: 'Jaisalmer War Museum',
      slug: 'jaisalmer-war-museum',
      type: 'museum',
      country: 'India',
      state: 'Rajasthan',
      city: 'Jaisalmer',
      location: 'Jaisalmer-Jodhpur Highway, Rajasthan 345001',
      latitude: 26.915,
      longitude: 71.025,
      googleMapLink: 'https://maps.app.goo.gl/DiKLFY8Ut1aFECuLA',
      images: [
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLxBrbdcLvEqUeiPcoCOb64HsaI8AR7L5hMldt',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatL32TqeKYyHGNQWTUq2aECORuhw67SeLso0BzP',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLmnodqNuCfsNGR5BreY0FHAlugDypqcKJbdiX',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLftSIyGex8piPbQthr5ewFHWTaGS9A0BJ7vId',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatL8YPOKO70KUJLz3fk7wCnAsjHTGhxDNO8ma21',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatL6Dbz07RTVEqSv4Pzy18RDdj3bJiMxKWmp9Bo',
      ],
      videos: [],
      shortDesc: 'A tribute to the Indian Army\'s bravery in the desert.',
      longDesc: 'Established to showcase the history of the Longewala battle. It features captured tanks, fighter jets, and an audio-visual room.',
      precautionAndSafety: ['Maintain discipline as it is an army-maintained site.'],
      metadata: [
        {
          data: '9:00 AM',
          label: 'Open Time',
        },
        {
          data: '6:00 PM',
          label: 'Close Time',
        },
        {
          data: 'Free Entry (Nominal fee for movie)',
          label: 'Entry Fees',
        },
      ],
      ticketPrice: 0,
      isActive: true,
    },
    {
      name: 'Sardar Government Museum',
      slug: 'sardar-government-museum',
      type: 'museum',
      country: 'India',
      state: 'Rajasthan',
      city: 'Jodhpur',
      location: 'Umaid Bagh, Jodhpur, Rajasthan 342001',
      latitude: 26.2912,
      longitude: 73.0332,
      googleMapLink: 'https://maps.app.goo.gl/EKXUgKncp9fpQKzu5',
      images: [
        'https://1qcn7f9d7l.ufs.sh/f/AQzTCCjJrmHyLZftyySQBfu4ZKni9jLzgqOdkeMWGY8PS7RU',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLL2soUDGDNG6HCbXlkYZMURAVdwEetiO4Iv50',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLxwb110vEqUeiPcoCOb64HsaI8AR7L5hMldtu',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLbhPYInFhlx6cINtXHuf1U39gWELjCwvVG5kn',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLBp77j9rHps3Cauzihk51YqrZFnR4dflEyQWU',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLmhItLxyuCfsNGR5BreY0FHAlugDypqcKJbdi',
      ],
      videos: [],
      shortDesc: 'A British-era museum inside Umaid Public Gardens.',
      longDesc: 'Built in 1909, it displays portraits of kings, stone sculptures, and terracotta from ancient sites.',
      precautionAndSafety: ['Usually closed on Fridays and public holidays.'],
      metadata: [
        {
          data: '10:00 AM',
          label: 'Open Time',
        },
        {
          data: '5:00 PM',
          label: 'Close Time',
        },
        {
          data: '₹20 (Indians), ₹100 (Foreigners)',
          label: 'Entry Fees',
        },
      ],
      ticketPrice: 2000,
      isActive: true,
    },
    {
      name: 'Vintage Car Museum',
      slug: 'vintage-car-museum-udaipur',
      type: 'museum',
      country: 'India',
      state: 'Rajasthan',
      city: 'Udaipur',
      location: 'Gulab Bagh Rd, Udaipur, Rajasthan 313001',
      latitude: 24.577,
      longitude: 73.692,
      googleMapLink: 'https://maps.app.goo.gl/9acnwwgzLe7s423s6',
      images: [
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLMJJeD2iBowsdr2zk49ypjKTDYXuSflQWhcUA',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLEH301tcHRFDpwrqXt9iYOIZ3CjxbKvMPU8lh',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLPMrsHejxQ5GtfoSd2K9Ab86aNTUcIRCELwDg',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLzQS6S6KIj8P7imGHJKyaTZqMvFYC9oQrSxAu',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLplCURVyKGQsNRYgZtWdobLUSFV6rMCeyaExf',
        'https://o8svf3luue.ufs.sh/f/cnyCfb1HiatLcWXIMg1HiatLm3KhUYMxbwq2N0Wo9IXyZvDV',
      ],
      videos: [],
      shortDesc: 'The royal collection of classic cars owned by Mewar Maharajas.',
      longDesc: 'Includes the 1934 Rolls-Royce Phantom and several Cadillacs used by the royal family of Udaipur.',
      precautionAndSafety: ['Do not touch the vehicles.'],
      metadata: [
        {
          data: '9:00 AM',
          label: 'Open Time',
        },
        {
          data: '9:00 PM',
          label: 'Close Time',
        },
        {
          data: '₹400 (Approx per person)',
          label: 'Entry Fees',
        },
      ],
      ticketPrice: 40000,
      isActive: true,
    },
];

// ─── Seed runner ─────────────────────────────────────────────────────────────

async function seed() {
  console.log('🌱  Starting database seed…\n');

  let inserted = 0;
  let skipped = 0;

  for (const p of places) {
    try {
      await db
        .insert(place)
        .values(p)
        .onConflictDoUpdate({
          target: place.slug,
          set: {
            name: p.name,
            type: p.type,
            country: p.country,
            state: p.state,
            city: p.city,
            location: p.location,
            latitude: p.latitude,
            longitude: p.longitude,
            googleMapLink: p.googleMapLink,
            images: p.images,
            videos: p.videos,
            shortDesc: p.shortDesc,
            longDesc: p.longDesc,
            precautionAndSafety: p.precautionAndSafety,
            metadata: p.metadata,
            ticketPrice: p.ticketPrice,
            isActive: p.isActive,
          },
        });

      console.log(`  ✅  ${p.type!.padEnd(8)}  ${p.name}  (${p.city}) — ₹${(p.ticketPrice ?? 0) / 100}`);
      inserted++;
    } catch (err) {
      console.warn(`  ⚠️   Skipped "${p.name}" — ${(err as Error).message}`);
      skipped++;
    }
  }

  console.log(`\n🏁  Seed complete — ${inserted} upserted, ${skipped} skipped.\n`);
  await pool.end();
}

seed().catch((err) => {
  console.error('❌  Seed failed:', err);
  process.exit(1);
});
