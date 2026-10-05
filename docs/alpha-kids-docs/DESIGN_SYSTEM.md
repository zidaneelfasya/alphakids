# Alpha Kids --- Design System

## 1. Design Direction

Alpha Kids should feel:

-   playful;
-   friendly;
-   educational;
-   energetic;
-   trustworthy;
-   modern;
-   professional enough for parents and administrators.

The design should avoid two extremes:

### Too corporate

Avoid making Alpha Kids look like a banking/enterprise dashboard.

### Too childish

Avoid filling every screen with cartoon characters, stickers, stars, or
excessive decorative illustrations.

The target is:

> **Playful Educational SaaS**

## 2. Brand Asset Direction

The supplied assets show a colorful educational identity with strong: -
yellow; - orange; - white/cream; - purple; - pink; - cyan/blue; - green
accents.

Yellow/orange should be the primary visual identity.

Purple/pink/cyan/green should be used as supporting accents rather than
all at equal visual weight.

## 3. Typography

### Headings

Raleway.

Suggested weights: - 600; - 700.

### Body

Poppins.

Suggested weights: - 400; - 500; - 600.

Keep typography hierarchy consistent.

## 4. Color System

Exact production hex values should be finalized from the approved brand
asset.

Conceptual tokens:

``` text
--primary
--primary-foreground

--accent-purple
--accent-pink
--accent-cyan
--accent-green

--background
--surface
--surface-muted

--foreground
--muted-foreground

--border
--success
--warning
--destructive
```

Do not randomly introduce new brand colors per page.

## 5. Shape

Use: - rounded cards; - rounded buttons; - friendly input fields; -
moderate corner radii.

Avoid extreme pill shapes for every element.

## 6. Shadows

Use soft, subtle shadows.

Avoid: - heavy black shadows; - excessive glassmorphism; - overly strong
gradients.

## 7. Illustrations

The supplied assets can be used for: - empty states; - landing-page
sections; - promotional blocks; - status states; - onboarding; - visual
accents.

Do not use decorative assets merely because they exist. Every
illustration should support hierarchy or communication.

## 8. Dashboard

The existing shadcn dashboard/sidebar should be retained as the
structural foundation.

Theme it rather than replacing it.

Dashboard priorities: 1. readability; 2. clear navigation; 3. data
hierarchy; 4. responsive behavior; 5. friendly Alpha Kids identity.

## 9. Public Website

The landing page can be more expressive than the admin dashboard.

Use: - stronger yellow/orange sections; - playful illustrations; -
rounded program cards; - clean typography; - controlled decorative
shapes.

## 10. Admin Dashboard

Admin UI should be more restrained.

Use Alpha Kids brand colors as accents while preserving: - table
readability; - clear status badges; - form usability; - predictable
navigation.

## 11. Program Cards

A program card should clearly show: - thumbnail; - title; - category; -
price; - period where relevant; - availability/status; - CTA.

## 12. Checkout

Checkout should prioritize trust and clarity.

Show: - program; - base price; - voucher input; - discount; - final
total; - payment CTA.

Never hide price calculations behind decorative UI.

## 13. Accessibility

Target: - readable contrast; - keyboard navigation; - visible focus
states; - semantic HTML; - accessible labels; - meaningful error
messages.

## 14. Responsive Design

Must work on: - mobile; - tablet; - desktop.

Do not design desktop first and merely shrink it.

## 15. UI Consistency

Before creating a new component, check whether shadcn/ui or an existing
project component already solves the problem.

Do not duplicate components unnecessarily.

## 16. Design Principle

Brand expression should come from: - typography; - color; - spacing; -
illustration; - shape; - micro-interaction.

Not from adding decorations everywhere.
