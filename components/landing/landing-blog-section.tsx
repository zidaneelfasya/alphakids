'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';
import type { BlogSectionContent } from '@/lib/cms';

interface LandingBlogSectionProps {
  content: BlogSectionContent;
}

export function LandingBlogSection({ content }: LandingBlogSectionProps) {
  const fallbackImage = '/assets/img/hero1.png';

  return (
    <section id="blog" className="py-20 sm:py-28 bg-[#FFFDF9] dark:bg-slate-950 overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            
            <h2 className="text-4xl sm:text-5xl font-semibold font-sans tracking-tight text-slate-950 dark:text-white leading-[1.15]">
              {content.titlePart1 || 'Read our'}{' '}
              <span className="font-sans italic font-normal text-[#ef599a]">
                {content.titleHighlight || 'blog'}
              </span>
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 font-normal max-w-xl">
              {content.subtitle ||
                'Temukan artikel pilihan, panduan metode bermain sambil belajar, dan aktivitas digital seru untuk tumbuh kembang buah hati Anda.'}
            </p>
          </div>

          <div className="hidden sm:block shrink-0">
            <Link
              href="#blog"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#ef599a] hover:text-[#df488a] transition-colors"
            >
              <span>Jelajahi Semua Artikel</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>

        {/* 3 Clean Rounded Cards in Pink Theme (Matching User's Reference Layout) */}
        {!content.items || content.items.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200">
            <BookOpen className="size-10 mx-auto text-[#ef599a] mb-3" />
            <p className="font-sans font-semibold text-base text-slate-700 dark:text-slate-300">
              Belum ada artikel yang dipublikasikan
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {content.items.slice(0, 3).map((item) => (
              <article
                key={item.id}
                className="group rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl shadow-pink-950/5 p-4 sm:p-5 flex flex-col justify-between overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div>
                  {/* Thumbnail Image */}
                  <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-[#FDF0F5] dark:bg-slate-800 mb-4 select-none">
                    <Image
                      // src={item.imageUrl || fallbackImage}
                      src="/assets/img/hero1.png"
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    {item.tag && (
                      <div className="absolute top-3 left-3">
                        <span className="bg-[#ef599a] text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-xs">
                          {item.tag}
                        </span>
                      </div>
                    )}
                    {item.readTime && (
                      <div className="absolute top-3 right-3">
                        <span className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs text-slate-700 dark:text-slate-200 text-[11px] font-medium px-2 py-0.5 rounded-full shadow-xs">
                          {item.readTime}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-semibold font-sans text-slate-950 dark:text-white line-clamp-2 mb-2 group-hover:text-[#ef599a] transition-colors leading-snug">
                    {item.title}
                  </h3>

                  {/* Description / Excerpt */}
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4 font-normal">
                    {item.excerpt}
                  </p>
                </div>

                {/* Bottom: Read More & Pink Circular Button */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between mt-auto">
                  <span className="text-xs sm:text-sm font-semibold text-[#ef599a] tracking-tight group-hover:text-[#df488a] transition-colors">
                    Read More
                  </span>
                  <span className="size-8 rounded-full bg-[#ef599a] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#ef599a]/25 transition-all duration-200 group-hover:scale-105 group-hover:bg-[#df488a] group-hover:translate-x-1">
                    <ArrowRight className="size-4 stroke-[2.5]" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
