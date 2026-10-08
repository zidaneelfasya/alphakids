'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import type { CtaSectionContent } from '@/lib/cms';

interface LandingFinalCtaProps {
  content: CtaSectionContent;
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M12.031 2C6.495 2 2 6.494 2 12.029c0 1.767.461 3.488 1.336 5.006L2 22l5.127-1.345a10.003 10.003 0 0 0 4.904 1.374h.004c5.534 0 10.029-4.494 10.029-10.029C22.064 6.494 17.568 2 12.031 2zm5.834 14.195c-.242.684-1.22 1.307-1.745 1.38-.49.07-1.127.101-3.642-.942-3.14-1.303-5.161-4.495-5.317-4.704-.156-.209-1.272-1.693-1.272-3.23 0-1.536.804-2.292 1.09-2.585.286-.293.626-.366.835-.366.208 0 .417.002.599.01.192.01.449-.073.702.535.261.628.892 2.174.969 2.332.078.158.13.344.026.552-.104.209-.156.339-.313.522-.156.183-.33.407-.47.546-.157.157-.32.327-.138.64.182.313.809 1.334 1.734 2.158 1.189 1.059 2.191 1.387 2.504 1.543.313.156.496.13.679-.078.183-.209.782-.912.991-1.225.209-.313.418-.261.704-.157.287.104 1.819.858 2.132 1.014.313.157.522.235.599.366.079.13.079.756-.163 1.44z" />
    </svg>
  );
}

export function LandingFinalCta({ content }: LandingFinalCtaProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="cta"
      className="py-16 sm:py-24 lg:py-28 relative overflow-hidden bg-gradient-to-br from-[#FFD524] via-[#FFCC07] to-[#F5BE00] text-slate-950"
    >
      {/* Subtle Ambient Light Glows */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-white/20 blur-3xl pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute top-1/3 right-10 -translate-y-1/2 w-72 sm:w-80 h-72 sm:h-80 rounded-full bg-amber-300/30 blur-2xl pointer-events-none"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* ============================================================= */}
          {/* LEFT COLUMN: Student Illustration Cutout (cta.png)             */}
          {/* ============================================================= */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.94, y: 24 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 xl:col-span-5 flex items-center justify-center lg:justify-start"
          >
            <div className="relative w-full max-w-[340px] sm:max-w-[400px] lg:max-w-[420px] xl:max-w-[480px] 2xl:max-w-[520px] aspect-[1293/1217] select-none transition-transform duration-500 hover:scale-[1.02]">
              {/* Soft radiance behind cutout */}
              <div
                aria-hidden="true"
                className="absolute inset-4 bg-white/30 rounded-full blur-2xl pointer-events-none -z-10"
              />
              <Image
                src={content.ctaImage || 'https://yxbjqatnmoqvanawxjyk.supabase.co/storage/v1/object/public/cms/cta.png'}
                alt="Siswa Berprestasi Alpha Kids"
                fill
                className="object-contain drop-shadow-2xl"
                priority
                sizes="(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 520px"
              />
            </div>
          </motion.div>

          {/* ============================================================= */}
          {/* RIGHT COLUMN: Copy & Dual Action Buttons (Aligned to the RIGHT)*/}
          {/* ============================================================= */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 xl:col-span-7 flex flex-col items-center sm:items-end text-center sm:text-right space-y-6"
          >
            {/* Playful Pink Badge */}
            

            {/* Headline with Brand Accent Star */}
            <div className="relative w-full">
              
              <h2 className="text-3xl sm:text-4xl lg:text-[2.5rem] xl:text-5xl font-semibold font-sans tracking-tight text-slate-950 leading-[1.15]">
                {content.title || 'Mulai Petualangan Belajar Digital Buah Hati Anda!'}
              </h2>
            </div>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-900/85 font-normal leading-relaxed max-w-xl">
              {content.subtitle ||
                'Konsultasikan bidang dan program belajar yang paling sesuai dengan kebutuhan si kecil bersama tim Alpha Kids.'}
            </p>

            {/* Action Buttons: Playful Alpha Pink Pill + WhatsApp Clean White Pill */}
            <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3.5 pt-2 w-full sm:w-auto">
              {/* Star Ornament near Buttons */}


              {/* Primary Button: Playful Alpha Pink Signature Pill with White Disc & ArrowUpRight */}
              <Link
                href={content.btnLink || '#programs'}
                className="group inline-flex items-center justify-between sm:justify-start gap-3 sm:gap-4 pl-6 sm:pl-7 pr-2 sm:pr-2.5 py-2 sm:py-2.5 rounded-full bg-[#ef599a] hover:bg-[#df488a] text-white font-semibold text-sm sm:text-base shadow-xl shadow-[#ef599a]/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span className="tracking-tight">{content.btnText || 'Daftar Sekarang'}</span>
                <span className="size-9 sm:size-10 rounded-full bg-white text-[#ef599a] flex items-center justify-center shrink-0 shadow-md transition-transform duration-200 group-hover:scale-105 group-hover:rotate-12">
                  <ArrowUpRight className="size-4 sm:size-5 stroke-[2.5] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>

              {/* Secondary Button: WhatsApp Clean White Pill */}
              <a
                href={
                  content.consultationLink ||
                  'https://wa.me/6281234567890?text=Halo%20Alpha%20Kids,%20saya%20ingin%20konsultasi%20program%20belajar%20anak'
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-white hover:bg-slate-50 text-slate-950 font-semibold text-sm sm:text-base shadow-lg shadow-black/5 transition-all duration-200 hover:scale-105 active:scale-95 text-center cursor-pointer border border-white/80"
              >
                <WhatsAppIcon className="size-5 shrink-0 text-[#25D366] fill-[#25D366]" />
                <span>{content.btnSecondaryText || 'Tanya di WhatsApp'}</span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
