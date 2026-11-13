'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[AlphaKids GlobalError]:', error);
  }, [error]);

  return (
    <html lang="id">
      <body className="min-h-screen flex flex-col justify-center items-center bg-[#FFFDF9] text-slate-900 font-sans p-6 text-center">
        <div className="max-w-md mx-auto p-8 rounded-3xl bg-white border border-slate-200 shadow-xl">
          <h1 className="text-2xl font-semibold mb-3">Terjadi Gangguan Sistem</h1>
          <p className="text-sm text-slate-600 mb-6">
            Mohon maaf atas ketidaknyamanan ini. Sistem sedang memulihkan kondisi secara otomatis.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="px-6 py-2.5 rounded-full bg-[#21b1db] text-white font-semibold text-sm shadow-md hover:bg-[#1da0c7] transition-all cursor-pointer"
          >
            Segarkan Halaman
          </button>
        </div>
      </body>
    </html>
  );
}
