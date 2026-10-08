'use client';

import { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ProgramCard } from '@/components/programs/program-card';

export interface CatalogProgram {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  price: number;
  promoPrice?: number | null;
  coverImage?: string | null;
  ageRange?: string | null;
  level?: string | null;
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

export interface CatalogCategory {
  id: string;
  name: string;
  slug: string;
}

interface ProgramsExplorerProps {
  programs: CatalogProgram[];
  categories: CatalogCategory[];
  initialCategory?: string;
  initialQuery?: string;
}

export function ProgramsExplorer({
  programs,
  categories,
  initialCategory = 'all',
  initialQuery = '',
}: ProgramsExplorerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialCategory || 'all'
  );
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery || '');
  const shouldReduceMotion = useReducedMotion();

  // Filter programs by category and search query
  const filteredPrograms = useMemo(() => {
    return programs.filter((prog) => {
      const matchesCategory =
        selectedCategory === 'all' || prog.category?.slug === selectedCategory;

      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const titleMatch = prog.title.toLowerCase().includes(q);
      const descMatch = prog.description?.toLowerCase().includes(q) ?? false;
      const levelMatch = prog.level?.toLowerCase().includes(q) ?? false;

      return titleMatch || descMatch || levelMatch;
    });
  }, [programs, selectedCategory, searchQuery]);

  const activeCategoryObj = categories.find((c) => c.slug === selectedCategory);
  const isFiltered = selectedCategory !== 'all' || searchQuery.trim() !== '';

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
  };

  return (
    <div className="space-y-8">
      {/* Search & Filter Control Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-3 sm:p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Filter Pills with Smooth Animated Active Pill (Generous py-2.5 to prevent shadow clipping) */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none w-full md:w-auto py-2.5 px-1">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`relative px-4.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
              selectedCategory === 'all'
                ? 'text-white -translate-y-0.5'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100/90 dark:hover:bg-slate-800/90 active:scale-95'
            }`}
          >
            {selectedCategory === 'all' && (
              <motion.span
                layoutId="activeCatalogPill"
                className="absolute inset-0 rounded-full bg-[#21b1db] shadow-md shadow-black/10 dark:shadow-black/40 z-0"
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
              />
            )}
            <span className="relative z-10">Semua Program</span>
          </button>

          {categories.map((cat) => {
            const isActive = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.slug)}
                className={`relative px-4.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'text-white -translate-y-0.5'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100/90 dark:hover:bg-slate-800/90 active:scale-95'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeCatalogPill"
                    className="absolute inset-0 rounded-full bg-[#21b1db] shadow-md shadow-black/10 dark:shadow-black/40 z-0"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <span className="relative z-10">{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Search Input (No emojis, single clean icon) */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="size-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama program..."
            className="w-full pl-9 pr-9 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#21b1db]/30 focus:border-[#21b1db] transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
              aria-label="Hapus kata kunci pencarian"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Meta Counter & Active Filter Tags */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
        <div>
          Menampilkan{' '}
          <span className="font-semibold text-slate-900 dark:text-white">
            {filteredPrograms.length}
          </span>{' '}
          program
          {activeCategoryObj && (
            <span>
              {' '}
              pada kategori{' '}
              <span className="font-semibold text-[#0e7490] dark:text-cyan-400">
                {activeCategoryObj.name}
              </span>
            </span>
          )}
          {searchQuery && (
            <span>
              {' '}
              dengan kata kunci &ldquo;
              <span className="font-semibold text-slate-900 dark:text-white">
                {searchQuery}
              </span>
              &rdquo;
            </span>
          )}
        </div>

        {isFiltered && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="font-medium text-[#ef599a] hover:text-[#df488a] transition-colors underline underline-offset-4"
          >
            Reset filter
          </button>
        )}
      </div>

      {/* Programs Grid / Empty State */}
      {filteredPrograms.length === 0 ? (
        <div className="text-center py-16 px-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 max-w-lg mx-auto shadow-xs">
          <div className="size-12 rounded-full bg-[#E8F8FA] dark:bg-cyan-950/60 text-[#21b1db] flex items-center justify-center mx-auto mb-4">
            <Search className="size-5" />
          </div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1.5">
            Program Tidak Ditemukan
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto mb-5 leading-relaxed">
            Tidak ada program yang sesuai dengan kata kunci pencarian atau kategori yang dipilih.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="inline-flex items-center justify-center px-5 py-2 rounded-full bg-[#21b1db] hover:bg-[#1da0c7] text-white text-xs font-semibold shadow-xs transition-colors"
          >
            Tampilkan Semua Program
          </button>
        </div>
      ) : (
        <motion.div
          layout={!shouldReduceMotion}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredPrograms.map((prog) => (
              <motion.div
                key={prog.id}
                layout={!shouldReduceMotion}
                initial={
                  shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.96 }
                }
                animate={{ opacity: 1, scale: 1 }}
                exit={
                  shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }
                }
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                <ProgramCard
                  id={prog.id}
                  name={prog.title}
                  slug={prog.slug}
                  description={prog.description || ''}
                  price={prog.price}
                  promoPrice={prog.promoPrice}
                  thumbnailUrl={prog.coverImage || null}
                  categoryName={prog.category?.name}
                  ageRange={prog.ageRange}
                  level={prog.level}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
