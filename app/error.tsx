'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { RotateCcw, Home, AlertCircle } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error securely
    console.error('[AlphaKids ErrorBoundary]:', error);
  }, [error]);

  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col justify-center items-center bg-[#FFFDF9] dark:bg-slate-950 px-4 text-center relative overflow-hidden font-sans selection:bg-pink-200 selection:text-pink-900">
      <div className="relative z-10 max-w-lg mx-auto py-12 px-6 sm:px-10 rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-900/5">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 text-xs font-semibold mb-6">
          <AlertCircle className="size-4 shrink-0" />
          <span>Kendala Sementara</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-semibold font-sans tracking-tight text-slate-900 dark:text-white leading-[1.2] mb-4">
          Terjadi Sedikit{' '}
          <span className="font-sans italic font-normal text-[#ef599a]">
            Gangguan
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-normal leading-relaxed mb-8">
          Sistem sedang menyegarkan kembali komponen yang diperlukan. Silakan coba muat ulang atau kembali ke halaman beranda.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-2.5 rounded-full bg-[#21b1db] hover:bg-[#1da0c7] text-white font-semibold text-sm shadow-md shadow-[#21b1db]/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <RotateCcw className="size-4" />
            <span>Coba Lagi</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border border-slate-200 dark:border-slate-800 hover:border-[#21b1db] text-slate-700 dark:text-slate-300 hover:text-[#21b1db] font-semibold text-sm transition-colors"
          >
            <Home className="size-4" />
            <span>Beranda</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
