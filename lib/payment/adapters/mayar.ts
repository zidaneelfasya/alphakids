import {
  PaymentGateway,
  PaymentProvider,
  CreatePaymentParams,
  CreatePaymentResult,
  WebhookValidationResult,
  NormalizedPaymentEvent,
  PaymentGatewayError,
} from '../types';

export interface MayarConfig {
  apiKey: string;
  webhookSecret?: string;
  baseUrl?: string;
  isProduction?: boolean;
}

export class MayarGatewayAdapter implements PaymentGateway {
  public readonly provider: PaymentProvider = 'MAYAR';
  private config: MayarConfig;

  constructor(config: MayarConfig) {
    if (!config.apiKey) {
      throw new Error('MayarGatewayAdapter requires apiKey.');
    }
    this.config = config;
  }

  private get apiBaseUrl(): string {
    if (this.config.baseUrl) {
      return this.config.baseUrl.replace(/\/+$/, '');
    }
    return this.config.isProduction !== false
      ? 'https://api.mayar.id'
      : 'https://api.mayar.io';
  }

  async createPayment(params: CreatePaymentParams): Promise<CreatePaymentResult> {
    const url = `${this.apiBaseUrl}/hl/v2/invoices/create`;

    // Ensure phone number exists as Mayar requires a valid mobile string
    const mobile = params.customer.phone && params.customer.phone.trim().length >= 8
      ? params.customer.phone.trim()
      : '081234567890';

    const payload = {
      name: params.customer.name,
      email: params.customer.email,
      mobile: mobile,
      description: `Pembelian: ${params.programTitle}`,
      items: params.items.map((item) => ({
        quantity: item.quantity,
        rate: Math.round(item.price),
        description: item.name.slice(0, 100),
      })),
      extraData: {
        orderId: params.orderId,
        orderNumber: params.orderNumber,
        ...(params.metadata || {}),
      },
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify(payload),
      });

      const resBody = await response.json();

      if (!response.ok || !resBody.data?.link) {
        const errorMsg =
          resBody.messages ||
          resBody.message ||
          (typeof resBody.errors === 'string' ? resBody.errors : null) ||
          'Gagal membuat invoice Mayar';
        throw new PaymentGatewayError('MAYAR', errorMsg, resBody);
      }

      return {
        success: true,
        provider: 'MAYAR',
        providerPaymentId: resBody.data.id || resBody.data.transactionId,
        checkoutUrl: resBody.data.link,
        rawResponse: resBody,
      };
    } catch (err: unknown) {
      if (err instanceof PaymentGatewayError) throw err;
      throw new PaymentGatewayError(
        'MAYAR',
        err instanceof Error ? err.message : 'Koneksi ke Mayar API gagal',
        err
      );
    }
  }

  async verifyAndParseWebhook(
    payload: unknown,
    headers: Headers,
    urlParams?: URLSearchParams
  ): Promise<WebhookValidationResult> {
    if (!payload || typeof payload !== 'object') {
      return { isValid: false, errorMessage: 'Invalid webhook payload structure' };
    }

    // Security Verification: Check webhook secret if configured
    if (this.config.webhookSecret) {
      const providedSecret =
        headers.get('x-mayar-token') ||
        headers.get('x-callback-token') ||
        headers.get('authorization')?.replace('Bearer ', '') ||
        urlParams?.get('secret');

      if (!providedSecret || providedSecret !== this.config.webhookSecret) {
        return {
          isValid: false,
          errorMessage: 'Invalid Mayar webhook secret/token',
          statusCode: 401,
        };
      }
    }

    const body = payload as Record<string, unknown>;
    const eventName = String(body.event || body['event.received'] || '');
    const data = (body.data || {}) as Record<string, unknown>;
    const extraData = (data.extraData || {}) as Record<string, unknown>;

    // Order identification: either from extraData.orderNumber or orderId
    const orderNumber = String(extraData.orderNumber || data.orderNumber || '');
    const orderId = String(extraData.orderId || data.orderId || '');
    const providerPaymentId = String(data.id || data.transactionId || '');
    const amount = Number(data.amount) || 0;

    if (!orderNumber && !orderId) {
      return {
        isValid: false,
        errorMessage: 'Webhook payload does not contain order identification (extraData.orderNumber / orderId)',
      };
    }

    let status: NormalizedPaymentEvent['status'] = 'PENDING';
    if (eventName === 'payment.received' || data.status === true || data.status === 'PAID') {
      status = 'SETTLEMENT';
    } else if (eventName === 'payment.failed' || data.status === false) {
      status = 'FAILED';
    } else if (eventName === 'payment.reminder') {
      status = 'PENDING';
    }

    const event: NormalizedPaymentEvent = {
      provider: 'MAYAR',
      providerPaymentId,
      orderNumber,
      orderId: orderId || undefined,
      grossAmount: amount,
      status,
      rawStatus: eventName || String(data.status),
      transactionTime: String(data.createdAt || data.updatedAt || new Date().toISOString()),
      signatureValid: true,
      rawPayload: payload,
    };

    return { isValid: true, event };
  }
}
