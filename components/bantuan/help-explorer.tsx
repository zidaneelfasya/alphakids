'use client';

import { useState, useMemo } from 'react';
import { Search, X, ChevronDown, HelpCircle, BookOpen, CreditCard, Sparkles, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FaqItem } from '@/lib/cms';

interface HelpTopic {
  id: string;
  name: string;
  icon: typeof HelpCircle;
}

const HELP_TOPICS: HelpTopic[] = [
  { id: 'all', name: 'Semua Pertanyaan', icon: HelpCircle },
  { id: 'daftar', name: 'Pendaftaran & Akun', icon: BookOpen },
  { id: 'bayar', name: 'Pembayaran & Promo', icon: CreditCard },
  { id: 'kelas', name: 'Kelas & Pendampingan', icon: Sparkles },
  { id: 'sertifikat', name: 'Sertifikat & Karya', icon: Award },
];

interface HelpExplorerProps {
  faqItems: FaqItem[];
}

export function HelpExplorer({ faqItems }: HelpExplorerProps) {
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Categorize or map questions into topics
  const categorizedFaqs = useMemo(() => {
    return faqItems.map((item, index) => {
      let topic = 'kelas';
      const q = item.question.toLowerCase();
      if (q.includes('daftar') || q.includes('akun') || q.includes('usia') || q.includes('mulai')) {
        topic = 'daftar';
      } else if (q.includes('bayar') || q.includes('biaya') || q.includes('harga') || q.includes('transfer') || q.includes('promo')) {
        topic = 'bayar';
      } else if (q.includes('sertifikat') || q.includes('karya') || q.includes('portofolio') || q.includes('lulus')) {
        topic = 'sertifikat';
      }
      return { ...item, originalIndex: index, topic };
    });
  }, [faqItems]);

  const filteredFaqs = useMemo(() => {
    return categorizedFaqs.filter((item) => {
      const matchesTopic = selectedTopic === 'all' || item.topic === selectedTopic;
      if (!matchesTopic) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      return (
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q)
      );
    });
  }, [categorizedFaqs, selectedTopic, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Control Bar: Topics + Search */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-3 sm:p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Pills (Floating Pill Cyan) */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none py-2.5 px-1">
          {HELP_TOPICS.map((topic) => {
            const isActive = selectedTopic === topic.id;
            return (
              <button
                key={topic.id}
                type="button"
                onClick={() => setSelectedTopic(topic.id)}
                className={`relative px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'text-white -translate-y-0.5'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100/90 dark:hover:bg-slate-800/90 active:scale-95'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeHelpTopicPill"
                    className="absolute inset-0 rounded-full bg-[#21b1db] shadow-md shadow-black/10 dark:shadow-black/40 z-0"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <span className="relative z-10">{topic.name}</span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="size-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari pertanyaan..."
            className="w-full pl-9 pr-9 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#21b1db]/30 focus:border-[#21b1db] transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 cursor-pointer"
              aria-label="Hapus kata kunci"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Counter */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
        <div>
          Menampilkan{' '}
          <span className="font-semibold text-slate-900 dark:text-white">
            {filteredFaqs.length}
          </span>{' '}
          pertanyaan
          {searchQuery && (
            <span>
              {' '}dengan kata kunci{' '}
              <strong className="text-slate-900 dark:text-white">&quot;{searchQuery}&quot;</strong>
            </span>
          )}
        </div>
        {(selectedTopic !== 'all' || searchQuery) && (
          <button
            type="button"
            onClick={() => {
              setSelectedTopic('all');
              setSearchQuery('');
            }}
            className="text-[#21b1db] hover:underline font-medium cursor-pointer"
          >
            Reset Filter
          </button>
        )}
      </div>

      {/* Accordion List (Disciplined monochrome shadows & smooth height) */}
      <div className="space-y-3">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden bg-white dark:bg-slate-900 ${
                  isOpen
                    ? 'border-slate-200 dark:border-slate-800 shadow-md shadow-black/[0.04] dark:shadow-black/40'
                    : 'border-slate-100 dark:border-slate-850 hover:border-slate-200'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="w-full py-4 sm:py-5 px-5 sm:px-6 flex items-center justify-between gap-4 text-left cursor-pointer focus:outline-none"
                >
                  <span className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white leading-snug">
                    {item.question}
                  </span>
                  <span
                    className={`size-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen
                        ? 'bg-[#E8F8FA] dark:bg-cyan-950/70 text-[#21b1db] rotate-180'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    <ChevronDown className="size-4" />
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: 'easeOut' }}
                    >
                      <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100/80 dark:border-slate-800/80 whitespace-pre-line">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 p-10 text-center bg-white dark:bg-slate-900">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Tidak ada pertanyaan yang sesuai dengan pencarian Anda.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedTopic('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-full text-xs font-semibold bg-[#21b1db] text-white hover:bg-[#1da0c7] cursor-pointer"
            >
              Lihat Semua Pertanyaan
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
