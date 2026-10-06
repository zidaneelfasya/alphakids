export type PaymentProvider = 'MIDTRANS' | 'MAYAR';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'expired' | 'refunded';

export type NormalizedEventStatus = 'SETTLEMENT' | 'PENDING' | 'EXPIRED' | 'FAILED';

export interface CustomerDetails {
  name: string;
  email: string;
  phone?: string;
}

export interface ItemDetail {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CreatePaymentParams {
  orderId: string;
  orderNumber: string;
  amount: number;
  programTitle: string;
  customer: CustomerDetails;
  items: ItemDetail[];
  metadata?: Record<string, unknown>;
}

export interface CreatePaymentResult {
  success: boolean;
  provider: PaymentProvider;
  providerPaymentId?: string;
  checkoutUrl?: string;
  token?: string; // Snap token for Midtrans embedded popup
  rawResponse?: unknown;
}

export interface NormalizedPaymentEvent {
  provider: PaymentProvider;
  providerPaymentId: string;
  orderNumber: string;
  orderId?: string;
  grossAmount: number;
  status: NormalizedEventStatus;
  rawStatus: string;
  transactionTime?: string;
  paymentType?: string;
  signatureValid: boolean;
  rawPayload: unknown;
}

export interface WebhookValidationResult {
  isValid: boolean;
  event?: NormalizedPaymentEvent;
  errorMessage?: string;
  statusCode?: number;
}

export interface PaymentGateway {
  readonly provider: PaymentProvider;
  
  /**
   * Generates a payment invoice / snap transaction with the gateway
   */
  createPayment(params: CreatePaymentParams): Promise<CreatePaymentResult>;

  /**
   * Verifies the authenticity of incoming webhook data and normalizes it
   */
  verifyAndParseWebhook(
    payload: unknown,
    headers: Headers,
    urlParams?: URLSearchParams
  ): Promise<WebhookValidationResult>;
}

export class NoActivePaymentGatewayError extends Error {
  constructor(message = 'Tidak ada payment gateway yang aktif. Silakan aktifkan Midtrans atau Mayar di Pengaturan Admin atau set environment variable.') {
    super(message);
    this.name = 'NoActivePaymentGatewayError';
  }
}

export class PaymentGatewayError extends Error {
  public provider: PaymentProvider;
  public details?: unknown;

  constructor(provider: PaymentProvider, message: string, details?: unknown) {
    super(`[${provider}] ${message}`);
    this.name = 'PaymentGatewayError';
    this.provider = provider;
    this.details = details;
  }
}
