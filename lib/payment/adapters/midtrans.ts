import crypto from 'crypto';
import {
  PaymentGateway,
  PaymentProvider,
  CreatePaymentParams,
  CreatePaymentResult,
  WebhookValidationResult,
  NormalizedPaymentEvent,
  PaymentGatewayError,
} from '../types';

export interface MidtransConfig {
  serverKey: string;
  clientKey?: string;
  isProduction: boolean;
}

export class MidtransGatewayAdapter implements PaymentGateway {
  public readonly provider: PaymentProvider = 'MIDTRANS';
  private config: MidtransConfig;

  constructor(config: MidtransConfig) {
    if (!config.serverKey) {
      throw new Error('MidtransGatewayAdapter requires serverKey.');
    }
    this.config = config;
  }

  private get snapApiUrl(): string {
    return this.config.isProduction
      ? 'https://app.midtrans.com/snap/v1/transactions'
      : 'https://app.sandbox.midtrans.com/snap/v1/transactions';
  }

  async createPayment(params: CreatePaymentParams): Promise<CreatePaymentResult> {
    const authString = Buffer.from(`${this.config.serverKey}:`).toString('base64');

    const payload = {
      transaction_details: {
        order_id: params.orderNumber,
        gross_amount: Math.round(params.amount),
      },
      customer_details: {
        first_name: params.customer.name,
        email: params.customer.email,
        phone: params.customer.phone || '',
      },
      item_details: params.items.map((item) => ({
        id: item.id,
        price: Math.round(item.price),
        quantity: item.quantity,
        name: item.name.slice(0, 50),
      })),
      callbacks: {
        finish: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard/programs`,
      },
    };

    try {
      const response = await fetch(this.snapApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Basic ${authString}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.token) {
        throw new PaymentGatewayError(
          'MIDTRANS',
          data.error_messages ? data.error_messages.join(', ') : 'Gagal membuat transaksi Midtrans Snap',
          data
        );
      }

      return {
        success: true,
        provider: 'MIDTRANS',
        providerPaymentId: params.orderNumber,
        token: data.token,
        checkoutUrl: data.redirect_url,
        rawResponse: data,
      };
    } catch (err: unknown) {
      if (err instanceof PaymentGatewayError) throw err;
      throw new PaymentGatewayError(
        'MIDTRANS',
        err instanceof Error ? err.message : 'Koneksi ke Midtrans gagal',
        err
      );
    }
  }

  async verifyAndParseWebhook(
    payload: unknown
  ): Promise<WebhookValidationResult> {
    if (!payload || typeof payload !== 'object') {
      return { isValid: false, errorMessage: 'Invalid webhook payload structure' };
    }

    const data = payload as Record<string, unknown>;
    const orderId = String(data.order_id || '');
    const statusCode = String(data.status_code || '');
    const grossAmount = String(data.gross_amount || '');
    const signatureKey = String(data.signature_key || '');
    const transactionStatus = String(data.transaction_status || '');
    const fraudStatus = String(data.fraud_status || '');

    if (!orderId || !statusCode || !grossAmount || !signatureKey) {
      return { isValid: false, errorMessage: 'Missing required signature verification fields' };
    }

    // SHA512(order_id + status_code + gross_amount + ServerKey)
    const expectedSignature = crypto
      .createHash('sha512')
      .update(`${orderId}${statusCode}${grossAmount}${this.config.serverKey}`)
      .digest('hex');

    const signatureValid = crypto.timingSafeEqual(
      Buffer.from(signatureKey, 'utf8'),
      Buffer.from(expectedSignature, 'utf8')
    );

    if (!signatureValid) {
      return { isValid: false, errorMessage: 'Invalid Midtrans signature key', statusCode: 401 };
    }

    let normalizedStatus: NormalizedPaymentEvent['status'] = 'PENDING';

    if (transactionStatus === 'capture') {
      if (fraudStatus === 'accept') {
        normalizedStatus = 'SETTLEMENT';
      } else if (fraudStatus === 'challenge') {
        normalizedStatus = 'PENDING';
      } else {
        normalizedStatus = 'FAILED';
      }
    } else if (transactionStatus === 'settlement') {
      normalizedStatus = 'SETTLEMENT';
    } else if (['cancel', 'deny'].includes(transactionStatus)) {
      normalizedStatus = 'FAILED';
    } else if (transactionStatus === 'expire') {
      normalizedStatus = 'EXPIRED';
    } else if (transactionStatus === 'pending') {
      normalizedStatus = 'PENDING';
    }

    const event: NormalizedPaymentEvent = {
      provider: 'MIDTRANS',
      providerPaymentId: String(data.transaction_id || orderId),
      orderNumber: orderId,
      grossAmount: parseFloat(grossAmount) || 0,
      status: normalizedStatus,
      rawStatus: transactionStatus,
      transactionTime: String(data.transaction_time || ''),
      paymentType: String(data.payment_type || ''),
      signatureValid: true,
      rawPayload: payload,
    };

    return { isValid: true, event };
  }
}
