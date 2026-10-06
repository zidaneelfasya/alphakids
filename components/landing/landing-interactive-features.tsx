'use client';

import { Lightbulb, Gamepad2, ClipboardCheck } from 'lucide-react';
import {
  ScallopedBadge,
  ConcentricRings,
  CaterpillarWave,
  DotGrid,
  CloudWithPills,
} from '@/components/landing/wonder-decorations';
import type { FeaturesSectionContent } from '@/lib/cms';

interface LandingInteractiveFeaturesProps {
  content: FeaturesSectionContent;
}

export function LandingInteractiveFeatures({ content }: LandingInteractiveFeaturesProps) {
  return (
    <section id="fitur" className="py-16 sm:py-24 bg-white dark:bg-slate-950 overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* ================================================================= */}
        {/* SECTION HEADER ROW (LEFT TITLE + RIGHT CLOUD PILLS)               */}
        {/* ================================================================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <h2 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-semibold font-sans tracking-tight text-slate-950 dark:text-white leading-[1.15]">
              Fitur{' '}
              <span className="font-sans italic font-normal text-[#21b1db]">
                interaktif
              </span>{' '}
              <br />
              unggulan kami
            </h2>
          </div>

          {/* Right Floating Cloud with 3 Colorful Tilted Pills */}
          <div className="hidden md:block shrink-0">
            <CloudWithPills />
          </div>
        </div>

        {/* ================================================================= */}
        {/* 3 ICONIC ALPHA KIDS CONTRAST CARDS                                */}
        {/* ================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* --------------------------------------------------------------- */}
          {/* CARD 1: Alpha Cyan #21b1db (Quiz Interaktif)                   */}
          {/* --------------------------------------------------------------- */}
          <div className="relative rounded-[2.5rem] bg-[#21b1db] text-white p-8 sm:p-9 min-h-[380px] flex flex-col justify-between overflow-hidden shadow-2xl shadow-[#21b1db]/25 transition-transform duration-300 hover:-translate-y-2">
            {/* Top Row: Left Scalloped Badge + Right Concentric Circles */}
            <div className="flex items-start justify-between relative z-10">
              {/* White Scalloped Starburst Badge with Quiz Icon */}
              <div className="relative size-16 flex items-center justify-center">
                <ScallopedBadge className="w-full h-full text-white" />
                <ClipboardCheck className="absolute size-6 text-[#21b1db]" />
              </div>

              {/* Concentric Circles cutting into the top-right corner */}
              <div className="absolute -top-12 -right-12 pointer-events-none opacity-80">
                <ConcentricRings className="size-36 text-white/35" />
              </div>
            </div>

            {/* Bottom Content */}
            <div className="relative z-10 pt-16">
              <h3 className="text-2xl sm:text-3xl font-semibold font-sans text-white mb-2 leading-tight">
                Quiz{' '}
                <span className="font-sans italic font-normal text-white">
                  Interaktif
                </span>
              </h3>
              <p className="text-xs sm:text-sm text-cyan-50 leading-relaxed font-medium">
                {content.card1Desc ||
                  'Uji pemahaman si kecil melalui kuis seru berhadiah poin petualang dan lencana prestasi!'}
              </p>
            </div>
          </div>

          {/* --------------------------------------------------------------- */}
          {/* CARD 2: Alpha Pink #ef599a (Aktivitas Kreatif)                  */}
          {/* --------------------------------------------------------------- */}
          <div className="relative rounded-[2.5rem] bg-[#ef599a] text-white p-8 sm:p-9 min-h-[380px] flex flex-col justify-between overflow-hidden shadow-2xl shadow-[#ef599a]/25 transition-transform duration-300 hover:-translate-y-2">
            {/* Top Row: Left Scalloped Badge + Right Caterpillar Wave */}
            <div className="flex items-start justify-between relative z-10">
              {/* White Scalloped Starburst Badge with Idea Icon */}
              <div className="relative size-16 flex items-center justify-center">
                <ScallopedBadge className="w-full h-full text-white" />
                <Lightbulb className="absolute size-6 text-[#ef599a]" />
              </div>

              {/* Translucent Caterpillar Wave Pattern on top-right */}
              <div className="absolute -top-3 -right-6 pointer-events-none opacity-90">
                <CaterpillarWave className="w-36 h-24 text-white/35" />
              </div>
            </div>

            {/* Bottom Content */}
            <div className="relative z-10 pt-16">
              <h3 className="text-2xl sm:text-3xl font-semibold font-sans text-white mb-2 leading-tight">
                Aktivitas{' '}
                <span className="font-sans italic font-normal text-white">
                  Kreatif
                </span>
              </h3>
              <p className="text-xs sm:text-sm text-pink-50 leading-relaxed font-medium">
                {content.card2Desc ||
                  'Eksplorasi coding visual, perakitan robotika, dan pembuatan game yang mengasah logika komputasi.'}
              </p>
            </div>
          </div>

          {/* --------------------------------------------------------------- */}
          {/* CARD 3: Alpha Yellow (Learn with Games - Trophy/Logo Yellow)     */}
          {/* --------------------------------------------------------------- */}
          <div className="relative rounded-[2.5rem] bg-[#FFCC07] p-8 sm:p-9 min-h-[380px] flex flex-col justify-between overflow-hidden shadow-lg shadow-amber-950/5 transition-transform duration-300 hover:-translate-y-2">
            {/* Top Row: Left Pale Yellow Badge + Right 4x5 Dot Grid */}
            <div className="flex items-start justify-between relative z-10">
              {/* Pale Yellow Scalloped Starburst Badge with Gamepad Icon */}
              <div className="relative size-16 flex items-center justify-center">
                <ScallopedBadge className="w-full h-full text-white/80" />
                <Gamepad2 className="absolute size-6 text-slate-900" />
              </div>

              {/* White Dot Grid on top-right */}
              <div className="absolute top-2 right-4 pointer-events-none">
                <DotGrid className="w-20 h-24" />
              </div>
            </div>

            {/* Bottom Content */}
            <div className="relative z-10 pt-16">
              <h3 className="text-2xl sm:text-3xl font-semibold font-sans text-slate-950 mb-2 leading-tight">
                Belajar dengan{' '}
                <span className="font-sans italic font-normal text-slate-950">
                  Game
                </span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-900/90 leading-relaxed font-medium">
                {content.card3Desc ||
                  'Metode gamifikasi modern yang membuat anak antusias memecahkan tantangan setiap hari!'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
