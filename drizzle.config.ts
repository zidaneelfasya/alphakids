import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// Ensure any literal % in database password is validly percent-encoded as %25
let connectionString = process.env.DATABASE_URL || '';
if (connectionString) {
  connectionString = connectionString.replace(/:([^@:]*)@/, (m, p) => {
    // If p contains % not followed by two hex digits, encode it
    const fixed = p.replace(/%(?![0-9A-Fa-f]{2})/g, '%25');
    return `:${fixed}@`;
  });
}

export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: connectionString,
  },
});
