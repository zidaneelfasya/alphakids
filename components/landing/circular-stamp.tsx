'use client';

import Image from 'next/image';

interface CircularStampProps {
  text?: string;
  className?: string;
}

export function CircularStamp({
  text = 'ALPHA KIDS • BELAJAR & BERKARYA • ',
  className = '',
}: CircularStampProps) {
  return (
    <div
      className={`relative flex items-center justify-center size-28 sm:size-32 rounded-full bg-white dark:bg-slate-900 shadow-xl border-2 border-[#FFCC07] select-none ${className}`}
    >
      {/* Rotating Circular Text */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full animate-[spin_20s_linear_infinite]"
      >
        <path
          id="circlePath"
          d="M 50, 50 m -36, 0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0"
          fill="none"
        />
        <text className="text-[9.5px] font-semibold uppercase tracking-[0.18em] fill-[#21b1db] dark:fill-cyan-200 font-sans">
          <textPath href="#circlePath" startOffset="0%">
            {text}
          </textPath>
        </text>
      </svg>

      {/* Center Official Alpha Kids Trophy Icon */}
      <div className="absolute inset-0 m-auto size-11 rounded-full bg-amber-50 dark:bg-slate-800 border border-[#FFCC07]/40 flex items-center justify-center shadow-inner p-1.5">
        <Image
          src="/assets/img/Simbol Piala AlphaKids_revisi0.png"
          alt="Alpha Kids Trophy"
          width={26}
          height={26}
          className="object-contain"
        />
      </div>
    </div>
  );
}
