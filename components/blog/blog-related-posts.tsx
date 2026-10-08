'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, BookOpen, Clock } from 'lucide-react';
import { BlogItem } from '@/lib/cms';

interface BlogRelatedPostsProps {
  currentSlug: string;
  currentTag?: string;
  allBlogs: BlogItem[];
}

export function BlogRelatedPosts({
  currentSlug,
  currentTag,
  allBlogs,
}: BlogRelatedPostsProps) {
  // Filter out the current article
  const otherBlogs = allBlogs.filter((b) => b.slug !== currentSlug);

  // Prioritize articles with matching tag, otherwise take recent
  const sorted = [...otherBlogs].sort((a, b) => {
    const aMatch = a.tag && currentTag && a.tag.toLowerCase() === currentTag.toLowerCase() ? 1 : 0;
    const bMatch = b.tag && currentTag && b.tag.toLowerCase() === currentTag.toLowerCase() ? 1 : 0;
    return bMatch - aMatch;
  });

  // Limit strictly to 2 - 3 items as requested
  const relatedPosts = sorted.slice(0, 3);

  if (relatedPosts.length === 0) return null;

  return (
    <aside
      aria-label="Artikel Terkait"
      className="sticky top-28 space-y-6"
    >
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-4 sm:p-5 shadow-xs">
        {/* Section Header */}
        <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100 dark:border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <BookOpen className="size-4 text-[#ef599a]" />
          <span>Artikel Terkait</span>
        </div>

        {/* List of 2-3 Related Items */}
        <div className="space-y-4">
          {relatedPosts.map((post) => (
            <article
              key={post.id}
              className="group flex gap-3 items-start pb-4 border-b border-slate-100 dark:border-slate-800/80 last:border-none last:pb-0"
            >
              {/* Mini Thumbnail */}
              <div className="relative size-16 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                <Image
                  src={post.imageUrl || '/assets/img/kid-tablet.png'}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="64px"
                />
              </div>

              {/* Title & Metadata */}
              <div className="flex-1 min-w-0">
                {post.tag && (
                  <span className="inline-block text-[10px] font-semibold text-[#ef599a] mb-1">
                    {post.tag}
                  </span>
                )}
                <h4 className="text-xs font-semibold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-[#ef599a] transition-colors">
                  <Link href={`/blog/${post.slug}`} className="focus:outline-none">
                    {post.title}
                  </Link>
                </h4>
                <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-400">
                  {post.readTime && (
                    <span className="flex items-center gap-1">
                      <Clock className="size-2.5" />
                      <span>{post.readTime}</span>
                    </span>
                  )}
                  {post.publishedAt && <span>• {post.publishedAt}</span>}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Explore All Link */}
        <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-[#ef599a] hover:text-[#df488a] transition-colors w-full py-1.5 rounded-lg hover:bg-[#FDF0F5] dark:hover:bg-pink-950/30"
          >
            <span>Eksplorasi Semua Artikel</span>
            <ArrowUpRight className="size-3.5 stroke-[2.5]" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
