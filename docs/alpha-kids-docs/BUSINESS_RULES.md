# Alpha Kids --- Business Rules

## 1. Purpose

This document contains rules that affect business behavior and therefore
must not be casually changed during implementation.

## 2. Program Purchase

Current approved proposal rules: 1. User must be authenticated before
checkout. 2. One checkout contains one program. 3. User identity should
not be re-entered for every purchase.

## 3. Price

Program price is the authoritative base price at checkout.

After an order is created, its commercial amount becomes a transaction
snapshot.

Changing a program price later must not retroactively change an existing
order.

## 4. Voucher

Current confirmed client requirements: 1. Admin can manage vouchers. 2.
Voucher can be used for all products in the initial implementation. 3.
Voucher supports percentage discount. 4. Voucher supports fixed nominal
discount. 5. Intended use cases include general promotions and Brand
Ambassador campaigns.

## 5. Voucher Calculation

### Percentage

``` text
discount = base_price × percentage / 100
final_price = base_price - discount
```

Example:

``` text
base = Rp100.000
discount = 10%
discount amount = Rp10.000
final = Rp90.000
```

### Fixed

``` text
discount = fixed_amount
final_price = base_price - discount
```

Example:

``` text
base = Rp100.000
discount = Rp10.000
final = Rp90.000
```

### Safety

The final amount must never become negative.

The server must calculate the discount.

The browser must never be allowed to submit an arbitrary discount amount
and have the server trust it.

## 6. Voucher Scope

Initial scope:

``` text
Voucher → all products
```

Do not introduce per-product voucher targeting unless explicitly
requested.

## 7. Voucher Rules Not Yet Decided

These are unresolved: - start date; - expiry date; - maximum total
usage; - maximum usage per user; - minimum purchase; - maximum
discount; - whether multiple vouchers can be stacked; - whether a user
can reuse a voucher; - whether a voucher can be disabled immediately; -
whether Brand Ambassador attribution requires more than a voucher code.

Until approved, the implementation should not invent these rules.

## 8. Payment

Planned provider: Midtrans.

Initial business statuses: - Pending; - Paid; - Failed; - Expired; -
Cancelled.

Payment state changes must be based on authoritative payment-provider
communication.

## 9. Payment Success

A successful payment should result in program activation according to
the approved activation rules.

The operation must be idempotent.

If the same successful webhook arrives twice, the user must not receive
duplicate access or duplicate certificate records.

## 10. Pending Payment

A pending payment may be continued if it is still valid according to the
payment provider and order state.

## 11. Failed / Expired

Current proposal states: - Failed: payment cannot be retried. - Expired:
payment cannot be retried. - Cancelled: payment cannot be retried.

Do not change these rules without approval.

## 12. User Program Access

Program access should be derived from a verified purchase/payment
relationship.

Hiding a program from the UI is not sufficient authorization.

## 13. Certificates

A certificate becomes visible when the administrator publishes/issues it
according to the final certificate workflow.

The identity printed on a certificate must be explicitly defined.

## 14. Dynamic Content

Dynamic content belongs to a program.

Admin controls: - content name; - type; - value; - ordering; - active
status.

Only active/published content should be visible according to access
rules.

## 15. CMS

Program information on the public landing page should come from
product/program management instead of being manually duplicated.

## 16. Administrative Actions

Administrative mutations must: - verify role/permission; - validate
input; - write through authorized server-side operations; - preserve
auditability where appropriate.

## 17. Change Management

A requirement is considered changed when it alters: - database
structure; - pricing; - payment; - authorization; - user-visible flow; -
admin workflow; - external integration.

Such changes should be recorded in `DECISIONS.md`.
