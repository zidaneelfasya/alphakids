# Alpha Kids --- Decisions, Assumptions & Open Questions

## 1. Confirmed Decisions

### D-001 --- Product Type

Alpha Kids is a Digital Program Platform, not an LMS.

### D-002 --- Initial Infrastructure

Use: - Next.js; - Supabase PostgreSQL; - Supabase Auth; - Google
OAuth; - Vercel; - Midtrans; - transactional email provider.

Start with free/practical managed services where possible.

### D-003 --- Checkout

Current proposal: - authentication required; - one checkout = one
program.

### D-004 --- Dynamic Program Content

Program information must be configurable by administrators.

### D-005 --- Voucher

New client requirement: - voucher applies to all products initially; -
percentage discount; - fixed nominal discount; - intended for promotions
and Brand Ambassador use cases.

### D-006 --- Theme

Brand direction: - playful; - educational; - modern; - professional; -
yellow/orange primary; - colorful accent palette; - Raleway for
headings; - Poppins for body.

### D-007 --- Existing UI Foundation

Use the prepared shadcn dashboard/sidebar as a foundation and theme it
for Alpha Kids rather than replacing it without reason.

## 2. Open Questions

These must be answered before locking implementation.

### Q-001 --- Buyer vs Student

Is the account owner: - the parent; - the student; - or a parent account
that manages one/more students?

This affects certificates, profiles, and program access.

### Q-002 --- Voucher Expiration

Should vouchers have: - start date; - expiry date?

### Q-003 --- Voucher Usage

Should vouchers support: - global usage limit; - per-user usage limit; -
unlimited usage?

### Q-004 --- Voucher Stacking

Can more than one voucher be applied to one checkout?

Default recommendation until decided: no stacking.

This is a recommendation, not an approved requirement.

### Q-005 --- Minimum/Maximum Discount

Should there be: - minimum order amount; - maximum discount amount?

### Q-006 --- Brand Ambassador Tracking

Does a BA only need a unique voucher code, or does Alpha Kids eventually
need: - BA identity; - usage count; - sales attribution; - commission
calculation?

### Q-007 --- Certificate Identity

Who should appear on the certificate: - buyer; - student; - another
participant identity?

### Q-008 --- Email Provider

Which transactional email service will be used?

### Q-009 --- Admin Roles

Is there only one admin role, or are roles needed such as: - super
admin; - content admin; - finance/admin?

### Q-010 --- Proposal Payment Amount Typo

The proposal states total development fee Rp10.000.000 but the two
listed payment installments each state Rp1.000.000. This must be
verified before the proposal is treated as financially authoritative.

## 3. Assumptions That Must Not Become Silent Requirements

The following are implementation ideas only until approved: - voucher
expiry; - usage limits; - BA commissions; - student/parent
relationship; - multiple students per parent; - multiple admin roles; -
voucher stacking; - minimum order; - maximum discount; - affiliate
dashboard; - automated certificate generation.

## 4. Change Log

### 2026-10-05

Added: - voucher/promotion management; - percentage discount; - fixed
nominal discount; - all-product scope for initial voucher
implementation; - Brand Ambassador as a potential voucher use case.

## 5. Decision Procedure

When a new requirement appears:

``` text
New request
   ↓
Does it change business behavior?
   |
   +-- No → implement normally
   |
   +-- Yes
        ↓
Record decision
        ↓
Check database/payment/security impact
        ↓
Update PRD/business rules
        ↓
Implement
        ↓
Test
```
