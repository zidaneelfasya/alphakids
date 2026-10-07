import React, { Suspense } from 'react';
import Link from 'next/link';
import { AlertTriangle, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Kendala Autentikasi | Alpha Kids',
  description: 'Terjadi kendala saat proses autentikasi akun Alpha Kids.',
};

async function ErrorMessage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 text-left space-y-1">
      <span className="font-semibold block">Keterangan Sistem:</span>
      <p className="font-mono text-[11px] text-amber-800 dark:text-amber-300">
        {params?.error || 'Sesi autentikasi telah kedaluwarsa atau tautan tidak valid.'}
      </p>
    </div>
  );
}

export default function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  return (
    <div className="max-w-md mx-auto">
      <div className="rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-8 sm:p-10 shadow-2xl shadow-cyan-950/10 text-center space-y-5">
        <div className="mx-auto size-14 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-200 shadow-xs">
          <AlertTriangle className="size-7 stroke-[2.2]" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold font-sans tracking-tight text-slate-950 dark:text-white">
            Terjadi Sedikit Kendala
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
            Proses verifikasi atau autentikasi akun tidak dapat diselesaikan saat ini.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="text-xs text-slate-400 py-2">
              Memeriksa rincian kendala...
            </div>
          }
        >
          <ErrorMessage searchParams={searchParams} />
        </Suspense>

        <div className="pt-2 flex flex-col gap-2.5">
          <Link
            href="/auth/login"
            className="group inline-flex items-center justify-center gap-2.5 w-full py-3 rounded-full bg-[#ef599a] hover:bg-[#df488a] text-white font-semibold text-xs sm:text-sm shadow-xl shadow-[#ef599a]/25 transition-all hover:scale-105 active:scale-95"
          >
            <span>Coba Masuk Kembali</span>
            <ArrowRight className="size-4 stroke-[2.5]" />
          </Link>

          <Link
            href="/"
            className="w-full py-2.5 rounded-full border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:border-[#21b1db] hover:text-[#21b1db] transition-colors"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
