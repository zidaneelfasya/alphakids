'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Clock, Calendar } from 'lucide-react';
import { BlogItem } from '@/lib/cms';

export interface BlogCardProps {
  item: BlogItem;
}

export function BlogCard({ item }: BlogCardProps) {
  const fallbackImage = '/assets/img/kid-tablet.png';

  return (
    <article className="group rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md shadow-slate-950/[0.03] p-4 sm:p-5 flex flex-col justify-between overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div>
        {/* Thumbnail Image Container */}
        <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 mb-4">
          <Image
            src={item.imageUrl || fallbackImage}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* Badges on Thumbnail (Pink theme) */}
          <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 pointer-events-none">
            {item.tag ? (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#ef599a] text-white shadow-xs">
                {item.tag}
              </span>
            ) : (
              <span />
            )}

            {item.readTime && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/95 dark:bg-slate-900/95 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 backdrop-blur-xs shadow-xs flex items-center gap-1">
                <Clock className="size-3 text-slate-400" />
                <span>{item.readTime}</span>
              </span>
            )}
          </div>
        </div>

        {/* Metadata info */}
        {item.author && (
          <div className="mb-2 flex items-center gap-2 text-[11px] font-medium text-slate-500 dark:text-slate-400">
            <span>Oleh: <strong className="font-semibold text-slate-700 dark:text-slate-200">{item.author}</strong></span>
          </div>
        )}

        {/* Blog Title */}
        <h3 className="text-lg font-semibold font-sans text-slate-900 dark:text-white line-clamp-2 mb-2 group-hover:text-[#ef599a] transition-colors">
          <Link href={`/blog/${item.slug}`} className="focus:outline-none">
            {item.title}
          </Link>
        </h3>

        {/* Description Snippet */}
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-5">
          {item.excerpt}
        </p>
      </div>

      {/* Bottom Row: Published Date & Action */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
          <Calendar className="size-3 text-slate-400 shrink-0" />
          <span>{item.publishedAt || 'Terbaru'}</span>
        </div>

        <Link
          href={`/blog/${item.slug}`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#ef599a] group-hover:text-[#df488a] transition-colors"
        >
          <span>Baca Selengkapnya</span>
          <span className="size-7 rounded-full bg-[#ef599a] text-white flex items-center justify-center shrink-0 shadow-xs transition-transform duration-200 group-hover:scale-105 group-hover:rotate-12">
            <ArrowUpRight className="size-3.5 stroke-[2.5]" />
          </span>
        </Link>
      </div>
    </article>
  );
}
