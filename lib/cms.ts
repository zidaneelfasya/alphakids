import { db, cmsSections } from '@/lib/db';
import { eq } from 'drizzle-orm';

export interface HeroSectionContent {
  badgeText: string;
  titlePart1: string;
  titleHighlight: string;
  titlePart2: string;
  subtitle: string;
  ctaPrimaryText: string;
  ctaPrimaryLink: string;
  ctaSecondaryText: string;
  ctaSecondaryLink: string;
  statsCount: string;
  statsLabel: string;
  ratingScore: string;
  ratingReviewCount: string;
  stampText: string;
}

export interface FeaturesSectionContent {
  badge: string;
  title: string;
  subtitle: string;
  card1Title: string;
  card1Desc: string;
  card1Tag: string;
  card2Title: string;
  card2Desc: string;
  card2Tag: string;
  card3Title: string;
  card3Desc: string;
  card3Tag: string;
}

export interface StorySectionContent {
  badge: string;
  title: string;
  titleHighlight: string;
  desc1: string;
  desc2: string;
  point1: string;
  point2: string;
  point3: string;
  point4: string;
}

export interface MentorsSectionContent {
  badge: string;
  title: string;
  subtitle: string;
  mentor1Name: string;
  mentor1Role: string;
  mentor1Tag: string;
  mentor2Name: string;
  mentor2Role: string;
  mentor2Tag: string;
  mentor3Name: string;
  mentor3Role: string;
  mentor3Tag: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqSectionContent {
  badge: string;
  title: string;
  subtitle: string;
  items: FaqItem[];
}

export interface CtaSectionContent {
  badge: string;
  title: string;
  subtitle: string;
  btnText: string;
  btnLink: string;
  consultationLink: string;
}

export interface BlogItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  imageUrl: string;
  tag?: string;
  readTime?: string;
}

export interface BlogSectionContent {
  badge: string;
  titlePart1: string;
  titleHighlight: string;
  subtitle: string;
  items: BlogItem[];
}

export type CmsSectionContent =
  | HeroSectionContent
  | FeaturesSectionContent
  | StorySectionContent
  | MentorsSectionContent
  | BlogSectionContent
  | FaqSectionContent
  | CtaSectionContent
  | Record<string, unknown>;

// -----------------------------------------------------------------------------
// Default Contents (Matching WonderKids & Alpha Kids Design Guide)
// -----------------------------------------------------------------------------

export const DEFAULT_HERO: HeroSectionContent = {
  badgeText: '⭐ Platform Belajar Digital Anak #1 Indonesia',
  titlePart1: 'Petualangan Seru',
  titleHighlight: 'Belajar & Berkarya',
  titlePart2: 'Masa Depan Hebat!',
  subtitle:
    'Eksplorasi coding, robotika, logika, dan kreativitas digital anak usia 4-15 tahun melalui metode gamifikasi seru dan mentor bersertifikat internasional.',
  ctaPrimaryText: 'Lihat Program Pilihan',
  ctaPrimaryLink: '#programs',
  ctaSecondaryText: 'Konsultasi Gratis via WA',
  ctaSecondaryLink: 'https://wa.me/6281234567890?text=Halo%20Alpha%20Kids,%20saya%20ingin%20tanya%20program%20belajar%20anak',
  statsCount: '12.500+',
  statsLabel: 'Anak Hebat Aktif Belajar',
  ratingScore: '4.9/5.0',
  ratingReviewCount: '2.400+ Ulasan Orang Tua',
  stampText: 'ALPHA KIDS • LEARNING & DISCOVERY • ',
};

