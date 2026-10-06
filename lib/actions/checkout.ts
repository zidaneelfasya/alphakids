'use server';

import { db, programs, programAccess, vouchers, orders, orderItems, payments } from '@/lib/db';
import { eq, and } from 'drizzle-orm';
import { requireAuth } from '@/lib/auth/guards';
import { PaymentGatewayRegistry } from '@/lib/payment/registry';
import { NoActivePaymentGatewayError, PaymentProvider } from '@/lib/payment/types';

export interface CheckoutResult {
  success: boolean;
  error?: string;
  orderNumber?: string;
  checkoutUrl?: string;
  snapToken?: string;
  provider?: PaymentProvider;
}

export async function createOrderAndInitiatePayment(
  programId: string,
  voucherCode?: string
): Promise<CheckoutResult> {
  try {
    const { user, profile } = await requireAuth('/programs');

    // 1. Verify program exists and is active
    const [program] = await db
      .select()
      .from(programs)
      .where(and(eq(programs.id, programId), eq(programs.isActive, true)))
      .limit(1);

    if (!program) {
      return { success: false, error: 'Program tidak ditemukan atau tidak aktif' };
    }

    // 2. Check if user is already enrolled (active program_access)
    const [existingAccess] = await db
      .select()
      .from(programAccess)
      .where(
        and(
          eq(programAccess.userId, user.id),
          eq(programAccess.programId, program.id),
          eq(programAccess.status, 'active')
        )
      )
      .limit(1);

    if (existingAccess) {
      return {
        success: false,
        error: 'Anda sudah terdaftar dan memiliki akses aktif ke program ini.',
      };
    }

    // 3. Calculate price and discount
    const subtotal = program.price;
    let discountTotal = 0;
    let voucherId: string | null = null;

    if (voucherCode && voucherCode.trim()) {
      const normalizedCode = voucherCode.trim().toUpperCase();
      const [voucher] = await db
        .select()
        .from(vouchers)
        .where(and(eq(vouchers.code, normalizedCode), eq(vouchers.isActive, true)))
        .limit(1);

      if (voucher) {
        voucherId = voucher.id;
        if (voucher.discountType === 'percentage') {
          discountTotal = Math.round((subtotal * voucher.discountValue) / 100);
        } else if (voucher.discountType === 'fixed') {
          discountTotal = voucher.discountValue;
        }
        discountTotal = Math.min(discountTotal, subtotal);
      }
    }

    const total = Math.max(0, subtotal - discountTotal);

    // 4. Generate order number
    const timestamp = Date.now().toString().slice(-6);
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `AK-${timestamp}-${randomSuffix}`;

    // 5. Resolve active payment gateway
    // STRICT RULE: No silent fallback to Midtrans. If no provider is active, throws error.
    let gateway;
    try {
      gateway = await PaymentGatewayRegistry.getActiveGateway();
    } catch (gwErr) {
      if (gwErr instanceof NoActivePaymentGatewayError) {
        console.error('Checkout failed: No active payment gateway:', gwErr.message);
        return {
          success: false,
          error: 'Layanan pembayaran sedang dalam pemeliharaan. Silakan hubungi admin.',
        };
      }
      throw gwErr;
    }

    // 6. Insert Order (status: 'pending')
    const [order] = await db
      .insert(orders)
      .values({
        userId: user.id,
        orderNumber,
        status: 'pending',
        subtotal,
        discountTotal,
        total,
        voucherId,
      })
      .returning();

    if (!order) {
      return { success: false, error: 'Gagal membuat pesanan. Silakan coba lagi.' };
    }

    // 7. Insert Order Item (1 order = 1 item MVP constraint)
    await db.insert(orderItems).values({
      orderId: order.id,
      programId: program.id,
      priceAtPurchase: subtotal,
      quantity: 1,
    });

    // 8. Insert initial Payment record
    await db.insert(payments).values({
      orderId: order.id,
      provider: gateway.provider,
      amount: total,
      status: 'pending',
    });

    // 9. Call gateway adapter to generate checkout link or snap token
    const paymentResult = await gateway.createPayment({
      orderId: order.id,
      orderNumber: order.orderNumber,
      amount: total,
      programTitle: program.title,
      customer: {
        name: profile?.full_name || user.email?.split('@')[0] || 'Peserta',
        email: user.email || '',
        phone: profile?.phone || undefined,
      },
      items: [
        {
          id: program.id,
          name: program.title,
          price: total,
          quantity: 1,
        },
      ],
      metadata: {
        programId: program.id,
        programSlug: program.slug,
      },
    });

    // 10. Update payment record with provider payment ID
    if (paymentResult.providerPaymentId) {
      await db
        .update(payments)
        .set({
          providerTransactionId: paymentResult.providerPaymentId,
          rawResponse: paymentResult.rawResponse || null,
          updatedAt: new Date(),
        })
        .where(and(eq(payments.orderId, order.id), eq(payments.provider, gateway.provider)));
    }

    return {
      success: true,
      orderNumber: order.orderNumber,
      checkoutUrl: paymentResult.checkoutUrl,
      snapToken: paymentResult.token,
      provider: paymentResult.provider,
    };
  } catch (err: unknown) {
    console.error('Checkout action uncaught error:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Terjadi kesalahan saat memproses checkout.',
    };
  }
}
