import { createClient } from '@/lib/supabase/server';
import { db, programs } from '@/lib/db';
import { eq, desc } from 'drizzle-orm';
import { LandingNavbar } from '@/components/landing/landing-navbar';
import { LandingFooter } from '@/components/landing/landing-footer';
import { BlogExplorer } from '@/components/blog/blog-explorer';
import { getCmsSection, DEFAULT_BLOGS, BlogSectionContent } from '@/lib/cms';

interface BlogPageProps {
  searchParams: Promise<{
    category?: string;
    q?: string;
  }>;
}

export const metadata = {
  title: 'Blog & Edukasi — Alpha Kids',
  description:
    'Temukan inspirasi artikel, panduan metode bermain sambil belajar, tips parenting era digital, dan aktivitas seru untuk tumbuh kembang buah hati Anda.',
};

export const dynamic = 'force-dynamic';

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { category: categorySlug, q: searchQuery } = await searchParams;

  // 1. Supabase auth session
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 2. Fetch Active Programs for Navbar program popover
  const activePrograms = await db.query.programs.findMany({
    where: eq(programs.isActive, true),
    orderBy: [desc(programs.createdAt)],
    with: {
      category: true,
    },
  });

  // 3. Fetch Blog CMS section
  const blogData = await getCmsSection<BlogSectionContent>('blogs', DEFAULT_BLOGS);

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF9] dark:bg-slate-950 font-sans antialiased text-slate-900 dark:text-white selection:bg-pink-200 selection:text-pink-900">
      {/* 1. Official Floating Capsule Navbar */}
      <LandingNavbar user={user} programs={activePrograms} />

      {/* 2. Main Content Area */}
      <main className="flex-1 pt-28 sm:pt-36 pb-20 sm:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section (Alpha Pink branding, disciplined anti-slop typography) */}
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
            <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-semibold   text-[#ef599a]">
              {blogData.badge || 'Artikel & Edukasi Digital'}
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-[3.25rem] font-semibold font-sans tracking-tight text-slate-900 dark:text-white leading-[1.2] mt-4">
              Kumpulan{' '}
              <span className="font-sans font-semibold font-normal text-[#ef599a]">
                artikel
              </span>{' '}
              & inspirasi anak
            </h1>

            <p className="mt-3.5 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
              {blogData.subtitle ||
                'Temukan inspirasi artikel, panduan metode bermain sambil belajar, dan aktivitas digital seru untuk tumbuh kembang buah hati Anda.'}
            </p>
          </div>

          {/* Blog Interactive Explorer */}
          <BlogExplorer
            blogs={blogData.items || []}
            initialCategory={categorySlug}
            initialQuery={searchQuery}
          />
        </div>
      </main>

      {/* 3. Branded Multi-Column Footer */}
      <LandingFooter />
    </div>
  );
}
