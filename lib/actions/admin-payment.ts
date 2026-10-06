'use server';

import { db, paymentGatewayConfigs } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { assertAdminMutation } from '@/lib/auth/guards';
import { PaymentProvider } from '@/lib/payment/types';
import { revalidatePath } from 'next/cache';

export async function getPaymentGatewayConfigsAction() {
  await assertAdminMutation();
  return db.select().from(paymentGatewayConfigs);
}

export async function setActivePaymentGatewayAction(provider: PaymentProvider) {
  await assertAdminMutation();

  await db.transaction(async (tx) => {
    // 1. Deactivate all gateways
    await tx
      .update(paymentGatewayConfigs)
      .set({ isActive: false, updatedAt: new Date() });

    // 2. Activate selected gateway (or insert if not exists)
    const [existing] = await tx
      .select()
      .from(paymentGatewayConfigs)
      .where(eq(paymentGatewayConfigs.provider, provider))
      .limit(1);

    if (existing) {
      await tx
        .update(paymentGatewayConfigs)
        .set({ isActive: true, updatedAt: new Date() })
        .where(eq(paymentGatewayConfigs.id, existing.id));
    } else {
      await tx.insert(paymentGatewayConfigs).values({
        provider,
        isActive: true,
        config: {},
      });
    }
  });

  revalidatePath('/admin/settings/payment');
  return { success: true, message: `Payment gateway aktif diubah menjadi ${provider}` };
}

export async function updatePaymentGatewayConfigAction(
  provider: PaymentProvider,
  config: Record<string, unknown>
) {
  await assertAdminMutation();

  const [existing] = await db
    .select()
    .from(paymentGatewayConfigs)
    .where(eq(paymentGatewayConfigs.provider, provider))
    .limit(1);

  if (existing) {
    await db
      .update(paymentGatewayConfigs)
      .set({
        config,
        updatedAt: new Date(),
      })
      .where(eq(paymentGatewayConfigs.id, existing.id));
  } else {
    await db.insert(paymentGatewayConfigs).values({
      provider,
      isActive: false,
      config,
    });
  }

  revalidatePath('/admin/settings/payment');
  return { success: true, message: `Konfigurasi ${provider} berhasil disimpan` };
}
