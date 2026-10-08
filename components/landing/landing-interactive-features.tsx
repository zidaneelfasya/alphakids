'use client';

import React, { useRef } from 'react';
import { Lightbulb, Gamepad2, ClipboardCheck } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'motion/react';
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

function InteractiveTiltCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Crisp, dampened spring parameters
  const springConfig = { stiffness: 320, damping: 28 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div style={{ perspective: 1000 }} className="h-full">
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        className={className}
      >
        {children}
      </motion.div>
    </div>
  );
}

export function LandingInteractiveFeatures({ content }: LandingInteractiveFeaturesProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="fitur" className="py-16 sm:py-24 bg-white dark:bg-slate-950 overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* ================================================================= */}
        {/* SECTION HEADER ROW (LEFT TITLE + RIGHT CLOUD PILLS)               */}
        {/* ================================================================= */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14"
        >
          <div>
            <h2 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-semibold font-sans tracking-tight text-slate-950 dark:text-white leading-[1.15]">
              {content?.titlePart1 || 'Fitur'}{' '}
              <span className="font-sans italic font-normal text-[#21b1db]">
                {content?.titleHighlight || 'interaktif'}
              </span>{' '}
              <br />
              {content?.titlePart2 || 'unggulan kami'}
            </h2>
          </div>

          {/* Right Floating Cloud with 3 Colorful Tilted Pills */}
          <div className="hidden md:block shrink-0">
            <CloudWithPills />
          </div>
        </motion.div>

        {/* ================================================================= */}
        {/* 3 ICONIC ALPHA KIDS CONTRAST CARDS WITH INTERACTIVE 3D TILT       */}
        {/* ================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {/* --------------------------------------------------------------- */}
          {/* CARD 1: Alpha Cyan #21b1db (Quiz Interaktif)                   */}
          {/* --------------------------------------------------------------- */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.55, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="h-full"
          >
            <InteractiveTiltCard className="relative rounded-[2.5rem] bg-[#21b1db] text-white p-6 sm:p-7 lg:p-7 xl:p-9 min-h-[380px] h-full flex flex-col justify-between overflow-hidden shadow-2xl shadow-[#21b1db]/25 select-none cursor-default">
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
                <h3 className="text-xl sm:text-2xl xl:text-3xl font-semibold font-sans text-white mb-2 leading-tight">
                  {content?.card1Title || 'Quiz'}{' '}
                  <span className="font-sans italic font-normal text-white">
                    {content?.card1TitleHighlight || 'Interaktif'}
                  </span>
                </h3>
                <p className="text-xs sm:text-sm text-cyan-50 leading-relaxed font-medium">
                  {content?.card1Desc ||
                    'Uji pemahaman si kecil melalui kuis seru berhadiah poin petualang dan lencana prestasi!'}
                </p>
              </div>
            </InteractiveTiltCard>
          </motion.div>

          {/* --------------------------------------------------------------- */}
          {/* CARD 2: Alpha Pink #ef599a (Aktivitas Kreatif)                  */}
          {/* --------------------------------------------------------------- */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.55, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="h-full"
          >
            <InteractiveTiltCard className="relative rounded-[2.5rem] bg-[#ef599a] text-white p-6 sm:p-7 lg:p-7 xl:p-9 min-h-[380px] h-full flex flex-col justify-between overflow-hidden shadow-2xl shadow-[#ef599a]/25 select-none cursor-default">
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
                <h3 className="text-xl sm:text-2xl xl:text-3xl font-semibold font-sans text-white mb-2 leading-tight">
                  {content?.card2Title || 'Aktivitas'}{' '}
                  <span className="font-sans italic font-normal text-white">
                    {content?.card2TitleHighlight || 'Kreatif'}
                  </span>
                </h3>
                <p className="text-xs sm:text-sm text-pink-50 leading-relaxed font-medium">
                  {content?.card2Desc ||
                    'Eksplorasi coding visual, perakitan robotika, dan pembuatan game yang mengasah logika komputasi.'}
                </p>
              </div>
            </InteractiveTiltCard>
          </motion.div>

          {/* --------------------------------------------------------------- */}
          {/* CARD 3: Alpha Yellow (Learn with Games - Trophy/Logo Yellow)     */}
          {/* --------------------------------------------------------------- */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.55, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="h-full"
          >
            <InteractiveTiltCard className="relative rounded-[2.5rem] bg-[#FFCC07] p-6 sm:p-7 lg:p-7 xl:p-9 min-h-[380px] h-full flex flex-col justify-between overflow-hidden shadow-lg shadow-amber-950/5 select-none cursor-default">
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
                <h3 className="text-xl sm:text-2xl xl:text-3xl font-semibold font-sans text-slate-950 mb-2 leading-tight">
                  {content?.card3Title || 'Belajar dengan'}{' '}
                  <span className="font-sans italic font-normal text-slate-950">
                    {content?.card3TitleHighlight || 'Game'}
                  </span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-900/90 leading-relaxed font-medium">
                  {content?.card3Desc ||
                    'Metode gamifikasi modern yang membuat anak antusias memecahkan tantangan setiap hari!'}
                </p>
              </div>
            </InteractiveTiltCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
