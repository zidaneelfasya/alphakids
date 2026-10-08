'use client';

import { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { BlogItem } from '@/lib/cms';
import { BlogCard } from '@/components/blog/blog-card';

interface BlogExplorerProps {
  blogs: BlogItem[];
  initialCategory?: string;
  initialQuery?: string;
}

export function BlogExplorer({
  blogs,
  initialCategory = 'Semua',
  initialQuery = '',
}: BlogExplorerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialCategory || 'Semua'
  );
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery || '');
  const shouldReduceMotion = useReducedMotion();

  // Extract unique tags/categories from blogs
  const categories = useMemo(() => {
    const tags = Array.from(
      new Set(
        blogs
          .map((b) => b.tag?.trim())
          .filter((t): t is string => Boolean(t && t.length > 0))
      )
    );
    return ['Semua', ...tags];
  }, [blogs]);

  // Filter blogs by tag and search query
  const filteredBlogs = useMemo(() => {
    return blogs.filter((item) => {
      const matchesCategory =
        selectedCategory === 'Semua' ||
        item.tag?.toLowerCase() === selectedCategory.toLowerCase();

      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const titleMatch = item.title.toLowerCase().includes(q);
      const excerptMatch = item.excerpt.toLowerCase().includes(q);
      const authorMatch = item.author?.toLowerCase().includes(q) ?? false;
      const tagMatch = item.tag?.toLowerCase().includes(q) ?? false;

      return titleMatch || excerptMatch || authorMatch || tagMatch;
    });
  }, [blogs, selectedCategory, searchQuery]);

  const isFiltered = selectedCategory !== 'Semua' || searchQuery.trim() !== '';

  const handleResetFilters = () => {
    setSelectedCategory('Semua');
    setSearchQuery('');
  };

  return (
    <div className="space-y-8">
      {/* Search & Filter Control Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-3 sm:p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Filter Pills with Floating Pink Active Pill (Generous py-2.5 to prevent shadow clipping) */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none w-full md:w-auto py-2.5 px-1">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`relative px-4.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'text-white -translate-y-0.5'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100/90 dark:hover:bg-slate-800/90 active:scale-95'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeBlogCategoryPill"
                    className="absolute inset-0 rounded-full bg-[#ef599a] shadow-md shadow-black/10 dark:shadow-black/40 z-0"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <span className="relative z-10">{cat === 'Semua' ? 'Semua Artikel' : cat}</span>
              </button>
            );
          })}
        </div>

        {/* Search Input (Alpha Pink focus ring) */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="size-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari judul artikel..."
            className="w-full pl-9 pr-9 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ef599a]/30 focus:border-[#ef599a] transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 cursor-pointer"
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
            {filteredBlogs.length}
          </span>{' '}
          artikel
          {selectedCategory !== 'Semua' && (
            <span>
              {' '}dalam topik{' '}
              <span className="font-semibold text-[#ef599a]">
                &quot;{selectedCategory}&quot;
              </span>
            </span>
          )}
          {searchQuery && (
            <span>
              {' '}dengan kata kunci{' '}
              <span className="font-semibold text-slate-900 dark:text-white">
                &quot;{searchQuery}&quot;
              </span>
            </span>
          )}
        </div>

        {isFiltered && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="text-xs font-semibold text-[#ef599a] hover:text-[#df488a] underline underline-offset-4 cursor-pointer"
          >
            Reset Filter
          </button>
        )}
      </div>

      {/* Blog Cards Grid */}
      {filteredBlogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredBlogs.map((item) => (
            <BlogCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center max-w-lg mx-auto">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2">
            Tidak ada artikel ditemukan
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
            Tidak ada artikel yang cocok dengan filter atau kata kunci pencarian Anda. Coba kata kunci lain atau reset filter.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="px-5 py-2 rounded-full text-xs font-semibold bg-[#ef599a] hover:bg-[#df488a] text-white transition-all cursor-pointer shadow-md shadow-[#ef599a]/20"
          >
            Lihat Semua Artikel
          </button>
        </div>
      )}
    </div>
  );
}
