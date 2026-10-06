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

  return (
    <section id="faq" className="py-20 relative overflow-hidden bg-slate-50/60 dark:bg-slate-900/40">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F8FA] dark:bg-cyan-950/60 text-[#0d89a4] dark:text-cyan-300 text-xs sm:text-sm font-semibold uppercase tracking-wider">
            <span>{content.badge}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold font-sans text-slate-900 dark:text-white tracking-tight leading-tight">
            {content.title}
          </h2>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 font-normal">
            {content.subtitle}
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {content.items.map((item, idx) => {
            const isOpen = openIndex === idx;
            const itemColorStyles = [
              { bg: 'bg-[#E8F8FA] dark:bg-cyan-950/60', text: 'text-[#21b1db]' },
              { bg: 'bg-[#FDF0F5] dark:bg-pink-950/60', text: 'text-[#ef599a]' },
              { bg: 'bg-[#FEF9C3] dark:bg-amber-950/60', text: 'text-amber-800 dark:text-[#FFCC07]' },
            ];
            const itemStyle = itemColorStyles[idx % 3];

            return (
              <div
                key={idx}
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
                  className="w-full flex items-center p-5 sm:p-6 text-left font-sans font-semibold text-base sm:text-lg text-slate-900 dark:text-white transition-colors gap-3.5 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
                >
                  {/* Left Animated Chevron (pointing up when closed, pointing down when open) */}
                  <motion.span
                    animate={{ rotate: isOpen ? 0 : 180 }}
                    transition={smoothTransition}
                    className="shrink-0 flex items-center justify-center text-slate-700 dark:text-slate-300"
                  >
                    <ChevronDown className="size-5" />
                  </motion.span>

                  {/* Badge Number */}
                  <span
                    className={`size-7 rounded-xl ${itemStyle.bg} ${itemStyle.text} flex items-center justify-center text-xs font-semibold shrink-0`}
                  >
                    {idx + 1}
                  </span>

                  {/* Question Title */}
                  <span className="leading-snug flex-1">{item.question}</span>
                </button>

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
                      <div className="px-6 pb-6 pt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80">
                        <div className="pl-0 sm:pl-9">
                          <AnimatedAnswerText
                            text={item.answer}
                            shouldReduceMotion={shouldReduceMotion}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