export const DEFAULT_FEATURES: FeaturesSectionContent = {
  badge: 'Fitur Unggulan',
  title: 'Kenapa Anak Suka & Betah Belajar di Alpha Kids?',
  subtitle:
    'Kurikulum inovatif menggabungkan tantangan gamifikasi, interaktivitas tinggi, dan apresiasi karya di setiap langkah.',
  card1Title: 'Quiz & Misi Harian Berhadiah',
  card1Desc:
    'Tantangan seru seperti bermain game. Setiap soal terpecahkan menghadiahkan koin petualang dan lencana prestasi.',
  card1Tag: '#MisiSeru',
  card2Title: 'Coding & Kreativitas Nyata',
  card2Desc:
    'Anak tidak cuma main game, tapi diajak merancang game sendiri, membuat animasi, dan menyusun robotika cerdas.',
  card2Tag: '#KreatorMuda',
  card3Title: 'Sertifikat & Portofolio Asli',
  card3Desc:
    'Setiap program ditutup dengan sertifikat digital resmi bernomor unik dan portofolio karya nyata yang membanggakan.',
  card3Tag: '#JuaraAlpha',
};

export const DEFAULT_STORY: StorySectionContent = {
  badge: 'Mengapa Alpha Kids',
  title: 'Mempersiapkan Generasi Emas dengan Keahlian',
  titleHighlight: 'Abad ke-21',
  desc1:
    'Di era digital, anak bukan hanya perlu tahu cara menggunakan teknologi, melainkan bagaimana memahami cara kerjanya dan menciptakan solusi nyata.',
  desc2:
    'Alpha Kids dirancang khusus oleh praktisi pendidikan dan teknologi anak untuk menumbuhkan rasa percaya diri, daya nalar kritis, serta kolaborasi.',
  point1: 'Kurikulum Berjenjang dari Dasar hingga Mahir',
  point2: 'Lingkungan Belajar Aman, Positif, & Edukatif',
  point3: 'Akses Materi Selamanya (Lifetime Access) Tanpa Batas',
  point4: 'Sertifikat Terverifikasi dengan Barcode Resmi',
};

export const DEFAULT_MENTORS: MentorsSectionContent = {
  badge: 'Mentor Berdedikasi',
  title: 'Didampingi Kakak Mentor Ramah & Berpengalaman',
  subtitle:
    'Semua instruktur melalui seleksi ketat dengan pendekatan ramah anak yang membuat suasana belajar selalu hangat dan menyenangkan.',
  mentor1Name: 'Kak Budi Prasetyo',
  mentor1Role: 'Eksplorasi Sains & Robotika Cerdas',
  mentor1Tag: 'STEM Specialist • Robotics Enthusiast',
  mentor2Name: 'Kak Sarah Amelia',
  mentor2Role: 'Spesialis Coding & Game Dev Anak',
  mentor2Tag: 'Lead Instructor • Scratch & Python',
  mentor3Name: 'Kak Nadia Utami',
  mentor3Role: 'Seni Digital & Animasi Karakter',
  mentor3Tag: 'Creative Mentor • 2D Animation',
};

export const DEFAULT_FAQ: FaqSectionContent = {
  badge: 'Tanya Jawab',
  title: 'Pertanyaan yang Sering Diajukan Orang Tua',
  subtitle:
    'Segala hal yang perlu Ayah & Bunda ketahui tentang metode, jadwal, dan manfaat belajar di Alpha Kids.',
  items: [
    {
      question: 'Apakah program ini cocok untuk anak yang belum pernah belajar coding?',
      answer:
        'Sangat cocok! Kelas pengantar dirancang khusus tanpa prasyarat koding rumit. Kami menggunakan visual block programming (seperti Scratch) yang intuitif dan mudah dipahami anak usia dini.',
    },
    {
      question: 'Bagaimana jadwal belajar dan sistem akses materinya?',
      answer:
        'Sangat fleksibel! Materi video dan modul interaktif bisa diakses 24/7 kapan saja sesuai ritme anak. Terdapat juga jadwal sesi live konsultasi berkala dengan kakak mentor.',
    },
    {
      question: 'Perangkat apa saja yang dibutuhkan untuk mengikuti kelas?',
      answer:
        'Cukup laptop/komputer (Windows/Mac) atau tablet dengan koneksi internet yang stabil dan browser Google Chrome/Edge terkini.',
    },
    {
      question: 'Apakah anak akan mendapatkan sertifikat setelah selesai?',
      answer:
        'Ya! Setiap peserta yang menuntaskan modul dan tugas akhir akan diterbitkan Sertifikat Kelulusan Resmi Digital ber-ID unik yang bisa diverifikasi secara online.',
    },
    {
      question: 'Bagaimana jika anak mengalami kesulitan saat belajar?',
      answer:
        'Tim mentor dan forum diskusi komunitas belajar selalu siap sedia membantu menjawab pertanyaan anak dan orang tua dengan ramah dan suportif.',
    },
  ],
};

