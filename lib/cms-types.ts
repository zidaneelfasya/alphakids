export interface HeroSectionContent {
  // Real dynamic fields matching official LandingHero UI
  titleLine1: string;          // "Tempat terbaik"
  titleLine1Suffix: string;    // "untuk"
  titleHighlightCyan: string;  // "belajar"
  titleConjunction: string;    // "dan"
  titleHighlightPink: string;  // "berkarya"
  titleLine3: string;          // "anak hebat"
  subtitle: string;            // Deskripsi lengkap
  ctaText: string;             // "Mulai Petualangan"
  ctaLink: string;             // "#programs"
  heroImageLeft?: string;      // "/assets/img/hero1.png"
  heroImageRight?: string;     // "/assets/img/hero2.png"
  // Backward compatibility optional fields
  badgeText?: string;
  titlePart1?: string;
  titleHighlight?: string;
  titlePart2?: string;
  ctaPrimaryText?: string;
  ctaPrimaryLink?: string;
  ctaSecondaryText?: string;
  ctaSecondaryLink?: string;
  statsCount?: string;
  statsLabel?: string;
  ratingScore?: string;
  ratingReviewCount?: string;
  stampText?: string;
}

export interface FeaturesSectionContent {
  // Real dynamic fields matching official LandingInteractiveFeatures UI
  titlePart1: string;          // "Fitur"
  titleHighlight: string;      // "interaktif"
  titlePart2: string;          // "unggulan kami"
  card1Title: string;          // "Quiz"
  card1TitleHighlight: string; // "Interaktif"
  card1Desc: string;           // "Uji pemahaman si kecil..."
  card2Title: string;          // "Aktivitas"
  card2TitleHighlight: string; // "Kreatif"
  card2Desc: string;           // "Eksplorasi coding visual..."
  card3Title: string;          // "Belajar dengan"
  card3TitleHighlight: string; // "Game"
  card3Desc: string;           // "Metode gamifikasi modern..."
  // Backward compatibility optional fields
  badge?: string;
  title?: string;
  subtitle?: string;
  card1Tag?: string;
  card2Tag?: string;
  card3Tag?: string;
}

export interface StorySectionContent {
  badge?: string;
  // Dynamic 4-Line Story Headline
  titleLine1: string;
  titleLine2: string;
  titleHighlight: string;
  titleLine3: string;
  subtitle: string;
  // CTA Action
  ctaText: string;
  ctaLink: string;
  // Dynamic Yellow Loop Dimension
  loopSize?: 'compact' | 'normal' | 'spacious';
  loopScale?: number; // 80 - 140
  // Tiered Pill Strip Images
  tier1Image?: string;
  tier2Image?: string;
  tier3Image?: string;
  // Legacy / fallback fields
  title?: string;
  desc1?: string;
  desc2?: string;
  point1?: string;
  point2?: string;
  point3?: string;
  point4?: string;
}

