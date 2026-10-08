'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Linkedin } from 'lucide-react';

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-2.909 2.879 2.896 2.896 0 0 1-2.879-2.909 2.896 2.896 0 0 1 2.879-2.88c.318 0 .626.046.917.13V9.408a6.34 6.34 0 0 0-.917-.066A6.333 6.333 0 0 0 3.13 15.675 6.333 6.333 0 0 0 9.465 22a6.333 6.333 0 0 0 6.335-6.325V9.012a8.17 8.17 0 0 0 4.789 1.517v-3.48a4.83 4.83 0 0 1-1-.363z" />
    </svg>
  );
}

export function LandingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#FFFDF9] dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 min-h-[520px] sm:min-h-[580px] lg:min-h-[620px] flex flex-col justify-between pt-10 sm:pt-12 lg:pt-14 pb-4 sm:pb-5 overflow-hidden">
      {/* ================================================================= */}
      {/* RIGHT SIDE BACKGROUND LOGO WATERMARK WITH GRADIENT & TRANSPARENCY  */}
      {/* ================================================================= */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute right-0 top-1/2 -translate-y-1/2 translate-x-[18%] sm:translate-x-[12%] w-[440px] sm:w-[600px] md:w-[740px] lg:w-[760px] xl:w-[880px] h-[440px] sm:h-[600px] md:h-[740px] lg:h-[760px] xl:h-[880px] opacity-15 dark:opacity-10 z-0 overflow-hidden"
        style={{
          maskImage: 'linear-gradient(to left, rgba(0,0,0,0.85) 15%, rgba(0,0,0,0) 80%)',
          WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,0.85) 15%, rgba(0,0,0,0) 80%)',
        }}
      >
        <div className="relative w-full h-full">
          <Image
            src="/assets/img/logo.png"
            alt=""
            fill
            className="object-contain object-right"
            priority={false}
          />
        </div>
      </div>

      <div className="w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 flex-1">
        {/* ================================================================= */}
        {/* TOP SECTION: 5 MULTI-COLOR COLUMNS + RIGHT BRAND PROFILE          */}
        {/* ALIGNED TO VERTICAL START (TOP POSITION)                          */}
        {/* ================================================================= */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-10 lg:gap-14 pt-1 sm:pt-2">
          {/* Left: 5 Themed Navigation Columns (Biru Muda, Pink, Kuning) */}
          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-5 gap-5 sm:gap-6 lg:gap-5 xl:gap-8 flex-1 w-full items-start">
            {/* Column 1: Biru Muda (#21b1db) */}
            <div className="space-y-4">
              <h4 className="font-sans font-semibold text-xs sm:text-sm tracking-wider uppercase text-[#21b1db]">
                Program
              </h4>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-900 dark:text-slate-400">
                <li>
                  <Link href="/programs" className="hover:text-[#21b1db] transition-colors">
                    Coding Game
                  </Link>
                </li>
                <li>
                  <Link href="/programs" className="hover:text-[#21b1db] transition-colors">
                    Robotika Pintar
                  </Link>
                </li>
                <li>
                  <Link href="/programs" className="hover:text-[#21b1db] transition-colors">
                    Seni Digital
                  </Link>
                </li>
                <li>
                  <Link href="/programs" className="hover:text-[#21b1db] transition-colors">
                    Logika & Sains
                  </Link>
                </li>
                <li>
                  <Link href="/programs" className="hover:text-[#21b1db] transition-colors">
                    Semua Kelas
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: Pink (#ef599a) */}
            <div className="space-y-4">
              <h4 className="font-sans font-semibold text-xs sm:text-sm tracking-wider uppercase text-[#ef599a]">
                Fitur
              </h4>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-900 dark:text-slate-400">
                <li>
                  <Link href="#fitur" className="hover:text-[#ef599a] transition-colors">
                    Quiz Interaktif
                  </Link>
                </li>
                <li>
                  <Link href="#fitur" className="hover:text-[#ef599a] transition-colors">
                    Aktivitas Kreatif
                  </Link>
                </li>
                <li>
                  <Link href="#fitur" className="hover:text-[#ef599a] transition-colors">
                    Game Belajar
                  </Link>
                </li>
                <li>
                  <Link href="#fitur" className="hover:text-[#ef599a] transition-colors">
                    Poin & Lencana
                  </Link>
                </li>
                <li>
                  <Link href="#fitur" className="hover:text-[#ef599a] transition-colors">
                    Portofolio
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-[#ef599a] transition-colors">
                    Artikel & Blog
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Kuning (#ca8a04 / #FFCC07) */}
            <div className="space-y-4">
              <h4 className="font-sans font-semibold text-xs sm:text-sm tracking-wider uppercase text-[#ca8a04] dark:text-[#FFCC07]">
                Keunggulan
              </h4>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-900 dark:text-slate-400">
                <li>
                  <Link href="#keunggulan" className="hover:text-[#ca8a04] dark:hover:text-[#FFCC07] transition-colors">
                    Metode Asyik
                  </Link>
                </li>
                <li>
                  <Link href="#keunggulan" className="hover:text-[#ca8a04] dark:hover:text-[#FFCC07] transition-colors">
                    Proyek Nyata
                  </Link>
                </li>
                <li>
                  <Link href="#mentor" className="hover:text-[#ca8a04] dark:hover:text-[#FFCC07] transition-colors">
                    Kakak Mentor
                  </Link>
                </li>
                <li>
                  <Link href="#keunggulan" className="hover:text-[#ca8a04] dark:hover:text-[#FFCC07] transition-colors">
                    Sertifikat
                  </Link>
                </li>
                <li>
                  <Link href="#keunggulan" className="hover:text-[#ca8a04] dark:hover:text-[#FFCC07] transition-colors">
                    Generasi Juara
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Biru Muda (#21b1db) */}
            <div className="space-y-4">
              <h4 className="font-sans font-semibold text-xs sm:text-sm tracking-wider uppercase text-[#21b1db]">
                Bantuan
              </h4>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-900 dark:text-slate-400">
                <li>
                  <a
                    href="https://wa.me/6281234567890"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#21b1db] transition-colors"
                  >
                    Konsultasi WA
                  </a>
                </li>
                <li>
                  <Link href="#faq" className="hover:text-[#21b1db] transition-colors">
                    Tanya Jawab (FAQ)
                  </Link>
                </li>
                <li>
                  <Link href="/auth/login" className="hover:text-[#21b1db] transition-colors">
                    Masuk Akun
                  </Link>
                </li>
                <li>
                  <Link href="/auth/sign-up" className="hover:text-[#21b1db] transition-colors">
                    Daftar Peserta
                  </Link>
                </li>
                <li>
                  <a href="mailto:halo@alphakids.id" className="hover:text-[#21b1db] transition-colors">
                    Email Resmi
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 5: Pink (#ef599a) */}
            <div className="space-y-4">
              <h4 className="font-sans font-semibold text-xs sm:text-sm tracking-wider uppercase text-[#ef599a]">
                Kebijakan
              </h4>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-900 dark:text-slate-400">
                <li>
                  <Link href="/terms" className="hover:text-[#ef599a] transition-colors">
                    Ketentuan
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-[#ef599a] transition-colors">
                    Privasi
                  </Link>
                </li>
                <li>
                  <Link href="/refund" className="hover:text-[#ef599a] transition-colors">
                    Pengembalian
                  </Link>
                </li>
                <li>
                  <Link href="/safety" className="hover:text-[#ef599a] transition-colors">
                    Keamanan
                  </Link>
                </li>
                <li>
                  <Link href="/license" className="hover:text-[#ef599a] transition-colors">
                    Lisensi
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Right: AlphaKids Brand Section with Logo, Tagline, & Social Media */}
          <div className="w-full lg:w-80 shrink-0 space-y-5 pt-2 lg:pt-0 relative z-10">
            {/* Logo + Brand Name */}
            <div className="flex items-center gap-3">
              <div className="relative size-11 shrink-0">
                <Image
                  src="/assets/img/logo.png"
                  alt="Alpha Kids Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-sans font-semibold text-2xl tracking-tight text-slate-900 dark:text-white">
                Alpha<span className="text-[#21b1db]">Kids</span>
              </span>
            </div>

            {/* Brand Description */}
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
              Platform program digital interaktif untuk mencetak generasi anak Indonesia yang cerdas komputasi, kreatif, dan berkarakter juara.
            </p>

            {/* Social Media Icons (Instagram, LinkedIn, TikTok) */}
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://instagram.com/alphakids.id"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram AlphaKids"
                className="size-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center hover:bg-[#ef599a]/15 hover:text-[#ef599a] transition-all hover:scale-105 active:scale-95 shadow-xs"
              >
                <Instagram className="size-4.5" />
              </a>

              <a
                href="https://linkedin.com/company/alphakids"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn AlphaKids"
                className="size-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center hover:bg-[#21b1db]/15 hover:text-[#21b1db] transition-all hover:scale-105 active:scale-95 shadow-xs"
              >
                <Linkedin className="size-4.5" />
              </a>

              <a
                href="https://tiktok.com/@alphakids.id"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok AlphaKids"
                className="size-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center hover:bg-slate-900 hover:text-white dark:hover:bg-slate-700 transition-all hover:scale-105 active:scale-95 shadow-xs"
              >
                <TikTokIcon className="size-4.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* BOTTOM SECTION: FULL-WIDTH DIVIDER & COMPACT COPYRIGHT PINNED AT BOTTOM */}
      {/* ================================================================= */}
      <div className="w-full relative z-10 mt-auto pt-16 sm:pt-20">
        {/* Full-width line spanning from left screen edge to right screen edge */}
        <div className="w-full h-px bg-slate-200/80 dark:bg-slate-800" />

        <div className="w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">          <p className="text-center text-xs text-slate-400 dark:text-slate-500 font-normal">
            &copy; {currentYear} AlphaKids. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
