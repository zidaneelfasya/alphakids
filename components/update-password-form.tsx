'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function UpdatePasswordForm() {
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error('Kata sandi baru minimal 6 karakter.');
      return;
    }

    if (password !== repeatPassword) {
      toast.error('Konfirmasi kata sandi tidak cocok. Silakan cek kembali.');
      return;
    }

    const supabase = createClient();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        toast.error(error.message || 'Gagal memperbarui kata sandi.');
        return;
      }

      toast.success('Kata sandi berhasil diperbarui! Mengalihkan ke dashboard...');
      router.push('/dashboard');
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Terjadi kendala jaringan.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleUpdatePassword} className="flex flex-col gap-4">
      {/* Password Field */}
      <div className="space-y-1.5">
        <Label htmlFor="password" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          Kata Sandi Baru
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Minimal 6 karakter"
            required
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 pr-10 rounded-2xl border-slate-200/90 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus-visible:ring-[#21b1db] text-xs sm:text-sm"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-1"
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>

      {/* Repeat Password Field */}
      <div className="space-y-1.5">
        <Label htmlFor="repeat-password" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          Konfirmasi Kata Sandi Baru
        </Label>
        <div className="relative">
          <Input
            id="repeat-password"
            type={showRepeatPassword ? 'text' : 'password'}
            placeholder="Ketik ulang kata sandi baru"
            required
            autoComplete="new-password"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            className="h-11 pr-10 rounded-2xl border-slate-200/90 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus-visible:ring-[#21b1db] text-xs sm:text-sm"
          />
          <button
            type="button"
            onClick={() => setShowRepeatPassword(!showRepeatPassword)}
            aria-label={showRepeatPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-1"
          >
            {showRepeatPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>

      {/* Primary Pill Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="group inline-flex items-center justify-between w-full pl-6 pr-2 py-2 mt-2 rounded-full bg-[#ef599a] hover:bg-[#df488a] text-white font-semibold text-xs sm:text-sm shadow-xl shadow-[#ef599a]/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 cursor-pointer"
      >
        <span>{isLoading ? 'Sedang Menyimpan...' : 'Simpan Kata Sandi Baru'}</span>
        <span className="size-9 rounded-full bg-white text-[#ef599a] flex items-center justify-center shrink-0 shadow-md transition-transform duration-200 group-hover:scale-105 group-hover:translate-x-0.5">
          {isLoading ? (
            <Loader2 className="size-4 animate-spin text-[#ef599a]" />
          ) : (
            <ArrowRight className="size-4 stroke-[2.5]" />
          )}
        </span>
      </button>
    </form>
  );
}
