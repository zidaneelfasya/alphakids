'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { CheckCircle2, Sparkles, Star } from 'lucide-react';
import { ScallopedBadge } from '@/components/landing/wonder-decorations';

interface AuthSplitLayoutProps {
  activeTab: 'login' | 'sign-up';
  title: string;
  subtitle: string;
  illustrationImage: string; // e.g. '/assets/img/hero1.png' or '/assets/img/cta.png'
  heroBadgeText?: string;
  showcaseTitle: React.ReactNode;
  showcaseDescription: string;
  quoteText?: string;
  quoteAuthor?: string;
  children: React.ReactNode;
}

export function AuthSplitLayout({
  activeTab,
  title,
  subtitle,
  illustrationImage,
  heroBadgeText = 'Platform Edukasi Digital Anak',
  showcaseTitle,
  showcaseDescription,
  quoteText = '“Anak saya selalu bersemangat belajar coding dan robotika setiap akhir pekan!”',
  quoteAuthor = 'Bunda Sarah — Orang Tua Murid',
  children,
}: AuthSplitLayoutProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      {/* 1. Left Showcase Column (Visible on Desktop lg:col-span-5) */}
      <div className="hidden lg:flex lg:col-span-5 flex-col justify-between rounded-[2.5rem] bg-gradient-to-b from-[#E8F8FA] via-[#FFFDF9] to-[#FDF0F5] dark:from-slate-900 dark:via-slate-850 dark:to-slate-900 p-8 xl:p-10 border border-[#EDE4F2] dark:border-slate-800 shadow-xl shadow-cyan-950/5 relative overflow-hidden select-none">
        {/* Subtle Watermark Decorations */}
        <div className="absolute top-4 right-4 pointer-events-none opacity-40">
          <ScallopedBadge className="size-16 text-[#FFCC07]" />
        </div>

        {/* Top Header & Headline */}
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 dark:bg-slate-800/90 border border-slate-200/60 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-xs">
            <Sparkles className="size-3.5 text-[#21b1db]" />
            <span>{heroBadgeText}</span>
          </div>

          <h2 className="text-2xl xl:text-3xl font-semibold font-sans tracking-tight text-slate-900 dark:text-white leading-[1.25]">
            {showcaseTitle}
          </h2>

          <p className="text-xs xl:text-sm text-slate-600 dark:text-slate-400 font-normal leading-relaxed">
            {showcaseDescription}
          </p>
        </div>

        {/* Center Character Cutout with Organic Blob Backdrop */}
        <div className="relative my-6 flex items-center justify-center">
          {/* Organic Colored Blob */}
          <div
            className={`absolute w-56 h-56 xl:w-64 xl:h-64 ${
              activeTab === 'login' ? 'bg-[#FFCC07]/30' : 'bg-[#ef599a]/20'
            } rounded-[45%_55%_63%_37%/38%_44%_56%_62%] blur-[1px] -z-0`}
          />

          {/* Child Cutout */}
          <div className="relative z-10 size-60 xl:size-72 drop-shadow-xl transition-transform hover:scale-105 duration-300">
            <Image
              src={illustrationImage}
              alt="Alpha Kids Character"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Floating Award Pill */}
          <div className="absolute -bottom-2 right-4 z-20 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-850 shadow-lg border border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <div className="size-6 rounded-full bg-[#21b1db] flex items-center justify-center text-white text-[11px] font-semibold">
              <Star className="size-3 fill-white" />
            </div>
            <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200">
              1.000+ Siswa Aktif
            </span>
          </div>
        </div>

        {/* Bottom Trust Items & Testimonial Quote */}
        <div className="relative z-10 space-y-4 pt-2">
          {/* Trust Checkpoints */}
          <div className="grid grid-cols-1 gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-[#21b1db] shrink-0" />
              <span>Metode Gamifikasi Seru & Interaktif</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-[#ef599a] shrink-0" />
              <span>Didampingi Kakak Mentor Bersertifikat</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-[#ca8a04] shrink-0" />
              <span>Pantauan Belajar Mudah untuk Orang Tua</span>
            </div>
          </div>

          {/* Mini Testimonial Glass Card */}
          <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-100 dark:border-slate-700/80 shadow-sm text-xs">
            <p className="text-slate-600 dark:text-slate-300 italic leading-snug">
              {quoteText}
            </p>
            <p className="mt-1.5 text-[11px] font-semibold text-[#21b1db]">
              {quoteAuthor}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Right Form Column (lg:col-span-7) */}
      <div className="lg:col-span-7 flex flex-col justify-between rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-10 xl:p-12 shadow-2xl shadow-cyan-950/10">
        <div>
          {/* Top Pill Tabs Switcher (Masuk vs Daftar) */}
          <div className="flex items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="inline-flex p-1 rounded-full bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700">
              <Link
                href="/auth/login"
                className={`relative px-5 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === 'login'
                    ? 'text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {activeTab === 'login' && (
                  <motion.span
                    layoutId="authActiveTab"
                    className="absolute inset-0 rounded-full bg-[#21b1db] shadow-md shadow-cyan-500/20"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <span className="relative z-10">Masuk</span>
              </Link>

              <Link
                href="/auth/sign-up"
                className={`relative px-5 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === 'sign-up'
                    ? 'text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {activeTab === 'sign-up' && (
                  <motion.span
                    layoutId="authActiveTab"
                    className="absolute inset-0 rounded-full bg-[#21b1db] shadow-md shadow-cyan-500/20"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <span className="relative z-10">Daftar Akun</span>
              </Link>
            </div>

            {/* Micro Badge */}
            <span className="hidden sm:inline-block text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              {activeTab === 'login' ? 'Sudah punya akun' : 'Pendaftaran gratis'}
            </span>
          </div>

          {/* Form Header */}
          <div className="mb-6 space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-semibold font-sans tracking-tight text-slate-950 dark:text-white">
              {title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
              {subtitle}
            </p>
          </div>

          {/* The Form Content */}
          <div className="mt-6">
            {children}
          </div>
        </div>

        {/* Security / Parent Note Footer */}
        <div className="mt-8 pt-5 border-t border-slate-100 dark:border-slate-800 text-center text-[11px] text-slate-400 dark:text-slate-500">
          Dengan melanjutkan, Anda menyetujui Ketentuan Layanan dan Kebijakan Privasi Alpha Kids.
        </div>
      </div>
    </div>
  );
}
