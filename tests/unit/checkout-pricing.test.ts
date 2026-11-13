import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

/**
 * Pure calculation logic mirroring checkout discount and order amount resolution
 */
function calculateOrderTotals(
  subtotal: number,
  voucher?: {
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    isActive: boolean;
  }
) {
  let discountTotal = 0;

  if (voucher && voucher.isActive) {
    if (voucher.discountType === 'percentage') {
      discountTotal = Math.round((subtotal * voucher.discountValue) / 100);
    } else if (voucher.discountType === 'fixed') {
      discountTotal = voucher.discountValue;
    }
    discountTotal = Math.min(discountTotal, subtotal);
  }

  const total = Math.max(0, subtotal - discountTotal);
  const isFreeProgram = total === 0;

  return {
    subtotal,
    discountTotal,
    total,
    isFreeProgram,
  };
}

describe('Checkout Pricing & Voucher Calculations', () => {
  it('should calculate standard price with no voucher', () => {
    const result = calculateOrderTotals(250000);
    assert.equal(result.subtotal, 250000);
    assert.equal(result.discountTotal, 0);
    assert.equal(result.total, 250000);
    assert.equal(result.isFreeProgram, false);
  });

  it('should apply percentage discount voucher accurately', () => {
    const result = calculateOrderTotals(200000, {
      discountType: 'percentage',
      discountValue: 20, // 20%
      isActive: true,
    });

    assert.equal(result.discountTotal, 40000);
    assert.equal(result.total, 160000);
    assert.equal(result.isFreeProgram, false);
  });

  it('should apply fixed discount voucher accurately', () => {
    const result = calculateOrderTotals(300000, {
      discountType: 'fixed',
      discountValue: 50000,
      isActive: true,
    });

    assert.equal(result.discountTotal, 50000);
    assert.equal(result.total, 250000);
    assert.equal(result.isFreeProgram, false);
  });

  it('should cap discount so total cannot be negative if fixed discount exceeds subtotal', () => {
    const result = calculateOrderTotals(50000, {
      discountType: 'fixed',
      discountValue: 100000,
      isActive: true,
    });

    assert.equal(result.discountTotal, 50000);
    assert.equal(result.total, 0);
    assert.equal(result.isFreeProgram, true);
  });

  it('should detect 100% discount as free program requiring gateway bypass', () => {
    const result = calculateOrderTotals(150000, {
      discountType: 'percentage',
      discountValue: 100,
      isActive: true,
    });

    assert.equal(result.discountTotal, 150000);
    assert.equal(result.total, 0);
    assert.equal(result.isFreeProgram, true);
  });

  it('should ignore inactive voucher', () => {
    const result = calculateOrderTotals(200000, {
      discountType: 'percentage',
      discountValue: 50,
      isActive: false,
    });

    assert.equal(result.discountTotal, 0);
    assert.equal(result.total, 200000);
    assert.equal(result.isFreeProgram, false);
  });

  it('should flag naturally free programs (price 0) as free without voucher', () => {
    const result = calculateOrderTotals(0);
    assert.equal(result.subtotal, 0);
    assert.equal(result.total, 0);
    assert.equal(result.isFreeProgram, true);
  });
});
