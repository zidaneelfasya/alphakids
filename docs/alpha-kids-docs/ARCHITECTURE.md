# Alpha Kids --- Technical Architecture

## 1. Architecture Goal

Build a simple, secure, maintainable MVP that can run on
managed/free-tier infrastructure and scale gradually.

Do not introduce infrastructure complexity without a concrete need.

## 2. Target Stack

``` text
Frontend / Server
    Next.js

UI
    shadcn/ui
    Tailwind CSS
    Raleway
    Poppins

Backend/Data
    Supabase PostgreSQL

Authentication
    Supabase Auth
    Google OAuth

Hosting
    Vercel

Payment
    Midtrans

Email
    Transactional email provider
```

## 3. High-Level Architecture

``` text
Browser
   |
   v
Next.js
   |
   +---- Public pages
   +---- Authenticated user pages
   +---- Admin pages
   +---- Server-side actions/routes
   |
   v
Supabase
   +---- Auth
   +---- PostgreSQL
   +---- Storage (if needed)
   |
   +---- RLS authorization
   |
   v
Midtrans
   |
   +---- Payment
   +---- Webhook
```

## 4. Application Boundaries

### Public

Can read only data explicitly marked public: - published programs; -
public categories; - CMS content; - public FAQ/testimonials.

### User

Can access: - own profile; - own orders; - own payments; - purchased
program access; - own certificates.

### Admin

Can access management functions according to role/permission.

## 5. Recommended Next.js Structure

Use a feature-oriented structure rather than putting everything into a
single directory.

Example:

``` text
src/
  app/
    (public)/
    (auth)/
    dashboard/
    admin/
    api/
  components/
    ui/
    shared/
  features/
    auth/
    programs/
    checkout/
    vouchers/
    payments/
    transactions/
    certificates/
    cms/
    announcements/
  lib/
    supabase/
    midtrans/
    email/
    validation/
    permissions/
  types/
  config/
```

The exact structure may adapt to the existing repository. Do not rewrite
an existing project architecture merely for cosmetic consistency.

## 6. Data Access

Preferred principles: - server-side access for privileged operations; -
validated inputs; - explicit authorization; - database constraints; -
RLS where applicable; - no service-role key in browser code; - no
payment secret in client code.

## 7. Server vs Client

Default: - Server Components for data-heavy read pages. - Client
Components only where interactivity is required. - Server Actions or
secure route handlers for mutations.

Do not expose privileged credentials to client components.

## 8. Payment Architecture

Checkout:

``` text
User
  |
  v
Create/validate checkout
  |
  +--> validate program
  +--> validate voucher
  +--> calculate final amount
  +--> create pending order
  |
  v
Midtrans transaction
  |
  v
User pays
  |
  v
Midtrans webhook
  |
  v
Server verifies webhook
  |
  v
Update payment/order
  |
  v
Grant program access
```

Never treat a browser redirect alone as proof of successful payment.

## 9. Webhook Principles

Webhook processing must be: - authenticated/verified according to
Midtrans's mechanism; - idempotent; - safe to retry; - independent of
the user's browser; - logged sufficiently for debugging.

A webhook received twice must not create duplicate access or duplicate
financial records.

## 10. Voucher Architecture

Voucher validation should happen server-side.

Never trust a discount amount submitted by the browser.

Recommended flow:

``` text
client sends voucher code
        |
        v
server fetches voucher
        |
        v
validate status/rules
        |
        v
calculate discount from authoritative price
        |
        v
return calculated result
```

When an order is created, preserve the pricing snapshot used for that
transaction.

## 11. Storage

Supabase Storage may be used for: - program thumbnails; - certificate
templates; - certificate files; - CMS images.

Do not store large binary assets directly in PostgreSQL unless there is
a specific reason.

## 12. Observability

MVP should at minimum provide: - structured server logs; -
payment/webhook logs sufficient to investigate failures; - error
boundaries; - clear user-facing error states.

Add external observability tooling only when useful.

## 13. Scaling Strategy

Phase 1: - Vercel; - Supabase; - managed payment/email services.

Phase 2: - optimize database queries; - add indexes; - improve
caching; - move heavy work to background jobs where needed.

Phase 3: - paid database tier; - dedicated services/VPS if justified; -
queues/workers; - object storage/CDN; - advanced monitoring.

Do not prematurely build Phase 3 infrastructure.

## 14. Architecture Principles

1.  Simplicity first.
2.  Server is authoritative for business rules.
3.  Database constraints protect data integrity.
4.  Authorization is enforced server-side and at the database layer
    where appropriate.
5.  Payments are handled as state machines, not simple booleans.
6.  Pricing is immutable at the transaction snapshot level.
7.  New features must not silently change existing business rules.
