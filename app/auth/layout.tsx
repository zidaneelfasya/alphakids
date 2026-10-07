import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Autentikasi Akun | Alpha Kids',
  description: 'Masuk atau daftar ke platform edukasi digital Alpha Kids.',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FFFDF9] dark:bg-slate-950 flex flex-col justify-between relative overflow-x-hidden selection:bg-cyan-200 selection:text-cyan-900">
      {/* Background Decorative Puzzle Ornaments (Consistent with Landing Hero) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Left Puzzle Ornament */}
        <div className="absolute -top-12 -left-20 w-[320px] sm:w-[480px] lg:w-[540px] aspect-square opacity-20 dark:opacity-10 rotate-12 blur-[1.5px]">
          <Image
            src="/assets/img/Ornamen Puzzle Kuning AlphaKids_revisi0.png"
            alt=""
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Right Puzzle Ornament */}
        <div className="absolute -bottom-16 -right-20 w-[300px] sm:w-[460px] lg:w-[520px] aspect-square opacity-20 dark:opacity-10 -rotate-12 blur-[1.5px]">
          <Image
            src="/assets/img/Ornamen Puzzle Putih AlphaKids_revisi0.png"
            alt=""
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Soft Frosted Glass Veil */}
        <div className="absolute inset-0 backdrop-blur-[2px] bg-[#FFFDF9]/60 dark:bg-slate-950/70" />
      </div>

      {/* Top Floating Navigation Header */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="group inline-flex items-center gap-2.5 transition-transform hover:scale-105"
        >
          <div className="relative size-9 sm:size-10 shrink-0">
            <Image
              src="/assets/img/logo.png"
              alt="Alpha Kids Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="font-semibold text-base sm:text-lg tracking-tight select-none">
            <span className="text-slate-900 dark:text-white">Alpha</span>
            <span className="text-[#21b1db]">Kids</span>
          </span>
        </Link>

        {/* Back to Home Pill Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-[#21b1db] hover:border-[#21b1db]/40 transition-all shadow-xs hover:shadow-sm"
        >
          <ArrowLeft className="size-3.5" />
          <span>Kembali ke Beranda</span>
        </Link>
      </header>

      {/* Main Auth Content Area */}
      <main className="relative z-10 flex-1 flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-5xl">
          {children}
        </div>
      </main>

      {/* Subtle Bottom Copyright */}
      <footer className="relative z-10 w-full text-center py-4 text-xs text-slate-400 dark:text-slate-600 select-none">
        <p>
          &copy; {new Date().getFullYear()} Alpha Kids — Platform Program Edukasi Digital Anak Indonesia. Seluruh hak cipta dilindungi.
        </p>
      </footer>
    </div>
  );
}
