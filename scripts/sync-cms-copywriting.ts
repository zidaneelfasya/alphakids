import { db, cmsSections } from '../lib/db';
import { eq } from 'drizzle-orm';
import {
  DEFAULT_HERO,
  DEFAULT_FEATURES,
  DEFAULT_STORY,
  DEFAULT_MENTORS,
  DEFAULT_TESTIMONIALS,
  DEFAULT_FAQ,
  DEFAULT_CTA,
  DEFAULT_BLOGS,
} from '../lib/cms-types';

async function syncCmsData() {
  console.log('Syncing CMS database sections with updated copywriting...');

  const sections = [
    {
      key: 'hero',
      content: {
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
        heroImageLeft: 'https://yxbjqatnmoqvanawxjyk.supabase.co/storage/v1/object/public/cms/hero1.png',
        heroImageRight: 'https://yxbjqatnmoqvanawxjyk.supabase.co/storage/v1/object/public/cms/hero2.png',
        titlePart1: 'Siapkan si kecil',
        titleHighlight: 'jadi juara OSN',
        titlePart2: 'sejak dini',
        ctaPrimaryText: 'Daftar Program',
        ctaPrimaryLink: '#programs',
      },
    },
    {
      key: 'features',
      content: {
        titlePart1: 'Tiga cara kami',
        titleHighlight: 'mengasah',
        titlePart2: 'juara OSN.',
        card1Title: 'Belajar',
        card1TitleHighlight: 'Terarah',
        card1Desc:
          'Materi bertahap dari konsep dasar hingga level seleksi OSN.',
        card2Title: 'Mentor',
        card2TitleHighlight: 'Terkurasi',
        card2Desc:
          'Pembina diseleksi berdasarkan keahlian dan pengalaman membina siswa di bidang OSN.',
        card3Title: 'Progres',
        card3TitleHighlight: 'Terukur',
        card3Desc:
          'Perkembangan anak dipantau melalui latihan dan evaluasi berkala agar orang tua dapat melihat hasilnya.',
      },
    },
    {
      key: 'story',
      content: {
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
        tier1Image: 'https://yxbjqatnmoqvanawxjyk.supabase.co/storage/v1/object/public/cms/hero1.png',
        tier2Image: 'https://yxbjqatnmoqvanawxjyk.supabase.co/storage/v1/object/public/cms/hero2.png',
        tier3Image: 'https://yxbjqatnmoqvanawxjyk.supabase.co/storage/v1/object/public/cms/hero3.png',
        title: 'Setiap anak punya potensi juara siap diasah',
        desc1:
          'Alpha Kids mendampingi langkah demi langkah: belajar yang terarah, mentor yang terkurasi, dan perkembangan yang terukur jelas.',
        point1: 'Kurikulum Berjenjang Seleksi OSN Kota hingga Nasional',
        point2: 'Pendampingan Personal & Pemecahan Soal Tingkat Tinggi (HOTS)',
        point3: 'Bank Soal Tryout Terstandar Silabus Pusat Prestasi Nasional',
        point4: 'Evaluasi & Laporan Perkembangan Belajar Rutin ke Orang Tua',
      },
    },
    {
      key: 'mentors',
      content: {
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
        mentor1Avatar: 'https://yxbjqatnmoqvanawxjyk.supabase.co/storage/v1/object/public/cms/orang1.webp',
        mentor2Name: 'Kak Sarah Amelia',
        mentor2Role: 'Spesialis OSN IPA & Biologi Cilik',
        mentor2Institution: 'Universitas Indonesia (UI)',
        mentor2Achievement: 'Peraih Medali Perak ONMIPA',
        mentor2Avatar: 'https://yxbjqatnmoqvanawxjyk.supabase.co/storage/v1/object/public/cms/orang2.webp',
        mentor3Name: 'Kak Nadia Utami',
        mentor3Role: 'Pembina OSN IPS & Dinamika Sosial',
        mentor3Institution: 'Universitas Gadjah Mada (UGM)',
        mentor3Achievement: 'Juara Olimpiade Geografi Nasional',
        mentor3Avatar: 'https://yxbjqatnmoqvanawxjyk.supabase.co/storage/v1/object/public/cms/orang4.webp',
        mentor4Name: 'Kak Jacob Rama',
        mentor4Role: 'Spesialis Penalaran Logika & HOTS',
        mentor4Institution: 'Institut Teknologi Sepuluh Nopember (ITS)',
        mentor4Achievement: 'Finalis International Math Camp',
        mentor4Avatar: 'https://yxbjqatnmoqvanawxjyk.supabase.co/storage/v1/object/public/cms/orang3.webp',
      },
    },
    {
      key: 'faq',
      content: {
        badge: 'TANYA JAWAB',
        title: 'Pertanyaan yang Sering Diajukan Orang Tua',
        subtitle:
          'Informasi penting tentang program, mentor, sistem belajar, dan perkembangan anak di Alpha Kids.',
        items: DEFAULT_FAQ.items,
      },
    },
    {
      key: 'cta',
      content: {
        title: 'Temukan Program Belajar yang Tepat untuk Anak Anda',
        subtitle:
          'Pilih program sesuai kebutuhan, kemampuan, dan target belajar anak dengan dukungan mentor terseleksi dan pembelajaran yang terarah.',
        btnText: 'Lihat Program',
        btnLink: '#programs',
        btnSecondaryText: 'Konsultasi Gratis',
        consultationLink:
          'https://wa.me/6281234567890?text=Halo%20Alpha%20Kids,%20saya%20ingin%20konsultasi%20program%20bimbingan%20OSN%20anak',
        ctaImage: 'https://yxbjqatnmoqvanawxjyk.supabase.co/storage/v1/object/public/cms/cta.png',
      },
    },
    {
      key: 'blogs',
      content: {
        badge: 'Artikel & Edukasi',
        titlePart1: 'Kumpulan artikel',
        titleHighlight: '& inspirasi',
        subtitle:
          'Temukan artikel pilihan, strategi belajar OSN, panduan orang tua, dan metode berpikir kritis untuk mencetak anak berprestasi.',
        items: DEFAULT_BLOGS.items,
      },
    },
    {
      key: 'testimonials',
      content: DEFAULT_TESTIMONIALS,
    },
  ];

  for (const item of sections) {
    const existing = await db
      .select()
      .from(cmsSections)
      .where(eq(cmsSections.sectionKey, item.key))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(cmsSections)
        .set({ content: item.content, updatedAt: new Date() })
        .where(eq(cmsSections.sectionKey, item.key));
      console.log(`Updated section: ${item.key}`);
    } else {
      await db.insert(cmsSections).values({
        sectionKey: item.key,
        content: item.content,
        updatedAt: new Date(),
      });
      console.log(`Inserted section: ${item.key}`);
    }
  }

  console.log('All CMS sections successfully synced with the database!');
}

syncCmsData()
  .catch((err) => {
    console.error('Error syncing CMS data:', err);
    process.exit(1);
  })
  .finally(() => process.exit(0));
