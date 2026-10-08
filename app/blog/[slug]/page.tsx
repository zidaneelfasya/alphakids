import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowLeft, Clock, Calendar, User } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { db, programs } from '@/lib/db';
import { eq, desc } from 'drizzle-orm';
import { LandingNavbar } from '@/components/landing/landing-navbar';
import { LandingFooter } from '@/components/landing/landing-footer';
import { getCmsSection, DEFAULT_BLOGS, BlogSectionContent } from '@/lib/cms';
import {
  BlogArticleBody,
  extractTableOfContents,
} from '@/components/blog/blog-article-body';
import { BlogTableOfContents } from '@/components/blog/blog-table-of-contents';
import { BlogRelatedPosts } from '@/components/blog/blog-related-posts';
import { BlogShareBar } from '@/components/blog/blog-share-bar';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const blogData = await getCmsSection<BlogSectionContent>('blogs', DEFAULT_BLOGS);
  const article = blogData.items.find((item) => item.slug === slug);

  if (!article) {
    return {
      title: 'Artikel Tidak Ditemukan — Alpha Kids',
    };
  }

  return {
    title: `${article.title} — Alpha Kids Blog`,
    description: article.excerpt,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

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

  // 3. Fetch Blog CMS section & find article
  const blogData = await getCmsSection<BlogSectionContent>('blogs', DEFAULT_BLOGS);
  const article = blogData.items.find((item) => item.slug === slug);

  if (!article) {
    notFound();
  }

  // 4. Extract headings for Table of Contents
  const tocItems = extractTableOfContents(article.content || '');

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF9] dark:bg-slate-950 font-sans antialiased text-slate-900 dark:text-white selection:bg-pink-200 selection:text-pink-900">
      {/* 1. Official Floating Capsule Navbar */}
      <LandingNavbar user={user} programs={activePrograms} />

      {/* 2. Main 3-Column Content Layout */}
      <main className="flex-1 pt-28 sm:pt-36 pb-20 sm:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb / Top Bar */}
          <div className="mb-6 flex items-center justify-between text-xs">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 font-semibold text-slate-500 hover:text-[#ef599a] dark:text-slate-400 dark:hover:text-pink-300 transition-colors"
            >
              <ArrowLeft className="size-3.5" />
              <span>Kembali ke Semua Artikel</span>
            </Link>

            {article.tag && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FDF0F5] dark:bg-pink-950/60 text-[#ef599a] dark:text-pink-300 border border-[#ef599a]/25">
                {article.tag}
              </span>
            )}
          </div>

          {/* 3-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-8 items-start">
            {/* Column 1: Left Sticky Table of Contents (Desktop) */}
            <div className="hidden lg:block lg:col-span-3">
              <BlogTableOfContents items={tocItems} />
            </div>

            {/* Column 2: Center Main Article */}
            <article className="col-span-12 lg:col-span-6 bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 lg:p-10 shadow-xs">
              {/* Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-[2.25rem] font-semibold font-sans tracking-tight text-slate-900 dark:text-white leading-[1.25] mb-4">
                {article.title}
              </h1>

              {/* Author & Publish Date Bar */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pb-6 mb-6 border-b border-slate-100 dark:border-slate-800">
                {article.author && (
                  <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                    <User className="size-3.5 text-[#ef599a]" />
                    <span>{article.author}</span>
                  </div>
                )}
                {article.publishedAt && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="size-3.5 text-slate-400" />
                    <span>{article.publishedAt}</span>
                  </div>
                )}
                {article.readTime && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="size-3.5 text-slate-400" />
                    <span>{article.readTime}</span>
                  </div>
                )}
              </div>

              {/* Banner Image */}
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 mb-8 shadow-xs">
                <Image
                  src={article.imageUrl || '/assets/img/hero1.png'}
                  alt={article.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 700px"
                />
              </div>

              {/* Mobile Table of Contents (Shown only on small screens) */}
              {tocItems.length > 0 && (
                <div className="block lg:hidden mb-8">
                  <BlogTableOfContents items={tocItems} />
                </div>
              )}

              {/* Markdown Article Content */}
              <BlogArticleBody content={article.content} />

              {/* Social Share Bar */}
              <BlogShareBar title={article.title} />
            </article>

            {/* Column 3: Right Sticky Related Posts (Desktop) */}
            <div className="hidden lg:block lg:col-span-3">
              <BlogRelatedPosts
                currentSlug={article.slug}
                currentTag={article.tag}
                allBlogs={blogData.items}
              />
            </div>
          </div>

          {/* Mobile / Tablet: Related Posts at Bottom */}
          <div className="block lg:hidden mt-12">
            <BlogRelatedPosts
              currentSlug={article.slug}
              currentTag={article.tag}
              allBlogs={blogData.items}
            />
          </div>
        </div>
      </main>

      {/* 3. Branded Multi-Column Footer */}
      <LandingFooter />
    </div>
  );
}
