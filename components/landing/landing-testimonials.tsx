'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Quote, Star, Award } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ScallopedBadge, ConcentricRings } from '@/components/landing/wonder-decorations';
import type { TestimonialsSectionContent, TestimonialItem } from '@/lib/cms';

interface LandingTestimonialsProps {
  content: TestimonialsSectionContent;
}

export function LandingTestimonials({ content }: LandingTestimonialsProps) {
  const shouldReduceMotion = useReducedMotion();
  const [page, setPage] = useState(0);

  const items = content?.items && content.items.length > 0 ? content.items : [];
  const ITEMS_PER_PAGE = 2;
  const totalPages = Math.max(1, Math.ceil(items.length / ITEMS_PER_PAGE));

  const handlePrev = () => {
    setPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const handleNext = () => {
    setPage((prev) => (prev + 1) % totalPages);
  };

  const currentItems = items.slice(
    page * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE + ITEMS_PER_PAGE
  );

  // Triad accents for cards
  const CARD_THEMES = [
    {
      accent: '#21b1db', // Cyan
      quoteBg: 'bg-[#E8F8FA] dark:bg-cyan-950/60 text-[#21b1db]',
      badgeBg: 'bg-[#E8F8FA] text-[#0d89a4] border-cyan-200/80 dark:bg-cyan-950/70 dark:text-cyan-300 dark:border-cyan-800',
      bottomLine: 'bg-[#21b1db]',
    },
    {
      accent: '#ef599a', // Pink
      quoteBg: 'bg-[#FDF0F5] dark:bg-pink-950/60 text-[#ef599a]',
      badgeBg: 'bg-[#FDF0F5] text-[#df488a] border-pink-200/80 dark:bg-pink-950/70 dark:text-pink-300 dark:border-pink-800',
      bottomLine: 'bg-[#ef599a]',
    },
    {
      accent: '#ca8a04', // Yellow / Amber
      quoteBg: 'bg-[#FEF9C3] dark:bg-amber-950/60 text-amber-700 dark:text-[#FFCC07]',
      badgeBg: 'bg-[#FEF9C3] text-amber-900 border-amber-300/80 dark:bg-amber-950/70 dark:text-amber-200 dark:border-amber-800',
      bottomLine: 'bg-[#FFCC07]',
    },
  ];

  return (
    <section
      id="testimoni"
      className="py-20 sm:py-28 relative overflow-hidden bg-[#FFFDF9] dark:bg-slate-950 select-none"
    >
      {/* Background Subtle Watermark */}
      <div
        aria-hidden="true"
        className="absolute -top-12 -left-12 pointer-events-none opacity-40 dark:opacity-20 select-none"
      >
        <ConcentricRings className="size-56 text-[#21b1db]/40" />
      </div>
      <div
        aria-hidden="true"
        className="absolute top-1/2 -right-16 pointer-events-none opacity-30 dark:opacity-10 select-none"
      >
        <ScallopedBadge className="size-64 text-[#FFCC07]/50" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ================================================================= */}
        {/* SECTION HEADER ROW                                                */}
        {/* ================================================================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl space-y-3.5"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FDF0F5] dark:bg-pink-950/60 text-[#ef599a] dark:text-pink-300 text-xs font-semibold uppercase tracking-wider border border-[#ef599a]/25">
              <span>{content?.badge || 'Testimoni Siswa & Orang Tua'}</span>
            </div>

            <h2 className="text-3xl xs:text-4xl sm:text-5xl lg:text-[3.25rem] font-semibold font-sans tracking-tight text-slate-900 dark:text-white leading-[1.2]">
              {content?.titlePart1 || 'Apa kata'}{' '}
              <span className="font-sans italic font-normal text-[#21b1db]">
                {content?.titleHighlight || 'juara kami'}
              </span>
              {content?.titlePart2 || '?'}
            </h2>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-normal leading-relaxed">
              {content?.subtitle ||
                'Kisah nyata para siswa dan orang tua yang telah membuktikan metode bimbingan terarah Alpha Kids dalam meraih prestasi terbaik di kompetisi OSN.'}
            </p>
          </motion.div>

          {/* Navigation Controls on Header */}
          {totalPages > 1 && (
            <div className="flex items-center gap-2.5 shrink-0 self-start md:self-end">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Testimoni sebelumnya"
                className="size-11 rounded-full bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-[#21b1db] hover:border-[#21b1db]/60 dark:hover:border-[#21b1db]/60 flex items-center justify-center transition-colors shadow-xs cursor-pointer"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Testimoni selanjutnya"
                className="size-11 rounded-full bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-[#21b1db] hover:border-[#21b1db]/60 dark:hover:border-[#21b1db]/60 flex items-center justify-center transition-colors shadow-xs cursor-pointer"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          )}
        </div>

        {/* ================================================================= */}
        {/* TESTIMONIAL CARDS GRID                                            */}
        {/* ================================================================= */}
        <div className="relative min-h-[360px]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={page}
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch"
            >
              {currentItems.map((item, idx) => {
                const globalIdx = page * ITEMS_PER_PAGE + idx;
                const theme = CARD_THEMES[globalIdx % CARD_THEMES.length];

                return (
                  <article
                    key={item.id || `${item.name}-${idx}`}
                    className="group relative rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-7 sm:p-9 flex flex-col justify-between shadow-lg shadow-slate-950/5 hover:border-slate-300/80 dark:hover:border-slate-700 transition-all duration-300 overflow-hidden"
                  >
                    {/* Top Row: Quotation Mark + Rating */}
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div
                          className={`size-12 rounded-2xl ${theme.quoteBg} flex items-center justify-center shadow-xs`}
                        >
                          <Quote className="size-6 stroke-[2.2]" />
                        </div>

                        {/* Stars */}
                        <div className="flex items-center gap-1">
                          {Array.from({ length: item.rating || 5 }).map((_, sIdx) => (
                            <Star
                              key={sIdx}
                              className="size-4 fill-[#FFCC07] text-[#FFCC07]"
                            />
                          ))}
                        </div>
                      </div>

                      {/* Testimonial Quote */}
                      <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed font-normal mb-8">
                        &ldquo;{item.quote}&rdquo;
                      </p>
                    </div>

                    {/* Bottom: Student Profile & Badge */}
                    <div className="pt-6 border-t border-slate-100 dark:border-slate-800/90 flex items-center gap-4">
                      {/* Avatar */}
                      <div className="relative size-14 sm:size-16 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 ring-2 ring-slate-100 dark:ring-slate-800 shadow-sm">
                        <Image
                          src={item.avatar || '/assets/img/hero1.png'}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>

                      {/* Name & School */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <h4 className="font-sans font-semibold text-base sm:text-lg text-slate-900 dark:text-white truncate">
                          {item.name}
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 truncate">
                          {item.role} &bull; {item.school}
                        </p>

                        {/* Achievement Badge */}
                        {item.achievement && (
                          <div className="pt-1 flex items-center gap-1.5">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${theme.badgeBg}`}
                            >
                              <Award className="size-3 shrink-0" />
                              <span className="truncate">{item.achievement}</span>
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom Accent Line */}
                    <div
                      aria-hidden="true"
                      className={`absolute bottom-0 left-0 right-0 h-1.5 ${theme.bottomLine}`}
                    />
                  </article>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ================================================================= */}
        {/* CAROUSEL DOT INDICATORS                                           */}
        {/* ================================================================= */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-10 sm:pt-12">
            {Array.from({ length: totalPages }).map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onClick={() => setPage(dotIdx)}
                aria-label={`Buka slide testimoni ${dotIdx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  dotIdx === page
                    ? 'w-7 bg-[#21b1db] shadow-xs'
                    : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
