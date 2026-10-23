'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, BookOpen } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Badge } from '@/components/ui/badge';
import { formatRupiah } from '@/lib/utils';

export interface ShowcaseProgram {
  id: string;
  title: string;
  slug: string;
  shortDescription?: string | null;
  description?: string | null;
  price: number;
  promoPrice?: number | null;
  coverImage?: string | null;
  thumbnailUrl?: string | null;
  ageMin?: number | null;
  ageMax?: number | null;
  ageRange?: string | null;
  level?: string | null;
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

export interface ShowcaseCategory {
  id: string;
  name: string;
  slug: string;
}

interface LandingProgramShowcaseProps {
  programs: ShowcaseProgram[];
  categories: ShowcaseCategory[];
}

export function LandingProgramShowcase({
  programs,
  categories,
}: LandingProgramShowcaseProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const shouldReduceMotion = useReducedMotion();

  // Enforce standardized 6 categories as requested in review:
  // Semua | Private 1-on-1 | Kelas Grup | Matematika | IPA | IPS
  const FILTER_TABS = [
    { slug: 'all', name: 'Semua' },
    { slug: 'private-1-on-1', name: 'Private 1-on-1' },
    { slug: 'kelas-grup', name: 'Kelas Grup' },
    { slug: 'matematika', name: 'Matematika' },
    { slug: 'ipa', name: 'IPA' },
    { slug: 'ips', name: 'IPS' },
  ];

  const filteredPrograms =
    selectedCategory === 'all'
      ? programs
      : programs.filter((p) => {
          if (p.category?.slug === selectedCategory) return true;
          const text = `${p.title} ${p.shortDescription || ''} ${p.description || ''} ${p.category?.name || ''}`.toLowerCase();
          if (selectedCategory === 'private-1-on-1') {
            return text.includes('private') || text.includes('1-on-1');
          }
          if (selectedCategory === 'kelas-grup') {
            return text.includes('grup') || text.includes('kelas') || text.includes('bootcamp');
          }
          if (selectedCategory === 'matematika') {
            return text.includes('matematika') || text.includes('math');
          }
          if (selectedCategory === 'ipa') {
            return text.includes('ipa') || text.includes('sains') || text.includes('science');
          }
          if (selectedCategory === 'ips') {
            return text.includes('ips') || text.includes('sosial');
          }
          return false;
        });

  const fallbackImage = '/assets/img/Konten Piramida AlphaKids_revisi0.png';

  return (
    <section id="programs" className="py-20 sm:py-28 bg-white dark:bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12"
        >
          <div>
            <h2 className="text-4xl sm:text-5xl font-semibold font-sans tracking-tight text-slate-950 dark:text-white">
              Program{' '}
              <span className="font-sans italic font-normal text-[#21b1db]">
                belajar
              </span>
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 font-normal">
              Pilih program sesuai jenjang, kebutuhan, dan target belajar anak.
            </p>
          </div>

          {/* Category Filter Capsule Pills: Semua | Private 1-on-1 | Kelas Grup | Matematika | IPA | IPS */}
          <div className="flex flex-wrap items-center gap-2 py-2.5 px-1">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.slug}
                type="button"
                onClick={() => setSelectedCategory(tab.slug)}
                className={`relative px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors duration-200 cursor-pointer ${
                  selectedCategory === tab.slug
                    ? 'text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {selectedCategory === tab.slug && (
                  <motion.span
                    layoutId="activeCategoryPill"
                    className="absolute inset-0 rounded-full bg-[#21b1db] shadow-md shadow-black/10 dark:shadow-black/40 z-0"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <span className="relative z-10">{tab.name}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* 3 Clean Rounded Cards with Fluid Animated Layout Reordering */}
        {filteredPrograms.length === 0 ? (
          <div className="text-center py-16 px-4 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200">
            <BookOpen className="size-10 mx-auto text-[#21b1db] mb-3" />
            <p className="font-sans font-semibold text-base text-slate-700 dark:text-slate-300">
              Belum ada program di kategori ini
            </p>
          </div>
        ) : (
          <motion.div
            layout={!shouldReduceMotion}
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredPrograms.slice(0, 6).map((prog) => {
                const activePrice = prog.promoPrice ?? prog.price;
                const hasDiscount = prog.promoPrice && prog.promoPrice < prog.price;

                const isPrivate =
                  prog.title.toLowerCase().includes('private') ||
                  prog.title.toLowerCase().includes('1-on-1') ||
                  prog.category?.slug === 'private-1-on-1';

                const isSMP =
                  prog.level?.toLowerCase().includes('smp') ||
                  prog.title.toLowerCase().includes('smp') ||
                  prog.title.toLowerCase().includes('kelas 7') ||
                  prog.title.toLowerCase().includes('kelas 8') ||
                  prog.title.toLowerCase().includes('kelas 9');

                // Badge format: SD Kelas 4–6 / SMP Kelas 7–9 (Item 9)
                const displayGradeBadge = isSMP ? 'SMP Kelas 7–9' : 'SD Kelas 4–6';

                // Price display: Mulai dari Rp250.000 / sesi vs Program lengkap Rp800.000 / siswa (Item 10)
                const priceLabel = isPrivate ? 'Mulai dari' : 'Program lengkap';
                const priceUnit = isPrivate ? '/ sesi' : '/ siswa';
                const displayPrice =
                  activePrice > 0
                    ? formatRupiah(activePrice)
                    : isPrivate
                    ? 'Rp250.000'
                    : 'Rp800.000';

                return (
                  <motion.div
                    key={prog.id}
                    layout={!shouldReduceMotion}
                    initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.28, ease: 'easeOut' }}
                    className="group rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-md shadow-slate-950/5 p-4 sm:p-5 flex flex-col justify-between overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-slate-200 dark:hover:border-slate-700"
                  >
                    <div>
                      {/* Thumbnail Image */}
                      <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 mb-4">
                        <Image
                          src={prog.coverImage || prog.thumbnailUrl || fallbackImage}
                          alt={prog.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                        <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                          <Badge className="bg-[#FFCC07] text-amber-950 font-semibold px-2.5 py-0.5 rounded-full text-[11px] shadow-sm">
                            {displayGradeBadge}
                          </Badge>
                          {prog.category?.name && (
                            <Badge className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs text-slate-700 dark:text-slate-200 font-medium px-2 py-0.5 rounded-full text-[10px] shadow-xs border border-slate-200/60 dark:border-slate-700/60">
                              {prog.category.name}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-semibold font-sans text-slate-950 dark:text-white line-clamp-2 mb-2 group-hover:text-[#21b1db] transition-colors">
                        {prog.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
                        {prog.description ||
                          prog.shortDescription ||
                          'Kurikulum olimpiade intensif dengan bank soal teruji, tryout berkala, dan bimbingan mentor medalis.'}
                      </p>
                    </div>

                    {/* Bottom: Price & Button */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                          {priceLabel}
                        </span>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-base font-semibold font-sans text-slate-900 dark:text-white">
                            {displayPrice}
                          </span>
                          <span className="text-[11px] text-slate-400 font-medium">
                            {priceUnit}
                          </span>
                          {hasDiscount && (
                            <span className="text-[11px] line-through text-slate-400">
                              {formatRupiah(prog.price)}
                            </span>
                          )}
                        </div>
                      </div>

                      <Link
                        href={`/programs/${prog.slug}`}
                        className="inline-flex items-center gap-2 text-xs font-semibold text-[#ef599a] hover:text-[#df488a] transition-colors"
                      >
                        <span>Lihat Detail</span>
                      <span className="size-6 rounded-full bg-[#ef599a] text-white flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:translate-x-0.5">
                        <ArrowRight className="size-3" />
                      </span>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
            </AnimatePresence>
          </motion.div>
        )}

        {/* View All Programs Link */}
        <div className="text-center mt-12">
          <Link
            href="/programs"
            className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:border-[#21b1db] hover:text-[#21b1db] transition-all"
          >
            <span>Buka Seluruh Katalog Program ({programs.length})</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
