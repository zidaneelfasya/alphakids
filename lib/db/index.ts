import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

let connectionString = process.env.DATABASE_URL || '';

if (!connectionString) {
  console.warn('DATABASE_URL is not set. Drizzle ORM operations requiring direct DB connection will fail.');
} else {
  // Ensure any literal % in database password is validly percent-encoded as %25
  connectionString = connectionString.replace(/:([^@:]*)@/, (m, p) => {
    const fixed = p.replace(/%(?![0-9A-Fa-f]{2})/g, '%25');
    return `:${fixed}@`;
  });
}

// Disable prefetch as it is not supported for "Transaction" pool mode in Supabase
const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, { schema });
export * from './schema';
