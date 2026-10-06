import postgres from 'postgres';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

let connectionString = process.env.DATABASE_URL || '';
connectionString = connectionString.replace(/:([^@:]*)@/, (m, p) => {
  const fixed = p.replace(/%(?![0-9A-Fa-f]{2})/g, '%25');
  return `:${fixed}@`;
});

const sql = postgres(connectionString, { prepare: false });

async function main() {
  console.log('Applying migration to add email to profiles...');
  await sql`ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email text;`;
  await sql`UPDATE public.profiles p SET email = u.email FROM auth.users u WHERE p.id = u.id AND p.email IS NULL;`;
  console.log('Successfully updated profiles with email!');
  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
