'use server';

import { db, vouchers } from '@/lib/db';
import { eq, and } from 'drizzle-orm';

export interface VoucherValidationResult {
  valid: boolean;
  error?: string;
  voucher?: {
    id: string;
    code: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    discountAmount: number;
    finalPrice: number;
  };
}

/**
 * Server-authoritative voucher validation using Drizzle ORM.
 * Strictly adheres to MVP rules:
 * - Only verifies code match and isActive flag.
 * - Does NOT check invented rules (no expiry, usage limits, or min spend).
 * - Applying here does NOT record redemption (redemption happens ONLY when paid).
 */
export async function validateVoucher(
  code: string,
  price: number
): Promise<VoucherValidationResult> {
  const normalizedCode = code.trim().toUpperCase();

  if (!normalizedCode) {
    return { valid: false, error: 'Silakan masukkan kode voucher' };
  }

  if (price <= 0) {
    return { valid: false, error: 'Harga program tidak valid' };
  }

  const [voucher] = await db
    .select()
    .from(vouchers)
    .where(and(eq(vouchers.code, normalizedCode), eq(vouchers.isActive, true)))
    .limit(1);

  if (!voucher) {
    return { valid: false, error: 'Kode voucher tidak valid atau sudah tidak aktif' };
  }

  let discountAmount = 0;

  if (voucher.discountType === 'percentage') {
    discountAmount = Math.round((price * voucher.discountValue) / 100);
  } else if (voucher.discountType === 'fixed') {
    discountAmount = voucher.discountValue;
  }

  // Invariant: discount cannot exceed original price
  discountAmount = Math.min(discountAmount, price);
  const finalPrice = Math.max(0, price - discountAmount);

  return {
    valid: true,
    voucher: {
      id: voucher.id,
      code: voucher.code,
      discountType: voucher.discountType as 'percentage' | 'fixed',
      discountValue: voucher.discountValue,
      discountAmount,
      finalPrice,
    },
  };
}