export interface MentorsSectionContent {
  // Real dynamic fields matching official LandingMentorsBlock UI
  badge?: string;              // "MENTOR ALPHA KIDS"
  titlePart1: string;          // "Berprestasi di bidangnya,"
  titleHighlight: string;      // "terlatih dalam mengajar."
  titlePart2?: string;         // ""
  subtitle?: string;           // "Mentor Alpha Kids dipilih berdasarkan kompetensi akademik..."
  mentor1Name: string;         // "Kak Budi Prasetyo"
  mentor1Role: string;         // "Pembina OSN Matematika SD/SMP"
  mentor1Institution?: string; // "Institut Teknologi Bandung (ITB)"
  mentor1Achievement?: string; // "Medali Emas OSN Matematika Nasional"
  mentor1Avatar?: string;
  mentor2Name: string;         // "Kak Sarah Amelia"
  mentor2Role: string;         // "Spesialis OSN Sains & IPA Terpadu"
  mentor2Institution?: string; // "Universitas Indonesia (UI)"
  mentor2Achievement?: string; // "Peraih Medali Perak ONMIPA Fisika"
  mentor2Avatar?: string;
  mentor3Name: string;         // "Kak Nadia Utami"
  mentor3Role: string;         // "Pembina OSN IPS & Analisis Spasial"
  mentor3Institution?: string; // "Universitas Gadjah Mada (UGM)"
  mentor3Achievement?: string; // "Juara 1 Lomba Cerdas Cermat Geografi"
  mentor3Avatar?: string;
  mentor4Name: string;         // "Kak Jacob Rama"
  mentor4Role: string;         // "Spesialis Logika & Problem Solving OSN"
  mentor4Institution?: string; // "Institut Teknologi Sepuluh Nopember (ITS)"
  mentor4Achievement?: string; // "Finalis IMO Training Camp"
  mentor4Avatar?: string;
  // Backward compatibility optional fields
  title?: string;
  mentor1Tag?: string;
  mentor2Tag?: string;
  mentor3Tag?: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;          // e.g. "Siswa SMP Kelas 8"
  school: string;        // e.g. "SMPK 3 PENABUR Jakarta"
  achievement?: string;  // e.g. "Medali Emas OSN Matematika"
  avatar: string;
  quote: string;
  rating?: number;       // default 5
}

export interface TestimonialsSectionContent {
  badge: string;
  titlePart1: string;
  titleHighlight: string;
  titlePart2: string;
  subtitle: string;
  items: TestimonialItem[];
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
  title: string;
  subtitle: string;
  btnText: string;
  btnLink: string;
  btnSecondaryText?: string;
  consultationLink: string;
  ctaImage?: string;
  badge?: string;
}

export interface BlogItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  imageUrl: string;
  tag?: string;
  readTime?: string;
  publishedAt?: string;
  author?: string;
  content?: string;
}

export interface BlogSectionContent {
  badge: string;
  titlePart1: string;
  titleHighlight: string;
  subtitle: string;
  items: BlogItem[];
}

export interface ContactSectionContent {
  whatsappNumber: string;
  whatsappDefaultText: string;
  supportEmail: string;
  operatingHours: string;
}

export type CmsSectionContent =
  | HeroSectionContent
  | FeaturesSectionContent
  | StorySectionContent
  | MentorsSectionContent
  | TestimonialsSectionContent
  | BlogSectionContent
  | FaqSectionContent
  | CtaSectionContent
  | ContactSectionContent
  | Record<string, unknown>;

// -----------------------------------------------------------------------------
// Default Contents (Matching WonderKids & Alpha Kids Design Guide)
// -----------------------------------------------------------------------------

export const DEFAULT_HERO: HeroSectionContent = {
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
  // Backward compatibility fields
  titlePart1: 'Siapkan si kecil',
  titleHighlight: 'jadi juara OSN',
  titlePart2: 'sejak dini',
  ctaPrimaryText: 'Daftar Program',
  ctaPrimaryLink: '#programs',
};

export const DEFAULT_FEATURES: FeaturesSectionContent = {
  titlePart1: 'Tiga cara kami',
  titleHighlight: 'mengasah',
  titlePart2: 'juara OSN',
  card1Title: 'Belajar',
  card1TitleHighlight: 'Terarah',
  card1Desc:
    'Materi disusun bertahap dari konsep dasar hingga level seleksi OSN, jadi anak selalu tahu apa yang dipelajari dan untuk apa.',
  card2Title: 'Mentor',
  card2TitleHighlight: 'Terkurasi',
  card2Desc:
    'Setiap pembina dipilih lewat seleksi ketat berdasarkan keahlian dan pengalaman membina siswa di bidang OSN.',
  card3Title: 'Progres',
  card3TitleHighlight: 'Terukur',
  card3Desc:
    'Perkembangan anak dipantau lewat latihan dan evaluasi berkala, sehingga orang tua melihat hasilnya dengan jelas.',
};

