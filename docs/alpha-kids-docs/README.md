# Alpha Kids --- Engineering Documentation

This directory contains the working documentation for the Alpha Kids
Digital Program Platform.

## Documents

1.  `PRD.md` --- Product requirements and scope.
2.  `ARCHITECTURE.md` --- Technical architecture and system boundaries.
3.  `DATABASE.md` --- Database/domain model and data rules.
4.  `BUSINESS_RULES.md` --- Business logic, especially checkout,
    payment, program activation, and vouchers.
5.  `DESIGN_SYSTEM.md` --- Alpha Kids visual/design direction and UI
    rules.
6.  `SECURITY.md` --- Authentication, authorization, RLS, secrets,
    webhook and payment security rules.
7.  `IMPLEMENTATION_PLAN.md` --- Recommended development sequence and
    acceptance gates.
8.  `DECISIONS.md` --- Decisions, assumptions, unresolved questions, and
    change log.
9.  `ANTIGRAVITY_PROMPT.md` --- Master prompt/instructions for an
    Antigravity coding agent.

## Source-of-truth policy

Use this order when requirements conflict:

1.  Explicitly approved client requirements.
2.  Explicit project decisions recorded in `DECISIONS.md`.
3.  `PRD.md`.
4.  `BUSINESS_RULES.md` / `ARCHITECTURE.md` / `DATABASE.md`.
5.  Implementation details.
6.  Agent assumptions.

An agent must **not silently invent business rules**. If a missing
requirement can materially affect data integrity, payment,
authorization, pricing, or user-visible behavior, stop and request
clarification.

## Current product direction

Alpha Kids is an educational program commerce platform, not an LMS. The
platform is intended to centralize program discovery, purchasing,
payment, participant access, transactions, certificates, and
administrative management. Learning itself may remain on external
services such as WhatsApp, Zoom, Google Drive, YouTube, etc.

Initial infrastructure: - Next.js - Supabase PostgreSQL - Supabase
Auth - Google OAuth - Vercel - Midtrans - Transactional email provider

The initial goal is an MVP using practical/free tiers where possible.
Infrastructure should scale gradually rather than being over-engineered
at the start.

## Important new requirement

The client requested voucher/promotion management after the original
proposal: - vouchers apply to all products for the initial version; -
discount can be percentage-based; - discount can also be fixed
nominal; - use cases include general promotions and Brand Ambassador
promotions.

Voucher functionality is therefore a new requirement and must be treated
as an explicit scope addition/change, not hidden inside product
management.

## How to use these documents

Before coding: 1. Read `PRD.md`. 2. Read `DECISIONS.md`. 3. Read
`ARCHITECTURE.md`. 4. Read `DATABASE.md`. 5. Read `BUSINESS_RULES.md`.
6. Read `DESIGN_SYSTEM.md`. 7. Read `SECURITY.md`. 8. Follow the
sequence in `IMPLEMENTATION_PLAN.md`.

For any ambiguity, do not guess. Record it in `DECISIONS.md` and ask for
a decision.
