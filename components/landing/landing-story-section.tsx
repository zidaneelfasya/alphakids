'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import {
  YellowLoop,
  ScallopedBadge,
  CaterpillarWave,
  ConcentricRings,
  DotGrid,
} from '@/components/landing/wonder-decorations';
import type { StorySectionContent } from '@/lib/cms';

interface LandingStorySectionProps {
  content: StorySectionContent;
}

export function LandingStorySection({ content }: LandingStorySectionProps) {
  return (
    <section id="keunggulan" className="py-14 sm:py-20 lg:py-28 bg-white dark:bg-slate-950 overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-14 items-center">
          {/* =============================================================== */}
          {/* LEFT COLUMN: HEADLINE WITH YELLOW OVAL LOOP & CTA               */}
          {/* =============================================================== */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            <h2 className="text-3xl xs:text-4xl sm:text-5xl lg:text-[3.25rem] xl:text-[3.5rem] font-semibold font-sans tracking-tight text-slate-900 dark:text-white leading-[1.28] sm:leading-[1.24] lg:leading-[1.2]">
              <span className="inline-block whitespace-normal xs:whitespace-nowrap">
                Materi belajar yang
              </span>{' '}
              <br />
              disediakan <br />
              <span className="relative inline-flex items-center justify-center align-baseline whitespace-nowrap mx-1.5 sm:mx-2 my-1.5 sm:my-2 px-3.5 sm:px-4.5 py-1">
                <span className="relative z-10 font-sans italic font-normal text-[#ef599a]">
                  menyenangkan
                </span>
                {/* Hand-drawn yellow oval loop encircling "menyenangkan" */}
                <YellowLoop />
              </span>{' '}
              <br />
              untuk anak
            </h2>

            <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg font-normal">
              {content.desc1 ||
                "Jangan khawatir! Buah hati Anda akan menikmati setiap sesi pembelajaran dengan materi interaktif yang mudah dipahami, aplikatif, dan menyenangkan."}
            </p>

            <div className="pt-2 sm:pt-3">
              <Link
                href="#programs"
                className="group inline-flex items-center gap-3 sm:gap-4 pl-6 sm:pl-7 pr-2 sm:pr-2.5 py-2 sm:py-2.5 rounded-full bg-[#21b1db] hover:bg-[#1da0c7] text-white font-semibold text-sm sm:text-base shadow-xl shadow-[#21b1db]/30 transition-all hover:scale-105 active:scale-95"
              >
                <span className="tracking-tight">Pelajari Lebih Lanjut</span>
                <span className="size-9 sm:size-10 rounded-full bg-white text-[#21b1db] flex items-center justify-center shrink-0 shadow-md transition-transform duration-200 group-hover:scale-105 group-hover:rotate-12">
                  <ArrowUpRight className="size-4 sm:size-5 stroke-[2.5] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            </div>
          </div>

          {/* =============================================================== */}
          {/* RIGHT COLUMN: 3 HORIZONTAL PILL STRIPS (ALPHA KIDS PYRAMID)      */}
          {/* =============================================================== */}
          <div className="lg:col-span-5 relative space-y-4 sm:space-y-5 flex flex-col items-center sm:items-end w-full">
            {/* Top Strip: Alpha Cyan Pill (Card 1: #21b1db) */}
            <div className="relative w-full max-w-[320px] xs:max-w-sm sm:max-w-md flex justify-end">
              {/* Alpha Yellow Scalloped Sunburst Badge on Top-Right */}
              <div className="absolute -top-7 sm:-top-10 right-2 sm:right-10 z-20">
                <ScallopedBadge className="size-12 sm:size-16 text-[#FFCC07]" />
              </div>

              {/* Alpha Cyan Pill Container (Pyramid Tier 1) */}
              <div className="w-5/6 h-20 sm:h-24 md:h-28 rounded-full bg-[#21b1db] flex items-center justify-between px-4 sm:px-7 md:px-8 relative overflow-visible shadow-lg shadow-[#21b1db]/25">
                {/* Concentric rings pattern (bulatan) on the left of the blue strip */}
                <div className="opacity-75 pl-1 sm:pl-3">
                  <ConcentricRings className="size-13 sm:size-16 md:size-18 text-white/50" />
                </div>

                {/* Kid cutout on the right */}
                <div className="absolute -top-4 sm:-top-6 right-6 sm:right-12 size-24 sm:size-28 md:size-32 rounded-full overflow-hidden">
                  <Image
                    src="/assets/img/hero1.png"
                    alt="Anak Senang Belajar"
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 96px, 128px"
                  />
                </div>
              </div>
            </div>

            {/* Middle Strip: Alpha Pink Pill (Card 2: #ef599a) */}
            <div className="relative w-full max-w-[320px] xs:max-w-sm sm:max-w-md flex justify-end">
              <div className="w-full h-20 sm:h-24 md:h-28 rounded-full bg-[#ef599a] flex items-center justify-between px-4 sm:px-8 md:px-10 relative overflow-visible shadow-lg shadow-[#ef599a]/25">
                {/* Decorative wavy pattern on the left of the pink strip */}
                <div className="opacity-80">
                  <CaterpillarWave className="w-16 sm:w-24 h-12 sm:h-16 text-[#FDF0F5]" />
                </div>

                {/* Kid cutout on the right */}
                <div className="absolute -top-4 sm:-top-6 right-2 sm:right-4 size-24 sm:size-28 md:size-32 rounded-full overflow-hidden">
                  <Image
                    src="/assets/img/hero2.png"
                    alt="Anak Cerdas Koding"
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 96px, 128px"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Strip: Alpha Yellow Pill (Card 3: #FFCC07) */}
            <div className="relative w-full max-w-[320px] xs:max-w-sm sm:max-w-md flex justify-end">
              <div className="w-4/5 h-20 sm:h-24 md:h-28 rounded-full bg-[#FFCC07] flex items-center justify-between px-4 sm:px-7 md:px-8 relative overflow-visible shadow-lg shadow-[#FFCC07]/30">
                {/* Square dot grid pattern (titik berbentuk persegi) on the left of the yellow strip */}
                <div className="opacity-80 pl-1 sm:pl-3">
                  <DotGrid
                    cols={4}
                    count={16}
                    className="gap-1.5 sm:gap-2"
                    dotClassName="size-1.5 sm:size-2 bg-white/85"
                  />
                </div>

                {/* Kid cutout on the right */}
                <div className="absolute -top-3.5 sm:-top-5 right-8 sm:right-14 size-24 sm:size-28 md:size-32 rounded-full overflow-hidden">
                  <Image
                    src="/assets/img/hero3.png"
                    alt="Anak Belajar Tablet"
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 96px, 128px"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