export const DEFAULT_STORY: StorySectionContent = {
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
  // Fallbacks
  title: 'Setiap anak punya potensi juara siap diasah',
  desc1:
    'Alpha Kids mendampingi langkah demi langkah: belajar yang terarah, mentor yang terkurasi, dan perkembangan yang terukur jelas.',
  point1: 'Kurikulum Berjenjang Seleksi OSN Kota hingga Nasional',
  point2: 'Pendampingan Personal & Pemecahan Soal Tingkat Tinggi (HOTS)',
  point3: 'Bank Soal Tryout Terstandar Silabus Pusat Prestasi Nasional',
  point4: 'Evaluasi & Laporan Perkembangan Belajar Rutin ke Orang Tua',
};

export const DEFAULT_MENTORS: MentorsSectionContent = {
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
};

export const DEFAULT_FAQ: FaqSectionContent = {
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

export const DEFAULT_BLOGS: BlogSectionContent = {
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
        'Explore the joy of games to enhance your child\'s learning experience and computational thinking without feeling pressured.',
      imageUrl: '/assets/img/hero1.png',
      tag: 'Gamifikasi',
      readTime: '3 mnt baca',
      publishedAt: '8 Okt 2026',
      author: 'Tim Kurikulum Alpha Kids',
      content: `## Introduction
Artificial Intelligence (AI) and gamified learning have been rapidly evolving, transforming various aspects of our children's daily learning routines. From smart coding assistants to interactive logic puzzles, technology is opening up new frontiers in early childhood education.

When learning feels like an adventure, children naturally develop deeper engagement and persistence. Gamification isn't just about entertainment—it's a deliberate pedagogical approach to make complex concepts intuitive.

## Key Areas of Development
In modern digital education for kids, there are several focal areas that build robust computational thinking:

1. **Interactive Logic & Gamification**
   - Visual puzzle solving and algorithmic sequencing
   - Immediate positive reinforcement loops
   - Hands-on block coding challenges

2. **Natural Problem Solving**
   - Decomposing large problems into bite-sized steps
   - Creative storytelling integrated with coding
   - Debugging as an empowering trial-and-error skill

3. **Digital Collaboration & Creativity**
   - Peer exploration through interactive challenges
   - Collaborative robotics and logic quests
   - Showcasing creative projects with pride

## Ethical Considerations & Healthy Screen Time
As digital learning continues to advance, it is crucial for parents and educators to address thoughtful digital wellness:
- Choosing safe, ad-free, and mentor-guided learning environments
- Striking a healthy balance between active coding and physical play
- Fostering critical thinking so children become creators, not merely passive consumers of media

## Conclusion
The future of learning is both exciting and empowering. When we introduce digital tools through playful exploration and certified mentorship, children gain the confidence to shape technology with creativity and joy.

> "The development of creative digital intelligence empowers children to shape their own future with confidence and imagination."

Untuk informasi lebih lanjut seputar kurikulum terpadu, kunjungi katalog program Alpha Kids.`,
    },
    {
      id: '2',
      title: '10 Ide Permainan Edukatif Anak di Rumah',
      slug: '10-ide-permainan-edukatif-anak',
      excerpt:
        'Ide permainan interaktif dan aktivitas fisik kreatif yang melatih daya nalar, logika, dan imajinasi si kecil tanpa rasa bosan.',
      imageUrl: '/assets/img/cta.png',
      tag: 'Aktivitas Seru',
      readTime: '5 mnt baca',
      publishedAt: '7 Okt 2026',
      author: 'Kak Sarah Amelia',
      content: `## Pentingnya Bermain Sambil Belajar
Bermain adalah bahasa alami anak-anak dalam memahami dunia. Melalui aktivitas bermain yang terstruktur, anak dapat melatih logika, koordinasi motorik, dan konsentrasi tanpa merasa terbebani seperti belajar formal di sekolah.

Berikut adalah 10 ide permainan edukatif yang mudah dipraktikkan di rumah bersama keluarga untuk melatih nalar komputasi dan kreativitas.

## Aktivitas Logika Unplugged (Tanpa Layar)
Sebelum menyentuh komputer, konsep dasar pemrograman dapat dilatih secara fisik:

1. **Robot Manusia (Algoritma Langkah)**
   - Anak berperan sebagai "programmer" dan orang tua sebagai "robot"
   - Anak memberikan instruksi spesifik (maju 2 langkah, belok kanan 90 derajat)
   - Melatih presisi instruksi dan pemikiran sekuensial

2. **Labirin Puzzle Kertas**
   - Menggambar peta grid sederhana dengan rintangan
   - Menuliskan simbol panah untuk memandu karakter mencapai tujuan
   - Memahami konsep algoritma dasar dan optimasi rute

3. **Tebak Pola Simbolik**
   - Menggunakan kancing atau balok aneka warna untuk membentuk pola berulang
   - Melatih kemampuan *pattern recognition* yang esensial dalam matematika

## Aktivitas Berbasis Proyek Kreatif
Untuk sesi eksplorasi terarah dengan dukungan gawai:

1. **Membuat Cerita Interaktif di Scratch Jr**
   - Menggabungkan gambar karakter dengan blok animasi sederhana
   - Melatih kreativitas naratif dan logika sebab-akibat

2. **Teka-Teki Spasial & Sudoku Bergambar**
   - Mengganti angka dengan bentuk geometri berwarna
   - Meningkatkan daya ingat kerja (*working memory*) dan deduksi logis

## Tips Pendampingan Orang Tua
Kunci keberhasilan metode ini terletak pada peran orang tua sebagai fasilitator:
- Berikan ruang bagi anak untuk mencoba dan belajar dari kesalahan (*growth mindset*)
- Rayakan proses pemecahan masalah, bukan hanya hasil akhir
- Batasi durasi sesi agar anak tetap antusias dan tidak jenuh

## Kesimpulan
Aktivitas bermain yang menyenangkan adalah pintu gerbang terbaik menuju pemahaman logika yang kokoh. Ketika anak terbiasa berpikir runut sejak dini, mereka akan lebih percaya diri menghadapi tantangan akademik di masa depan.`,
    },
    {
      id: '3',
      title: 'Seni Digital & Imajinasi: Mengubah Screen Time Jadi Karya Hebat',
      slug: 'seni-digital-dan-imajinasi-anak',
      excerpt:
        'Panduan bijak mendampingi anak menyalurkan ketertarikan teknologi menjadi karya visual, animasi, dan game ciptaan mereka sendiri.',
      imageUrl: '/assets/img/hero1.png',
      tag: 'Tips Belajar',
      readTime: '4 mnt baca',
      publishedAt: '5 Okt 2026',
      author: 'Kak Budi Prasetyo',
      content: `## Dari Konsumsi Pasif Menjadi Kreasi Aktif
Generasi masa kini tumbuh berdampingan dengan gawai sejak usia dini. Tantangan terbesar orang tua bukanlah melarang teknologi secara total, melainkan mengarahkan rasa ingin tahu anak dari sekadar penonton video pasif menjadi pencipta karya digital yang inovatif.

Ada perbedaan mendasar antara konsumsi pasif dan kreasi aktif dalam penggunaan teknologi:
1. Menonton animasi orang lain vs. Menggambar karakter dan membuat animasi sendiri
2. Memainkan game pabrikan vs. Merancang aturan main dan mekanik logika game
3. Menggeser feed media sosial vs. Menyusun kode balok interaktif yang hidup

## Eksplorasi Media Digital Anak
Beberapa media yang sangat efektif untuk melatih jiwa kreasi visual anak:

1. **Pixel Art & Ilustrasi Geometris**
   - Memahami resolusi, koordinat grid (X, Y), dan harmonisasi warna
   - Membangun ketelitian dan apresiasi estetika sejak dini

2. **Animasi Stop-Motion Mini**
   - Membuat rekaman foto beruntun dari mainan lego atau lilin plastisin
   - Memahami konsep frame rate dan transisi adegan

3. **Pemodelan Visual Sederhana**
   - Menggabungkan balok kubus dan prisma untuk membangun struktur 3D
   - Melatih kecerdasan spasial dan penalaran geometri

## Membangun Kebiasaan Digital yang Sehat
Agar kegiatan kreatif tetap seimbang dan bermakna bagi tumbuh kembang anak:
- Buat kesepakatan jadwal eksplorasi digital yang konsisten
- Dampingi anak saat mencoba platform atau aplikasi kreatif baru
- Berikan apresiasi terhadap setiap proyek yang berhasil diselesaikan anak

## Kesimpulan
Teknologi adalah kanvas modern bagi imajinasi anak-anak kita. Dengan bimbingan yang tepat dan kurikulum yang ramah anak, setiap anak memiliki potensi untuk menghasilkan karya hebat yang membanggakan.`,
    },
    {
      id: '4',
      title: 'Mengenal Robotika Anak: Cara Menyenangkan Belajar Rekayasa Sejak Dini',
      slug: 'mengenal-robotika-anak-sejak-dini',
      excerpt:
        'Bagaimana perakitan kit robotika sederhana dan pemrograman sensor dapat membangun ketangguhan problem-solving serta rasa percaya diri anak.',
      imageUrl: '/assets/img/cta.png',
      tag: 'Robotika',
      readTime: '4 mnt baca',
      publishedAt: '3 Okt 2026',
      author: 'Kak Jacob Rama',
      content: `## Mengapa Robotika Menarik Bagi Anak
Robotika menggabungkan tiga pilar sains sekaligus: mekanika fisik, sirkuit elektronik dasar, dan logika pemrograman komputer. Bagi anak-anak, melihat robot rakitan mereka sendiri bergerak mengikuti perintah yang mereka susun memberikan kepuasan belajar yang tak ternilai.

Ketertarikan visual dan taktikal ini menjadi katalisator terbaik untuk memperkenalkan konsep STEAM (Science, Technology, Engineering, Art, and Math) tanpa rasa takut atau bosan.

## Keterampilan Kunci yang Dilatih Melalui Robotika
Melalui eksplorasi modul robotika, anak mengasah beragam kemampuan esensial:

1. **Pemahaman Sensor & Respon Lingkungan**
   - Mengenal sensor ultrasonik (jarak), sensor inframerah (garis), dan sensor cahaya
   - Memahami bagaimana mesin mendeteksi dan merespons kondisi di sekitarnya

2. **Ketahanan Melakukan Uji Coba (Debugging Fisik)**
   - Saat roda macet atau arah berbelok tidak tepat, anak belajar mencari penyebabnya secara analitis
   - Mengubah kesalahan menjadi proses belajar yang positif

3. **Kerja Sama Tim & Komunikasi**
   - Bekerja berpasangan untuk merakit komponen fisik dan menyusun algoritma gerak
   - Berbagi peran dan mengomunikasikan ide pemecahan masalah

## Tahapan Pengenalan Sesuai Usia
- **Usia 4-6 Tahun**: Pengenalan balok robotik berkancing tanpa layar dengan navigasi arah sederhana
- **Usia 7-10 Tahun**: Perakitan motor servo, sensor garis, dan coding blok warna-warni
- **Usia 11-15 Tahun**: Pemrograman mikrokontroler lanjutan dan simulasi misi penyelamatan cerdas

## Kesimpulan
Robotika bukan sekadar merakit mainan, melainkan sarana terbaik melatih anak berpikir seperti seorang perekayasa (engineer) yang kreatif, tangguh, dan berdaya cipta tinggi.`,
    },
    {
      id: '5',
      title: 'Panduan Parenting Digital: Menemani Anak Menghadapi Era AI',
      slug: 'panduan-parenting-digital-era-ai',
      excerpt:
        'Langkah praktis bagi ayah dan bunda untuk membimbing anak memanfaatkan kecerdasan buatan secara aman, etis, dan produktif.',
      imageUrl: '/assets/img/hero1.png',
      tag: 'Parenting Digital',
      readTime: '6 mnt baca',
      publishedAt: '1 Okt 2026',
      author: 'Kak Nadia Utami',
      content: `## Era Baru Literasi Digital untuk Keluarga
Perkembangan pesat kecerdasan buatan (Artificial Intelligence) telah mengubah cara anak-anak kita belajar, mencari informasi, dan berinteraksi. Alih-alih merasa cemas atau menjauhkan anak dari kemajuan zaman, peran terbaik orang tua adalah menjadi kompas pemandu yang bijaksana.

Literasi digital di era kecerdasan buatan menuntut pemahaman bahwa teknologi adalah alat bantu berpikir, bukan pengganti nalar manusia.

## 3 Pilar Pendampingan Orang Tua
Ada tiga pilar utama yang dapat diterapkan keluarga di rumah:

1. **Keterbukaan & Dialog Dua Arah**
   - Buat suasana di mana anak bebas bertanya tentang konten atau alat digital yang mereka temukan
   - Diskusikan bersama mengapa suatu informasi bisa keliru atau memerlukan verifikasi

2. **Etika & Kejujuran Intelektual**
   - Ajarkan anak menghargai karya orang lain dan memahami pentingnya orisinalitas
   - Tekankan bahwa alat bantu digital digunakan untuk memperluas ide, bukan menyalin jawaban secara instan

3. **Perlindungan Privasi & Keamanan Data**
   - Ajari anak untuk tidak pernah membagikan identitas diri, foto pribadi, atau alamat rumah kepada sistem tak dikenal
   - Gunakan pengaturan pengawasan ramah keluarga pada perangkat yang digunakan anak

## Menumbuhkan Berpikir Kritis
Anak-anak yang dibekali kemampuan berpikir kritis tidak akan mudah terperdaya oleh informasi palsu. Ajak anak selalu bertanya: *"Dari mana data ini berasal?"* dan *"Apakah penjelasan ini masuk akal secara logis?"*.

## Kesimpulan
Kunci pengasuhan di era digital adalah koneksi, bukan sekadar proteksi. Saat orang tua hadir sebagai rekan diskusi yang suportif, anak-anak akan tumbuh menjadi generasi digital yang cerdas, berkarakter, dan siap memimpin masa depan.`,
    },
    {
      id: '6',
      title: 'Logika Komputasi: Fondasi Berpikir Kritis Abad 21',
      slug: 'logika-komputasi-fondasi-berpikir-kritis',
      excerpt:
        'Memahami 4 pilar computational thinking dan bagaimana metode ini membantu anak memecahkan masalah sehari-hari dengan lebih sistematis.',
      imageUrl: '/assets/img/cta.png',
      tag: 'Gamifikasi',
      readTime: '5 mnt baca',
      publishedAt: '28 Sep 2026',
      author: 'Tim Kurikulum Alpha Kids',
      content: `## Apa Itu Computational Thinking?
Computational Thinking (Berpikir Komputasional) adalah metode pemecahan masalah yang merumuskan tantangan menjadi langkah-langkah terstruktur sehingga dapat diselesaikan secara efektif oleh manusia maupun bantuan komputer.

Kemampuan ini bukan hanya milik para programmer, melainkan keterampilan berpikir dasar yang sangat bermanfaat dalam matematika, sains, seni, hingga pengambilan keputusan sehari-hari.

## 4 Pilar Berpikir Komputasional
Ada 4 fondasi utama dalam metode ini:

1. **Dekomposisi (Decomposition)**
   - Memecah masalah besar dan rumit menjadi bagian-bagian kecil yang lebih mudah dikelola
   - Contoh: Merapikan kamar dengan membaginya ke tugas membereskan buku, merapikan selimut, dan menyortir mainan

2. **Pengenalan Pola (Pattern Recognition)**
   - Mengamati kesamaan, pola berulang, dan tren dari pengalaman sebelumnya
   - Membantu anak membuat prediksi cepat dan akurat

3. **Abstraksi (Abstraction)**
   - Memusatkan perhatian pada informasi yang benar-benar penting dan mengabaikan detail yang tidak relevan
   - Menghindari kebingungan akibat informasi berlebih

4. **Perancangan Algoritma (Algorithm Design)**
   - Menyusun urutan langkah instruksi yang logis dan runtut untuk mencapai hasil yang diinginkan
   - Seperti resep memasak kue atau instruksi merakit lego langkah demi langkah

## Dampak Positif pada Prestasi Anak
Anak yang terbiasa menggunakan pola pikir komputasional menunjukkan daya tahan (*grit*) yang lebih tinggi ketika menemui soal-soal sulit, serta lebih mandiri dalam mencari jalan keluar.

## Kesimpulan
Mengajarkan computational thinking sejak dini adalah investasi terbaik untuk membekali buah hati dengan keterampilan berpikir kritis yang tak lekang oleh waktu di tengah pesatnya disrupsi teknologi.`,
    },
  ],
};

