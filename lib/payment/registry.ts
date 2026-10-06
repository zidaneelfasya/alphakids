import { db, paymentGatewayConfigs } from '@/lib/db';
import { eq } from 'drizzle-orm';
import {
  PaymentGateway,
  PaymentProvider,
  NoActivePaymentGatewayError,
  PaymentGatewayError,
} from './types';
import { MidtransGatewayAdapter } from './adapters/midtrans';
import { MayarGatewayAdapter } from './adapters/mayar';

export class PaymentGatewayRegistry {
  /**
   * Retrieves the currently active payment gateway.
   * STRICT RULE: Will NEVER silently fallback to Midtrans if no provider is active.
   */
  static async getActiveGateway(): Promise<PaymentGateway> {
    let activeProvider: PaymentProvider | null = null;
    let dbConfig: Record<string, unknown> | null = null;

    // 1. Try to read active gateway from database configuration via Drizzle
    try {
      const [activeRow] = await db
        .select()
        .from(paymentGatewayConfigs)
        .where(eq(paymentGatewayConfigs.isActive, true))
        .limit(1);

      if (activeRow) {
        activeProvider = activeRow.provider as PaymentProvider;
        dbConfig = (activeRow.config as Record<string, unknown>) || {};
      }
    } catch (err) {
      console.warn('Could not query payment_gateway_configs table, falling back to environment variables:', err);
    }

    // 2. Fall back to environment variable if no active DB configuration was found
    if (!activeProvider) {
      const envActive = (process.env.ACTIVE_PAYMENT_GATEWAY || '').trim().toUpperCase();
      if (envActive === 'MIDTRANS' || envActive === 'MAYAR') {
        activeProvider = envActive as PaymentProvider;
      }
    }

    // 3. STRICT CHECK: If still no active provider, THROW EXPLICIT ERROR. NEVER SILENTLY FALLBACK!
    if (!activeProvider) {
      throw new NoActivePaymentGatewayError(
        'Tidak ada payment gateway yang aktif. Harap aktifkan Midtrans atau Mayar di Pengaturan Admin atau set ACTIVE_PAYMENT_GATEWAY di environment.'
      );
    }

    return this.createAdapter(activeProvider, dbConfig);
  }

  /**
   * Retrieves a specific gateway adapter by provider name (useful for webhook routing)
   */
  static async getGatewayByProvider(
    provider: PaymentProvider
  ): Promise<PaymentGateway> {
    let dbConfig: Record<string, unknown> | null = null;

    try {
      const [configRow] = await db
        .select()
        .from(paymentGatewayConfigs)
        .where(eq(paymentGatewayConfigs.provider, provider))
        .limit(1);

      if (configRow) {
        dbConfig = (configRow.config as Record<string, unknown>) || {};
      }
    } catch (err) {
      console.warn(`Could not load config for ${provider}:`, err);
    }

    return this.createAdapter(provider, dbConfig);
  }

  /**
   * Instantiates the appropriate adapter with merged DB + ENV configuration
   */
  private static createAdapter(
    provider: PaymentProvider,
    dbConfig: Record<string, unknown> | null
  ): PaymentGateway {
    if (provider === 'MIDTRANS') {
      const serverKey =
        (dbConfig?.serverKey as string) ||
        (dbConfig?.server_key as string) ||
        process.env.MIDTRANS_SERVER_KEY ||
        '';

      const clientKey =
        (dbConfig?.clientKey as string) ||
        (dbConfig?.client_key as string) ||
        process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY ||
        '';

      const isProduction =
        dbConfig?.isProduction !== undefined
          ? Boolean(dbConfig.isProduction)
          : process.env.MIDTRANS_IS_PRODUCTION === 'true';

      if (!serverKey) {
        throw new PaymentGatewayError(
          'MIDTRANS',
          'Konfigurasi Midtrans tidak lengkap: Server Key belum disetel.'
        );
      }

      return new MidtransGatewayAdapter({
        serverKey,
        clientKey,
        isProduction,
      });
    }

    if (provider === 'MAYAR') {
      const apiKey =
        (dbConfig?.apiKey as string) ||
        (dbConfig?.api_key as string) ||
        process.env.MAYAR_API_KEY ||
        '';

      const webhookSecret =
        (dbConfig?.webhookSecret as string) ||
        (dbConfig?.webhook_secret as string) ||
        process.env.MAYAR_WEBHOOK_SECRET ||
        '';

      const baseUrl =
        (dbConfig?.baseUrl as string) ||
        (dbConfig?.base_url as string) ||
        process.env.MAYAR_BASE_URL ||
        '';

      const isProduction =
        dbConfig?.isProduction !== undefined
          ? Boolean(dbConfig.isProduction)
          : process.env.NODE_ENV === 'production';

      if (!apiKey) {
        throw new PaymentGatewayError(
          'MAYAR',
          'Konfigurasi Mayar tidak lengkap: API Key belum disetel.'
        );
      }

      return new MayarGatewayAdapter({
        apiKey,
        webhookSecret,
        baseUrl,
        isProduction,
      });
    }

    throw new NoActivePaymentGatewayError(`Provider "${provider}" tidak didukung.`);
  }
}
