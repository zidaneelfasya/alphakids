'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { getDicebearMoodsAvatar } from '@/lib/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function SignUpFormContent() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOAuthLoading, setIsOAuthLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get('next') || '/dashboard';

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      toast.error('Mohon masukkan nama lengkap Anda.');
      return;
    }

    if (!email.trim()) {
      toast.error('Mohon masukkan alamat email yang valid.');
      return;
    }

    if (password.length < 6) {
      toast.error('Kata sandi harus minimal 6 karakter.');
      return;
    }

    if (password !== repeatPassword) {
      toast.error('Konfirmasi kata sandi tidak cocok. Silakan cek kembali.');
      return;
    }

    const supabase = createClient();
    setIsLoading(true);

    try {
      const redirectUrl = `${window.location.origin}${nextUrl.startsWith('/') ? nextUrl : '/dashboard'}`;
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            avatar_url: getDicebearMoodsAvatar(fullName.trim() || email),
          },
          emailRedirectTo: redirectUrl,
        },
      });

      if (error) {
        toast.error(error.message || 'Terjadi kesalahan saat mendaftar.');
        return;
      }

      toast.success('Pendaftaran akun berhasil! Silakan periksa email Anda.');
      router.push('/auth/sign-up-success');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Terjadi kendala jaringan.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    const supabase = createClient();
    setIsOAuthLoading(true);

    try {
      const redirectDestination = `${window.location.origin}${nextUrl.startsWith('/') ? nextUrl : '/dashboard'}`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectDestination,
        },
      });

      if (error) {
        toast.error(error.message || 'Gagal mendaftar dengan Google.');
        setIsOAuthLoading(false);
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Terjadi kesalahan Google OAuth.');
      setIsOAuthLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* 1. Google OAuth Button */}
      <button
        type="button"
        onClick={handleGoogleSignUp}
        disabled={isOAuthLoading || isLoading}
        className="w-full flex items-center justify-center gap-3 h-12 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs sm:text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-750 hover:border-slate-300 dark:hover:border-slate-600 transition-all shadow-xs active:scale-[0.99] disabled:opacity-60 cursor-pointer"
      >
        {isOAuthLoading ? (
          <Loader2 className="size-4 animate-spin text-[#21b1db]" />
        ) : (
          <svg className="size-4 shrink-0" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              fill="#EA4335"
            />
          </svg>
        )}
        <span>{isOAuthLoading ? 'Menghubungkan...' : 'Daftar Cepat dengan Google'}</span>
      </button>

      {/* 2. Divider */}
      <div className="relative flex items-center justify-center text-xs py-1">
        <span className="w-full border-t border-slate-200/80 dark:border-slate-800" />
        <span className="bg-white dark:bg-slate-900 px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          atau email
        </span>
        <span className="w-full border-t border-slate-200/80 dark:border-slate-800" />
      </div>

      {/* 3. Registration Form */}
      <form onSubmit={handleSignUp} className="flex flex-col gap-3.5">
        {/* Full Name Field */}
        <div className="space-y-1.5">
          <Label htmlFor="fullName" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Nama Lengkap Anda / Orang Tua
          </Label>
          <Input
            id="fullName"
            type="text"
            placeholder="contoh: Sarah Amelia"
            required
            autoComplete="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="h-11 rounded-2xl border-slate-200/90 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus-visible:ring-[#21b1db] text-xs sm:text-sm"
          />
        </div>

        {/* Email Field */}
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Alamat Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="nama@email.com"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 rounded-2xl border-slate-200/90 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus-visible:ring-[#21b1db] text-xs sm:text-sm"
          />
        </div>

        {/* Password & Confirm Password (Grid on Tablet/Desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Kata Sandi
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Min. 6 karakter"
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 pr-10 rounded-2xl border-slate-200/90 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus-visible:ring-[#21b1db] text-xs sm:text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-1"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="repeat-password" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Ulangi Sandi
            </Label>
            <div className="relative">
              <Input
                id="repeat-password"
                type={showRepeatPassword ? 'text' : 'password'}
                placeholder="Ketik ulang sandi"
                required
                autoComplete="new-password"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                className="h-11 pr-10 rounded-2xl border-slate-200/90 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus-visible:ring-[#21b1db] text-xs sm:text-sm"
              />
              <button
                type="button"
                onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                aria-label={showRepeatPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-1"
              >
                {showRepeatPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* 4. Signature Alpha Kids Primary Pill Button */}
        <button
          type="submit"
          disabled={isLoading || isOAuthLoading}
          className="group inline-flex items-center justify-between w-full pl-6 pr-2 py-2 mt-2 rounded-full bg-[#ef599a] hover:bg-[#df488a] text-white font-semibold text-xs sm:text-sm shadow-xl shadow-[#ef599a]/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 cursor-pointer"
        >
          <span>{isLoading ? 'Mendaftarkan Akun...' : 'Daftar Akun Alpha Kids'}</span>
          <span className="size-9 rounded-full bg-white text-[#ef599a] flex items-center justify-center shrink-0 shadow-md transition-transform duration-200 group-hover:scale-105 group-hover:translate-x-0.5">
            {isLoading ? (
              <Loader2 className="size-4 animate-spin text-[#ef599a]" />
            ) : (
              <ArrowRight className="size-4 stroke-[2.5]" />
            )}
          </span>
        </button>
      </form>

      {/* 5. Switch to Login Link */}
      <div className="text-center pt-2 text-xs text-slate-500 dark:text-slate-400">
        Sudah memiliki akun terdaftar?{' '}
        <Link
          href="/auth/login"
          className="font-semibold text-[#21b1db] hover:text-[#1da0c7] hover:underline"
        >
          Masuk Sekarang
        </Link>
      </div>
    </div>
  );
}

export function SignUpForm() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12 text-slate-400 text-xs">
          <Loader2 className="size-5 animate-spin mr-2 text-[#21b1db]" />
          <span>Memuat formulir pendaftaran...</span>
        </div>
      }
    >
      <SignUpFormContent />
    </Suspense>
  );
}
