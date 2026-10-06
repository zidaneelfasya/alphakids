'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

// 1. Scalloped 12-Petal Starburst Badge (Bottle Cap / Seal)
export function ScallopedBadge({
  className = 'size-14 text-white',
  fill = 'currentColor',
}: {
  className?: string;
  fill?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn('overflow-visible', className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M49.6 3 C53.1 3 56.3 9.7 59.8 10.6 C63.4 11.5 69.7 6.6 72.8 8.8 C76 11.1 76.4 18.2 79.1 21.4 C81.8 24.5 88.5 25.8 90.3 29.4 C92.1 33 88.9 39.7 89.4 43.7 C89.8 47.8 94.3 51.3 94.3 55.4 C94.3 59.4 88 62.5 87.2 66.1 C86.3 69.7 90.3 76.4 88 79.5 C85.8 82.7 79.1 82.2 76 84.9 C72.8 87.6 70.6 93.9 67 95.2 C63.4 96.6 58.1 92.1 54 92.5 C50 93 45.5 97 41.5 96.1 C37.5 95.2 34.8 88.9 31.2 87.2 C27.6 85.4 20.9 88 18.2 85.4 C15.5 82.7 18.2 75.5 16 72.4 C13.7 69.2 7.5 67 6.6 63.4 C5.7 59.8 11.1 54.5 11.1 50.4 C11.1 46.4 5.7 41.9 6.1 37.9 C6.6 33.9 13.3 32.1 15.1 29 C16.9 25.8 15.1 18.7 17.8 16 C20.5 13.3 27.2 15.5 30.8 13.3 C34.3 11.1 36.1 4.3 39.7 3.9 C43.3 3.4 46 3 49.6 3 Z"
        fill={fill}
      />
    </svg>
  );
}

// 2. Concentric Purple Rings
export function ConcentricRings({
  className = 'size-28 text-purple-600',
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="50" r="12" stroke="currentColor" strokeWidth="4" />
      <circle cx="50" cy="50" r="24" stroke="currentColor" strokeWidth="4" />
      <circle cx="50" cy="50" r="36" stroke="currentColor" strokeWidth="4" />
      <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="4" />
    </svg>
  );
}

// 3. Caterpillar Wave / Zig-Zag Pill Pattern (for Card 2)
export function CaterpillarWave({
  className = 'w-32 h-20 text-purple-300',
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 140 80"
      className={className}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0" y="25" width="16" height="50" rx="8" transform="rotate(-20 0 25)" />
      <rect x="25" y="20" width="16" height="55" rx="8" transform="rotate(-20 25 20)" />
      <rect x="50" y="15" width="16" height="60" rx="8" transform="rotate(-20 50 15)" />
      <rect x="75" y="10" width="16" height="65" rx="8" transform="rotate(-20 75 10)" />
      <rect x="100" y="5" width="16" height="70" rx="8" transform="rotate(-20 100 5)" />
      <rect x="125" y="0" width="16" height="75" rx="8" transform="rotate(-20 125 0)" />
    </svg>
  );
}

// 4. Dot Grid Pattern (Square 4x4 or customizable)
export function DotGrid({
  className,
  cols = 4,
  count = 16,
  dotClassName = 'size-2 rounded-full bg-white opacity-85',
}: {
  className?: string;
  cols?: number;
  count?: number;
  dotClassName?: string;
}) {
  return (
    <div
      className={cn(
        'grid gap-2',
        cols === 4 && 'grid-cols-4',
        cols === 3 && 'grid-cols-3',
        className
      )}
    >
      {[...Array(count)].map((_, i) => (
        <span key={i} className={cn('rounded-full bg-white', dotClassName)} />
      ))}
    </div>
  );
}

// 5. Hand-Drawn Curving Arrow (pointing to hero headline)
export function CurvedArrow({
  className = 'w-16 h-16 text-[#21b1db]',
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 60 60"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 15 C 25 35, 10 50, 45 42"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M38 32 L 47 42 L 35 48"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// 6. Yellow Wavy Brush Underline (Alpha Yellow #FFCC07)
export function YellowBrushUnderline({
  className = 'w-full h-3 text-[#FFCC07]',
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 9C40 2 80 12 120 4C150 -2 175 10 197 6"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}

// 7. Yellow Hand-Drawn Oval Loop (encircling "menyenangkan" with Alpha Yellow #FFCC07)
export function YellowLoop({
  className,
}: {
  className?: string;
} = {}) {
  return (
    <svg
      aria-hidden="true"
      className={cn(
        'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%+2.5rem)] sm:w-[calc(100%+3.5rem)] h-[calc(100%+2.25rem)] sm:h-[calc(100%+3rem)] pointer-events-none select-none text-[#FFCC07] -rotate-1',
        className
      )}
      viewBox="0 0 320 100"
      preserveAspectRatio="none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M 22,54 C 14,28 42,10 160,8 C 278,6 310,24 308,52 C 306,80 268,92 160,92 C 52,92 12,78 14,48 C 16,18 64,12 220,14"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

// 8. Soft Cloud with 3 Tilted Pills (Smart, Brave, Diligent)
export function CloudWithPills({ className }: { className?: string } = {}) {
  return (
    <div className={cn("relative w-64 h-36 shrink-0 select-none", className)}>
      <Image
        src="/assets/img/cloud.png"
        alt="Alpha Kids Cloud Feature"
        fill
        className="object-contain"
        sizes="256px"
        priority
      />
    </div>
  );
}

// 9. Radial Chevron Flower / Geometric Petal Star (CTA Modern Graphic)
export function RadialChevronFlower({
  className,
  variant = 'pastel',
}: {
  className?: string;
  variant?: 'pastel' | 'white';
} = {}) {
  const petals =
    variant === 'white'
      ? [
          { angle: 12, color: 'text-white/90' }, // Top petal in crisp white
          { angle: 68, color: 'text-white/40' },
          { angle: 128, color: 'text-white/40' },
          { angle: 185, color: 'text-white/50' },
          { angle: 242, color: 'text-white/50' },
          { angle: 298, color: 'text-white/45' },
        ]
      : [
          { angle: 12, color: 'text-[#E0E7FF] dark:text-indigo-950/60' }, // Soft Lavender Top
          { angle: 68, color: 'text-[#FEF3C7] dark:text-amber-950/40' }, // Soft Cream/Amber
          { angle: 128, color: 'text-[#FEF3C7] dark:text-amber-950/40' },
          { angle: 185, color: 'text-[#FEF3C7] dark:text-amber-950/50' },
          { angle: 242, color: 'text-[#FEF3C7] dark:text-amber-950/50' },
          { angle: 298, color: 'text-[#FEF3C7] dark:text-amber-950/45' },
        ];

  return (
    <svg
      viewBox="0 0 400 400"
      className={cn('w-72 sm:w-96 h-72 sm:h-96 select-none pointer-events-none overflow-visible', className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g transform="translate(200, 200)">
        {petals.map((petal, i) => (
          <g key={i} transform={`rotate(${petal.angle})`}>
            <path
              d="M -34 -148 L 0 -62 L 34 -148"
              className={petal.color}
              stroke="currentColor"
              strokeWidth="32"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        ))}
      </g>
    </svg>
  );
}

