'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Mohon masukkan alamat email Anda.');
      return;
    }

    const supabase = createClient();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });

      if (error) {
        toast.error(error.message || 'Gagal mengirim instruksi reset kata sandi.');
        return;
      }

      setIsSubmitted(true);
      toast.success('Tautan pemulihan kata sandi telah dikirim ke email Anda!');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Terjadi kendala jaringan.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center text-center space-y-5 py-4">
        <div className="size-16 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-800 shadow-sm">
          <CheckCircle2 className="size-8 stroke-[2.2]" />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold font-sans text-slate-900 dark:text-white">
            Periksa Kotak Masuk Email Anda
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
            Kami telah mengirimkan tautan pemulihan kata sandi ke{' '}
            <span className="font-semibold text-slate-900 dark:text-white">{email}</span>.
            Silakan buka email tersebut untuk mengatur kata sandi baru.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 w-full justify-center">
          <button
            type="button"
            onClick={() => setIsSubmitted(false)}
            className="px-5 py-2.5 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-[#21b1db] hover:text-[#21b1db] transition-colors"
          >
            Kirim Ulang Email
          </button>
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#21b1db] hover:bg-[#1da0c7] text-white text-xs font-semibold shadow-md transition-all"
          >
            <ArrowLeft className="size-3.5" />
            <span>Kembali ke Halaman Masuk</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleReset} className="flex flex-col gap-5">
      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          Alamat Email Akun
        </Label>
        <div className="relative">
          <Input
            id="email"
            type="email"
            placeholder="nama@email.com"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 pl-10 rounded-2xl border-slate-200/90 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus-visible:ring-[#21b1db] text-xs sm:text-sm"
          />
          <Mail className="size-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          Kami akan mengirimkan instruksi dan tautan aman untuk membuat kata sandi baru.
        </p>
      </div>

      {/* Primary Pill Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="group inline-flex items-center justify-between w-full pl-6 pr-2 py-2 rounded-full bg-[#ef599a] hover:bg-[#df488a] text-white font-semibold text-xs sm:text-sm shadow-xl shadow-[#ef599a]/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 cursor-pointer"
      >
        <span>{isLoading ? 'Sedang Mengirim Tautan...' : 'Kirim Tautan Pemulihan'}</span>
        <span className="size-9 rounded-full bg-white text-[#ef599a] flex items-center justify-center shrink-0 shadow-md transition-transform duration-200 group-hover:scale-105 group-hover:translate-x-0.5">
          {isLoading ? (
            <Loader2 className="size-4 animate-spin text-[#ef599a]" />
          ) : (
            <ArrowRight className="size-4 stroke-[2.5]" />
          )}
        </span>
      </button>

      <div className="text-center pt-2 text-xs text-slate-500">
        Ingat kata sandi Anda?{' '}
        <Link
          href="/auth/login"
          className="font-semibold text-[#21b1db] hover:text-[#1da0c7] hover:underline"
        >
          Masuk ke Akun
        </Link>
      </div>
    </form>
  );
}
