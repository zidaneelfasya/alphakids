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
  | BlogSectionContent
  | FaqSectionContent
  | CtaSectionContent
  | ContactSectionContent
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
  titleLine1: 'Materi belajar yang',
  titleLine2: 'disediakan',
  titleHighlight: 'menyenangkan',
  titleLine3: 'untuk anak',
  subtitle:
    'Jangan khawatir! Buah hati Anda akan menikmati setiap sesi pembelajaran dengan materi interaktif yang mudah dipahami, aplikatif, dan menyenangkan.',
  ctaText: 'Pelajari Lebih Lanjut',
  ctaLink: '#programs',
  loopSize: 'normal',
  loopScale: 100,
  tier1Image: '/assets/img/hero1.png',
  tier2Image: '/assets/img/hero2.png',
  tier3Image: '/assets/img/hero3.png',
  // Fallbacks
  title: 'Materi belajar yang disediakan menyenangkan untuk anak',
  desc1:
    'Jangan khawatir! Buah hati Anda akan menikmati setiap sesi pembelajaran dengan materi interaktif yang mudah dipahami, aplikatif, dan menyenangkan.',
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
  badge: 'SIAP MELANGKAH?',
  title: 'Mulai Petualangan Belajar Digital Buah Hati Anda!',
  subtitle:
    'Konsultasikan bidang dan program belajar yang paling sesuai dengan kebutuhan si kecil bersama tim Alpha Kids.',
  btnText: 'Daftar Sekarang',
  btnLink: '#programs',
  consultationLink:
    'https://wa.me/6281234567890?text=Halo%20Alpha%20Kids,%20saya%20ingin%20konsultasi%20program%20belajar%20anak',
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
