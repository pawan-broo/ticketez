import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { place } from './schema/places';
import { asc } from 'drizzle-orm';

import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({
  path: path.resolve(__dirname, '../../../apps/web/.env'),
});

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Stringify a value into valid TypeScript source — pretty-printed. */
function toTs(value: unknown, indent = 4): string {
  if (value === null || value === undefined) return 'null';

  if (typeof value === 'string') {
    // Escape backticks and backslashes, then wrap in single quotes
    const escaped = value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    return `'${escaped}'`;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';

    const pad = ' '.repeat(indent + 2);
    const closePad = ' '.repeat(indent);

    // Flat array of primitives → single-line
    const allPrimitive = value.every(
      (v) => typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean',
    );
    if (allPrimitive) {
      const items = value.map((v) => toTs(v, indent)).join(', ');
      const oneLiner = `[${items}]`;
      // Keep on one line if short enough
      if (oneLiner.length <= 100) return oneLiner;
    }

    const items = value.map((v) => `${pad}${toTs(v, indent + 2)}`).join(',\n');
    return `[\n${items},\n${closePad}]`;
  }

  if (typeof value === 'object') {
    const pad = ' '.repeat(indent + 2);
    const closePad = ' '.repeat(indent);
    const entries = Object.entries(value as Record<string, unknown>)
      .map(([k, v]) => `${pad}${k}: ${toTs(v, indent + 2)}`)
      .join(',\n');
    return `{\n${entries},\n${closePad}}`;
  }

  return String(value);
}

/** Format a single place object into TypeScript source lines. */
function formatPlace(p: typeof place.$inferSelect): string {
  const indent = 4; // 4 spaces inside the array literal
  const pad = ' '.repeat(indent);

  const fields: [string, unknown][] = [
    ['name', p.name],
    ['slug', p.slug],
    ['type', p.type],
    ['country', p.country],
    ['state', p.state],
    ['city', p.city],
    ['location', p.location],
    ['latitude', p.latitude ?? null],
    ['longitude', p.longitude ?? null],
    ['googleMapLink', p.googleMapLink ?? null],
    ['images', p.images],
    ['videos', p.videos],
    ['shortDesc', p.shortDesc ?? null],
    ['longDesc', p.longDesc ?? null],
    ['precautionAndSafety', p.precautionAndSafety],
    ['metadata', p.metadata ?? []],
    ['ticketPrice', p.ticketPrice],
    ['isActive', p.isActive],
  ];

  const lines = fields
    .map(([key, val]) => `${pad}  ${key}: ${toTs(val, indent + 2)}`)
    .join(',\n');

  return `${pad}{\n${lines},\n${pad}}`;
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function exportPlaces() {
  console.log('🔍  Connecting to database…');

  const places = await db
    .select()
    .from(place)
    .orderBy(asc(place.type), asc(place.name));

  if (places.length === 0) {
    console.warn('⚠️   No places found in the database. Exiting.');
    await pool.end();
    return;
  }

  console.log(`✅  Fetched ${places.length} place(s) from the database.\n`);

  // ─── Group by type for a readable comment header ─────────────────────────
  const monuments = places.filter((p) => p.type === 'monument');
  const museums = places.filter((p) => p.type === 'museum');
  const others = places.filter((p) => p.type !== 'monument' && p.type !== 'museum');

  const sections: string[] = [];

  if (monuments.length > 0) {
    sections.push(
      `  // ─── MONUMENTS (${monuments.length}) ────────────────────────────────────────────────────\n` +
        monuments.map(formatPlace).join(',\n'),
    );
  }

  if (museums.length > 0) {
    sections.push(
      `  // ─── MUSEUMS (${museums.length}) ──────────────────────────────────────────────────────\n` +
        museums.map(formatPlace).join(',\n'),
    );
  }

  if (others.length > 0) {
    sections.push(
      `  // ─── OTHER (${others.length}) ────────────────────────────────────────────────────────\n` +
        others.map(formatPlace).join(',\n'),
    );
  }

  const placesBody = sections.join(',\n\n');

  // ─── Build the full seed file ─────────────────────────────────────────────
  const now = new Date().toISOString();
  const output = `// ─────────────────────────────────────────────────────────────────────────────
// Auto-generated seed data — exported from the database on ${now}
// Total places: ${places.length} (${monuments.length} monuments, ${museums.length} museums${others.length > 0 ? `, ${others.length} other` : ''})
//
// Usage:
//   1. Replace the \`places\` array in packages/db/src/seed.ts with this data.
//   2. Run:  pnpm --filter @ticketez/db db:seed
// ─────────────────────────────────────────────────────────────────────────────

import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { place } from './schema/places';

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({
  path: path.resolve(__dirname, '../../../apps/web/.env'),
});

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

const places: (typeof place.$inferInsert)[] = [
${placesBody},
];

// ─── Seed runner ─────────────────────────────────────────────────────────────

async function seed() {
  console.log('🌱  Starting database seed…\\n');

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

      console.log(\`  ✅  \${p.type!.padEnd(8)}  \${p.name}  (\${p.city}) — ₹\${(p.ticketPrice ?? 0) / 100}\`);
      inserted++;
    } catch (err) {
      console.warn(\`  ⚠️   Skipped "\${p.name}" — \${(err as Error).message}\`);
      skipped++;
    }
  }

  console.log(\`\\n🏁  Seed complete — \${inserted} upserted, \${skipped} skipped.\\n\`);
  await pool.end();
}

seed().catch((err) => {
  console.error('❌  Seed failed:', err);
  process.exit(1);
});
`;

  // ─── Write output file ────────────────────────────────────────────────────
  const outPath = path.resolve(__dirname, '../seed-export.ts');
  fs.writeFileSync(outPath, output, 'utf-8');

  console.log(`📄  Written to: ${outPath}`);
  console.log(`\n📊  Summary:`);
  console.log(`    • Total places : ${places.length}`);
  console.log(`    • Monuments    : ${monuments.length}`);
  console.log(`    • Museums      : ${museums.length}`);
  if (others.length > 0) console.log(`    • Other        : ${others.length}`);
  console.log(`\n✨  Done. Copy seed-export.ts → src/seed.ts to use it as the new seed.\n`);

  await pool.end();
}

exportPlaces().catch((err) => {
  console.error('❌  Export failed:', err);
  process.exit(1);
});
