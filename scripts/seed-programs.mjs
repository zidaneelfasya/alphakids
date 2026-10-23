import { createClient } from '@supabase/supabase-js';
import postgres from 'postgres';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
let connectionString = process.env.DATABASE_URL || '';

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY harus diisi di .env.local');
  process.exit(1);
}

if (!connectionString) {
  console.error('❌ Error: DATABASE_URL tidak ditemukan di .env.local');
  process.exit(1);
}

// Percent-encode any literal % in password
connectionString = connectionString.replace(/:([^@:]*)@/, (m, p) => {
  const fixed = p.replace(/%(?![0-9A-Fa-f]{2})/g, '%25');
  return `:${fixed}@`;
});

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const sql = postgres(connectionString, { prepare: false });

async function uploadImageToStorage(bucketName, localFilePath, destinationFileName) {
  console.log(`📤 Mengunggah ${localFilePath} ke bucket '${bucketName}/${destinationFileName}'...`);
  const fileBuffer = fs.readFileSync(localFilePath);

  const { error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(destinationFileName, fileBuffer, {
      contentType: 'image/png',
      upsert: true,
    });

  if (uploadError) {
    throw new Error(`Gagal upload ${destinationFileName}: ${uploadError.message}`);
  }

  const { data: urlData } = supabase.storage
    .from(bucketName)
    .getPublicUrl(destinationFileName);

  console.log(`✅ Berhasil diunggah! Public URL: ${urlData.publicUrl}`);
  return urlData.publicUrl;
}

async function main() {
  console.log('🚀 Memulai proses seeding data program dan kategori Alpha Kids...');

  // 1. Pastikan Bucket 'programs' ada di Supabase Storage
  const bucketName = 'programs';
  console.log(`\n📦 Memeriksa bucket '${bucketName}' di Supabase Storage...`);
  const { data: buckets, error: getBucketError } = await supabase.storage.listBuckets();

  if (getBucketError) {
    console.warn(`⚠️ Peringatan saat listBuckets: ${getBucketError.message}. Mencoba cek via SQL...`);
  }

  const bucketExists = buckets?.some((b) => b.name === bucketName);

  if (!bucketExists) {
    console.log(`⚙️ Membuat bucket '${bucketName}' (public: true)...`);
    const { error: createBucketError } = await supabase.storage.createBucket(bucketName, {
      public: true,
      fileSizeLimit: 10485760, // 10MB
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
    });

    if (createBucketError) {
      console.warn(`⚠️ createBucket via SDK: ${createBucketError.message}. Memastikan via SQL...`);
      await sql`
        INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
        VALUES (${bucketName}, ${bucketName}, true, 10485760, ARRAY['image/png', 'image/jpeg', 'image/webp'])
        ON CONFLICT (id) DO UPDATE SET public = true;
      `;
    }
  } else {
    await supabase.storage.updateBucket(bucketName, { public: true });
    console.log(`✅ Bucket '${bucketName}' sudah ada dan berstatus publik.`);
  }

  // 2. Upload aset hero1.png dan cta.png ke Supabase Storage
  const hero1Path = path.resolve('public/assets/img/hero1.png');
  const ctaPath = path.resolve('public/assets/img/cta.png');

  if (!fs.existsSync(hero1Path) || !fs.existsSync(ctaPath)) {
    throw new Error('❌ Berkas hero1.png atau cta.png tidak ditemukan di public/assets/img/');
  }

  const hero1Url = await uploadImageToStorage(bucketName, hero1Path, 'hero1.png');
  const ctaUrl = await uploadImageToStorage(bucketName, ctaPath, 'cta.png');

  // 3. Seed Kategori Resmi (Sesuai Review: Semua | Private 1-on-1 | Kelas Grup | Matematika | IPA | IPS)
  console.log('\n📂 Melakukan seeding tabel categories...');
  const categoriesData = [
    {
      name: 'Private 1-on-1',
      slug: 'private-1-on-1',
      description: 'Pendampingan belajar privat eksklusif 1-on-1 dengan jadwal fleksibel dan pendekatan personal.',
    },
    {
      name: 'Kelas Grup',
      slug: 'kelas-grup',
      description: 'Kelas interaktif kelompok kecil bersama mentor berpengalaman untuk membangun kolaborasi dan daya juang siswa.',
    },
    {
      name: 'Matematika',
      slug: 'matematika',
      description: 'Program bimbingan intensif persiapan Olimpiade Sains Nasional bidang Matematika tingkat SD & SMP.',
    },
    {
      name: 'IPA',
      slug: 'ipa',
      description: 'Bimbingan terstruktur pendalaman materi sains, biologi, dan fisika untuk olimpiade jenjang SD & SMP.',
    },
    {
      name: 'IPS',
      slug: 'ips',
      description: 'Penguasaan konsep geografi, sejarah, sosiologi, dan ekonomi untuk persiapan kompetisi OSN IPS.',
    },
  ];

  const categoryMap = new Map();

  for (const cat of categoriesData) {
    const [savedCat] = await sql`
      INSERT INTO public.categories (name, slug, description, is_active, updated_at)
      VALUES (${cat.name}, ${cat.slug}, ${cat.description}, true, NOW())
      ON CONFLICT (slug) DO UPDATE
      SET name = EXCLUDED.name,
          description = EXCLUDED.description,
          is_active = true,
          updated_at = NOW()
      RETURNING id, slug;
    `;
    categoryMap.set(savedCat.slug, savedCat.id);
    console.log(`  ✓ Kategori '${cat.name}' (${savedCat.id})`);
  }

  // 4. Seed Program (public.programs)
  // Sesuai Review:
  // - Badge jenjang kelas: SD Kelas 4–6 / SMP Kelas 7–9
  // - Private 1-on-1: Label Mulai dari, Harga: Rp250.000 / sesi
  // - Bootcamp / Kelas Grup: Label Program lengkap, Harga: Rp800.000 / siswa
  console.log('\n🎓 Melakukan seeding tabel programs...');
  const programsData = [
    {
      categorySlug: 'private-1-on-1',
      title: 'Private 1-on-1 OSN Matematika SD',
      slug: 'private-osn-matematika-sd',
      description: 'Bimbingan intensif 1-on-1 persiapan seleksi OSN Matematika SD dengan kurikulum terstruktur dan pemecahan soal HOTS.',
      price: 250000,
      coverImage: hero1Url,
      ageRange: 'SD Kelas 4–6',
      level: 'SD Kelas 4–6',
      contents: [
        {
          title: 'Pendalaman Teori Bilangan & Aljabar Dasar',
          contentType: 'lesson',
          content: 'Pembahasan konsep dasar pemecahan masalah nalar tingkat tinggi dan pola bilangan olimpiade.',
          sortOrder: 1,
        },
        {
          title: 'Simulasi Tryout CBT & Analisis Kesalahan',
          contentType: 'lesson',
          content: 'Latihan soal mandiri berbasis CBT dengan feedback detail langsung dari mentor.',
          sortOrder: 2,
        },
        {
          title: 'Fasilitas & Pendampingan Mentor Medalis',
          contentType: 'text',
          content: 'Jadwal fleksibel, sesi tanya jawab tak terbatas, dan laporan evaluasi rutin berkala kepada orang tua.',
          sortOrder: 3,
        },
      ],
    },
    {
      categorySlug: 'private-1-on-1',
      title: 'Private 1-on-1 OSN IPA SMP',
      slug: 'private-osn-ipa-smp',
      description: 'Pendampingan privat personal bidang IPA Fisika dan Biologi SMP menghadapi seleksi OSN tingkat kota dan provinsi.',
      price: 250000,
      coverImage: ctaUrl,
      ageRange: 'SMP Kelas 7–9',
      level: 'SMP Kelas 7–9',
      contents: [
        {
          title: 'Konsep Mekanika, Gelombang & Fisiologi Makhluk Hidup',
          contentType: 'lesson',
          content: 'Eksplorasi materi esensial sesuai silabus resmi Puspresnas secara terstruktur.',
          sortOrder: 1,
        },
        {
          title: 'Bedah Soal HOTS & Strategi Eliminasi Cepat',
          contentType: 'lesson',
          content: 'Teknik menganalisis soal eksperimental dan penalaran logis tingkat tinggi.',
          sortOrder: 2,
        },
      ],
    },
    {
      categorySlug: 'private-1-on-1',
      title: 'Private 1-on-1 OSN IPS SMP',
      slug: 'private-osn-ips-smp',
      description: 'Bimbingan eksklusif 1-on-1 OSN IPS SMP mencakup dinamika sosial, spasial geografi, dan sistem ekonomi.',
      price: 250000,
      coverImage: hero1Url,
      ageRange: 'SMP Kelas 7–9',
      level: 'SMP Kelas 7–9',
      contents: [
        {
          title: 'Pemahaman Peta, Geografi & Dinamika Sosial',
          contentType: 'lesson',
          content: 'Materi terstruktur konsep spasial dan dinamika interaksi sosial masyarakat.',
          sortOrder: 1,
        },
      ],
    },
    {
      categorySlug: 'kelas-grup',
      title: 'Bootcamp Intensif OSN Matematika SD',
      slug: 'bootcamp-osn-matematika-sd',
      description: 'Program lengkap bimbingan kelompok persiapan kompetisi OSN Matematika SD dengan simulasi tryout dan modul eksklusif.',
      price: 800000,
      coverImage: ctaUrl,
      ageRange: 'SD Kelas 4–6',
      level: 'SD Kelas 4–6',
      contents: [
        {
          title: 'Kurikulum Berjenjang Seleksi OSN Kota hingga Nasional',
          contentType: 'lesson',
          content: 'Modul bertahap dari konsep dasar hingga tipe soal kompetisi nasional.',
          sortOrder: 1,
        },
        {
          title: 'Simulasi Tryout Berkala Berstandar Nasional',
          contentType: 'lesson',
          content: 'Ujian simulasi online dengan skor real-time dan pembahasan live interaktif.',
          sortOrder: 2,
        },
      ],
    },
    {
      categorySlug: 'kelas-grup',
      title: 'Bootcamp Persiapan OSN IPA SMP',
      slug: 'bootcamp-osn-ipa-smp',
      description: 'Program lengkap kelas grup interaktif pendalaman materi sains terpadu SMP dengan bank latihan soal terlengkap.',
      price: 800000,
      coverImage: hero1Url,
      ageRange: 'SMP Kelas 7–9',
      level: 'SMP Kelas 7–9',
      contents: [
        {
          title: 'Fisika Terapan & Biologi Seluler Lanjutan',
          contentType: 'lesson',
          content: 'Pembahasan komprehensif silabus olimpiade sains nasional jenjang SMP.',
          sortOrder: 1,
        },
      ],
    },
    {
      categorySlug: 'kelas-grup',
      title: 'Bootcamp & Masterclass OSN IPS SMP',
      slug: 'bootcamp-osn-ips-smp',
      description: 'Program lengkap kelas grup persiapan olimpiade IPS SMP dengan studi kasus fenomena sosial dan pembinaan mentor juara.',
      price: 800000,
      coverImage: ctaUrl,
      ageRange: 'SMP Kelas 7–9',
      level: 'SMP Kelas 7–9',
      contents: [
        {
          title: 'Analisis Fenomena Ekonomi & Lingkungan',
          contentType: 'lesson',
          content: 'Bedah tipe soal esai dan pilihan ganda kompetisi sains nasional bidang IPS.',
          sortOrder: 1,
        },
      ],
    },
    {
      categorySlug: 'matematika',
      title: 'Kelas Master OSN Matematika SMP',
      slug: 'kelas-master-osn-matematika-smp',
      description: 'Bimbingan intensif kombinatorika, aljabar, dan geometri tingkat SMP untuk mencetak calon juara OSN tingkat provinsi & nasional.',
      price: 800000,
      coverImage: hero1Url,
      ageRange: 'SMP Kelas 7–9',
      level: 'SMP Kelas 7–9',
      contents: [
        {
          title: 'Kombinatorika & Teori Peluang Olimpiade',
          contentType: 'lesson',
          content: 'Strategi pemecahan masalah non-rutin dengan nalar analitis cepat.',
          sortOrder: 1,
        },
      ],
    },
    {
      categorySlug: 'ipa',
      title: 'Kelas Eksplorasi Sains & OSN IPA SD',
      slug: 'kelas-eksplorasi-osn-ipa-sd',
      description: 'Bimbingan sains terarah untuk anak SD kelas 4-6 dengan pendekatan eksperimen interaktif dan pemahaman konsep mendalam.',
      price: 250000,
      coverImage: ctaUrl,
      ageRange: 'SD Kelas 4–6',
      level: 'SD Kelas 4–6',
      contents: [
        {
          title: 'Alam Semesta, Energi & Keanekaragaman Hayati',
          contentType: 'lesson',
          content: 'Konsep dasar IPA sekolah dasar yang dikembangkan hingga level pengujian OSN.',
          sortOrder: 1,
        },
      ],
    },
    {
      categorySlug: 'ips',
      title: 'Kelas Pendalaman OSN IPS Terpadu SMP',
      slug: 'kelas-pendalaman-osn-ips-smp',
      description: 'Bimbingan komprehensif geografi, sejarah, sosiologi, dan ekonomi bersama mentor lulusan perguruan tinggi ternama.',
      price: 250000,
      coverImage: hero1Url,
      ageRange: 'SMP Kelas 7–9',
      level: 'SMP Kelas 7–9',
      contents: [
        {
          title: 'Ruang, Waktu, & Interaksi Sosial Manusia',
          contentType: 'lesson',
          content: 'Penguasaan materi holistik kurikulum olimpiade IPS jenjang SMP.',
          sortOrder: 1,
        },
      ],
    },
  ];

  for (const prog of programsData) {
    const categoryId = categoryMap.get(prog.categorySlug);

    const [savedProg] = await sql`
      INSERT INTO public.programs (
        category_id, title, slug, description, price, cover_image, age_range, level, is_active, published_at, updated_at
      ) VALUES (
        ${categoryId}, ${prog.title}, ${prog.slug}, ${prog.description}, ${prog.price}, ${prog.coverImage}, ${prog.ageRange}, ${prog.level}, true, NOW(), NOW()
      )
      ON CONFLICT (slug) DO UPDATE
      SET category_id = EXCLUDED.category_id,
          title = EXCLUDED.title,
          description = EXCLUDED.description,
          price = EXCLUDED.price,
          cover_image = EXCLUDED.cover_image,
          age_range = EXCLUDED.age_range,
          level = EXCLUDED.level,
          is_active = true,
          updated_at = NOW()
      RETURNING id, title, slug;
    `;

    console.log(`  ✓ Program '${savedProg.title}' (${savedProg.slug}) - ${prog.level} - Rp${prog.price.toLocaleString('id-ID')}`);

    // Hapus konten publik lama untuk program ini agar tidak duplikat
    await sql`
      DELETE FROM public.program_contents
      WHERE program_id = ${savedProg.id} AND visibility = 'public';
    `;

    // Seed konten publik
    for (const item of prog.contents) {
      await sql`
        INSERT INTO public.program_contents (
          program_id, title, content_type, content, visibility, sort_order, updated_at
        ) VALUES (
          ${savedProg.id}, ${item.title}, ${item.contentType}, ${item.content}, 'public', ${item.sortOrder}, NOW()
        );
      `;
    }
  }

  // 5. Seed Vouchers (public.vouchers)
  console.log('\n🎟️ Melakukan seeding tabel vouchers...');
  const vouchersData = [
    {
      code: 'ALPHAJUARA',
      discountType: 'percentage',
      discountValue: 15,
    },
    {
      code: 'OSN50K',
      discountType: 'fixed',
      discountValue: 50000,
    },
  ];

  for (const v of vouchersData) {
    await sql`
      INSERT INTO public.vouchers (code, discount_type, discount_value, is_active, updated_at)
      VALUES (${v.code}, ${v.discountType}, ${v.discountValue}, true, NOW())
      ON CONFLICT (code) DO UPDATE
      SET discount_type = EXCLUDED.discount_type,
          discount_value = EXCLUDED.discount_value,
          is_active = true,
          updated_at = NOW();
    `;
    console.log(`  ✓ Voucher '${v.code}' (${v.discountType === 'percentage' ? `${v.discountValue}%` : `Rp ${v.discountValue}`})`);
  }

  console.log('\n✨ SEEDING PROGRAM BERHASIL! Seluruh kategori, program, dan voucher sudah sesuai standar Alpha Kids.');
  await sql.end();
}

main().catch(async (err) => {
  console.error('\n❌ Gagal melakukan seeding program:', err);
  await sql.end();
  process.exit(1);
});
