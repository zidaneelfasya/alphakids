'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatRupiah } from '@/lib/utils';
import { validateVoucher, VoucherValidationResult } from '@/lib/actions/vouchers';
import { createOrderAndInitiatePayment } from '@/lib/actions/checkout';
import { Tag, ShieldCheck, Zap, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

interface ProgramData {
  id: string;
  title: string;
  slug: string;
  price: number;
  age_range: string | null;
  level: string | null;
  cover_image: string | null;
}

interface UserData {
  name: string;
  email: string;
  phone?: string | null;
}

interface CheckoutViewProps {
  program: ProgramData;
  user: UserData;
}

export function CheckoutView({ program, user }: CheckoutViewProps) {
  const router = useRouter();

  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<VoucherValidationResult['voucher'] | null>(null);
  const [voucherError, setVoucherError] = useState<string | null>(null);
  const [isValidatingVoucher, setIsValidatingVoucher] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const subtotal = program.price;
  const discountTotal = appliedVoucher ? appliedVoucher.discountAmount : 0;
  const finalTotal = Math.max(0, subtotal - discountTotal);

  const handleApplyVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!voucherCode.trim()) return;

    setIsValidatingVoucher(true);
    setVoucherError(null);

    try {
      const res = await validateVoucher(voucherCode, subtotal);
      if (!res.valid || !res.voucher) {
        setVoucherError(res.error || 'Voucher tidak valid');
        setAppliedVoucher(null);
      } else {
        setAppliedVoucher(res.voucher);
        setVoucherError(null);
      }
    } catch {
      setVoucherError('Gagal memvalidasi voucher');
      setAppliedVoucher(null);
    } finally {
      setIsValidatingVoucher(false);
    }
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setVoucherCode('');
    setVoucherError(null);
  };

  const handlePayNow = async () => {
    setIsSubmitting(true);
    setCheckoutError(null);

    try {
      const result = await createOrderAndInitiatePayment(
        program.id,
        appliedVoucher?.code
      );

      if (!result.success || (!result.checkoutUrl && !result.snapToken)) {
        setCheckoutError(result.error || 'Gagal memproses pembayaran. Silakan coba kembali.');
        setIsSubmitting(false);
        return;
      }

      // If gateway returned a checkout URL (Mayar Invoice link or Midtrans redirect)
      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      } else if (result.snapToken && typeof window !== 'undefined' && (window as unknown as { snap?: { pay: (token: string) => void } }).snap) {
        // Fallback for Snap popup if script loaded
        (window as unknown as { snap: { pay: (token: string) => void } }).snap.pay(result.snapToken);
        setIsSubmitting(false);
      } else {
        router.push(`/dashboard/transactions?order=${result.orderNumber}`);
      }
    } catch (err: unknown) {
      setCheckoutError(err instanceof Error ? err.message : 'Terjadi gangguan koneksi');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back button */}
      <Link
        href={`/programs/${program.slug}`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Detail Program
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Detail Pesanan & Pembeli */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
            <h2 className="text-xl font-bold font-heading text-slate-900 mb-4">
              Ringkasan Pesanan
            </h2>

            <div className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 mb-6">
              <div className="w-20 h-20 rounded-lg bg-amber-100 flex-shrink-0 flex items-center justify-center font-bold text-amber-700 text-lg">
                AK
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {program.age_range && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      Usia {program.age_range}
                    </span>
                  )}
                  {program.level && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                      {program.level}
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-slate-900 leading-snug line-clamp-2">
                  {program.title}
                </h3>
                <p className="text-sm font-semibold text-amber-600 mt-1">
                  {formatRupiah(program.price)}
                </p>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">
                Informasi Pendaftaran Akun
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 rounded-lg bg-slate-50">
                  <span className="text-xs text-slate-400 block mb-0.5">Nama Peserta / Wali</span>
                  <span className="font-medium text-slate-800 truncate block">{user.name}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50">
                  <span className="text-xs text-slate-400 block mb-0.5">Email Pengguna</span>
                  <span className="font-medium text-slate-800 truncate block">{user.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Guarantee Badges */}
          <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent rounded-2xl p-5 border border-amber-200/50 flex flex-col sm:flex-row gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-700">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Pembayaran Resmi & Aman</h4>
                <p className="text-xs text-slate-500">Enkripsi standar industri perbankan Indonesia</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-700">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Akses Langsung Aktif</h4>
                <p className="text-xs text-slate-500">Materi & komunitas terbuka otomatis setelah lunas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Voucher & Payment Breakdown */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-6">
            <h2 className="text-lg font-bold font-heading text-slate-900">
              Rincian Pembayaran
            </h2>

            {/* Voucher Box */}
            <div>
              <label htmlFor="voucherInput" className="text-xs font-semibold text-slate-600 block mb-2">
                Punya Kode Voucher?
              </label>

              {appliedVoucher ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="text-xs font-bold text-emerald-800 tracking-wider">
                        {appliedVoucher.code}
                      </span>
                      <p className="text-[11px] text-emerald-600 font-medium">
                        Potongan {formatRupiah(appliedVoucher.discountAmount)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveVoucher}
                    className="text-xs font-semibold text-red-600 hover:text-red-700 p-1"
                  >
                    Hapus
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyVoucher} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="voucherInput"
                      type="text"
                      placeholder="Masukkan kode voucher"
                      value={voucherCode}
                      onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                      className="w-full pl-9 pr-3 py-2 text-xs uppercase font-medium rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isValidatingVoucher || !voucherCode.trim()}
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
                  >
                    {isValidatingVoucher ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Terapkan'}
                  </button>
                </form>
              )}

              {voucherError && (
                <p className="text-xs text-red-600 mt-2 font-medium">
                  {voucherError}
                </p>
              )}
            </div>

            {/* Price Calculations */}
            <div className="border-t border-slate-100 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Harga Program</span>
                <span className="font-medium text-slate-800">{formatRupiah(subtotal)}</span>
              </div>

              {discountTotal > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Diskon Voucher</span>
                  <span className="font-semibold">- {formatRupiah(discountTotal)}</span>
                </div>
              )}

              <div className="border-t border-dashed border-slate-200 my-2 pt-2 flex justify-between items-baseline">
                <span className="font-bold text-slate-900 text-base">Total Bayar</span>
                <span className="font-extrabold text-amber-600 text-2xl font-heading">
                  {formatRupiah(finalTotal)}
                </span>
              </div>
            </div>

            {checkoutError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
                {checkoutError}
              </div>
            )}

            {/* Pay Now Button */}
            <button
              type="button"
              onClick={handlePayNow}
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-white font-bold text-sm tracking-wide shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Memproses Pembayaran...</span>
                </>
              ) : (
                <span>Bayar Sekarang ({formatRupiah(finalTotal)})</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
