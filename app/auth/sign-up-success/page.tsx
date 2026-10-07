import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { ScallopedBadge } from '@/components/landing/wonder-decorations';

export const metadata = {
  title: 'Pendaftaran Berhasil | Alpha Kids',
  description: 'Pendaftaran akun Alpha Kids berhasil. Periksa email Anda untuk konfirmasi.',
};

export default function SignUpSuccessPage() {
  return (
    <div className="max-w-xl mx-auto">
      <div className="rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-8 sm:p-12 shadow-2xl shadow-cyan-950/10 text-center relative overflow-hidden">
        {/* Floating Background Badge */}
        <div className="absolute top-4 right-4 pointer-events-none opacity-30">
          <ScallopedBadge className="size-16 text-[#FFCC07]" />
        </div>

        {/* Character Celebration Cutout */}
        <div className="relative mx-auto size-32 sm:size-40 mb-4 drop-shadow-lg">
          <Image
            src="/assets/img/hero2.png"
            alt="Anak Ceria Alpha Kids"
            fill
            className="object-contain"
            priority
          />
          <div className="absolute -bottom-2 -right-2 size-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
            <CheckCircle2 className="size-6 stroke-[2.5]" />
          </div>
        </div>

        {/* Header */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F8FA] dark:bg-cyan-950/60 text-[#21b1db] text-xs font-semibold mb-3 border border-cyan-200/50">
          <Sparkles className="size-3.5" />
          <span>Selamat Bergabung!</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-semibold font-sans tracking-tight text-slate-950 dark:text-white mb-3">
          Pendaftaran Akun Berhasil 🎉
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed mb-8">
          Tautan aktivasi akun telah kami kirimkan ke email Anda. Silakan periksa kotak masuk (atau folder spam/promosi) untuk mengonfirmasi akun.
        </p>

        {/* Next Steps Card */}
        <div className="text-left bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-5 mb-8 border border-slate-100 dark:border-slate-750 space-y-3 text-xs text-slate-700 dark:text-slate-300">
          <span className="font-semibold text-slate-900 dark:text-white block uppercase tracking-wider text-[11px] text-[#21b1db]">
            Langkah Selanjutnya:
          </span>
          <div className="flex items-start gap-3">
            <div className="size-5 rounded-full bg-[#21b1db] text-white flex items-center justify-center shrink-0 font-semibold text-[10px]">
              1
            </div>
            <span>Buka aplikasi email Anda (Gmail, Outlook, Yahoo, dll).</span>
          </div>
          <div className="flex items-start gap-3">
            <div className="size-5 rounded-full bg-[#ef599a] text-white flex items-center justify-center shrink-0 font-semibold text-[10px]">
              2
            </div>
            <span>Klik tombol <strong>Konfirmasi Akun</strong> di pesan resmi Alpha Kids.</span>
          </div>
          <div className="flex items-start gap-3">
            <div className="size-5 rounded-full bg-[#ca8a04] text-white flex items-center justify-center shrink-0 font-semibold text-[10px]">
              3
            </div>
            <span>Kembali dan masuk untuk memilih kelas digital pertama si kecil!</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Link
            href="/auth/login"
            className="group inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-7 py-3 rounded-full bg-[#ef599a] hover:bg-[#df488a] text-white font-semibold text-xs sm:text-sm shadow-xl shadow-[#ef599a]/25 transition-all hover:scale-105 active:scale-95"
          >
            <span>Buka Halaman Masuk</span>
            <ArrowRight className="size-4 stroke-[2.5] transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-full border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs sm:text-sm hover:border-[#21b1db] hover:text-[#21b1db] transition-colors"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
