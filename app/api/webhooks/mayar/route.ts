import { NextRequest, NextResponse } from 'next/server';
import { PaymentGatewayRegistry } from '@/lib/payment/registry';
import { SharedPaymentProcessor } from '@/lib/payment/processor';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Get Mayar adapter
    const gateway = await PaymentGatewayRegistry.getGatewayByProvider('MAYAR');

    // 2. Verify payload and optional webhook secret
    const validation = await gateway.verifyAndParseWebhook(
      body,
      req.headers,
      req.nextUrl.searchParams
    );

    if (!validation.isValid || !validation.event) {
      console.warn('Mayar webhook verification failed:', validation.errorMessage);
      return NextResponse.json(
        { error: validation.errorMessage || 'Invalid Mayar webhook' },
        { status: validation.statusCode || 400 }
      );
    }

    // 3. Process normalized event atomically
    const processResult = await SharedPaymentProcessor.process(validation.event);

    if (!processResult.success) {
      console.error('Failed to process Mayar settlement:', processResult.error);
      return NextResponse.json(
        { error: processResult.error || 'Processing error' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      status: 'ok',
      message: processResult.message,
      orderNumber: processResult.orderNumber,
    });
  } catch (error: unknown) {
    console.error('Unhandled error in Mayar webhook handler:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}
