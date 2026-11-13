import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { MidtransGatewayAdapter } from '../../lib/payment/adapters/midtrans';
import { MayarGatewayAdapter } from '../../lib/payment/adapters/mayar';

describe('Payment Gateway Adapters Unit Tests', () => {
  const testServerKey = 'SB-Mid-server-TESTKEY123';
  const midtrans = new MidtransGatewayAdapter({
    serverKey: testServerKey,
    clientKey: 'SB-Mid-client-TESTKEY123',
    isProduction: false,
  });

  describe('Midtrans Webhook Signature Verification', () => {
    const orderId = 'AK-123456-7890';
    const statusCode = '200';
    const grossAmount = '150000.00';

    const validSignature = crypto
      .createHash('sha512')
      .update(`${orderId}${statusCode}${grossAmount}${testServerKey}`)
      .digest('hex');

    it('should validate correctly signed Midtrans webhook payload', async () => {
      const payload = {
        order_id: orderId,
        status_code: statusCode,
        gross_amount: grossAmount,
        signature_key: validSignature,
        transaction_status: 'capture',
        fraud_status: 'accept',
        payment_type: 'credit_card',
        transaction_id: 'midtrans-tx-001',
      };

      const result = await midtrans.verifyAndParseWebhook(payload);
      assert.equal(result.isValid, true);
      assert.ok(result.event);
      assert.equal(result.event.status, 'SETTLEMENT');
      assert.equal(result.event.orderNumber, orderId);
      assert.equal(result.event.grossAmount, 150000);
    });

    it('should reject invalid signature with status 401', async () => {
      // Same length, wrong hex
      const tamperedSignature = 'a'.repeat(128);
      const payload = {
        order_id: orderId,
        status_code: statusCode,
        gross_amount: grossAmount,
        signature_key: tamperedSignature,
        transaction_status: 'settlement',
      };

      const result = await midtrans.verifyAndParseWebhook(payload);
      assert.equal(result.isValid, false);
      assert.equal(result.statusCode, 401);
    });

    it('should safely reject signature with mismatched length without throwing TypeError', async () => {
      // Arbitrary shorter length (would crash crypto.timingSafeEqual without length guard)
      const shortSignature = 'malicious-probe-payload';
      const payload = {
        order_id: orderId,
        status_code: statusCode,
        gross_amount: grossAmount,
        signature_key: shortSignature,
        transaction_status: 'settlement',
      };

      const result = await midtrans.verifyAndParseWebhook(payload);
      assert.equal(result.isValid, false);
      assert.equal(result.statusCode, 401);
    });

    it('should normalize various transaction statuses accurately', async () => {
      const basePayload = {
        order_id: orderId,
        status_code: statusCode,
        gross_amount: grossAmount,
        signature_key: validSignature,
        transaction_id: 'midtrans-tx-002',
      };

      // Test pending
      const pendingRes = await midtrans.verifyAndParseWebhook({
        ...basePayload,
        transaction_status: 'pending',
      });
      assert.equal(pendingRes.event?.status, 'PENDING');

      // Test settlement
      const settlementRes = await midtrans.verifyAndParseWebhook({
        ...basePayload,
        transaction_status: 'settlement',
      });
      assert.equal(settlementRes.event?.status, 'SETTLEMENT');

      // Test failure / cancel
      const cancelRes = await midtrans.verifyAndParseWebhook({
        ...basePayload,
        transaction_status: 'cancel',
      });
      assert.equal(cancelRes.event?.status, 'FAILED');
    });
  });

  describe('Mayar Webhook Secret Verification', () => {
    const testSecret = 'mayar-secret-key-xyz999';
    const mayar = new MayarGatewayAdapter({
      apiKey: 'test-api-key',
      webhookSecret: testSecret,
      isProduction: false,
    });

    it('should accept valid webhook secret in header', async () => {
      const headers = new Headers({
        'x-mayar-token': testSecret,
      });

      const payload = {
        event: 'payment.received',
        data: {
          id: 'mayar-tx-001',
          amount: 250000,
          status: 'success',
          extraData: {
            orderNumber: 'AK-999999-1111',
          },
        },
      };

      const result = await mayar.verifyAndParseWebhook(payload, headers);
      assert.equal(result.isValid, true);
      assert.equal(result.event?.status, 'SETTLEMENT');
      assert.equal(result.event?.orderNumber, 'AK-999999-1111');
      assert.equal(result.event?.grossAmount, 250000);
    });

    it('should reject missing or incorrect webhook secret with 401', async () => {
      const headers = new Headers({
        'x-mayar-token': 'wrong-secret-token',
      });

      const payload = {
        event: 'payment.received',
        data: { id: 'mayar-tx-002', amount: 100000 },
      };

      const result = await mayar.verifyAndParseWebhook(payload, headers);
      assert.equal(result.isValid, false);
      assert.equal(result.statusCode, 401);
    });
  });
});
