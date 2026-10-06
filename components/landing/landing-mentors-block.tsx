'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ScallopedBadge, DotGrid } from '@/components/landing/wonder-decorations';
import type { MentorsSectionContent } from '@/lib/cms';

interface LandingMentorsBlockProps {
  content: MentorsSectionContent;
}

export function LandingMentorsBlock({ content }: LandingMentorsBlockProps) {
  const shouldReduceMotion = useReducedMotion();
  const [currentPage, setCurrentPage] = useState(0);

  // 8 Unique Mentors featuring orang1.webp through orang8.webp with unique abstract shapes
  const allMentors = [
    {
      name: content.mentor1Name || 'Kak Budi Prasetyo',
      role: content.mentor1Role || 'Eksplorasi Sains & Robotika',
      avatar: '/assets/img/orang1.webp',
      shape: '63% 37% 54% 46% / 40% 58% 42% 60%',
      decoration: null,
    },
    {
      name: content.mentor2Name || 'Kak Sarah Amelia',
      role: content.mentor2Role || 'Spesialis Koding & Game Dev',
      avatar: '/assets/img/orang2.webp',
      shape: '40% 60% 38% 62% / 62% 38% 62% 38%',
      decoration: (
        <svg
          viewBox="0 0 100 100"
          className="absolute -top-3 -left-3 size-14 text-[#FFCC07] pointer-events-none z-0"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
        >
          <path d="M 50,50 m -15,0 a 15,15 0 1,0 30,0 a 15,15 0 1,0 -30,0 m -10,0 a 25,25 0 1,0 50,0 a 25,25 0 1,0 -50,0" />
        </svg>
      ),
    },
    {
      name: 'Kak Jacob Rama',
      role: 'Logika & Matematika Kreatif',
      avatar: '/assets/img/orang3.webp',
      shape: '68% 32% 60% 40% / 36% 64% 36% 64%',
      decoration: (
        <div className="absolute -top-4 -right-4 pointer-events-none opacity-80 scale-75 z-0">
          <DotGrid className="w-16 h-20" />
        </div>
      ),
    },
    {
      name: content.mentor3Name || 'Kak Nadia Utami',
      role: content.mentor3Role || 'Seni Digital & Animasi',
      avatar: '/assets/img/orang4.webp',
      shape: '38% 62% 65% 35% / 58% 40% 60% 42%',
      decoration: null,
    },
    {
      name: 'Kak Kevin Alamsyah',
      role: 'Juara ONMIPA & Fisika Seru',
      avatar: '/assets/img/orang5.webp',
      shape: '55% 45% 68% 32% / 42% 60% 40% 58%',
      decoration: (
        <div className="absolute -top-3.5 -left-3.5 pointer-events-none opacity-80 scale-75 z-0">
          <ScallopedBadge className="size-14 text-[#FFCC07]" />
        </div>
      ),
    },
    {
      name: 'Kak Dimas Prayoga',
      role: 'Web Dev & Algoritma Logika',
      avatar: '/assets/img/orang6.webp',
      shape: '42% 58% 35% 65% / 58% 42% 58% 42%',
      decoration: null,
    },
    {
      name: 'Kak Zahra Aulia',
      role: 'Desain Interaktif & UI Karakter',
      avatar: '/assets/img/orang7.webp',
      shape: '65% 35% 48% 52% / 38% 62% 38% 62%',
      decoration: (
        <div className="absolute -top-4 -right-4 pointer-events-none opacity-80 scale-75 z-0">
          <DotGrid className="w-16 h-20" />
        </div>
      ),
    },
    {
      name: 'Kak Fajar Ramadhan',
      role: 'Robotika Cerdas & IoT Cilik',
      avatar: '/assets/img/orang8.webp',
      shape: '36% 64% 58% 42% / 50% 38% 62% 50%',
      decoration: null,
    },
  ];

  const MENTORS_PER_PAGE = 4;
  const totalPages = Math.ceil(allMentors.length / MENTORS_PER_PAGE);

  const handleNext = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const handlePrev = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const visibleMentors = allMentors.slice(
    currentPage * MENTORS_PER_PAGE,
    (currentPage + 1) * MENTORS_PER_PAGE
  );

  return (
    <section id="mentor" className="py-24 sm:py-32 bg-[#21b1db] text-white relative overflow-hidden">
      {/* Top-Left: Bright Yellow Scalloped Sunburst Badge */}
      <div className="absolute top-8 left-8 sm:top-14 sm:left-14 z-10 pointer-events-none">
        <ScallopedBadge className="size-20 sm:size-24 text-[#FFCC07]" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-20">
        {/* Centered Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
          <h2 className="text-3xl sm:text-5xl lg:text-[3.25rem] font-semibold font-sans tracking-tight leading-[1.2] text-white">
            Misi kami adalah membantu anak <br />
            <span className="font-sans italic font-normal text-[#FFCC07]">
              menemukan kegembiraan belajar kreatif
            </span>{' '}
            <br />
            dan tumbuh menjadi generasi juara.
          </h2>
        </div>

        {/* Mentors Row with Navigation Controls */}
        <div className="relative flex items-center justify-center px-0 sm:px-6 md:px-10">
          {/* Left Arrow Button */}
          <button
            type="button"
            onClick={handlePrev}
            className="flex absolute -left-2 sm:-left-6 md:-left-8 lg:-left-12 z-30 size-11 sm:size-12 rounded-full bg-white/15 hover:bg-white/30 active:scale-90 text-white items-center justify-center transition-all shadow-xl backdrop-blur-md  cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Mentor sebelumnya"
          >
            <ChevronLeft className="size-6 transition-transform group-hover:-translate-x-0.5" />
          </button>

          {/* Mentors Animated Grid Container with Staggered Blur Reveal */}
          <div className="w-full max-w-5xl overflow-hidden py-4">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={currentPage}
                initial="initial"
                animate="animate"
                exit="exit"
                className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 w-full"
              >
                {visibleMentors.map((m, idx) => (
                  <motion.div
                    key={m.name}
                    initial={
                      shouldReduceMotion
                        ? { opacity: 0 }
                        : {
                            opacity: 0,
                            filter: 'blur(14px)',
                            y: 12,
                            scale: 0.94,
                          }
                    }
                    animate={
                      shouldReduceMotion
                        ? { opacity: 1 }
                        : {
                            opacity: 1,
                            filter: 'blur(0px)',
                            y: 0,
                            scale: 1,
                          }
                    }
                    exit={
                      shouldReduceMotion
                        ? { opacity: 0 }
                        : {
                            opacity: 0,
                            filter: 'blur(10px)',
                            y: -8,
                            scale: 0.96,
                          }
                    }
                    transition={{
                      duration: shouldReduceMotion ? 0 : 0.4,
                      delay: shouldReduceMotion ? 0 : idx * 0.08, // Sequential staggered blur reveal
                      ease: [0.22, 1, 0.36, 1], // Fluid cubic-bezier
                    }}
                    className="flex flex-col items-center text-center group will-change-[filter,opacity,transform]"
                  >
                    {/* Abstract Organic Avatar (No border, unique organic shape) */}
                    <div className="relative mb-4">
                      {m.decoration}
                      <div
                        style={{ borderRadius: m.shape }}
                        className="relative z-10 size-32 sm:size-36 md:size-40 overflow-hidden shadow-xl shadow-cyan-950/25 transition-transform duration-300 group-hover:scale-105"
                      >
                        <Image
                          src={m.avatar}
                          alt={m.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 160px, 180px"
                        />
                      </div>
                    </div>

                    {/* Name & Role */}
                    <h3 className="font-sans font-semibold text-base sm:text-lg text-white mb-1">
                      {m.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-cyan-100 font-medium">
                      {m.role}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Arrow Button */}
          <button
            type="button"
            onClick={handleNext}
            className="flex absolute -right-2 sm:-right-6 md:-right-8 lg:-right-12 z-30 size-11 sm:size-12 rounded-full bg-white/15 hover:bg-white/30 active:scale-90 text-white items-center justify-center transition-all shadow-xl backdrop-blur-md cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Mentor selanjutnya"
          >
            <ChevronRight className="size-6 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* Carousel Dot Indicators */}
        <div className="flex items-center justify-center gap-2 pt-6 sm:pt-8 z-30">
          {Array.from({ length: totalPages }).map((_, pageIdx) => (
            <button
              key={pageIdx}
              type="button"
              onClick={() => setCurrentPage(pageIdx)}
              aria-label={`Buka halaman mentor ${pageIdx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                pageIdx === currentPage
                  ? 'w-7 bg-[#FFCC07] shadow-sm shadow-amber-950/20'
                  : 'w-2 bg-white/35 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
