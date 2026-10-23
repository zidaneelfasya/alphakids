import { createClient } from '@supabase/supabase-js';
import postgres from 'postgres';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
let connectionString = process.env.DATABASE_URL || '';

if (!supabaseUrl || !serviceRoleKey || !connectionString) {
  console.error('❌ Credentials missing in .env.local');
  process.exit(1);
}

connectionString = connectionString.replace(/:([^@:]*)@/, (m, p) => {
  const fixed = p.replace(/%(?![0-9A-Fa-f]{2})/g, '%25');
  return `:${fixed}@`;
});

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});
const sql = postgres(connectionString, { prepare: false });

const BUCKET_NAME = 'cms';

const ASSETS_TO_UPLOAD = [
  { file: 'hero1.png', mime: 'image/png' },
  { file: 'hero2.png', mime: 'image/png' },
  { file: 'hero3.png', mime: 'image/png' },
  { file: 'cta.png', mime: 'image/png' },
  { file: 'orang1.webp', mime: 'image/webp' },
  { file: 'orang2.webp', mime: 'image/webp' },
  { file: 'orang3.webp', mime: 'image/webp' },
  { file: 'orang4.webp', mime: 'image/webp' },
  { file: 'orang5.webp', mime: 'image/webp' },
  { file: 'orang6.webp', mime: 'image/webp' },
  { file: 'orang7.webp', mime: 'image/webp' },
  { file: 'orang8.webp', mime: 'image/webp' },
];

async function uploadFile(fileName, mimeType) {
  const localPath = path.resolve('public/assets/img', fileName);
  if (!fs.existsSync(localPath)) {
    console.warn(`⚠️ File tidak ditemukan: ${localPath}`);
    return null;
  }

  const buffer = fs.readFileSync(localPath);
  console.log(`📤 Mengunggah ${fileName} (${(buffer.length / 1024).toFixed(1)} KB) ke bucket '${BUCKET_NAME}'...`);

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(fileName, buffer, {
      contentType: mimeType,
      upsert: true,
    });

  if (error) {
    console.error(`❌ Gagal upload ${fileName}:`, error.message);
    throw error;
  }

  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName);
  console.log(`✅ Berhasil: ${data.publicUrl}`);
  return data.publicUrl;
}

