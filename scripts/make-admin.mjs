import postgres from 'postgres';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

let connectionString = process.env.DATABASE_URL || '';
if (!connectionString) {
  console.error('❌ Error: DATABASE_URL tidak ditemukan di .env.local');
  process.exit(1);
}

// Percent-encode any literal % in password
connectionString = connectionString.replace(/:([^@:]*)@/, (m, p) => {
  const fixed = p.replace(/%(?![0-9A-Fa-f]{2})/g, '%25');
  return `:${fixed}@`;
});

const sql = postgres(connectionString, { prepare: false });

async function main() {
  const targetEmail = process.argv[2]?.trim().toLowerCase();

  if (!targetEmail) {
    console.log('\n🔍 Mencari seluruh akun terdaftar di Supabase Auth...');
    const users = await sql`
      SELECT id, email, created_at, raw_user_meta_data
      FROM auth.users
      ORDER BY created_at DESC;
    `;

    if (users.length === 0) {
      console.log('⚠️ Belum ada akun yang terdaftar di Supabase Auth.');
      console.log('👉 Silakan buat akun terlebih dahulu di website melalui halaman /auth/sign-up');
      await sql.end();
      return;
    }

    console.log(`Ditemukan ${users.length} akun:`);
    users.forEach((u, i) => {
      console.log(` [${i + 1}] ${u.email} (ID: ${u.id})`);
    });

    console.log('\n💡 Cara penggunaan:');
    console.log('   npm run make-admin <email>');
    console.log(`   Contoh: npm run make-admin ${users[0].email}\n`);
    await sql.end();
    return;
  }

  console.log(`\n⚙️ Memproses perubahan role untuk: ${targetEmail}...`);

  // 1. Cek di auth.users
  const [authUser] = await sql`
    SELECT id, email, raw_user_meta_data
    FROM auth.users
    WHERE LOWER(email) = ${targetEmail};
  `;

  if (!authUser) {
    console.error(`❌ User dengan email "${targetEmail}" tidak ditemukan di Supabase Auth.`);
    console.error('👉 Pastikan email sudah terdaftar melalui /auth/sign-up');
    await sql.end();
    process.exit(1);
  }

  const fullName =
    authUser.raw_user_meta_data?.full_name ||
    authUser.raw_user_meta_data?.name ||
    authUser.email.split('@')[0];

  // 2. Insert atau Update di public.profiles
  await sql`
    INSERT INTO public.profiles (id, full_name, email, role, updated_at)
    VALUES (${authUser.id}, ${fullName}, ${authUser.email}, 'admin', NOW())
    ON CONFLICT (id) DO UPDATE
    SET role = 'admin',
        email = EXCLUDED.email,
        full_name = COALESCE(public.profiles.full_name, EXCLUDED.full_name),
        updated_at = NOW();
  `;

  console.log('🎉 BERHASIL!');
  console.log(`Akun ${authUser.email} (${authUser.id}) kini berstatus: ADMIN 🛡️`);
  console.log('Silakan login dan buka menu Admin Panel di: http://localhost:3000/admin\n');

  await sql.end();
}

main().catch((err) => {
  console.error('❌ Terjadi kesalahan:', err);
  process.exit(1);
});
