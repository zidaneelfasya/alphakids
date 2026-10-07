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
  console.log('🚀 Memulai proses seeding data realistis Alpha Kids...');

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
    // Pastikan public = true
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

  // 3. Seed Kategori (public.categories)
  console.log('\n📂 Melakukan seeding tabel categories...');
  const categoriesData = [
    {
      name: 'Coding & Game Dev',
      slug: 'coding-game-dev',
      description: 'Eksplorasi logika pemrograman visual, algoritma anak, dan kreasi game 2D mandiri.',
    },
    {
      name: 'Sains & Robotika',
      slug: 'sains-robotika',
      description: 'Praktik sensor pintar, sirkuit aman, dan perakitan robot mini interaktif berbasis proyek.',
    },
    {
      name: 'Seni & Animasi Digital',
      slug: 'seni-animasi-digital',
      description: 'Kembangkan imajinasi visual, desain karakter orisinal, dan animasi gerak kreatif.',
    },
    {
      name: 'Olimpiade & Logika Matematika',
      slug: 'olimpiade-matematika',
      description: 'Pelatihan nalar kritis, problem solving olimpiade, dan strategi matematika kompetitif.',
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
  console.log('\n🎓 Melakukan seeding tabel programs...');
  const programsData = [
    {
      categorySlug: 'coding-game-dev',
      title: 'Petualangan Coding & Pembuat Game 2D',
      slug: 'petualangan-coding-game-2d',
      description: 'Belajar fondasi computational thinking, logika blok visual, dan bangun game petualangan 2D interaktif karya sendiri dari nol.',
      price: 299000,
      coverImage: hero1Url,
      ageRange: 'Usia 7–12 Thn',
      level: 'Pemula',
      contents: [
        {
          title: 'Silabus Modul: Logika Blok & Gerak Karakter',
          contentType: 'lesson',
          content: 'Minggu 1-2: Pengenalan Sprite, koordinat X-Y, loop pergerakan, dan mekanisme kontrol tombol keyboard.',
          sortOrder: 1,
        },
        {
          title: 'Proyek Akhir: Game Labirin Pemburu Koin 2D',
          contentType: 'lesson',
          content: 'Membangun game interaktif lengkap dengan sistem nyawa, timer hitung mundur, dan skor kemenangan.',
          sortOrder: 2,
        },
        {
          title: 'Fasilitas Program & Bimbingan',
          contentType: 'text',
          content: 'Sesi live Zoom 8x pertemuan bersama Kakak Mentor, akses video tutorial selamanya, dan e-sertifikat kelulusan.',
          sortOrder: 3,
        },
      ],
    },
    {
      categorySlug: 'sains-robotika',
      title: 'Sains Cilik: Robotika Pintar & Sensor Eksplorasi',
      slug: 'sains-robotika-pintar',
      description: 'Eksperimen seru merakit sirkuit cerdas, membaca input sensor gerak dan cahaya, serta menghidupkan robot mini edukatif.',
      price: 349000,
      coverImage: ctaUrl,
      ageRange: 'Usia 8–14 Thn',
      level: 'Menengah',
      contents: [
        {
          title: 'Silabus Modul: Komponen Sirkuit Aman & Sensor',
          contentType: 'lesson',
          content: 'Mengenal resistor, LED, saklar otomatis, dan prinsip konduktivitas listrik melalui eksperimen yang aman bagi anak.',
          sortOrder: 1,
        },
        {
          title: 'Proyek Akhir: Robot Mini Pendeteksi Rintangan',
          contentType: 'lesson',
          content: 'Merakit robot beroda dengan sensor ultrasonik yang mampu bermanuver menghindari halangan secara mandiri.',
          sortOrder: 2,
        },
        {
          title: 'Fasilitas & Pendampingan',
          contentType: 'text',
          content: 'Bimbingan intensif grup kecil, panduan eksperimen visual bergambar, dan sertifikat prestasi inovator cilik.',
          sortOrder: 3,
        },
      ],
    },
    {
      categorySlug: 'seni-animasi-digital',
      title: 'Studio Seni Digital & Ilustrasi Karakter Anak',
      slug: 'seni-digital-ilustrasi-karakter',
      description: 'Asah kreativitas menggambar digital, belajar komposisi warna harmonis, dan ciptakan figur karakter kartun favorit si kecil.',
      price: 249000,
      coverImage: hero1Url,
      ageRange: 'Usia 6–11 Thn',
      level: 'Pemula',
      contents: [
        {
          title: 'Silabus Modul: Anatomi Kartun & Palet Warna',
          contentType: 'lesson',
          content: 'Teknik dasar sketsa garis digital, ekspresi wajah kartun, dan pencampuran gradasi warna yang ceria.',
          sortOrder: 1,
        },
        {
          title: 'Proyek Akhir: Komik Pendek 4 Panel Karya Sendiri',
          contentType: 'lesson',
          content: 'Menciptakan alur cerita mini, menyusun panel komik, dan mengekspor karya siap cetak atau dibagikan ke keluarga.',
          sortOrder: 2,
        },
        {
          title: 'Fasilitas & Karya Galeri',
          contentType: 'text',
          content: 'Portofolio digital tersimpan rapi, ulasan karya personal dari ilustrator profesional, dan sertifikat kelulusan seni.',
          sortOrder: 3,
        },
      ],
    },
    {
      categorySlug: 'olimpiade-matematika',
      title: 'Master OSN Matematika Cilik & Nalar Komputasi',
      slug: 'osn-matematika',
      description: 'Bimbingan intensif pemecahan soal olimpiade sains nasional, trik berhitung cepat, dan penguatan konsep matematika analitis.',
      price: 399000,
      coverImage: ctaUrl,
      ageRange: 'Usia 9–15 Thn',
      level: 'Mahir',
      contents: [
        {
          title: 'Silabus Modul: Pola Bilangan, Aljabar Visual & Kombinatorika',
          contentType: 'lesson',
          content: 'Strategi bedah tipe soal HOTS (Higher Order Thinking Skills) tingkat OSN kota dan provinsi.',
          sortOrder: 1,
        },
        {
          title: 'Simulasi Tryout & Bedah Soal Realistis',
          contentType: 'lesson',
          content: 'Latihan simulasi ujian berkala dengan sistem scoring instan dan pembahasan taktis per butir soal.',
          sortOrder: 2,
        },
        {
          title: 'Fasilitas & Pendampingan Juara',
          contentType: 'text',
          content: 'Bank soal 500+ latihan eksklusif, mentoring bersama peraih medali OSN, dan sertifikat kompetensi analitis.',
          sortOrder: 3,
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

    console.log(`  ✓ Program '${savedProg.title}' (${savedProg.slug})`);

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
      code: 'ALPHABARU',
      discountType: 'percentage',
      discountValue: 20,
    },
    {
      code: 'HEMAT50K',
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

  console.log('\n✨ SEEDING BERHASIL! Seluruh data program dan gambar Supabase Storage sudah tersinkronisasi sempurna.');
  await sql.end();
}

main().catch(async (err) => {
  console.error('\n❌ Gagal melakukan seeding:', err);
  await sql.end();
  process.exit(1);
});