export const DEFAULT_CTA: CtaSectionContent = {
  title: 'Temukan Program Belajar yang Tepat untuk Anak Anda',
  subtitle:
    'Pilih program sesuai kebutuhan, kemampuan, dan target belajar anak dengan dukungan mentor terseleksi dan pembelajaran yang terarah.',
  btnText: 'Lihat Program',
  btnLink: '#programs',
  btnSecondaryText: 'Konsultasi Gratis',
  consultationLink:
    'https://wa.me/6281234567890?text=Halo%20Alpha%20Kids,%20saya%20ingin%20konsultasi%20program%20bimbingan%20OSN%20anak',
  ctaImage: 'https://yxbjqatnmoqvanawxjyk.supabase.co/storage/v1/object/public/cms/cta.png',
};

export const DEFAULT_TESTIMONIALS: TestimonialsSectionContent = {
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
      avatar: 'https://yxbjqatnmoqvanawxjyk.supabase.co/storage/v1/object/public/cms/orang3.webp',
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
      avatar: 'https://yxbjqatnmoqvanawxjyk.supabase.co/storage/v1/object/public/cms/orang6.webp',
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
      avatar: 'https://yxbjqatnmoqvanawxjyk.supabase.co/storage/v1/object/public/cms/orang2.webp',
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
      avatar: 'https://yxbjqatnmoqvanawxjyk.supabase.co/storage/v1/object/public/cms/orang7.webp',
      quote:
        'Sebagai orang tua, kami sangat terbantu dengan laporan evaluasi perkembangan anak yang terukur berkala. Guru dan mentornya sangat komunikatif dan peduli.',
      rating: 5,
    },
  ],
};

export const DEFAULT_CONTACT: ContactSectionContent = {
  whatsappNumber: '6281234567890',
  whatsappDefaultText: 'Halo Admin Alpha Kids, saya ingin tanya seputar program belajar anak',
  supportEmail: 'halo@alphakids.id',
  operatingHours: 'Senin - Sabtu: 08.00 - 20.00 WIB',
};

export function formatWhatsAppUrl(number?: string, message?: string): string {
  const cleanNumber = (number || '6281234567890').replace(/[^0-9]/g, '');
  const text = message || 'Halo Admin Alpha Kids, saya ingin tanya seputar program belajar anak';
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
}
