# Alpha Kids --- Security Requirements

## 1. Core Principle

Security must be enforced by the server/database, not by hiding UI
elements.

## 2. Authentication

Use Supabase Auth.

Support: - email/password; - email verification; - password recovery; -
Google OAuth.

Do not implement custom password storage.

## 3. Authorization

Roles must be checked server-side.

At minimum: - public; - authenticated user; - admin.

Do not rely on:

``` text
if (role === "admin") render button
```

as the only protection.

The server must reject unauthorized mutations.

## 4. Supabase RLS

Use Row Level Security for user-owned data where appropriate.

Examples: - user can read own profile; - user can read own orders; -
user can read own payments; - user can read own certificates; - user can
read authorized program content.

Admin policies must be deliberately designed.

Never use an overly broad policy such as:

``` text
authenticated users can read everything
```

unless there is a documented reason.

## 5. Service Role Key

The Supabase service-role key is server-only.

Never: - expose it to browser code; - prefix it as a public environment
variable; - commit it to Git.

## 6. Environment Variables

Separate: - public variables; - server-only secrets.

Never commit `.env` secrets.

Provide `.env.example` with variable names but no secrets.

## 7. Payment

Never trust: - client-submitted payment status; - client-submitted final
price; - client-submitted discount amount.

Payment state must be verified using the payment provider.

## 8. Webhooks

Webhook handlers must: - verify authenticity; - validate payload; - be
idempotent; - safely handle retries; - avoid duplicate activation.

## 9. Voucher Abuse

Server must recalculate: - program price; - voucher validity; -
discount; - final total.

Do not trust a client-supplied calculated total.

## 10. Input Validation

Validate all mutations.

Use a schema validation library consistently if already present in the
project.

Validate: - string length; - enum values; - numeric ranges; - URLs; -
dates; - IDs; - voucher codes.

## 11. XSS / Content

Dynamic content must not allow arbitrary unsafe HTML execution.

If rich text/HTML is supported, sanitize it before rendering.

Prefer structured content where possible.

## 12. File Uploads

Validate: - file type; - file size; - filename handling; -
authorization; - storage path.

Do not trust MIME type alone.

## 13. Sensitive Data

Do not store unnecessary: - passwords; - payment credentials; - card
data; - authentication tokens; - secret API keys.

## 14. Destructive Operations

Do not automatically execute: - database drops; - destructive
migrations; - mass deletes; - production data resets.

Ask for explicit approval when an operation can cause irreversible data
loss.

## 15. Auditability

Important administrative/payment operations should be traceable
through: - timestamps; - actor/user ID where appropriate; - provider
IDs; - order numbers; - structured logs.

## 16. Security Review Gate

Before production: - inspect RLS; - inspect admin authorization; -
inspect payment webhook; - inspect environment variables; - inspect
storage policies; - test unauthorized access; - test voucher
manipulation; - test duplicate webhook delivery.