export const DEFAULT_BLOGS: BlogSectionContent = {
  badge: 'Artikel & Edukasi',
  titlePart1: 'Read our',
  titleHighlight: 'blog',
  subtitle:
    'Temukan inspirasi artikel, panduan metode bermain sambil belajar, dan aktivitas digital seru untuk tumbuh kembang buah hati Anda.',
  items: [
    {
      id: '1',
      title: 'Learning with Games? Why not!',
      slug: 'learning-with-games-why-not',
      excerpt:
        'Explore the joy of games to enhance your child\'s learning experience and computational thinking without feeling pressured.',
      imageUrl: '/assets/img/kid-tablet.png',
      tag: 'Gamifikasi',
      readTime: '3 mnt baca',
    },
    {
      id: '2',
      title: '10 Learning Game Ideas',
      slug: '10-learning-game-ideas',
      excerpt:
        '10 ideas for interactive games and creative hands-on activities your kids will love having fun with at home.',
      imageUrl: '/assets/img/kid-teddy.png',
      tag: 'Aktivitas Seru',
      readTime: '5 mnt baca',
    },
    {
      id: '3',
      title: 'Fun Activities for Kids',
      slug: 'fun-activities-for-kids',
      excerpt:
        'Here are some fun and creative digital activities for your kid to transform curiosity into real creative projects.',
      imageUrl: '/assets/img/kid-thumbsup.png',
      tag: 'Tips Kreatif',
      readTime: '4 mnt baca',
    },
  ],
};

export const DEFAULT_CTA: CtaSectionContent = {
  badge: 'SIAP MELANGKAH?',
  title: 'Mulai Petualangan Belajar Digital Buah Hati Anda!',
  subtitle:
    'Konsultasikan bidang dan program belajar yang paling sesuai dengan kebutuhan si kecil bersama tim Alpha Kids.',
  btnText: 'Daftar Sekarang',
  btnLink: '#programs',
  consultationLink:
    'https://wa.me/6281234567890?text=Halo%20Alpha%20Kids,%20saya%20ingin%20konsultasi%20program%20belajar%20anak',
};

// -----------------------------------------------------------------------------
// Data Fetcher
// -----------------------------------------------------------------------------

export async function getCmsSection<T>(sectionKey: string, fallback: T): Promise<T> {
  try {
    const rows = await db
      .select()
      .from(cmsSections)
      .where(eq(cmsSections.sectionKey, sectionKey))
      .limit(1);

    if (rows.length > 0 && rows[0].content) {
      return { ...fallback, ...(rows[0].content as object) } as T;
    }
    return fallback;
  } catch (error) {
    console.error(`[getCmsSection] Error fetching section ${sectionKey}:`, error);
    return fallback;
  }
}

export async function getAllCmsData() {
  const [hero, features, story, mentors, blogs, faq, cta] = await Promise.all([
    getCmsSection<HeroSectionContent>('hero', DEFAULT_HERO),
    getCmsSection<FeaturesSectionContent>('features', DEFAULT_FEATURES),
    getCmsSection<StorySectionContent>('story', DEFAULT_STORY),
    getCmsSection<MentorsSectionContent>('mentors', DEFAULT_MENTORS),
    getCmsSection<BlogSectionContent>('blogs', DEFAULT_BLOGS),
    getCmsSection<FaqSectionContent>('faq', DEFAULT_FAQ),
    getCmsSection<CtaSectionContent>('cta', DEFAULT_CTA),
  ]);

  return { hero, features, story, mentors, blogs, faq, cta };
}
