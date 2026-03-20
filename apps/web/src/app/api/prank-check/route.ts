import { NextResponse } from 'next/server';
import { db } from '@ticketez/db';
import { settings } from '@ticketez/db/schema/settings';
import { eq } from 'drizzle-orm';

export const revalidate = 10; // ISR cache — re-fetch from DB at most every 10 seconds

export async function GET() {
  try {
    const [row] = await db
      .select({ value: settings.value })
      .from(settings)
      .where(eq(settings.key, 'ENABLE_PRANK_MODE'))
      .limit(1);

    const enabled = row?.value === 'true';

    return NextResponse.json(
      { enabled },
      {
        headers: {
          'Cache-Control': 'public, max-age=10, stale-while-revalidate=5',
        },
      },
    );
  } catch {
    // If DB is unreachable or table doesn't exist yet, fail safe — prank off
    return NextResponse.json(
      { enabled: false },
      {
        headers: {
          'Cache-Control': 'public, max-age=5',
        },
      },
    );
  }
}
