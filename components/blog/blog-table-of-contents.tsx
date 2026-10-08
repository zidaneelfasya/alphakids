'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ListOrdered } from 'lucide-react';

export interface TocItem {
  id: string;
  title: string;
  level: number;
}

interface BlogTableOfContentsProps {
  items: TocItem[];
}

export function BlogTableOfContents({ items }: BlogTableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (items.length === 0) return;

    // Set first item active initially
    if (!activeId && items[0]) {
      setActiveId(items[0].id);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        // Find visible section
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      {
        rootMargin: '-100px 0px -60% 0px',
        threshold: 0,
      }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items, activeId]);

  const scrollToHeading = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;

    const navbarOffset = 110; // floating navbar clearance
    const bodyTop = document.body.getBoundingClientRect().top;
    const elTop = el.getBoundingClientRect().top;
    const elementPosition = elTop - bodyTop;
    const offsetPosition = elementPosition - navbarOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });

    history.pushState(null, '', `#${id}`);
    setActiveId(id);
  };

  if (items.length === 0) return null;

  return (
    <div className="sticky top-28 space-y-6">
      {/* Back to Blog Catalog Link */}
      <div>
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#ef599a] dark:text-slate-400 dark:hover:text-pink-300 transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Kembali ke Blog</span>
        </Link>
      </div>

      {/* TOC Container Card */}
      <nav
        aria-label="Daftar Isi Artikel"
        className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-4 sm:p-5 shadow-xs"
      >
        <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-100 dark:border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <ListOrdered className="size-4 text-[#ef599a]" />
          <span>Daftar Isi</span>
        </div>

        <ul className="space-y-1 text-xs">
          {items.map((item) => {
            const isActive = activeId === item.id;
            return (
              <li key={item.id} className={item.level === 3 ? 'pl-3' : ''}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => scrollToHeading(e, item.id)}
                  className={`group flex items-start gap-2 py-1.5 px-2 rounded-lg transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#FDF0F5] dark:bg-pink-950/40 text-[#ef599a] dark:text-pink-300 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60 font-normal'
                  }`}
                >
                  <span
                    className={`size-1.5 rounded-full mt-1.5 shrink-0 transition-all ${
                      isActive
                        ? 'bg-[#ef599a] scale-125'
                        : 'bg-slate-300 dark:bg-slate-700 group-hover:bg-slate-400'
                    }`}
                  />
                  <span className="line-clamp-2 leading-relaxed">
                    {item.title}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
