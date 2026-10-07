import React from 'react';
import { ForgotPasswordForm } from '@/components/forgot-password-form';
import { KeyRound } from 'lucide-react';

export const metadata = {
  title: 'Pemulihan Kata Sandi | Alpha Kids',
  description: 'Atur ulang kata sandi akun Alpha Kids Anda.',
};

export default function ForgotPasswordPage() {
  return (
    <div className="max-w-md mx-auto">
      <div className="rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-10 shadow-2xl shadow-cyan-950/10">
        <div className="text-center mb-6 space-y-2">
          <div className="mx-auto size-12 rounded-2xl bg-[#E8F8FA] dark:bg-cyan-950/60 text-[#21b1db] flex items-center justify-center border border-cyan-200/60 dark:border-cyan-800 shadow-xs">
            <KeyRound className="size-6 stroke-[2.2]" />
          </div>
          <h1 className="text-2xl font-semibold font-sans tracking-tight text-slate-950 dark:text-white">
            Pemulihan Kata Sandi
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
            Masukkan email terdaftar untuk menerima tautan pembuatan kata sandi baru.
          </p>
        </div>

        <ForgotPasswordForm />
      </div>
    </div>
  );
}
