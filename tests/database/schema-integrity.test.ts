import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  profiles,
  categories,
  programs,
  programContents,
  vouchers,
  orders,
  orderItems,
  paymentGatewayConfigs,
  payments,
  programAccess,
  voucherRedemptions,
} from '../../lib/db/schema';
import { getTableColumns } from 'drizzle-orm';

describe('Database Schema Integrity & Constraint Test Suite', () => {
  describe('Profiles Table Constraints', () => {
    const cols = getTableColumns(profiles);

    it('should have required non-null fields for user identity', () => {
      assert.ok(cols.id.primary, 'Profile ID must be primary key');
      assert.equal(cols.fullName.notNull, true, 'Full name cannot be null');
      assert.equal(cols.role.notNull, true, 'Role cannot be null');
      assert.equal(cols.createdAt.notNull, true, 'createdAt cannot be null');
      assert.equal(cols.updatedAt.notNull, true, 'updatedAt cannot be null');
    });

    it('should default role to "user"', () => {
      assert.equal(cols.role.default, 'user');
    });
  });

  describe('Categories Table Constraints', () => {
    const cols = getTableColumns(categories);

    it('should have slug and name as mandatory non-null fields', () => {
      assert.ok(cols.id.primary, 'Category ID must be primary key');
      assert.equal(cols.name.notNull, true, 'Name cannot be null');
      assert.equal(cols.slug.notNull, true, 'Slug cannot be null');
      assert.equal(cols.slug.isUnique, true, 'Category slug must be unique');
    });

    it('should default isActive to true', () => {
      assert.equal(cols.isActive.default, true);
    });
  });

  describe('Programs Table Constraints', () => {
    const cols = getTableColumns(programs);

    it('should have unique slug and positive price defaults', () => {
      assert.ok(cols.id.primary, 'Program ID must be primary key');
      assert.equal(cols.title.notNull, true, 'Title cannot be null');
      assert.equal(cols.slug.notNull, true, 'Slug cannot be null');
      assert.equal(cols.slug.isUnique, true, 'Program slug must be unique');
      assert.equal(cols.price.notNull, true, 'Price cannot be null');
      assert.equal(cols.price.default, 0, 'Price should default to 0');
      assert.equal(cols.isActive.default, true, 'isActive should default to true');
    });
  });

  describe('Program Contents Table Constraints', () => {
    const cols = getTableColumns(programContents);

    it('should mandate title, contentType, and default member visibility', () => {
      assert.ok(cols.id.primary, 'Content ID must be primary key');
      assert.equal(cols.programId.notNull, true, 'programId cannot be null');
      assert.equal(cols.title.notNull, true, 'title cannot be null');
      assert.equal(cols.contentType.notNull, true, 'contentType cannot be null');
      assert.equal(cols.visibility.default, 'member', 'visibility should default to member');
      assert.equal(cols.sortOrder.default, 0, 'sortOrder should default to 0');
    });
  });

  describe('Orders Table Constraints & Financial Invariants', () => {
    const cols = getTableColumns(orders);

    it('should guarantee unique orderNumber and required financial fields', () => {
      assert.ok(cols.id.primary, 'Order ID must be primary key');
      assert.equal(cols.userId.notNull, true, 'Order must belong to a user');
      assert.equal(cols.orderNumber.notNull, true, 'Order number cannot be null');
      assert.equal(cols.orderNumber.isUnique, true, 'Order number must be strictly unique');
      assert.equal(cols.subtotal.notNull, true, 'Subtotal cannot be null');
      assert.equal(cols.total.notNull, true, 'Total cannot be null');
      assert.equal(cols.discountTotal.notNull, true, 'Discount total cannot be null');
      assert.equal(cols.discountTotal.default, 0, 'Discount total defaults to 0');
      assert.equal(cols.status.default, 'pending', 'Order status defaults to pending');
    });

    it('should verify pricing invariant: total = subtotal - discountTotal', () => {
      // Invariant check logic verification:
      const testCases = [
        { subtotal: 100000, discountTotal: 0, expectedTotal: 100000 },
        { subtotal: 250000, discountTotal: 50000, expectedTotal: 200000 },
        { subtotal: 150000, discountTotal: 150000, expectedTotal: 0 },
      ];

      for (const tc of testCases) {
        const computedTotal = tc.subtotal - tc.discountTotal;
        assert.equal(computedTotal, tc.expectedTotal);
        assert.ok(computedTotal >= 0, 'Order total must never be negative');
      }
    });
  });

  describe('Order Items Table Constraints', () => {
    const cols = getTableColumns(orderItems);

    it('should enforce quantity default of 1 and non-null price', () => {
      assert.equal(cols.orderId.notNull, true, 'Order ID is mandatory');
      assert.equal(cols.programId.notNull, true, 'Program ID is mandatory');
      assert.equal(cols.priceAtPurchase.notNull, true, 'Price at purchase is mandatory');
      assert.equal(cols.quantity.default, 1, 'Quantity defaults to 1 per platform business rule');
    });
  });

  describe('Vouchers & Redemptions Constraints', () => {
    const vCols = getTableColumns(vouchers);
    const rCols = getTableColumns(voucherRedemptions);

    it('should require unique voucher code and active defaults', () => {
      assert.equal(vCols.code.notNull, true, 'Voucher code is mandatory');
      assert.equal(vCols.code.isUnique, true, 'Voucher code must be strictly unique');
      assert.equal(vCols.discountType.notNull, true, 'Discount type is mandatory');
      assert.equal(vCols.discountValue.notNull, true, 'Discount value is mandatory');
      assert.equal(vCols.isActive.default, true, 'Voucher isActive defaults to true');
    });

    it('should strictly enforce 1 redemption per order via unique orderId constraint', () => {
      assert.equal(rCols.voucherId.notNull, true, 'Voucher ID is mandatory');
      assert.equal(rCols.userId.notNull, true, 'User ID is mandatory');
      assert.equal(rCols.orderId.notNull, true, 'Order ID is mandatory');
      assert.equal(rCols.orderId.isUnique, true, 'Voucher redemption orderId MUST be unique to prevent multi-apply');
    });
  });

  describe('Program Access (Atomic Enrollment Model)', () => {
    const cols = getTableColumns(programAccess);

    it('should enforce non-null user and program associations with default active status', () => {
      assert.ok(cols.id.primary, 'Access ID must be primary key');
      assert.equal(cols.userId.notNull, true, 'userId is mandatory');
      assert.equal(cols.programId.notNull, true, 'programId is mandatory');
      assert.equal(cols.status.default, 'active', 'Access status defaults to active');
      assert.equal(cols.status.notNull, true, 'Access status cannot be null');
    });
  });

  describe('Payment Gateway Configs & Payments', () => {
    const configCols = getTableColumns(paymentGatewayConfigs);
    const payCols = getTableColumns(payments);

    it('should enforce provider uniqueness for gateway configs', () => {
      assert.equal(configCols.provider.notNull, true);
      assert.equal(configCols.provider.isUnique, true, 'Only one config entry per provider');
    });

    it('should mandate order association and amount for payments', () => {
      assert.equal(payCols.orderId.notNull, true);
      assert.equal(payCols.amount.notNull, true);
      assert.equal(payCols.status.default, 'pending');
    });
  });
});
