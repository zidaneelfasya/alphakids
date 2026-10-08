import postgres from 'postgres';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

let connectionString = process.env.DATABASE_URL || '';

if (!connectionString) {
  console.error('❌ Error: DATABASE_URL tidak ditemukan di .env.local');
  process.exit(1);
}

// Ensure literal % in password is validly percent-encoded
connectionString = connectionString.replace(/:([^@:]*)@/, (m, p) => {
  const fixed = p.replace(/%(?![0-9A-Fa-f]{2})/g, '%25');
  return `:${fixed}@`;
});

const sql = postgres(connectionString, { prepare: false });

const blogsData = {
  badge: 'Artikel & Edukasi Digital',
  titlePart1: 'Read our',
  titleHighlight: 'blog',
  subtitle:
    'Temukan inspirasi artikel, panduan metode bermain sambil belajar, tips parenting era digital, dan aktivitas seru untuk tumbuh kembang buah hati Anda.',
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

async function seedBlogs() {
  console.log('🌱 Menjalankan seeding data blog ke cms_sections...');

  // Upsert into cms_sections
  const result = await sql`
    INSERT INTO cms_sections (section_key, content, updated_at)
    VALUES ('blogs', ${sql.json(blogsData)}, NOW())
    ON CONFLICT (section_key)
    DO UPDATE SET
      content = EXCLUDED.content,
      updated_at = NOW()
    RETURNING id, section_key, updated_at;
  `;

  console.log('✅ Berhasil menyimpan section blogs ke database:', result[0]);
  console.log(`📚 Total artikel yang di-seed: ${blogsData.items.length}`);
  blogsData.items.forEach((item, idx) => {
    console.log(`   ${idx + 1}. [${item.tag}] ${item.title} -> Image: ${item.imageUrl}`);
  });

  await sql.end();
}

seedBlogs().catch((err) => {
  console.error('❌ Terjadi kesalahan saat seeding blogs:', err);
  process.exit(1);
});
