import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  unique,
  check,
} from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

// ------------------------------------------------------------------------------
// 1. Profiles (mirrors auth.users)
// ------------------------------------------------------------------------------
export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey(),
  fullName: text('full_name').notNull(),
  email: text('email'),
  avatarUrl: text('avatar_url'),
  phone: text('phone'),
  role: text('role', { enum: ['user', 'admin'] }).default('user').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// ------------------------------------------------------------------------------
// 2. Categories
// ------------------------------------------------------------------------------
export const categories = pgTable('categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// ------------------------------------------------------------------------------
// 3. Programs
// ------------------------------------------------------------------------------
export const programs = pgTable(
  'programs',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    categoryId: uuid('category_id').references(() => categories.id, { onDelete: 'set null' }),
    title: text('title').notNull(),
    slug: text('slug').notNull().unique(),
    description: text('description'),
    price: integer('price').default(0).notNull(),
    coverImage: text('cover_image'),
    ageRange: text('age_range'),
    level: text('level'),
    isActive: boolean('is_active').default(true).notNull(),
    publishedAt: timestamp('published_at', { withTimezone: true }).defaultNow(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    check('programs_price_check', sql`${table.price} >= 0`),
  ]
);

// ------------------------------------------------------------------------------
// 4. Program Contents (Dynamic Content with Visibility: public vs member)
// ------------------------------------------------------------------------------
export const programContents = pgTable('program_contents', {
  id: uuid('id').defaultRandom().primaryKey(),
  programId: uuid('program_id').references(() => programs.id, { onDelete: 'cascade' }).notNull(),
  title: text('title').notNull(),
  contentType: text('content_type').notNull(), // 'whatsapp_group' | 'zoom_link' | 'google_drive' | 'lesson' | 'text' | 'file'
  url: text('url'),
  content: text('content'),
  visibility: text('visibility', { enum: ['public', 'member'] }).default('member').notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// ------------------------------------------------------------------------------
// 5. Vouchers (MVP Rules strictly: percentage or fixed)
// ------------------------------------------------------------------------------
export const vouchers = pgTable(
  'vouchers',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    code: text('code').notNull().unique(),
    discountType: text('discount_type', { enum: ['percentage', 'fixed'] }).notNull(),
    discountValue: integer('discount_value').notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    check('vouchers_discount_value_check', sql`${table.discountValue} > 0`),
  ]
);

// ------------------------------------------------------------------------------
// 6. Orders
// ------------------------------------------------------------------------------
export const orders = pgTable(
  'orders',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').references(() => profiles.id, { onDelete: 'cascade' }).notNull(),
    orderNumber: text('order_number').notNull().unique(),
    status: text('status', {
      enum: ['draft', 'pending', 'paid', 'expired', 'failed', 'cancelled'],
    }).default('pending').notNull(),
    subtotal: integer('subtotal').notNull(),
    discountTotal: integer('discount_total').default(0).notNull(),
    total: integer('total').notNull(),
    voucherId: uuid('voucher_id').references(() => vouchers.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    check('orders_subtotal_check', sql`${table.subtotal} >= 0`),
    check('orders_discount_total_check', sql`${table.discountTotal} >= 0`),
    check('orders_total_check', sql`${table.total} >= 0`),
    check('orders_pricing_invariant', sql`${table.total} = ${table.subtotal} - ${table.discountTotal}`),
  ]
);

// ------------------------------------------------------------------------------
// 7. Order Items (1 item per order constraint)
// ------------------------------------------------------------------------------
export const orderItems = pgTable(
  'order_items',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    orderId: uuid('order_id').references(() => orders.id, { onDelete: 'cascade' }).notNull(),
    programId: uuid('program_id').references(() => programs.id, { onDelete: 'restrict' }).notNull(),
    priceAtPurchase: integer('price_at_purchase').notNull(),
    quantity: integer('quantity').default(1).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    check('order_items_price_check', sql`${table.priceAtPurchase} >= 0`),
    check('order_items_quantity_check', sql`${table.quantity} = 1`),
  ]
);

// ------------------------------------------------------------------------------
// 8. Payment Gateway Configs (Midtrans / Mayar)
// ------------------------------------------------------------------------------
export const paymentGatewayConfigs = pgTable('payment_gateway_configs', {
  id: uuid('id').defaultRandom().primaryKey(),
  provider: text('provider').notNull().unique(), // 'MIDTRANS' | 'MAYAR'
  isActive: boolean('is_active').default(false).notNull(),
  config: jsonb('config').default({}).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// ------------------------------------------------------------------------------
// 9. Payments
// ------------------------------------------------------------------------------
export const payments = pgTable(
  'payments',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    orderId: uuid('order_id').references(() => orders.id, { onDelete: 'cascade' }).notNull(),
    provider: text('provider').notNull(), // 'MIDTRANS' | 'MAYAR'
    providerTransactionId: text('provider_transaction_id'),
    status: text('status', {
      enum: ['initiated', 'pending', 'paid', 'failed', 'expired', 'cancelled'],
    }).default('pending').notNull(),
    amount: integer('amount').notNull(),
    providerStatus: text('provider_status'),
    paymentMethod: text('payment_method'),
    rawResponse: jsonb('raw_response'),
    paidAt: timestamp('paid_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    check('payments_amount_check', sql`${table.amount} >= 0`),
  ]
);

// ------------------------------------------------------------------------------
// 10. Program Access (Atomic Enrollment Model)
// ------------------------------------------------------------------------------
export const programAccess = pgTable(
  'program_access',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').references(() => profiles.id, { onDelete: 'cascade' }).notNull(),
    programId: uuid('program_id').references(() => programs.id, { onDelete: 'cascade' }).notNull(),
    orderId: uuid('order_id').references(() => orders.id, { onDelete: 'set null' }),
    status: text('status', { enum: ['active', 'revoked', 'expired'] }).default('active').notNull(),
    grantedAt: timestamp('granted_at', { withTimezone: true }).defaultNow().notNull(),
    revokedAt: timestamp('revoked_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    unique('program_access_user_program_unique').on(table.userId, table.programId),
  ]
);

// ------------------------------------------------------------------------------
// 11. Voucher Redemptions (Recorded ONLY when order status becomes 'paid')
// ------------------------------------------------------------------------------
export const voucherRedemptions = pgTable(
  'voucher_redemptions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    voucherId: uuid('voucher_id').references(() => vouchers.id, { onDelete: 'cascade' }).notNull(),
    userId: uuid('user_id').references(() => profiles.id, { onDelete: 'cascade' }).notNull(),
    orderId: uuid('order_id').references(() => orders.id, { onDelete: 'cascade' }).notNull().unique(),
    discountAmount: integer('discount_amount').notNull(),
    redeemedAt: timestamp('redeemed_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    check('voucher_redemptions_discount_check', sql`${table.discountAmount} >= 0`),
  ]
);

// ------------------------------------------------------------------------------
// 12. Certificates (Admin-controlled issuance)
// ------------------------------------------------------------------------------
export const certificates = pgTable(
  'certificates',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    certificateNumber: text('certificate_number').notNull().unique(),
    userId: uuid('user_id').references(() => profiles.id, { onDelete: 'cascade' }).notNull(),
    programId: uuid('program_id').references(() => programs.id, { onDelete: 'cascade' }).notNull(),
    issuedAt: timestamp('issued_at', { withTimezone: true }).defaultNow().notNull(),
    issuedBy: uuid('issued_by').references(() => profiles.id, { onDelete: 'set null' }),
    recipientNameSnapshot: text('recipient_name_snapshot').notNull(),
    recipientEmailSnapshot: text('recipient_email_snapshot').notNull(),
    programNameSnapshot: text('program_name_snapshot').notNull(),
    certificateUrl: text('certificate_url'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    unique('certificates_user_program_unique').on(table.userId, table.programId),
  ]
);

// ------------------------------------------------------------------------------
// 13. Announcements
// ------------------------------------------------------------------------------
export const announcements = pgTable('announcements', {
  id: uuid('id').defaultRandom().primaryKey(),
  programId: uuid('program_id').references(() => programs.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  content: text('content').notNull(),
  isPublished: boolean('is_published').default(true).notNull(),
  publishedAt: timestamp('published_at', { withTimezone: true }).defaultNow().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// ------------------------------------------------------------------------------
// 14. CMS Sections
// ------------------------------------------------------------------------------
export const cmsSections = pgTable('cms_sections', {
  id: uuid('id').defaultRandom().primaryKey(),
  sectionKey: text('section_key').notNull().unique(),
  content: jsonb('content').default({}).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// ------------------------------------------------------------------------------
// Drizzle Relations
// ------------------------------------------------------------------------------
export const categoriesRelations = relations(categories, ({ many }) => ({
  programs: many(programs),
}));

export const programsRelations = relations(programs, ({ one, many }) => ({
  category: one(categories, {
    fields: [programs.categoryId],
    references: [categories.id],
  }),
  contents: many(programContents),
  accesses: many(programAccess),
  certificates: many(certificates),
  orderItems: many(orderItems),
  announcements: many(announcements),
}));

export const programContentsRelations = relations(programContents, ({ one }) => ({
  program: one(programs, {
    fields: [programContents.programId],
    references: [programs.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(profiles, {
    fields: [orders.userId],
    references: [profiles.id],
  }),
  voucher: one(vouchers, {
    fields: [orders.voucherId],
    references: [vouchers.id],
  }),
  orderItems: many(orderItems),
  payments: many(payments),
  voucherRedemption: one(voucherRedemptions, {
    fields: [orders.id],
    references: [voucherRedemptions.orderId],
  }),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  program: one(programs, {
    fields: [orderItems.programId],
    references: [programs.id],
  }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  order: one(orders, {
    fields: [payments.orderId],
    references: [orders.id],
  }),
}));

export const programAccessRelations = relations(programAccess, ({ one }) => ({
  user: one(profiles, {
    fields: [programAccess.userId],
    references: [profiles.id],
  }),
  program: one(programs, {
    fields: [programAccess.programId],
    references: [programs.id],
  }),
  order: one(orders, {
    fields: [programAccess.orderId],
    references: [orders.id],
  }),
}));

export const certificatesRelations = relations(certificates, ({ one }) => ({
  user: one(profiles, {
    fields: [certificates.userId],
    references: [profiles.id],
  }),
  program: one(programs, {
    fields: [certificates.programId],
    references: [programs.id],
  }),
  issuer: one(profiles, {
    fields: [certificates.issuedBy],
    references: [profiles.id],
  }),
}));
