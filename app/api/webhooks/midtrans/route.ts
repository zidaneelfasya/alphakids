import { NextRequest, NextResponse } from 'next/server';
import { PaymentGatewayRegistry } from '@/lib/payment/registry';
import { SharedPaymentProcessor } from '@/lib/payment/processor';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Get Midtrans adapter
    const gateway = await PaymentGatewayRegistry.getGatewayByProvider('MIDTRANS');

    // 2. Verify signature and parse payload
    const validation = await gateway.verifyAndParseWebhook(body, req.headers);

    if (!validation.isValid || !validation.event) {
      console.warn('Midtrans webhook verification failed:', validation.errorMessage);
      return NextResponse.json(
        { error: validation.errorMessage || 'Invalid webhook signature' },
        { status: validation.statusCode || 400 }
      );
    }

    // 3. Process normalized event atomically
    const processResult = await SharedPaymentProcessor.process(validation.event);

    if (!processResult.success) {
      console.error('Failed to process Midtrans settlement:', processResult.error);
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
    console.error('Unhandled error in Midtrans webhook handler:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}
