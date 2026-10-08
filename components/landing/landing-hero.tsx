'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import {
  CurvedArrow,
  YellowBrushUnderline,
} from '@/components/landing/wonder-decorations';
import type { HeroSectionContent } from '@/lib/cms';

interface LandingHeroProps {
  content: HeroSectionContent;
}

export function LandingHero({ content }: LandingHeroProps) {
  const shouldReduceMotion = useReducedMotion();

  // Dynamic CMS fields with robust fallbacks
  const line1 = content?.titleLine1 || 'Tempat terbaik';
  const line1Suffix = content?.titleLine1Suffix || 'untuk';
  const highlightCyan = content?.titleHighlightCyan || 'belajar';
  const conjunction = content?.titleConjunction || 'dan';
  const highlightPink = content?.titleHighlightPink || 'berkarya';
  const line3 = content?.titleLine3 || 'anak hebat';
  const subtitle =
    content?.subtitle ||
    'Eksplorasi coding, robotika, logika, dan kreativitas digital anak usia 4-15 tahun melalui metode gamifikasi seru dan mentor bersertifikat internasional.';
  const ctaText = content?.ctaText || 'Mulai Petualangan';
  const ctaLink = content?.ctaLink || '#programs';
  const imgLeft = content?.heroImageLeft || '/assets/img/hero1.png';
  const imgRight = content?.heroImageRight || '/assets/img/hero2.png';

  return (
    <section className="relative overflow-hidden min-h-screen min-h-[100dvh] flex flex-col justify-center items-center bg-[#FFFDF9] dark:bg-slate-950 pt-20 sm:pt-28 pb-10 sm:pb-14">
      {/* 1. Left Background Puzzle: 50% in, 50% out of screen (Fully Responsive Scaling) */}
      <div
        aria-hidden="true"
        className="absolute left-0 top-[45%] sm:top-[50%] -translate-y-1/2 -translate-x-1/2 w-[220px] h-[220px] xs:w-[280px] xs:h-[280px] sm:w-[420px] sm:h-[420px] lg:w-[500px] lg:h-[500px] xl:w-[580px] xl:h-[580px] 2xl:w-[680px] 2xl:h-[680px] min-[1800px]:w-[840px] min-[1800px]:h-[840px] pointer-events-none select-none z-[1]"
      >
        <div className="relative w-full h-full rotate-12 filter blur-[2px] sm:blur-[3px] opacity-70 sm:opacity-85 dark:opacity-60 transition-all">
          <Image
            src="/assets/img/Ornamen Puzzle Kuning AlphaKids_revisi0.png"
            alt=""
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* 2. Right Background Puzzle: 50% in, 50% out of screen (180 derajat) */}
      <div
        aria-hidden="true"
        className="absolute right-0 top-[65%] sm:top-[60%] -translate-y-1/2 translate-x-1/2 w-[220px] h-[220px] xs:w-[280px] xs:h-[280px] sm:w-[420px] sm:h-[420px] lg:w-[500px] lg:h-[500px] xl:w-[580px] xl:h-[580px] 2xl:w-[680px] 2xl:h-[680px] min-[1800px]:w-[840px] min-[1800px]:h-[840px] pointer-events-none select-none z-[1]"
      >
        <div className="relative w-full h-full -rotate-12 filter blur-[2px] sm:blur-[3px] opacity-70 sm:opacity-90 dark:opacity-60 transition-all">
          <Image
            src="/assets/img/Ornamen Puzzle Kuning AlphaKids_revisi0.png"
            alt=""
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* 3. Full Hero Frosted Glass Sheet (Efek Kaca Halus Menyeluruh) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[2] pointer-events-none select-none backdrop-blur-[6px] sm:backdrop-blur-md bg-white/20 dark:bg-slate-950/25"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 w-full my-auto">
        {/* ================================================================= */}
        {/* CENTERED HERO CONTENT (ALPHA KIDS RESPONSIVE TYPOGRAPHY & LAYOUT) */}
        {/* ================================================================= */}
        <div className="text-center mx-auto pt-2 sm:pt-6">
          {/* Relative wrapper for Headline + Flanking Characters (Anchored to text) */}
          <div className="relative inline-block max-w-full mx-auto">
            {/* 1. Left Flanking Hero Character: hero1.png (Yellow Blob Backdrop) */}
            <motion.div
              aria-hidden="true"
              initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.55, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="absolute right-full mr-3 xl:mr-5 2xl:mr-8 min-[1800px]:mr-12 top-1/2 -translate-y-[35%] w-[210px] h-[210px] xl:w-[260px] xl:h-[260px] 2xl:w-[320px] 2xl:h-[320px] min-[1800px]:w-[380px] min-[1800px]:h-[380px] pointer-events-none select-none z-10 hidden xl:block"
            >
              <div className="relative w-full h-full drop-shadow-2xl">
                <Image
                  src={imgLeft}
                  alt="Siswa Alpha Kids"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </motion.div>

            {/* 2. Top-Left: Official Alpha Kids Star Ornament + Curving Arrow */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, delay: 0.28, ease: 'easeOut' }}
              className="absolute -top-10 sm:-top-12 -left-6 sm:-left-10 lg:-left-12 z-10 pointer-events-none hidden md:flex flex-col items-center"
            >
              <div className="relative size-10 sm:size-12 mb-1">
                <Image
                  src="/assets/img/Ornamen Bintang Ungu AlphaKids_revisi0.png"
                  alt="Bintang Ungu"
                  fill
                  className="object-contain"
                />
              </div>
              <CurvedArrow className="w-10 h-10 sm:w-12 sm:h-12 text-[#21b1db] opacity-80 transform -rotate-12" />
            </motion.div>

            {/* 3. Centered Master Headline */}
            <motion.h1
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.48, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl xs:text-4xl sm:text-5xl md:text-5xl lg:text-[3.25rem] xl:text-[3.65rem] 2xl:text-[4.25rem] min-[1800px]:text-[5.25rem] font-semibold font-sans tracking-tight text-slate-900 dark:text-white leading-[1.18] sm:leading-[1.15]"
            >
              {line1}{' '}
              <span className="whitespace-nowrap inline-flex items-center gap-2 sm:gap-3.5 align-baseline">
                <span>{line1Suffix}</span>
                <span className="relative inline-block size-7 xs:size-8 sm:size-9 lg:size-10 xl:size-11 shrink-0 select-none pointer-events-none drop-shadow-md rotate-12 -mt-1 sm:-mt-2">
                  <Image
                    src="/assets/img/Ornamen Puzzle Kuning AlphaKids_revisi0.png"
                    alt="Puzzle Kuning"
                    fill
                    className="object-contain"
                    priority
                  />
                </span>
              </span>
              <br />
              <span className="font-sans font-semibold text-[#21b1db]">
                {highlightCyan}
              </span>{' '}
              <span className="font-semibold font-sans">{conjunction}</span>{' '}
              <span className="relative inline-block font-sans font-semibold text-[#ef599a]">
                {highlightPink}
                <YellowBrushUnderline className="absolute -bottom-1.5 sm:-bottom-2.5 left-0 w-full text-[#FFCC07]" />
              </span>
              <br />
              {line3}
            </motion.h1>

            {/* 4. Right Flanking Hero Character: hero2.png (Purple Blob Backdrop) */}
            <motion.div
              aria-hidden="true"
              initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.55, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-full ml-3 xl:ml-5 2xl:ml-8 min-[1800px]:ml-12 top-1/2 -translate-y-[55%] w-[210px] h-[210px] xl:w-[260px] xl:h-[260px] 2xl:w-[320px] 2xl:h-[320px] min-[1800px]:w-[380px] min-[1800px]:h-[380px] pointer-events-none select-none z-10 hidden xl:block"
            >
              <div className="relative w-full h-full drop-shadow-2xl">
                <Image
                  src={imgRight}
                  alt="Siswa Alpha Kids"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </motion.div>
          </div>

          {/* Mobile, Tablet & Compact Laptop: Hero Characters Row (< xl screens) */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, delay: 0.16, ease: 'easeOut' }}
            className="flex xl:hidden justify-center items-center gap-4 xs:gap-6 sm:gap-8 lg:gap-10 my-4 sm:my-6 z-20"
          >
            <div className="relative w-28 h-28 xs:w-36 xs:h-36 sm:w-48 sm:h-48 lg:w-56 lg:h-56 drop-shadow-xl">
              <Image
                src={imgLeft}
                alt="Siswa Alpha Kids"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="relative w-28 h-28 xs:w-36 xs:h-36 sm:w-48 sm:h-48 lg:w-56 lg:h-56 drop-shadow-xl">
              <Image
                src={imgRight}
                alt="Siswa Alpha Kids"
                fill
                className="object-contain"
                priority
              />
            </div>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.22, ease: 'easeOut' }}
            className="mt-3 sm:mt-6 text-xs xs:text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed px-3 sm:px-0"
          >
            {subtitle}
          </motion.p>

          {/* Centered Alpha Pink Pill CTA Button (Card 2 Accent) */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.3, ease: 'easeOut' }}
            className="mt-5 sm:mt-8 flex justify-center"
          >
            <Link
              href={ctaLink}
              className="group inline-flex items-center gap-3 sm:gap-4 pl-6 sm:pl-7 pr-2 sm:pr-2.5 py-2 sm:py-2.5 rounded-full bg-[#ef599a] hover:bg-[#df488a] text-white font-semibold text-sm sm:text-base shadow-xl shadow-[#ef599a]/30 transition-all hover:scale-105 active:scale-95"
            >
              <span className="tracking-tight">{ctaText}</span>
              <span className="size-9 sm:size-10 rounded-full bg-white text-[#ef599a] flex items-center justify-center shrink-0 shadow-md transition-transform duration-200 group-hover:scale-105 group-hover:rotate-12">
                <ArrowUpRight className="size-4 sm:size-5 stroke-[2.5] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
