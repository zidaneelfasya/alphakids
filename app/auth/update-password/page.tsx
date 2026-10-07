import React from 'react';
import { UpdatePasswordForm } from '@/components/update-password-form';
import { ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Buat Kata Sandi Baru | Alpha Kids',
  description: 'Atur kata sandi baru untuk akun Alpha Kids Anda.',
};

export default function UpdatePasswordPage() {
  return (
    <div className="max-w-md mx-auto">
      <div className="rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-10 shadow-2xl shadow-cyan-950/10">
        <div className="text-center mb-6 space-y-2">
          <div className="mx-auto size-12 rounded-2xl bg-[#E8F8FA] dark:bg-cyan-950/60 text-[#21b1db] flex items-center justify-center border border-cyan-200/60 dark:border-cyan-800 shadow-xs">
            <ShieldCheck className="size-6 stroke-[2.2]" />
          </div>
          <h1 className="text-2xl font-semibold font-sans tracking-tight text-slate-950 dark:text-white">
            Atur Kata Sandi Baru
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
            Masukkan kata sandi baru yang aman untuk akun Alpha Kids Anda.
          </p>
        </div>

        <UpdatePasswordForm />
      </div>
    </div>
  );
}
