import React from 'react';
import { LoginForm } from '@/components/login-form';
import { AuthSplitLayout } from '@/components/auth/auth-split-layout';
import { YellowLoop } from '@/components/landing/wonder-decorations';

export const metadata = {
  title: 'Masuk Akun | Alpha Kids',
  description: 'Masuk ke akun Alpha Kids untuk mengakses kelas digital dan dashboard belajar anak.',
};

export default function LoginPage() {
  return (
    <AuthSplitLayout
      activeTab="login"
      title="Masuk ke Akun Anda"
      subtitle="Akses seluruh kelas interaktif, rekaman bimbingan, dan perkembangan belajar si kecil."
      illustrationImage="/assets/img/hero1.png"
      heroBadgeText="Portal Belajar Alpha Kids"
      showcaseTitle={
        <>
          Selamat datang kembali,{' '}
          <span className="relative inline-flex items-center justify-center align-baseline whitespace-nowrap mx-1 px-3.5 py-0.5">
            <span className="relative z-10 font-sans italic font-normal text-[#ef599a]">
              Sahabat Cilik!
            </span>
            <YellowLoop />
          </span>
        </>
      }
      showcaseDescription="Lanjutkan petualangan seru mengasah logika nalar dan daya cipta teknologi bersama mentor favorit."
      quoteText="“Anak saya selalu bersemangat menunggu sesi live coding dan tantangan robotika setiap minggunya!”"
      quoteAuthor="Bunda Sarah — Orang Tua Murid"
    >
      <LoginForm />
    </AuthSplitLayout>
  );
}
