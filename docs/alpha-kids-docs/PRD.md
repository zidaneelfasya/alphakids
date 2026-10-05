# Alpha Kids --- Product Requirements Document (PRD)

## 1. Product Overview

**Product:** Alpha Kids Digital Program Platform

Alpha Kids needs a responsive digital platform that combines: - public
information website; - program catalog; - online program purchase; -
online payment; - authenticated participant dashboard; - administrator
dashboard; - dynamic program information; - certificate management; -
simple website CMS; - transactional email.

The platform is **not an LMS**. Learning may continue on external
platforms such as WhatsApp, Zoom, Google Drive, YouTube, or other
services.

## 2. Product Goals

The platform should:

1.  Present Alpha Kids professionally.
2.  Display available educational programs.
3.  Allow users to purchase programs online.
4.  Integrate online payment.
5.  Give users a personal dashboard.
6.  Centralize program information after purchase.
7.  Let administrators manage programs and participants.
8.  Let administrators manage selected website content without developer
    intervention.
9.  Provide certificate access.
10. Support promotions/vouchers without compromising pricing or
    transaction integrity.

## 3. Users and Roles

### 3.1 Public Visitor

Can: - view landing page; - view program catalog; - view program
details; - view public content; - navigate to authentication/checkout.

### 3.2 Authenticated User

Can: - manage profile; - view purchased programs; - view program
information available to them; - view transaction history; - continue
eligible pending payment; - view available certificates; - use eligible
vouchers during checkout.

### 3.3 Administrator

Can: - manage users; - manage programs; - manage categories; - manage
dynamic program content; - manage transactions; - manage CMS content; -
manage certificates; - manage announcements; - manage
vouchers/promotions.

The exact role/permission matrix must be finalized before production
authorization is implemented.

## 4. Public Website

### Landing Page

Initial sections: - hero; - Alpha Kids information; - featured
programs; - benefits/advantages; - testimonials; - FAQ; - CTA; - contact
information.

### Program Catalog

Programs may include: - OSN guidance; - online classes; - webinars; -
intensive programs; - digital products; - other educational programs.

Program data includes, at minimum: - name; - description; - price; -
category; - thumbnail; - program period; - status.

## 5. Dynamic Product Content

Program information must not be hard-coded to one fixed set of fields.

Admin should be able to add content blocks/fields with: - name; -
type; - value/content; - display order; - active/inactive status.

Examples: - WhatsApp group link; - learning material link; - Zoom
link; - mentor information; - schedule; - announcements.

This makes the platform flexible for different program types.

## 6. Authentication

Required capabilities: - registration; - login; - logout; - email
verification; - forgot password; - reset password; - Google OAuth.

Checkout requires authentication.

## 7. User Profile

User can: - view profile; - edit name/profile information; - change
password where supported by the authentication flow; - logout.

## 8. Checkout and Purchase

Current proposal rule: - user must be logged in; - one checkout is for
one program; - user identity should not be repeatedly entered when
purchasing again.

The checkout must calculate: - original program price; - applicable
discount/voucher; - final payable amount.

The exact rules for voucher stacking, minimum purchase, expiry, usage
limits, and ownership are currently unresolved and must not be invented.

## 9. Voucher / Promotion Management --- New Requirement

### Initial requirement

Admin can create/manage vouchers that apply to all products.

A voucher supports two discount types:

#### Percentage

Example: - original price: Rp100.000 - voucher: 10% - discount:
Rp10.000 - final price: Rp90.000

#### Fixed Nominal

Example: - original price: Rp100.000 - voucher: Rp10.000 - final price:
Rp90.000

### Intended use cases

-   regular promotions;
-   event campaigns;
-   special dates;
-   Brand Ambassador campaigns.

### Important

Do not assume: - voucher expiry; - maximum usage; - per-user usage
limit; - minimum purchase; - maximum discount; - stacking; - BA
commission; - automatic campaign attribution.

These need explicit decisions.

## 10. Payment

Planned provider: Midtrans.

Planned methods from the proposal: - QRIS; - e-wallet; - virtual
account.

The system must process payment status through the payment gateway and
webhook.

Initial status concepts: - Pending; - Paid; - Failed; - Expired; -
Cancelled.

A successful payment should activate the purchased program according to
the final approved business rules.

## 11. User Dashboard

Menu: - Dashboard; - Program Saya; - Transaksi; - Sertifikat; - Profile.

Dashboard should provide concise information about: - active programs; -
recent transactions; - certificates; - relevant program updates.

## 12. Program Access

A purchased program may expose dynamic content such as: - WhatsApp
group; - materials; - Zoom; - mentor information; - schedule; -
announcements.

Access must be authorized by server/database rules, not merely hidden in
the UI.

## 13. Transactions

User transaction history should include: - transaction number; -
program; - purchase date; - total; - payment status.

Pending transactions may expose a continue-payment action only while the
payment remains eligible.

## 14. Certificates

Admin can: 1. select a program; 2. upload a certificate template; 3.
determine the participant-name position; 4. publish the certificate.

User can then access the certificate from the dashboard.

The certificate identity model must be finalized if the buyer and
student can be different people.

## 15. Admin Dashboard

Main areas: - user management; - program management; - category
management; - dynamic content; - transaction management; - voucher
management; - CMS; - certificate management; - announcements.

### Product management

Admin can: - create; - edit; - archive; - set price; - set category; -
set period; - set thumbnail; - publish/unpublish; - manage dynamic
content.

### Transaction management

Admin can inspect: - transaction; - user; - program; - amount; - payment
status; - transaction time.

## 16. Website CMS

Initial CMS areas: - Hero; - About; - Testimonials; - FAQ.

Program data displayed on the landing page should be connected to
product management instead of duplicated manually.

## 17. Email

Planned categories: - email verification; - password reset; - welcome
email; - program activated; - payment reminder; - program announcement.

The exact email provider is not fixed by this document.

## 18. Non-Goals

For the MVP, do not automatically expand into: - full LMS; - in-platform
video learning; - complex affiliate platform; - multi-vendor
marketplace; - multi-currency commerce; - multi-tenant architecture; -
advanced CRM; - complex marketing automation.

These can be considered later if explicitly requested.

## 19. Success Criteria

The MVP is successful when a real user can:

1.  discover a program;
2.  register/login;
3.  purchase a program;
4.  apply a valid voucher;
5.  complete payment;
6.  have payment status updated reliably;
7.  receive program access;
8.  view the purchase in the dashboard;
9.  later access a published certificate.

An administrator must be able to manage the relevant data without
editing the database manually.

## 20. Scope Discipline

A new feature is not considered automatically included just because it
is technically related to an existing feature.

Every new requirement should be: - accepted; - documented; - designed; -
implemented; - tested; - added to the change log.
