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
  console.log('🚀 Memulai proses seeding aset gambar landing page ke Supabase Storage...');

  const uploadedUrls = {};

  for (const item of ASSETS_TO_UPLOAD) {
    const url = await uploadFile(item.file, item.mime);
    if (url) {
      uploadedUrls[item.file] = url;
    }
  }

  console.log('\n📦 Seluruh berkas berhasil diunggah ke Supabase Storage:');
  console.log(JSON.stringify(uploadedUrls, null, 2));

  // Update Database cms_sections with Supabase Storage URLs
  console.log('\n🔄 Memperbarui konten database cms_sections dengan URL Supabase Storage...');

  // 1. Hero Section
  const [heroRow] = await sql`SELECT content FROM cms_sections WHERE section_key = ${'hero'}`;
  const heroContent = heroRow?.content || {};
  heroContent.heroImageLeft = uploadedUrls['hero1.png'] || heroContent.heroImageLeft;
  heroContent.heroImageRight = uploadedUrls['hero2.png'] || heroContent.heroImageRight;
  await sql`
    INSERT INTO cms_sections (section_key, content, updated_at)
    VALUES (${'hero'}, ${heroContent}, NOW())
    ON CONFLICT (section_key) DO UPDATE
    SET content = ${heroContent}, updated_at = NOW()
  `;
  console.log('✅ Updated section: hero');

  // 2. Story Section
  const [storyRow] = await sql`SELECT content FROM cms_sections WHERE section_key = ${'story'}`;
  const storyContent = storyRow?.content || {};
  storyContent.tier1Image = uploadedUrls['hero1.png'] || storyContent.tier1Image;
  storyContent.tier2Image = uploadedUrls['hero2.png'] || storyContent.tier2Image;
  storyContent.tier3Image = uploadedUrls['hero3.png'] || storyContent.tier3Image;
  await sql`
    INSERT INTO cms_sections (section_key, content, updated_at)
    VALUES (${'story'}, ${storyContent}, NOW())
    ON CONFLICT (section_key) DO UPDATE
    SET content = ${storyContent}, updated_at = NOW()
  `;
  console.log('✅ Updated section: story');

  // 3. Mentors Section
  const [mentorsRow] = await sql`SELECT content FROM cms_sections WHERE section_key = ${'mentors'}`;
  const mentorsContent = mentorsRow?.content || {};
  mentorsContent.mentor1Avatar = uploadedUrls['orang1.webp'] || mentorsContent.mentor1Avatar;
  mentorsContent.mentor2Avatar = uploadedUrls['orang2.webp'] || mentorsContent.mentor2Avatar;
  mentorsContent.mentor3Avatar = uploadedUrls['orang3.webp'] || mentorsContent.mentor3Avatar;
  mentorsContent.mentor4Avatar = uploadedUrls['orang4.webp'] || mentorsContent.mentor4Avatar;
  await sql`
    INSERT INTO cms_sections (section_key, content, updated_at)
    VALUES (${'mentors'}, ${mentorsContent}, NOW())
    ON CONFLICT (section_key) DO UPDATE
    SET content = ${mentorsContent}, updated_at = NOW()
  `;
  console.log('✅ Updated section: mentors');

  // 4. CTA Section
  const [ctaRow] = await sql`SELECT content FROM cms_sections WHERE section_key = ${'cta'}`;
  const ctaContent = ctaRow?.content || {};
  ctaContent.ctaImage = uploadedUrls['cta.png'] || ctaContent.ctaImage;
  await sql`
    INSERT INTO cms_sections (section_key, content, updated_at)
    VALUES (${'cta'}, ${ctaContent}, NOW())
    ON CONFLICT (section_key) DO UPDATE
    SET content = ${ctaContent}, updated_at = NOW()
  `;
  console.log('✅ Updated section: cta');

  // 5. Blogs Section
  const [blogsRow] = await sql`SELECT content FROM cms_sections WHERE section_key = ${'blogs'}`;
  if (blogsRow?.content?.items) {
    const blogsContent = blogsRow.content;
    blogsContent.items = blogsContent.items.map((b, idx) => {
      // Alternate between hero1 and cta if local path
      const chosen = idx % 2 === 0 ? uploadedUrls['hero1.png'] : uploadedUrls['cta.png'];
      return {
        ...b,
        imageUrl: chosen || b.imageUrl,
      };
    });
    await sql`
      INSERT INTO cms_sections (section_key, content, updated_at)
      VALUES (${'blogs'}, ${blogsContent}, NOW())
      ON CONFLICT (section_key) DO UPDATE
      SET content = ${blogsContent}, updated_at = NOW()
    `;
    console.log('✅ Updated section: blogs');
  }

  await sql.end();
  console.log('\n🎉 SEMUA ASET BERHASIL DI-UPLOAD & DISINKRONKAN KE SUPABASE STORAGE!');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
