import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { sql } from 'drizzle-orm';

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({
  path: path.resolve(__dirname, '../../../apps/web/.env'),
});

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

// ─── Tables in safe truncation order (children before parents) ───────────────
// CASCADE handles FK references automatically, but we list leaf-first anyway
// so the log output is readable and predictable.

const TABLES = [
  // ── Leaf tables (no children) ──
  'booking_member',   // FK → booking
  'saved_place',      // FK → user
  'verification',     // standalone auth table
  'session',          // FK → user
  'account',          // FK → user
  'settings',         // standalone
  // ── Mid-level ──
  'booking',          // FK → user, place
  // ── Root tables ──
  'place',
  '"user"',           // quoted because USER is a reserved word in PostgreSQL
] as const;

async function clearDb() {
  console.log('⚠️   WARNING: This will permanently delete ALL data.\n');

  // Give a short window to abort
  await new Promise((res) => setTimeout(res, 2000));

  console.log('🗑️   Clearing database…\n');

  let cleared = 0;
  let failed = 0;

  for (const table of TABLES) {
    try {
      await db.execute(sql.raw(`TRUNCATE TABLE ${table} RESTART IDENTITY CASCADE;`));
      console.log(`  ✅  Truncated  ${table}`);
      cleared++;
    } catch (err) {
      console.warn(`  ⚠️   Skipped    ${table}  — ${(err as Error).message}`);
      failed++;
    }
  }

  console.log(`\n🏁  Done — ${cleared} table(s) cleared, ${failed} skipped.\n`);

  await pool.end();
}

clearDb().catch((err) => {
  console.error('❌  Clear failed:', err);
  process.exit(1);
});
