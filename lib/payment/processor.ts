import { db, orders, orderItems, payments, programAccess, voucherRedemptions, profiles, programs } from '@/lib/db';
import { eq, and } from 'drizzle-orm';
import { NormalizedPaymentEvent } from './types';
import { sendProgramAccessActivationEmail } from '@/lib/notifications/email';

export interface ProcessPaymentResult {
  success: boolean;
  message?: string;
  error?: string;
  orderId?: string;
  orderNumber?: string;
}

export class SharedPaymentProcessor {
  /**
   * Processes a normalized payment event from any provider (Midtrans, Mayar)
   * into the PostgreSQL database atomically using Drizzle ORM transactions.
   */
  static async process(event: NormalizedPaymentEvent): Promise<ProcessPaymentResult> {
    // 1. If status is SETTLEMENT, perform atomic state transition
    if (event.status === 'SETTLEMENT') {
      try {
        const result = await db.transaction(async (tx) => {
          // 1. Lock and fetch order
          const [order] = await tx
            .select()
            .from(orders)
            .where(eq(orders.orderNumber, event.orderNumber))
            .for('update');

          if (!order) {
            return { success: false, error: 'Order not found' };
          }

          // 2. State machine protection: if order is already paid, exit idempotently
          if (order.status === 'paid') {
            return {
              success: true,
              message: 'Order already paid',
              orderId: order.id,
            };
          }

          // 3. Amount verification (prevent amount tampering)
          const expectedAmount = Math.round(event.grossAmount);
          if (order.total !== expectedAmount) {
            return {
              success: false,
              error: `Amount mismatch: expected ${order.total}, received ${expectedAmount}`,
            };
          }

          // 4. Update or insert payment record
          const [existingPayment] = await tx
            .select()
            .from(payments)
            .where(and(eq(payments.orderId, order.id), eq(payments.provider, event.provider)))
            .limit(1);

          const paidAt = event.transactionTime ? new Date(event.transactionTime) : new Date();

          if (existingPayment) {
            await tx
              .update(payments)
              .set({
                status: 'paid',
                providerTransactionId: event.providerPaymentId,
                providerStatus: event.rawStatus,
                paymentMethod: event.paymentType || null,
                rawResponse: event.rawPayload || null,
                paidAt,
                updatedAt: new Date(),
              })
              .where(eq(payments.id, existingPayment.id));
          } else {
            await tx.insert(payments).values({
              orderId: order.id,
              provider: event.provider,
              providerTransactionId: event.providerPaymentId,
              status: 'paid',
              amount: expectedAmount,
              providerStatus: event.rawStatus,
              paymentMethod: event.paymentType || null,
              rawResponse: event.rawPayload || null,
              paidAt,
            });
          }

          // 5. Update order status to 'paid'
          await tx
            .update(orders)
            .set({
              status: 'paid',
              updatedAt: new Date(),
            })
            .where(eq(orders.id, order.id));

          // 6. Grant Program Access for all items in this order
          const items = await tx
            .select()
            .from(orderItems)
            .where(eq(orderItems.orderId, order.id));

          for (const item of items) {
            await tx
              .insert(programAccess)
              .values({
                userId: order.userId,
                programId: item.programId,
                orderId: order.id,
                status: 'active',
                grantedAt: paidAt,
              })
              .onConflictDoUpdate({
                target: [programAccess.userId, programAccess.programId],
                set: {
                  status: 'active',
                  revokedAt: null,
                  updatedAt: new Date(),
                },
              });
          }

          // 7. Record Voucher Redemption ONLY upon successful settlement
          if (order.voucherId && order.discountTotal > 0) {
            await tx
              .insert(voucherRedemptions)
              .values({
                voucherId: order.voucherId,
                userId: order.userId,
                orderId: order.id,
                discountAmount: order.discountTotal,
                redeemedAt: paidAt,
              })
              .onConflictDoNothing();
          }

          return {
            success: true,
            message: 'Payment settled and program access granted',
            orderId: order.id,
          };
        });

        // Trigger transactional email notification (non-blocking)
        (async () => {
          try {
            const [order] = await db
              .select()
              .from(orders)
              .where(eq(orders.orderNumber, event.orderNumber));

            if (order) {
              const [userProfile] = await db
                .select()
                .from(profiles)
                .where(eq(profiles.id, order.userId));

              const [item] = await db
                .select({
                  title: programs.title,
                  slug: programs.slug,
                })
                .from(orderItems)
                .innerJoin(programs, eq(orderItems.programId, programs.id))
                .where(eq(orderItems.orderId, order.id));

              if (userProfile?.email && item) {
                await sendProgramAccessActivationEmail({
                  toEmail: userProfile.email,
                  recipientName: userProfile.fullName,
                  programTitle: item.title,
                  orderNumber: order.orderNumber,
                  accessUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://alphakids.id'}/dashboard/programs/${item.slug}`,
                });
              }
            }
          } catch (e) {
            console.error('[EMAIL DISPATCH ERROR]', e);
          }
        })();

        return {
          ...result,
          orderNumber: event.orderNumber,
        };
      } catch (err: unknown) {
        console.error('Transaction error in SharedPaymentProcessor:', err);
        return {
          success: false,
          error: err instanceof Error ? err.message : 'Database transaction failed',
          orderNumber: event.orderNumber,
        };
      }
    }

    // 2. If status is FAILED or EXPIRED, update payment & order without downgrading if already paid
    if (event.status === 'FAILED' || event.status === 'EXPIRED') {
      const targetStatus = event.status === 'EXPIRED' ? 'expired' : 'failed';

      const [order] = await db
        .select({ id: orders.id, status: orders.status })
        .from(orders)
        .where(eq(orders.orderNumber, event.orderNumber))
        .limit(1);

      if (!order) {
        return {
          success: false,
          error: `Order ${event.orderNumber} not found`,
        };
      }

      // State machine invariant: DO NOT DOWNGRADE if order already paid
      if (order.status === 'paid') {
        return {
          success: true,
          message: 'Order already finalized as paid; ignoring failure event.',
          orderId: order.id,
          orderNumber: event.orderNumber,
        };
      }

      await db
        .update(orders)
        .set({ status: targetStatus, updatedAt: new Date() })
        .where(eq(orders.id, order.id));

      await db
        .update(payments)
        .set({
          status: targetStatus,
          providerStatus: event.rawStatus,
          rawResponse: event.rawPayload || null,
          updatedAt: new Date(),
        })
        .where(and(eq(payments.orderId, order.id), eq(payments.provider, event.provider)));

      return {
        success: true,
        message: `Order marked as ${targetStatus}`,
        orderId: order.id,
        orderNumber: event.orderNumber,
      };
    }

    // 3. For PENDING events, update provider status on payment record
    if (event.status === 'PENDING') {
      const [order] = await db
        .select({ id: orders.id, status: orders.status })
        .from(orders)
        .where(eq(orders.orderNumber, event.orderNumber))
        .limit(1);

      if (order && order.status === 'pending') {
        await db
          .update(payments)
          .set({
            providerStatus: event.rawStatus,
            rawResponse: event.rawPayload || null,
            updatedAt: new Date(),
          })
          .where(and(eq(payments.orderId, order.id), eq(payments.provider, event.provider)));
      }

      return {
        success: true,
        message: 'Order pending payment',
        orderId: order?.id,
        orderNumber: event.orderNumber,
      };
    }

    return {
      success: true,
      message: 'Event processed without state mutation',
      orderNumber: event.orderNumber,
    };
  }
}
