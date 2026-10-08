'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { formatRupiah } from '@/lib/utils';

export interface ProgramCardProps {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  promoPrice?: number | null;
  thumbnailUrl: string | null;
  categoryName?: string;
  ageRange?: string | null;
  level?: string | null;
  startAt?: string | null;
  endAt?: string | null;
}

export function ProgramCard({
  name,
  slug,
  description,
  price,
  promoPrice,
  thumbnailUrl,
  categoryName,
  ageRange,
  level,
}: ProgramCardProps) {
  const fallbackImage = '/assets/img/Konten Piramida AlphaKids_revisi0.png';
  const activePrice = promoPrice ?? price;
  const hasDiscount = promoPrice !== undefined && promoPrice !== null && promoPrice < price;

  return (
    <article className="group rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md shadow-slate-950/[0.03] p-4 sm:p-5 flex flex-col justify-between overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div>
        {/* Thumbnail Image Container */}
        <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 mb-4">
          <Image
            src={thumbnailUrl || fallbackImage}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* Badges on Thumbnail */}
          <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 pointer-events-none">
            {ageRange ? (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FFCC07] text-amber-950 shadow-xs">
                {ageRange.toLowerCase().startsWith('usia')
                  ? ageRange
                  : `Usia ${ageRange}`}
              </span>
            ) : (
              <span />
            )}

            {categoryName && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/95 dark:bg-slate-900/95 text-[#0e7490] dark:text-cyan-300 border border-cyan-100 dark:border-cyan-900/50 backdrop-blur-xs shadow-xs">
                {categoryName}
              </span>
            )}
          </div>
        </div>

        {/* Level Tag (If present) */}
        {level && (
          <div className="mb-2">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Tingkat:{' '}
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {level}
              </span>
            </span>
          </div>
        )}

        {/* Program Title */}
        <h3 className="text-lg font-semibold font-sans text-slate-900 dark:text-white line-clamp-2 mb-2 group-hover:text-[#21b1db] transition-colors">
          <Link href={`/programs/${slug}`} className="focus:outline-none">
            {name}
          </Link>
        </h3>

        {/* Description Snippet */}
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-5">
          {description}
        </p>
      </div>

      {/* Bottom Row: Price & Action */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">
            Investasi Belajar
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-semibold font-sans text-slate-900 dark:text-white">
              {activePrice === 0 ? 'Gratis' : formatRupiah(activePrice)}
            </span>
            {hasDiscount && (
              <span className="text-[11px] line-through text-slate-400">
                {formatRupiah(price)}
              </span>
            )}
          </div>
        </div>

        <Link
          href={`/programs/${slug}`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#ef599a] group-hover:text-[#df488a] transition-colors"
        >
          <span>Lihat Detail</span>
          <span className="size-7 rounded-full bg-[#ef599a] text-white flex items-center justify-center shrink-0 shadow-xs transition-transform duration-200 group-hover:scale-105 group-hover:rotate-12">
            <ArrowUpRight className="size-3.5 stroke-[2.5]" />
          </span>
        </Link>
      </div>
    </article>
  );
}
