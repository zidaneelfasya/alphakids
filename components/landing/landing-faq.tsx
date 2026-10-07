'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion, type Transition } from 'motion/react';
import type { FaqSectionContent } from '@/lib/cms';

interface LandingFaqProps {
  content: FaqSectionContent;
}

function AnimatedAnswerText({
  text,
  shouldReduceMotion,
}: {
  text: string;
  shouldReduceMotion: boolean | null;
}) {
  const words = text.split(' ');

  if (shouldReduceMotion) {
    return <p>{text}</p>;
  }

  return (
    <p className="leading-relaxed">
      {words.map((word, wIdx) => (
        <motion.span
          key={wIdx}
          initial={{ opacity: 0, filter: 'blur(6px)', y: 3 }}
          animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          transition={{
            duration: 0.32,
            delay: wIdx * 0.016, // Staggered fade & blur reveal from left to right
            ease: 'easeOut',
          }}
          className={`inline-block ${
            wIdx === words.length - 1 ? '' : 'mr-[0.28em]'
          } will-change-[opacity,filter,transform]`}
        >
          {word}
        </motion.span>
      ))}
    </p>
  );
}

export function LandingFaq({ content }: LandingFaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const shouldReduceMotion = useReducedMotion();

  const toggle = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  const smoothTransition: Transition = {
    duration: shouldReduceMotion ? 0 : 0.35, // 350ms smooth transition
    ease: 'easeOut',
  };

  // Playful Tri-color styling matching Alpha Kids (Cyan, Pink, Yellow)
  // Number badges use soft tints, while Chevron circular buttons use solid full brand colors
  const itemColorStyles = [
    {
      badgeBg: 'bg-[#E8F8FA] dark:bg-cyan-950/60',
      badgeText: 'text-[#21b1db]',
      chevronCircleBg: 'bg-[#21b1db] text-white shadow-md shadow-[#21b1db]/25',
    },
    {
      badgeBg: 'bg-[#FDF0F5] dark:bg-pink-950/60',
      badgeText: 'text-[#ef599a]',
      chevronCircleBg: 'bg-[#ef599a] text-white shadow-md shadow-[#ef599a]/25',
    },
    {
      badgeBg: 'bg-[#FEF9C3] dark:bg-amber-950/60',
      badgeText: 'text-amber-800 dark:text-[#FFCC07]',
      chevronCircleBg: 'bg-[#FFCC07] text-slate-950 shadow-md shadow-amber-400/25',
    },
  ];

  return (
    <section id="faq" className="py-20 sm:py-28 relative overflow-hidden bg-slate-50/60 dark:bg-slate-900/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* ============================================================= */}
          {/* LEFT COLUMN: Title, Subtitle, & Parent Support Card            */}
          {/* ============================================================= */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 lg:sticky lg:top-28 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F8FA] dark:bg-cyan-950/60 text-[#0d89a4] dark:text-cyan-300 text-xs sm:text-sm font-semibold uppercase tracking-wider">
              <span>{content.badge || 'Tanya Jawab'}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold font-sans text-slate-900 dark:text-white tracking-tight leading-[1.18]">
              {content.title || 'Pertanyaan yang Sering Diajukan Orang Tua'}
            </h2>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 font-normal leading-relaxed">
              {content.subtitle ||
                'Segala hal yang perlu Ayah & Bunda ketahui tentang metode belajar, kurikulum, jadwal, dan manfaat belajar di Alpha Kids.'}
            </p>

            {/* Parent Support Quick Help Box */}
            
          </motion.div>

          {/* ============================================================= */}
          {/* RIGHT COLUMN: FAQ Accordion List                               */}
          {/* ============================================================= */}
          <div className="lg:col-span-7 space-y-4">
            {content.items.map((item, idx) => {
              const isOpen = openIndex === idx;
              const itemStyle = itemColorStyles[idx % 3];

              return (
                <motion.div
                  key={idx}
                  initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.45, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className={`overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border transition-all duration-350 ease-out ${
                    isOpen
                      ? 'border-slate-200 dark:border-slate-700/80 -translate-y-1 sm:-translate-y-1.5 shadow-xl shadow-black/[0.08] dark:shadow-black/50'
                      : 'border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md hover:shadow-black/[0.05] dark:hover:shadow-black/30 hover:-translate-y-0.5'
                  }`}
                >
                  <button
                    type="button"
                    id={`faq-trigger-${idx}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${idx}`}
                    onClick={() => toggle(idx)}
                    className="w-full flex items-center justify-between p-5 sm:p-6 text-left font-sans font-semibold text-base sm:text-lg text-slate-950 dark:text-white transition-colors gap-4 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
                  >
                    {/* Left: Badge Number & Question Title */}
                    <div className="flex items-center gap-3.5 flex-1 min-w-0 pr-2">
                      <span
                        className={`size-7 sm:size-8 rounded-xl ${itemStyle.badgeBg} ${itemStyle.badgeText} flex items-center justify-center text-xs sm:text-sm font-semibold shrink-0`}
                      >
                        {idx + 1}
                      </span>
                      <span className="leading-snug text-slate-900 dark:text-white">
                        {item.question}
                      </span>
                    </div>

                    {/* Right: Circular Chevron Button with Solid Tri-Color Shape */}
                    <div
                      className={`size-8 sm:size-9 rounded-full ${itemStyle.chevronCircleBg} flex items-center justify-center shrink-0 transition-transform duration-300 hover:scale-105`}
                    >
                      <motion.span
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={smoothTransition}
                        className="flex items-center justify-center"
                      >
                        <ChevronDown className="size-4 sm:size-4.5 stroke-[2.5]" />
                      </motion.span>
                    </div>
                  </button>

                  {/* Accordion Answer Content (Spans Full Width of the Card) */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-answer-${idx}`}
                        role="region"
                        aria-labelledby={`faq-trigger-${idx}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={smoothTransition}
                        className="overflow-hidden"
                      >
                        <div className="px-5 sm:px-6 pb-6 pt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80">
                          <AnimatedAnswerText
                            text={item.answer}
                            shouldReduceMotion={shouldReduceMotion}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
