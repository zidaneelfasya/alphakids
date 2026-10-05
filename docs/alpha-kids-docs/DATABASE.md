# Alpha Kids --- Database Design

## 1. Database Philosophy

The database should model business facts, not UI screens.

Avoid duplicating information merely because two screens display it.

Use foreign keys, constraints, indexes, timestamps, and explicit status
values.

## 2. Core Domain

Initial conceptual entities:

``` text
profiles
categories
programs
program_contents
orders
order_items
payments
vouchers
voucher_redemptions
certificates
announcements
cms_hero
cms_about
cms_testimonials
cms_faq
```

Authentication identities are managed by Supabase Auth. Application
profile data should reference the authenticated user.

## 3. Profiles

Conceptual fields:

``` text
id
full_name
avatar_url
phone (if required)
role
created_at
updated_at
```

Do not duplicate authentication secrets.

Role values should be constrained.

## 4. Categories

``` text
id
name
slug
description
is_active
created_at
updated_at
```

Slug should be unique.

## 5. Programs

Conceptual fields:

``` text
id
category_id
name
slug
description
price
thumbnail_url
start_at
end_at
status
created_at
updated_at
```

Potential statuses:

``` text
draft
published
archived
```

Use a numeric type suitable for IDR currency. Do not use floating-point
values for money.

## 6. Program Contents

Dynamic content:

``` text
id
program_id
name
type
value
sort_order
is_active
created_at
updated_at
```

The allowed `type` values should be deliberately defined rather than
allowing arbitrary client-controlled behavior.

Possible initial types: - text; - rich text; - URL; - image; -
date/time; - link.

Do not build a generic arbitrary-code/HTML execution system.

## 7. Orders

An order represents the commercial transaction.

Conceptual fields:

``` text
id
order_number
user_id
status
subtotal
discount_total
total
voucher_id nullable
currency
created_at
updated_at
```

Order amounts are authoritative snapshots.

Never calculate historical order totals from the current program price.

## 8. Order Items

Even though MVP checkout is one program per order, keeping an order-item
model can make the domain cleaner.

``` text
id
order_id
program_id
program_name_snapshot
unit_price_snapshot
quantity
subtotal
discount
total
```

If the product model changes later, historical orders remain
understandable.

## 9. Payments

Conceptual:

``` text
id
order_id
provider
provider_transaction_id
status
amount
raw_reference_id / metadata where appropriate
paid_at
expired_at
created_at
updated_at
```

Do not store unnecessary sensitive payment data.

## 10. Vouchers

Initial conceptual model:

``` text
id
code
name
discount_type
discount_value
is_active
created_at
updated_at
```

`discount_type`:

``` text
percentage
fixed
```

Code should be normalized consistently and unique.

Do not assume additional fields until requirements are approved.

Potential future fields: - starts_at; - expires_at; - max_redemptions; -
max_redemptions_per_user; - minimum_order_amount; -
maximum_discount_amount; - campaign/BA reference.

## 11. Voucher Redemptions

Recommended to keep redemption history separate:

``` text
id
voucher_id
user_id
order_id
discount_amount
created_at
```

This creates an auditable record.

## 12. Certificates

Conceptual:

``` text
id
program_id
user_id
template_url
certificate_url
issued_at
status
```

The exact model must be adjusted if the buyer and student are separate
entities.

## 13. Announcements

Conceptual:

``` text
id
program_id nullable
title
content
is_published
published_at
created_at
updated_at
```

## 14. CMS

CMS data may be modeled as separate tables or a structured configuration
model depending on the existing implementation.

Do not over-generalize CMS data into a fully arbitrary schema unless
there is a concrete requirement.

## 15. Indexing

Likely important indexes: - profiles.role; - categories.slug; -
programs.slug; - programs.status; - programs.category_id; -
orders.user_id; - orders.status; - orders.order_number; -
payments.provider_transaction_id; - voucher.code; -
voucher_redemptions.voucher_id; - voucher_redemptions.user_id.

Indexes should be validated against actual query patterns.

## 16. Data Integrity

Use: - NOT NULL where appropriate; - UNIQUE; - CHECK constraints where
appropriate; - foreign keys; - transaction boundaries for multi-step
mutations.

## 17. Money

Use integer smallest units or a precise numeric representation.

For Indonesian Rupiah, the system should not use floating-point
arithmetic.

Example:

``` text
Rp100.000
```

should be represented in a deterministic integer/numeric form.

## 18. Soft Delete / Archive

Programs should preferably be archived rather than hard-deleted when
historical transactions reference them.

Historical transaction records must remain understandable.

## 19. Migration Policy

All schema changes must be represented as migrations.

Do not make production schema changes manually without recording them.

Before applying destructive migrations: - inspect dependencies; - back
up where appropriate; - verify affected records; - require explicit
approval for destructive operations.
