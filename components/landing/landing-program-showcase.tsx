'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatRupiah } from '@/lib/utils';

export interface ShowcaseProgram {
  id: string;
  title: string;
  slug: string;
  shortDescription?: string | null;
  price: number;
  promoPrice?: number | null;
  thumbnailUrl?: string | null;
  ageMin?: number | null;
  ageMax?: number | null;
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

  const filteredPrograms =
    selectedCategory === 'all'
      ? programs
      : programs.filter((p) => p.category?.slug === selectedCategory);

  const fallbackImage = '/assets/img/Konten Piramida AlphaKids_revisi0.png';

  return (
    <section id="programs" className="py-20 sm:py-28 bg-white dark:bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading (Matching "Read our blog" typography from Image 2) */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-4xl sm:text-5xl font-semibold font-sans tracking-tight text-slate-950 dark:text-white">
              Katalog{' '}
              <span className="font-sans italic font-normal text-[#21b1db]">
                program
              </span>
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 font-normal">
              Pilih kelas digital favorit si kecil untuk mengasah daya nalar komputasi dan kreativitas.
            </p>
          </div>

          {/* Category Filter Capsule Pills */}
          {categories.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-[#21b1db] text-white shadow-sm'
                    : 'border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-[#21b1db] hover:text-[#21b1db]'
                }`}
              >
                Semua
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    selectedCategory === cat.slug
                      ? 'bg-[#21b1db] text-white shadow-sm'
                      : 'border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-[#21b1db] hover:text-[#21b1db]'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 3 Clean Rounded Cards (WonderKids Bottom Cards Style) */}
        {filteredPrograms.length === 0 ? (
          <div className="text-center py-16 px-4 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200">
            <BookOpen className="size-10 mx-auto text-[#21b1db] mb-3" />
            <p className="font-sans font-semibold text-base text-slate-700 dark:text-slate-300">
              Belum ada program di kategori ini
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredPrograms.slice(0, 6).map((prog) => {
              const ageLabel =
                prog.ageMin && prog.ageMax
                  ? `Usia ${prog.ageMin}–${prog.ageMax} Thn`
                  : prog.ageMin
                  ? `Mulai ${prog.ageMin} Thn`
                  : null;

              const activePrice = prog.promoPrice ?? prog.price;
              const hasDiscount = prog.promoPrice && prog.promoPrice < prog.price;

              return (
                <div
                  key={prog.id}
                  className="group rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-950/5 p-4 sm:p-5 flex flex-col justify-between overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
                >
                  <div>
                    {/* Thumbnail Image */}
                    <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 mb-4">
                      <Image
                        src={prog.thumbnailUrl || fallbackImage}
                        alt={prog.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      {ageLabel && (
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-[#FFCC07] text-amber-950 font-semibold px-2.5 py-0.5 rounded-full text-[11px] shadow-sm">
                            {ageLabel}
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold font-sans text-slate-950 dark:text-white line-clamp-2 mb-2 group-hover:text-[#21b1db] transition-colors">
                      {prog.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
                      {prog.shortDescription ||
                        'Kurikulum interaktif dengan proyek langsung, sertifikat resmi, dan bimbingan mentor.'}
                    </p>
                  </div>

                  {/* Bottom: Price & Button (Exact WonderKids "Read More ->" pill style) */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                        Investasi
                      </span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base font-semibold font-sans text-slate-900 dark:text-white">
                          {activePrice === 0 ? 'Gratis' : formatRupiah(activePrice)}
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
                </div>
              );
            })}
          </div>
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
