# Alpha Kids --- Implementation Plan

## 1. Goal

Build the MVP in controlled vertical slices, validating each layer
before moving to the next.

Do not attempt to build every screen first and connect the backend
later.

## 2. Phase 0 --- Repository Inspection

Before changing code:

1.  Inspect current repository.
2.  Identify Next.js version.
3.  Identify package manager.
4.  Inspect existing shadcn components.
5.  Inspect existing sidebar/dashboard.
6.  Inspect Tailwind configuration.
7.  Inspect existing authentication.
8.  Inspect environment variables without exposing secrets.
9.  Inspect existing Supabase setup.
10. Inspect existing database/migrations.
11. Identify existing design tokens.

Deliverable: - technical inventory; - list of reusable components; -
list of missing infrastructure.

Do not rewrite existing working code unnecessarily.

## 3. Phase 1 --- Foundation

Implement/verify: - project conventions; - environment handling; -
Supabase clients; - auth; - protected routes; - role model; - design
tokens; - typography; - base layout.

Acceptance: - user can register/login/logout; - admin route is
protected; - unauthorized users cannot access admin mutations.

## 4. Phase 2 --- Database

Create migrations for: - profiles; - categories; - programs; -
program_contents; - orders; - order_items; - payments; - vouchers; -
voucher_redemptions; - certificates; - announcements; - CMS entities.

Acceptance: - migration runs cleanly; - constraints are valid; - RLS is
tested; - seed/test data is safe.

## 5. Phase 3 --- Program Management

Build admin: - category CRUD; - program CRUD; - publish/unpublish; -
archive; - dynamic content management.

Build public: - catalog; - detail page.

Acceptance: - published program appears publicly; - draft does not; -
archived program behaves correctly; - dynamic content is rendered
safely.

## 6. Phase 4 --- User Dashboard

Build: - dashboard; - Program Saya; - Transactions; - Certificates; -
Profile.

Acceptance: - users can only see their own private data; - program
access follows purchase state.

## 7. Phase 5 --- Checkout

Build: - checkout page; - order creation; - server-side price
calculation; - pending order; - Midtrans integration.

Acceptance: - one checkout = one program; - order amount is stored; -
browser cannot manipulate final price.

## 8. Phase 6 --- Voucher

Build: - admin voucher list; - create/edit/disable; - voucher code
validation; - percentage discount; - fixed discount; - checkout
integration; - redemption record.

Acceptance: - invalid code rejected; - disabled code rejected; - server
calculates discount; - final price cannot be negative; - order preserves
discount snapshot; - duplicate/abusive redemption behavior follows
approved rules.

Do not implement unresolved voucher rules until they are approved.

## 9. Phase 7 --- Payment Webhook

Build: - Midtrans notification endpoint; - signature/authenticity
verification; - idempotent status update; - program activation.

Acceptance: - duplicate webhook does not duplicate access; - successful
payment activates correctly; - failed/expired states follow rules.

## 10. Phase 8 --- CMS

Build: - Hero; - About; - Testimonials; - FAQ.

Acceptance: - admin can update; - public page reflects changes; -
unpublished content is not shown.

## 11. Phase 9 --- Certificates

Build: - upload template; - associate with program/user; - publish
certificate; - user access.

Acceptance: - unauthorized users cannot access another user's
certificate; - certificate remains linked to historical participant
identity.

## 12. Phase 10 --- Email

Implement only the necessary transactional messages first.

Priority: 1. email verification; 2. password recovery; 3. payment
reminder; 4. program activated.

Then: 5. welcome; 6. announcement.

## 13. Phase 11 --- QA

Test:

### Auth

-   registration;
-   login;
-   logout;
-   reset;
-   OAuth;
-   unauthorized routes.

### Program

-   draft;
-   publish;
-   archive;
-   dynamic content.

### Checkout

-   normal;
-   invalid program;
-   invalid voucher;
-   valid voucher;
-   fixed discount;
-   percentage discount;
-   zero/negative total prevention.

### Payment

-   pending;
-   success;
-   failure;
-   expiry;
-   duplicate webhook.

### Authorization

-   user A cannot access user B;
-   user cannot call admin mutations;
-   admin functions are protected.

### Responsive

-   mobile;
-   tablet;
-   desktop.

## 14. Phase 12 --- Deployment

Before production: - configure environment variables; - verify domain; -
configure Supabase production project; - configure Midtrans production
credentials; - configure webhook; - configure email; - verify OAuth
redirect URLs; - run smoke tests.

## 15. Development Rule

Prefer this loop:

``` text
Requirement
   ↓
Design
   ↓
Schema
   ↓
Server logic
   ↓
UI
   ↓
Test
   ↓
Review
   ↓
Commit
```

Avoid:

``` text
Build 30 pages
   ↓
Connect everything later
```

## 16. Definition of Done

A feature is not done merely because the UI exists.

A feature is done when: - UI works; - server logic works; -
authorization works; - database constraints work; - loading/error/empty
states exist; - responsive behavior works; - relevant tests pass; - no
secret is exposed; - documentation is updated.
