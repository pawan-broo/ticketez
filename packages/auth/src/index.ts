import { nextCookies } from 'better-auth/next-js';
import { betterAuth, type BetterAuthOptions } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@ticketez/db';
import * as schema from '@ticketez/db/schema/auth';
import { randomUUID } from 'crypto';

export const auth = betterAuth<BetterAuthOptions>({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: schema,
  }),
  trustedOrigins: [process.env.CORS_ORIGIN || ''],
  emailAndPassword: {
    enabled: false,
  },
  secret: process.env.BETTER_AUTH_SECRET,
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      prompt: 'select_account',
    },
  },
  plugins: [nextCookies()],
  user: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'USER',
        input: false,
      },
    },
  },
  advanced: {
    database: {
      generateId: () => randomUUID(),
    },
  },
});
