import React from 'react';
import { SignUpForm } from '@/components/sign-up-form';
import { AuthSplitLayout } from '@/components/auth/auth-split-layout';
import { YellowBrushUnderline } from '@/components/landing/wonder-decorations';

export const metadata = {
  title: 'Daftar Akun Baru | Alpha Kids',
  description: 'Daftar akun Alpha Kids untuk memulai pembelajaran coding, sains, dan kreativitas digital anak.',
};

export default function SignUpPage() {
  return (
    <AuthSplitLayout
      activeTab="sign-up"
      title="Buat Akun Alpha Kids"
      subtitle="Daftar dalam 1 menit untuk mengakses kelas digital, materi interaktif, dan sertifikat resmi."
      illustrationImage="/assets/img/cta.png"
      heroBadgeText="Pendaftaran Terbuka"
      showcaseTitle={
        <>
          Mulai petualangan belajar{' '}
          <span className="relative inline-block whitespace-nowrap">
            <span className="font-sans italic font-normal text-[#ef599a]">
              kreatif
            </span>
            <YellowBrushUnderline />
          </span>{' '}
          si kecil hari ini!
        </>
      }
      showcaseDescription="Bangun daya cipta teknologi dan rasa percaya diri anak dengan kurikulum proyek nyata dan pendampingan mentor bersertifikat."
      quoteText="“Metode belajarnya sangat ramah anak. Materi coding dijelaskan dengan visual yang mudah dipahami si kecil!”"
      quoteAuthor="Ayah Hendra — Orang Tua Murid"
    >
      <SignUpForm />
    </AuthSplitLayout>
  );
}
