'use server';

import { db, vouchers } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { assertAdminMutation } from '@/lib/auth/guards';
import { revalidatePath } from 'next/cache';

export interface VoucherInput {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  isActive?: boolean;
}

export async function createVoucherAction(data: VoucherInput) {
  await assertAdminMutation();

  const [voucher] = await db
    .insert(vouchers)
    .values({
      code: data.code.trim().toUpperCase(),
      discountType: data.discountType,
      discountValue: Math.max(1, Math.round(data.discountValue)),
      isActive: data.isActive !== undefined ? data.isActive : true,
    })
    .returning();

  revalidatePath('/admin/vouchers');
  return { success: true, message: 'Voucher berhasil dibuat', voucher };
}

export async function updateVoucherAction(id: string, data: Partial<VoucherInput>) {
  await assertAdminMutation();

  await db
    .update(vouchers)
    .set({
      ...(data.code && { code: data.code.trim().toUpperCase() }),
      ...(data.discountType && { discountType: data.discountType }),
      ...(data.discountValue !== undefined && {
        discountValue: Math.max(1, Math.round(data.discountValue)),
      }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
      updatedAt: new Date(),
    })
    .where(eq(vouchers.id, id));

  revalidatePath('/admin/vouchers');
  return { success: true, message: 'Voucher berhasil diperbarui' };
}

export async function deleteVoucherAction(id: string) {
  await assertAdminMutation();

  await db.delete(vouchers).where(eq(vouchers.id, id));

  revalidatePath('/admin/vouchers');
  return { success: true, message: 'Voucher berhasil dihapus' };
}