async function main() {
  console.log('🚀 Memulai proses seeding aset dan konten CMS Alpha Kids...');

  const uploadedUrls = {};

  for (const item of ASSETS_TO_UPLOAD) {
    const url = await uploadFile(item.file, item.mime);
    if (url) {
      uploadedUrls[item.file] = url;
    }
  }

  console.log('\n📦 Seluruh berkas berhasil diunggah ke Supabase Storage.');

  // Seed / Update Database cms_sections with Official Copywriting and Storage URLs
  console.log('\n🔄 Memperbarui konten database cms_sections dengan copywriting resmi...');

  // 1. Hero Section
  const heroContent = {
    titleLine1: 'Siapkan si kecil',
    titleLine1Suffix: '',
    titleHighlightCyan: 'jadi juara',
    titleConjunction: '',
    titleHighlightPink: 'OSN',
    titleLine3: 'sejak dini',
    subtitle:
      'Program bimbingan OSN Matematika, Sains, dan IPS untuk SD & SMP, dengan materi terstruktur dan pendampingan yang personal.',
    ctaText: 'Daftar Program',
    ctaLink: '#programs',
    heroImageLeft: uploadedUrls['hero1.png'] || 'https://yxbjqatnmoqvanawxjyk.supabase.co/storage/v1/object/public/cms/hero1.png',
    heroImageRight: uploadedUrls['hero2.png'] || 'https://yxbjqatnmoqvanawxjyk.supabase.co/storage/v1/object/public/cms/hero2.png',
    titlePart1: 'Siapkan si kecil',
    titleHighlight: 'jadi juara OSN',
    titlePart2: 'sejak dini',
    ctaPrimaryText: 'Daftar Program',
    ctaPrimaryLink: '#programs',
  };
  await sql`
    INSERT INTO cms_sections (section_key, content, updated_at)
    VALUES (${'hero'}, ${heroContent}, NOW())
    ON CONFLICT (section_key) DO UPDATE
    SET content = ${heroContent}, updated_at = NOW()
  `;
  console.log('✅ Updated section: hero');

  // 2. Keunggulan / Features Section
  const featuresContent = {
    titlePart1: 'Tiga cara kami',
    titleHighlight: 'mengasah',
    titlePart2: 'juara OSN.',
    card1Title: 'Belajar',
    card1TitleHighlight: 'Terarah',
    card1Desc: 'Materi bertahap dari konsep dasar hingga level seleksi OSN.',
    card2Title: 'Mentor',
    card2TitleHighlight: 'Terkurasi',
    card2Desc: 'Pembina diseleksi berdasarkan keahlian dan pengalaman membina siswa di bidang OSN.',
    card3Title: 'Progres',
    card3TitleHighlight: 'Terukur',
    card3Desc: 'Perkembangan anak dipantau melalui latihan dan evaluasi berkala agar orang tua dapat melihat hasilnya.',
  };
  await sql`
    INSERT INTO cms_sections (section_key, content, updated_at)
    VALUES (${'features'}, ${featuresContent}, NOW())
    ON CONFLICT (section_key) DO UPDATE
    SET content = ${featuresContent}, updated_at = NOW()
  `;
  console.log('✅ Updated section: features');

  // 3. Story Section
  const storyContent = {
    badge: 'Mengapa Alpha Kids',
    titleLine1: 'Setiap anak',
    titleLine2: 'punya potensi',
    titleHighlight: 'juara',
    titleLine3: 'siap diasah',
    subtitle:
      'Alpha Kids mendampingi langkah demi langkah: belajar yang terarah, mentor yang terkurasi, dan perkembangan yang terukur jelas.',
    ctaText: 'Daftar Program',
    ctaLink: '#programs',
    loopSize: 'normal',
    loopScale: 100,
    tier1Image: uploadedUrls['hero1.png'] || 'https://yxbjqatnmoqvanawxjyk.supabase.co/storage/v1/object/public/cms/hero1.png',
    tier2Image: uploadedUrls['hero2.png'] || 'https://yxbjqatnmoqvanawxjyk.supabase.co/storage/v1/object/public/cms/hero2.png',
    tier3Image: uploadedUrls['hero3.png'] || 'https://yxbjqatnmoqvanawxjyk.supabase.co/storage/v1/object/public/cms/hero3.png',
    title: 'Setiap anak punya potensi juara siap diasah',
    desc1:
      'Alpha Kids mendampingi langkah demi langkah: belajar yang terarah, mentor yang terkurasi, dan perkembangan yang terukur jelas.',
    point1: 'Kurikulum Berjenjang Seleksi OSN Kota hingga Nasional',
    point2: 'Pendampingan Personal & Pemecahan Soal Tingkat Tinggi (HOTS)',
    point3: 'Bank Soal Tryout Terstandar Silabus Pusat Prestasi Nasional',
    point4: 'Evaluasi & Laporan Perkembangan Belajar Rutin ke Orang Tua',
  };
  await sql`
    INSERT INTO cms_sections (section_key, content, updated_at)
    VALUES (${'story'}, ${storyContent}, NOW())
    ON CONFLICT (section_key) DO UPDATE
    SET content = ${storyContent}, updated_at = NOW()
  `;
  console.log('✅ Updated section: story');

  // 4. Mentors Section
  const mentorsContent = {
    badge: 'MENTOR ALPHA KIDS',
    titlePart1: 'Berprestasi di bidangnya,',
    titleHighlight: 'terlatih dalam mengajar.',
    titlePart2: '',
    subtitle:
      'Mentor Alpha Kids dipilih berdasarkan kompetensi akademik, pengalaman, dan kemampuan pedagogik untuk membantu anak memahami materi dengan lebih efektif.',
    mentor1Name: 'Kak Budi Prasetyo',
    mentor1Role: 'Pembina OSN Matematika SD & SMP',
    mentor1Institution: 'Institut Teknologi Bandung (ITB)',
    mentor1Achievement: 'Medali Emas OSN Matematika',
    mentor1Avatar: uploadedUrls['orang1.webp'] || 'https://yxbjqatnmoqvanawxjyk.supabase.co/storage/v1/object/public/cms/orang1.webp',

    mentor2Name: 'Kak Sarah Amelia',
    mentor2Role: 'Spesialis OSN IPA & Biologi Cilik',
    mentor2Institution: 'Universitas Indonesia (UI)',
    mentor2Achievement: 'Peraih Medali Perak ONMIPA',
    mentor2Avatar: uploadedUrls['orang2.webp'] || 'https://yxbjqatnmoqvanawxjyk.supabase.co/storage/v1/object/public/cms/orang2.webp',

    mentor3Name: 'Kak Nadia Utami',
    mentor3Role: 'Pembina OSN IPS & Dinamika Sosial',
    mentor3Institution: 'Universitas Gadjah Mada (UGM)',
    mentor3Achievement: 'Juara Olimpiade Geografi Nasional',
    mentor3Avatar: uploadedUrls['orang4.webp'] || 'https://yxbjqatnmoqvanawxjyk.supabase.co/storage/v1/object/public/cms/orang4.webp',

    mentor4Name: 'Kak Jacob Rama',
    mentor4Role: 'Spesialis Penalaran Logika & HOTS',
    mentor4Institution: 'Institut Teknologi Sepuluh Nopember (ITS)',
    mentor4Achievement: 'Finalis International Math Camp',
    mentor4Avatar: uploadedUrls['orang3.webp'] || 'https://yxbjqatnmoqvanawxjyk.supabase.co/storage/v1/object/public/cms/orang3.webp',
  };
  await sql`
    INSERT INTO cms_sections (section_key, content, updated_at)
    VALUES (${'mentors'}, ${mentorsContent}, NOW())
    ON CONFLICT (section_key) DO UPDATE
    SET content = ${mentorsContent}, updated_at = NOW()
  `;
  console.log('✅ Updated section: mentors');

  // 5. Testimonials Section
  const testimonialsContent = {
    badge: 'Testimoni Siswa & Orang Tua',
    titlePart1: 'Apa kata',
    titleHighlight: 'juara kami',
    titlePart2: '?',
    subtitle:
      'Kisah nyata para siswa dan orang tua yang membuktikan metode bimbingan terarah Alpha Kids dalam meraih prestasi terbaik di kompetisi OSN.',
    items: [
      {
        id: 't-1',
        name: 'William Philip Karnadi',
        role: 'Siswa SMP Kelas 8',
        school: 'SMPK 3 PENABUR Jakarta',
        achievement: 'Medali Emas OSN Matematika',
        avatar: uploadedUrls['orang3.webp'] || 'https://yxbjqatnmoqvanawxjyk.supabase.co/storage/v1/object/public/cms/orang3.webp',
        quote:
          'Latihan soal try-out di Alpha Kids mantap banget! Kualitas soalnya menantang dan sesuai dengan silabus seleksi OSN, pembahasannya terstruktur bikin konsep sulit jadi gampang.',
        rating: 5,
      },
      {
        id: 't-2',
        name: 'Alvin Dermawan',
        role: 'Siswa SMP Kelas 9',
        school: 'SMPN 1 Probolinggo',
        achievement: 'Medali Perak OSN IPA',
        avatar: uploadedUrls['orang6.webp'] || 'https://yxbjqatnmoqvanawxjyk.supabase.co/storage/v1/object/public/cms/orang6.webp',
        quote:
          'Soal-soal yang diberikan sangat mirip dengan tipe seleksi OSN tingkat kota dan provinsi. Kakak mentor selalu siap membantu membimbing saat saya bingung menjawab soal HOTS.',
        rating: 5,
      },
      {
        id: 't-3',
        name: 'Clarissa Aurelia',
        role: 'Siswa SD Kelas 5',
        school: 'SD Mentari Grand Surya Jakarta',
        achievement: 'Juara 1 OSN Matematika Kota',
        avatar: uploadedUrls['orang2.webp'] || 'https://yxbjqatnmoqvanawxjyk.supabase.co/storage/v1/object/public/cms/orang2.webp',
        quote:
          'Dulu aku merasa matematika itu susah dan bikin pusing. Tapi setelah ikut bimbingan Alpha Kids, belajarnya jadi seru dengan trik logika cepat. Senang sekali bisa juara!',
        rating: 5,
      },
      {
        id: 't-4',
        name: 'Ibu Ratna Dewi',
        role: 'Orang Tua (Daffa - SD Kelas 6)',
        school: 'Wali Murid SD Al-Azhar',
        achievement: 'Lolos Seleksi OSN Provinsi',
        avatar: uploadedUrls['orang7.webp'] || 'https://yxbjqatnmoqvanawxjyk.supabase.co/storage/v1/object/public/cms/orang7.webp',
        quote:
          'Sebagai orang tua, kami sangat terbantu dengan laporan evaluasi perkembangan anak yang terukur berkala. Guru dan mentornya sangat komunikatif dan peduli.',
        rating: 5,
      },
    ],
  };
  await sql`
    INSERT INTO cms_sections (section_key, content, updated_at)
    VALUES (${'testimonials'}, ${testimonialsContent}, NOW())
    ON CONFLICT (section_key) DO UPDATE
    SET content = ${testimonialsContent}, updated_at = NOW()
  `;
  console.log('✅ Updated section: testimonials');

  // 6. FAQ Section
  const faqContent = {
    badge: 'TANYA JAWAB',
    title: 'Pertanyaan yang Sering Diajukan Orang Tua',
    subtitle:
      'Informasi penting tentang program, mentor, sistem belajar, dan perkembangan anak di Alpha Kids.',
    items: [
      {
        question: 'Apakah program bimbingan ini cocok untuk anak yang baru mulai belajar OSN?',
        answer:
          'Sangat cocok! Kelas kami dirancang bertahap mulai dari pendalaman konsep dasar sekolah, pemahaman logika analitis, hingga pengenalan tipe-tipe soal HOTS seleksi OSN tingkat kota.',
      },
      {
        question: 'Bagaimana jadwal bimbingan dan sistem belajarnya?',
        answer:
          'Jadwal fleksibel tersedia dalam pilihan kelas Private 1-on-1 maupun Kelas Grup interaktif melalui sesi live interaktif, lengkap dengan rekaman materi dan bank latihan soal yang dapat diakses kapan saja.',
      },
      {
        question: 'Apa saja bidang OSN yang dibina di Alpha Kids?',
        answer:
          'Kami fokus mendampingi bidang Matematika, Sains/IPA, dan IPS untuk jenjang SD (Kelas 4–6) serta SMP (Kelas 7–9) dengan kurikulum terstruktur.',
      },
      {
        question: 'Apakah anak akan mendapatkan simulasi tryout berkala?',
        answer:
          'Ya! Setiap peserta akan mengikuti simulasi tryout berkala berbasis CBT yang disesuaikan dengan standar dan durasi resmi seleksi OSN Pusat Prestasi Nasional.',
      },
      {
        question: 'Bagaimana orang tua dapat memantau perkembangan anak?',
        answer:
          'Alpha Kids menyediakan rapor progres belajar berkala dan konsultasi bersama mentor, sehingga Ayah & Bunda mengetahui kekuatan konsep dan materi yang perlu diasah lebih lanjut.',
      },
    ],
  };
  await sql`
    INSERT INTO cms_sections (section_key, content, updated_at)
    VALUES (${'faq'}, ${faqContent}, NOW())
    ON CONFLICT (section_key) DO UPDATE
    SET content = ${faqContent}, updated_at = NOW()
  `;
  console.log('✅ Updated section: faq');

  // 7. CTA Section
  const ctaContent = {
    title: 'Temukan Program Belajar yang Tepat untuk Anak Anda',
    subtitle:
      'Pilih program sesuai kebutuhan, kemampuan, dan target belajar anak dengan dukungan mentor terseleksi dan pembelajaran yang terarah.',
    btnText: 'Lihat Program',
    btnLink: '#programs',
    btnSecondaryText: 'Konsultasi Gratis',
    consultationLink:
      'https://wa.me/6281234567890?text=Halo%20Alpha%20Kids,%20saya%20ingin%20konsultasi%20program%20bimbingan%20OSN%20anak',
    ctaImage: uploadedUrls['cta.png'] || 'https://yxbjqatnmoqvanawxjyk.supabase.co/storage/v1/object/public/cms/cta.png',
  };
  await sql`
    INSERT INTO cms_sections (section_key, content, updated_at)
    VALUES (${'cta'}, ${ctaContent}, NOW())
    ON CONFLICT (section_key) DO UPDATE
    SET content = ${ctaContent}, updated_at = NOW()
  `;
  console.log('✅ Updated section: cta');

  // 8. Blogs Section
  const blogsContent = {
    badge: 'Artikel & Edukasi',
    titlePart1: 'Kumpulan artikel',
    titleHighlight: '& inspirasi',
    subtitle:
      'Temukan artikel pilihan, strategi belajar OSN, panduan orang tua, dan metode berpikir kritis untuk mencetak anak berprestasi.',
    items: [
      {
        id: '1',
        title: 'Learning with Games? Why not!',
        slug: 'learning-with-games-why-not',
        excerpt:
          'Eksplorasi metode gamifikasi dan penalaran visual yang menyenangkan untuk mengasah computational thinking dan logika analitis anak.',
        imageUrl: uploadedUrls['hero1.png'] || '/assets/img/hero1.png',
        tag: 'Gamifikasi',
        readTime: '3 mnt baca',
        publishedAt: '8 Okt 2026',
        author: 'Tim Kurikulum Alpha Kids',
      },
      {
        id: '2',
        title: '10 Ide Permainan Edukatif Anak di Rumah',
        slug: '10-ide-permainan-edukatif-anak',
        excerpt:
          'Ide permainan interaktif dan aktivitas fisik kreatif yang melatih daya nalar, logika, dan imajinasi si kecil tanpa rasa bosan.',
        imageUrl: uploadedUrls['cta.png'] || '/assets/img/cta.png',
        tag: 'Aktivitas Seru',
        readTime: '5 mnt baca',
        publishedAt: '7 Okt 2026',
        author: 'Kak Sarah Amelia',
      },
      {
        id: '3',
        title: 'Seni Digital & Imajinasi: Mengubah Screen Time Jadi Karya Hebat',
        slug: 'seni-digital-imajinasi-anak',
        excerpt:
          'Bagaimana menyalurkan minat gadget anak menjadi hobi produktif membuat ilustrasi digital, komik mini, dan karya seni yang membanggakan.',
        imageUrl: uploadedUrls['hero1.png'] || '/assets/img/hero1.png',
        tag: 'Tips Belajar',
        readTime: '4 mnt baca',
        publishedAt: '5 Okt 2026',
        author: 'Kak Nadia Utami',
      },
      {
        id: '4',
        title: 'Mengenal Robotika Anak: Cara Menyenangkan Belajar Rekayasa Sejak Dini',
        slug: 'mengenal-robotika-anak-sejak-dini',
        excerpt:
          'Bagaimana perakitan kit robotika sederhana dan pemrograman sensor dapat membangun ketangguhan problem-solving serta rasa percaya diri anak.',
        imageUrl: uploadedUrls['cta.png'] || '/assets/img/cta.png',
        tag: 'Robotika',
        readTime: '4 mnt baca',
        publishedAt: '3 Okt 2026',
        author: 'Kak Jacob Rama',
      },
      {
        id: '5',
        title: 'Panduan Parenting Digital: Menemani Anak Menghadapi Era AI',
        slug: 'panduan-parenting-digital-era-ai',
        excerpt:
          'Langkah praktis bagi ayah dan bunda untuk membimbing anak memanfaatkan kecerdasan buatan secara aman, etis, dan produktif.',
        imageUrl: uploadedUrls['hero1.png'] || '/assets/img/hero1.png',
        tag: 'Parenting Digital',
        readTime: '6 mnt baca',
        publishedAt: '1 Okt 2026',
        author: 'Kak Nadia Utami',
      },
      {
        id: '6',
        title: 'Logika Komputasi: Fondasi Berpikir Kritis Abad 21',
        slug: 'logika-komputasi-fondasi-berpikir-kritis',
        excerpt:
          'Memahami 4 pilar computational thinking dan bagaimana metode ini membantu anak memecahkan masalah sehari-hari dengan lebih sistematis.',
        imageUrl: uploadedUrls['cta.png'] || '/assets/img/cta.png',
        tag: 'Gamifikasi',
        readTime: '5 mnt baca',
        publishedAt: '28 Sep 2026',
        author: 'Tim Kurikulum Alpha Kids',
      },
    ],
  };
  await sql`
    INSERT INTO cms_sections (section_key, content, updated_at)
    VALUES (${'blogs'}, ${blogsContent}, NOW())
    ON CONFLICT (section_key) DO UPDATE
    SET content = ${blogsContent}, updated_at = NOW()
  `;
  console.log('✅ Updated section: blogs');

  await sql.end();
  console.log('\n🎉 SEMUA ASET & KONTEN CMS RESMI BERHASIL DISINKRONKAN KE SUPABASE!');
}

main().catch((err) => {
  console.error('Fatal error saat seeding CMS:', err);
  process.exit(1);
});
