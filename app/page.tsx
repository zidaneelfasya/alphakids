import { createClient } from '@/lib/supabase/server';
import { db, programs, categories } from '@/lib/db';
import { eq, desc } from 'drizzle-orm';
import { getAllCmsData } from '@/lib/cms';
import { LandingNavbar } from '@/components/landing/landing-navbar';
import { LandingHero } from '@/components/landing/landing-hero';
import { LandingInteractiveFeatures } from '@/components/landing/landing-interactive-features';
import { LandingProgramShowcase } from '@/components/landing/landing-program-showcase';
import { LandingStorySection } from '@/components/landing/landing-story-section';
import { LandingBlogSection } from '@/components/landing/landing-blog-section';
import { LandingMentorsBlock } from '@/components/landing/landing-mentors-block';
import { LandingFaq } from '@/components/landing/landing-faq';
import { LandingFinalCta } from '@/components/landing/landing-final-cta';
import { LandingFooter } from '@/components/landing/landing-footer';

export const metadata = {
  title: 'Alpha Kids — Platform Program Belajar Digital & Eksplorasi Kreatif Anak',
  description:
    'Eksplorasi coding, robotika, logika, dan kreativitas digital anak usia 4-15 tahun melalui metode gamifikasi seru dan mentor bersertifikat.',
};

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 1. Fetch CMS Section Data (dynamic from db with fallbacks)
  const cmsData = await getAllCmsData();

  // 2. Fetch Active Programs with Category relation
  const activePrograms = await db.query.programs.findMany({
    where: eq(programs.isActive, true),
    orderBy: [desc(programs.createdAt)],
    with: {
      category: true,
    },
  });

  // 3. Fetch Active Categories
  const activeCategories = await db.query.categories.findMany({
    where: eq(categories.isActive, true),
    orderBy: [categories.name],
  });

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans antialiased selection:bg-cyan-200 selection:text-cyan-900">
      {/* 1. Floating Capsule Navbar */}
      <LandingNavbar user={user} programs={activePrograms} />

      <main className="flex-1">
        {/* 1. Hero Section (Image 1 Centered Hero) */}
        <LandingHero content={cmsData.hero} />

        {/* 2. Interactive Features (Image 1: 3 Contrast Cards) */}
        <LandingInteractiveFeatures content={cmsData.features} />

        {/* 3. Enjoyable Learning Materials (Image 2 Top) */}
        <LandingStorySection content={cmsData.story} />

        {/* 3.5. Read Our Blog (Image 2 Bottom Style - Pink Theme) */}
        <LandingBlogSection content={cmsData.blogs} />

        {/* 4. Mentors Block (Image 2 Middle: Solid Royal Purple) */}
        <LandingMentorsBlock content={cmsData.mentors} />

        {/* 5. Product Catalog (Image 2 Bottom: Katalog Program Pilihan) */}
        <LandingProgramShowcase
          programs={activePrograms}
          categories={activeCategories}
        />

        {/* 6. Tanya Jawab (FAQ) */}
        <LandingFaq content={cmsData.faq} />

        {/* 7. Call To Action (Modern Island Card - Post-FAQ) */}
        <LandingFinalCta content={cmsData.cta} />
      </main>

      {/* 9. Branded Footer */}
      <LandingFooter />
    </div>
  );
}
