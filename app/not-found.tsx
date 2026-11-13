import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col justify-center items-center bg-[#FFFDF9] dark:bg-slate-950 px-4 text-center relative overflow-hidden font-sans selection:bg-pink-200 selection:text-pink-900">
      {/* Background Decorative Puzzle Ornaments */}
      <div
        aria-hidden="true"
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/3 w-[360px] h-[360px] pointer-events-none select-none opacity-40 blur-[2px]"
      >
        <Image
          src="/assets/img/Ornamen Puzzle Kuning AlphaKids_revisi0.png"
          alt=""
          fill
          className="object-contain rotate-12"
        />
      </div>

      <div
        aria-hidden="true"
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/3 w-[360px] h-[360px] pointer-events-none select-none opacity-40 blur-[2px]"
      >
        <Image
          src="/assets/img/Ornamen Puzzle Kuning AlphaKids_revisi0.png"
          alt=""
          fill
          className="object-contain -rotate-12"
        />
      </div>

      {/* Main Content Card */}
      <div className="relative z-10 max-w-lg mx-auto py-12 px-6 sm:px-10 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-900/5">
        {/* Playful 404 Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E8F8FA] dark:bg-cyan-950/60 text-[#21b1db] border border-[#21b1db]/25 text-xs font-semibold mb-6">
          <Compass className="size-4 animate-spin [animation-duration:8s]" />
          <span>Error 404 &bull; Tautan Tersesat</span>
        </div>

        {/* Master Headline */}
        <h1 className="text-3xl sm:text-5xl font-semibold font-sans tracking-tight text-slate-900 dark:text-white leading-[1.2] mb-4">
          Ups! Halaman Tidak{' '}
          <span className="font-sans italic font-normal text-[#ef599a]">
            Ditemukan
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-normal leading-relaxed mb-8">
          Sepertinya halaman yang kamu tuju sedang berpetualang atau tautan sudah dipindahkan. Yuk kembali belajar bersama mentor berprestasi!
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 pl-6 pr-2 py-2 rounded-full bg-[#ef599a] hover:bg-[#df488a] text-white font-semibold text-sm shadow-lg shadow-[#ef599a]/25 transition-all hover:scale-105 active:scale-95"
          >
            <span>Kembali ke Beranda</span>
            <span className="size-8 rounded-full bg-white text-[#ef599a] flex items-center justify-center shrink-0 shadow-xs transition-transform duration-200 group-hover:rotate-12">
              <ArrowUpRight className="size-4 stroke-[2.5]" />
            </span>
          </Link>

          <Link
            href="/programs"
            className="w-full sm:w-auto px-6 py-2.5 rounded-full border border-slate-200 dark:border-slate-800 hover:border-[#21b1db] text-slate-700 dark:text-slate-300 hover:text-[#21b1db] font-semibold text-sm transition-colors"
          >
            Katalog Program
          </Link>
        </div>
      </div>
    </div>
  );
}
