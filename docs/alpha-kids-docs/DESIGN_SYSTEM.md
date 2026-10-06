# Alpha Kids — Design System & Guidelines (Source of Truth)

> **Official Design System & Implementation Reference for Alpha Kids**  
> Ratified for Navbar, Hero, Features, Landing Story, FAQ, Footer, Design Tokens, and Micro-interactions.  
> Mirrors the agent design skill at [`.agents/skills/alphakids-landing-page/SKILL.md`](file:///.agents/skills/alphakids-landing-page/SKILL.md).

---

## 1. Core Principles

Alpha Kids is a modern digital learning platform for children and parents. The visual identity balances two essential goals:
1. **Child-Friendly & Exciting**: Playful color blocking, organic geometric shapes, character cutouts, hand-drawn vector accents, and gamified micro-interactions.
2. **Parent-Trustworthy & Premium**: Disciplined typography hierarchy, crisp layout grids, smooth motion transitions, no visual slop, and accessible UI semantics.

---

## 2. Brand Identity & Color Tokens

### 2.1 The Signature Color Triad

Alpha Kids interfaces rely on a disciplined triad of three vibrant contrast colors. Every core section, card, and tiered element draws from this triad:

| Color Name | Hex Code | Hover Hex | Soft Tint Background | Dark Mode Tint | Semantic Association |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Alpha Cyan** | `#21b1db` | `#1da0c7` | `#E8F8FA` | `dark:bg-cyan-950/60` | Quiz, Tech, Discovery, Story CTA, Strip 1 |
| **Alpha Pink** | `#ef599a` | `#df488a` | `#FDF0F5` | `dark:bg-pink-950/60` | Creative, Imagination, Hero CTA, Strip 2, "berkarya" |
| **Alpha Yellow** | `#FFCC07` | `#e6b800` | `#FEF9C3` | `dark:bg-amber-950/60` | Gamification, Puzzles, Sunburst Badge, Strip 3 |

> [!NOTE]
> **Contrast Rule for Yellow Text**: When displaying text directly on white or light backgrounds, use high-contrast amber `#ca8a04` instead of `#FFCC07` to guarantee WCAG AA readability.

### 2.2 Supporting Brand Colors
- **Alpha Purple**: `#996AAC` (Used in mentors section, subtle navbar borders, secondary badges)
- **Alpha Green**: `#94BE3E` (Badges, success states, science tags)
- **Alpha Orange**: `#ED8224` (Badges, alert tags)

### 2.3 Canvas & Neutral Palette
- **Soft Canvas (Light Mode)**: `#FFFDF9`  
  *Never use pure cold `#FFFFFF` for the main page canvas.* The soft ivory `#FFFDF9` gives a warm, premium editorial feel across Hero, Footer, and alternating blocks.
- **Surface White**: `#FFFFFF` (Cards, navbar body, story section canvas)
- **Dark Canvas**: `slate-950` (`#020617`)
- **Dark Surface**: `slate-900` (`#0f172a`)
- **Primary Text**: `text-slate-900` (light) / `text-white` (dark)
- **Secondary Text**: `text-slate-600` / `text-slate-500` (light) / `text-slate-400` (dark)
- **Neutral Borders**: `border-slate-200/80` (light) / `border-slate-800` (dark)

---

## 3. Typography Guidelines

### 3.1 Font Stack & Weight Ceiling
- **Font Stack**: Strict `font-sans` (Inter / system fallback).
- **Weight Ceiling**: **Maximum `font-semibold` (weight 600)** across all headlines, navigation, and badges.  
  ❌ **NEVER use `font-bold` (700) or `font-black` (900)** on landing page headings or cards. `font-semibold` provides a sleek, modern, anti-slop aesthetic.

### 3.2 Italic Accent Words
Meaningful emphasis words within titles (such as *berkarya*, *menyenangkan*, *interaktif*, *game*) must be rendered with:
```tsx
<span className="font-sans italic font-normal text-[accent-color]">
  kata-kunci
</span>
```
This italic treatment creates an expressive, friendly hand-drawn rhythm without feeling childish.

### 3.3 Orphan Prevention & Line Breaking Rules
Headings must never allow solitary short conjunctions or prepositions (e.g., *"yang"*, *"dan"*, *"untuk"*) to drop awkwardly into a new line by themselves.  
Always use explicit line breaks `<br />` and `whitespace-nowrap` on grouped phrases:
```tsx
{/* Example: 4-Line Landing Story Headline */}
<h2 className="text-3xl sm:text-5xl lg:text-[3.25rem] font-semibold font-sans tracking-tight text-slate-900 dark:text-white leading-[1.2]">
  <span className="inline-block whitespace-normal xs:whitespace-nowrap">
    Materi belajar yang
  </span>{' '}
  <br />
  disediakan <br />
  <span className="relative inline-flex items-center justify-center align-baseline whitespace-nowrap mx-1.5 my-1.5 px-3.5 py-1">
    <span className="relative z-10 font-sans italic font-normal text-[#ef599a]">
      menyenangkan
    </span>
    <YellowLoop />
  </span>{' '}
  <br />
  untuk anak
</h2>
```

---

## 4. Abstract Shape & Watermark System

Every primary brand color is married to an exact abstract geometric watermark from [`components/landing/wonder-decorations.tsx`](file:///components/landing/wonder-decorations.tsx):

### 4.1 Cyan `#21b1db` ➔ Concentric Rings (`ConcentricRings`)
- **Structure**: 4 concentric outline circles (`r=12, 24, 36, 48`) with `stroke="currentColor" strokeWidth="4"`.
- **Usage**:
  - Feature Card 1: Top-right corner cut (`size-36 text-white/35`).
  - Story Section Tier 1 (Blue Strip): Left watermark (`size-13 sm:size-16 md:size-18 text-white/50`).

### 4.2 Pink `#ef599a` ➔ Caterpillar Wave (`CaterpillarWave`)
- **Structure**: Slanted pill bars / wavy stripes rotated `-20deg` with progressive heights (`w-32 h-20 text-currentColor`).
- **Usage**:
  - Feature Card 2: Top-right corner cut (`w-36 h-24 text-white/35`).
  - Story Section Tier 2 (Pink Strip): Left watermark (`w-16 sm:w-24 h-12 sm:h-16 text-[#FDF0F5] opacity-80`).

### 4.3 Yellow `#FFCC07` ➔ 4x4 Square Dot Grid (`DotGrid`)
- **Structure**: Exact 4x4 matrix (16 dots total) in a square layout (`cols={4} count={16}`), dots with `rounded-full bg-white/85 size-1.5 sm:size-2`.
- **Usage**:
  - Feature Card 3: Top-right corner (`w-20 h-24`).
  - Story Section Tier 3 (Yellow Strip): Left watermark (`cols={4} count={16} gap-1.5 sm:gap-2`).

### 4.4 Hand-Drawn Vector Embellishments
- **`YellowBrushUnderline`**: Wavy hand-drawn underline under highlighted words (e.g., *berkarya* in the Hero).
- **`YellowLoop`**: Continuous hand-drawn oval loop encircling key words (e.g., *menyenangkan* in the Story Section). Sized with `w-[calc(100%+2.5rem)]` and `h-[calc(100%+2.25rem)]` so it never clips or overlaps the text awkwardly.
- **`ScallopedBadge`**: 12-petal organic sunburst badge for icons, seals, or awards.
- **`CurvedArrow`**: Cyan hand-drawn arrow pointing from ornamental stars towards headlines.

---

## 5. Primary Pill Button Specification

The signature Alpha Kids call-to-action button combines a solid pill body with a white circular icon disc housing `<ArrowUpRight />`.

```tsx
<Link
  href="#target"
  className="group inline-flex items-center gap-3 sm:gap-4 pl-6 sm:pl-7 pr-2 sm:pr-2.5 py-2 sm:py-2.5 rounded-full bg-[#ef599a] hover:bg-[#df488a] text-white font-semibold text-sm sm:text-base shadow-xl shadow-[#ef599a]/30 transition-all hover:scale-105 active:scale-95"
>
  <span className="tracking-tight">Label Aksi</span>
  <span className="size-9 sm:size-10 rounded-full bg-white text-[#ef599a] flex items-center justify-center shrink-0 shadow-md transition-transform duration-200 group-hover:scale-105 group-hover:rotate-12">
    <ArrowUpRight className="size-4 sm:size-5 stroke-[2.5] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
  </span>
</Link>
```

### Button Rules:
1. **Pill Container**: Solid brand color (`bg-[#ef599a]` in Hero, `bg-[#21b1db]` in Story).
2. **Padding**: Asymmetric padding (`pl-6 sm:pl-7` on left, `pr-2 sm:pr-2.5` on right) so the circular disc sits snugly against the edge.
3. **White Circular Disc**: `size-9 sm:size-10 rounded-full bg-white` with the matching brand color applied to the icon text.
4. **Micro-Animations on Hover**:
   - Container: Scales up `hover:scale-105`, presses down `active:scale-95`.
   - Disc: Scales and rotates `group-hover:scale-105 group-hover:rotate-12`.
   - Arrow: Glides diagonally `group-hover:translate-x-0.5 group-hover:-translate-y-0.5`.

---

## 6. Component Guidelines: Navbar (`LandingNavbar` & `ResizableNavbar`)

### 6.1 Structure & Behavior
- **Capsule Pill**: Floating fixed header with rounded-full geometry (`rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md`).
- **Scroll Morphing**:
  - Rest State (`scrollY <= 50`): Width `92%`, max-width `1200px`, `y: 14px`.
  - Scrolled State (`scrollY > 50`): Width `72%`, max-width `880px`, `y: 10px`, refined shadow.
- **3-Slot Mathematical Centering**:  
  Uses a three-slot layout (`<div className="flex-1">...</div>`, `<div className="flex-none">...</div>`, `<div className="flex-1">...</div>`) so the central navigation links remain **mathematically centered** at all times and never jitter or drift when the logo or right actions resize.
- **Morphing Popover Dropdowns**: Smooth spring transitions for Program cards, Keunggulan links, and Bantuan links.

---

## 7. Component Guidelines: Hero Section (`LandingHero`)

### 7.1 Layout & Visual Hierarchy
- **Canvas**: Centered layout on `#FFFDF9` with `min-h-[100dvh] pt-20 sm:pt-28 pb-10 sm:pb-14`.
- **Background Puzzle Ornaments**:
  - Left Puzzle: Scaled `w-[220px]` to `[840px]`, positioned 50% in and 50% out (`-translate-x-1/2`), rotated `12deg`, blurred with `blur-[2px] sm:blur-[3px]`, opacity `70%-85%`.
  - Right Puzzle: Symmetrical 50% in and 50% out (`translate-x-1/2`), inverted rotation `-12deg` (180° flipped orientation), blurred.
- **Frosted Glass Sheet Overlay**:
  - `absolute inset-0 z-[2] backdrop-blur-[6px] sm:backdrop-blur-md bg-white/20 dark:bg-slate-950/25` softens background puzzles so text remains completely crisp.
- **Flanking Character Cutouts**:
  - Desktop (`hidden lg:block`): Left `hero1.png` (Yellow blob backdrop), Right `hero2.png` (Purple blob backdrop) with `drop-shadow-2xl`.
  - Mobile/Tablet (`< lg`): Displayed as a centered duo row directly under the headline.
- **Master Headline**:
  - Font size: `text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-[5.25rem]`.
  - Content: `"Tempat terbaik untuk [Puzzle Icon] belajar dan berkarya [YellowBrushUnderline] anak hebat"`.
- **CTA**: Centered Alpha Pink Pill Button (`bg-[#ef599a]`).

---

## 8. Component Guidelines: Landing Story Section (`LandingStorySection`)

### 8.1 Grid Ratio
- **Left Column (`lg:col-span-7`)**: Wider column ensuring the 4-line headline has room to stretch horizontally without awkward wrapping.
- **Right Column (`lg:col-span-5`)**: Right-aligned tiered pyramid strips.

### 8.2 Right Tiered Pyramid Strips
The 3 horizontal pill strips form an inverted tiered visual pyramid, each featuring its dedicated abstract watermark and child cutout:

1. **Top Strip — Cyan `#21b1db` (Width `w-5/6`)**:
   - Left Watermark: `ConcentricRings` in `text-white/50`.
   - Right Cutout: `hero1.png` in circular crop (`size-24 sm:size-28 md:size-32`).
   - Accent: Top-right `ScallopedBadge` (`size-12 sm:size-16 text-[#FFCC07]`).
2. **Middle Strip — Pink `#ef599a` (Width `w-full`)**:
   - Left Watermark: `CaterpillarWave` in `text-[#FDF0F5] opacity-80`.
   - Right Cutout: `hero2.png` in circular crop.
3. **Bottom Strip — Yellow `#FFCC07` (Width `w-4/5`)**:
   - Left Watermark: 4x4 square `DotGrid` (16 dots in `bg-white/85`).
   - Right Cutout: `hero3.png` in circular crop.

---

## 9. Component Guidelines: Mentors Block (`LandingMentorsBlock`)

### 9.1 Visual Hierarchy & Canvas
- **Background**: Bold gradient `bg-gradient-to-br from-[#0c7490] via-[#0284c7] to-[#21b1db]` with white text and yellow accent on *"menemukan kegembiraan belajar kreatif"*.
- **Ornament**: Sunburst seal [`ScallopedBadge`](file:///components/landing/wonder-decorations.tsx) on top-left in bright yellow `#FFCC07`.

### 9.2 Avatar Shape & Anti-Slop Rules
- ❌ **NO BORDERS**: Dilarang menggunakan border atau padding berwarna (`p-1`, ring stroke) di sekeliling foto mentor. Foto langsung terpotong bersih mengikuti kontur bentuk abstraknya.
- **Bentuk Abstrak Organik Unik (Bukan Bulat Sempurna)**:  
  Setiap foto mentor (8 mentor lengkap `orang1.webp` hingga `orang8.webp`) memiliki siluet bentuk abstrak organik asimetris yang berbeda menggunakan 8-value `borderRadius`:
  1. **Kak Budi Prasetyo (`orang1.webp`)**: `63% 37% 54% 46% / 40% 58% 42% 60%`
  2. **Kak Sarah Amelia (`orang2.webp`)**: `40% 60% 38% 62% / 62% 38% 62% 38%`
  3. **Kak Jacob Rama (`orang3.webp`)**: `68% 32% 60% 40% / 36% 64% 36% 64%`
  4. **Kak Nadia Utami (`orang4.webp`)**: `38% 62% 65% 35% / 58% 40% 60% 42%`
  5. **Kak Kevin Alamsyah (`orang5.webp`)**: `55% 45% 68% 32% / 42% 60% 40% 58%`
  6. **Kak Dimas Prayoga (`orang6.webp`)**: `42% 58% 35% 65% / 58% 42% 58% 42%`
  7. **Kak Zahra Aulia (`orang7.webp`)**: `65% 35% 48% 52% / 38% 62% 38% 62%`
  8. **Kak Fajar Ramadhan (`orang8.webp`)**: `36% 64% 58% 42% / 50% 38% 62% 50%`

### 9.3 Carousel Navigation & Staggered Blur Reveal
- **Interaksi Panah & Dot Indicators**: Tombol panah kiri dan kanan (`ChevronLeft` / `ChevronRight`) aktif untuk berpindah batch mentor (4 per halaman) dengan dukungan circular wrap-around dan dot indicator pills di bawah.
- **Transisi Blur Berurutan (Bukan Sekadar Geser)**:  
  Alih-alih animasi slide/geser horizontal biasa, pergantian mentor menggunakan **staggered sequential blur transition**:
  - Exit: Blur cepat `filter: blur(10px)`, `opacity: 0`, durasi 0.18s.
  - Enter: Setiap kartu dalam baris memblur masuk secara bertahap (`filter: blur(14px) -> blur(0px)`, `y: 12 -> 0`, `scale: 0.94 -> 1`) dengan jeda `delay: idx * 0.08s` sehingga kartu 1, 2, 3, dan 4 mengabur dan menajam berurutan.
- **Aksesibilitas**: Mendukung `useReducedMotion()`.

---

## 10. Component Guidelines: FAQ Accordion (`LandingFaq`)

### 9.1 Motion & Spring Transition
- **Library**: `motion/react` + `AnimatePresence`.
- **Timing**: Smooth 350ms `easeOut` transition.
- **Single Expansion**: Only one FAQ item open at a time (`openIndex === idx ? null : idx`).
- **No Layout Jumps**: Container strictly animates `height: 0 -> 'auto'`, and all vertical padding is placed **inside** the child wrapper (`px-6 pb-6 pt-3`), never on the animated container.

### 9.2 Left-Aligned Animated Chevron
- Positioned on the **LEFT** side of the question trigger button.
- Rotation Logic:
  - **Closed**: Points **UP** (`⌃`, `rotate: 180deg`).
  - **Open**: Points **DOWN** (`⌵`, `rotate: 0deg`).

### 9.3 Staggered Blur-In Text Reveal
The answer text splits into words, with each word fading and unblurring smoothly from left to right:
```tsx
<motion.span
  initial={{ opacity: 0, filter: 'blur(6px)', y: 3 }}
  animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
  transition={{
    duration: 0.32,
    delay: wIdx * 0.016, // Staggered reveal from left to right
    ease: 'easeOut',
  }}
  className="inline-block mr-[0.28em] will-change-[opacity,filter,transform]"
>
  {word}
</motion.span>
```

### 9.4 Border & Shadow Rules (Strict Anti-Slop)
- ❌ **NO COLORED BORDERS**: Never use cyan, pink, or yellow borders on active or hover states. Keep borders strictly neutral: `border-slate-200/80` (closed) / `border-slate-200` (open).
- ❌ **NO COLORED SHADOWS**: Shadows must be pure monochrome elevations:  
  `isOpen ? 'shadow-xl shadow-black/[0.08] dark:shadow-black/50 -translate-y-1 sm:-translate-y-1.5' : 'shadow-xs hover:shadow-md hover:shadow-black/[0.05]'`.

---

## 10. Component Guidelines: Footer (`LandingFooter`)

### 10.1 Canvas & Height
- **Background**: Soft Ivory `#FFFDF9` (light) / `slate-950` (dark).
- **Height Scale**: Generous vertical stature (`min-h-[520px] sm:min-h-[580px] lg:min-h-[620px] flex flex-col justify-between`).
- **Top Alignment**: Content starts at the top (`pt-10 sm:pt-12 lg:pt-14`), leaving balanced breathing space below before the copyright.

### 10.2 The 5 Multi-Color Navigation Columns
Left area organizes 5 distinct columns with themed colored headings:
1. `Program` ➔ Cyan `#21b1db`
2. `Fitur` ➔ Pink `#ef599a`
3. `Keunggulan` ➔ Amber/Yellow `#ca8a04` (`dark:text-[#FFCC07]`)
4. `Bantuan` ➔ Cyan `#21b1db`
5. `Kebijakan` ➔ Pink `#ef599a`
- Link items use readable `text-slate-900 dark:text-slate-400` with subtle hover color transitions.

### 10.3 Right Brand Section & Logo Watermark
- **Brand Info**: AlphaKids logo (`/assets/img/logo.png`) + `Alpha` + Cyan `Kids` title + clear tagline + social icon buttons (Instagram, LinkedIn, TikTok).
- **Background Logo Watermark**:
  - Oversized AlphaKids logo on the right (`w-[440px]` to `[880px]`), opacity `15%` (dark `10%`).
  - Fade mask using CSS:
    ```css
    mask-image: linear-gradient(to left, rgba(0,0,0,0.85) 15%, rgba(0,0,0,0) 80%);
    -webkit-mask-image: linear-gradient(to left, rgba(0,0,0,0.85) 15%, rgba(0,0,0,0) 80%);
    ```

### 10.4 Full-Width Divider Line & Copyright
- **Divider**: Full-width `w-full h-px bg-slate-200/80 dark:bg-slate-800` spanning 100vw from the left screen edge to the right screen edge (positioned outside the `max-w-7xl` container).
- **Copyright**: Compact centered bar `py-3.5 sm:py-4` pinned at the very bottom.

---

## 11. Anti-Slop Rules & Checklist

Before approving or generating any new section or component for Alpha Kids, run this checklist:

| Rule | Requirement | Forbidden Anti-Patterns |
| :--- | :--- | :--- |
| **Typography Weight** | Maximum `font-semibold` | ❌ No `font-bold` (700) or `font-black` (900) on public pages |
| **Headline Wrapping** | Group short words with `whitespace-nowrap` | ❌ Never let single words like "yang" or "untuk" drop alone |
| **Button Design** | Pill container with white disc & `ArrowUpRight` | ❌ No generic square buttons or border-only buttons |
| **Abstract Matching** | Cyan = Concentric, Pink = Wave, Yellow = 4x4 Dots | ❌ Never mix random abstract SVGs arbitrarily |
| **Accordion Shadows** | Monochrome neutral shadow (`shadow-black/[0.08]`) | ❌ No colored glow shadows or colored borders |
| **Page Canvas** | Soft `#FFFDF9` on large open sections | ❌ No harsh `#FFFFFF` glare or muddy gray backgrounds |
| **Divider Lines** | Edge-to-edge full width on footer | ❌ No constrained dividers that stop inside container margins |
| **Accessibility** | All accordions & modals use ARIA & reduced-motion | ❌ No missing ARIA attributes or un-closable elements |

---

## 12. Component File Sitemap

- Navbar: [`components/landing/landing-navbar.tsx`](file:///components/landing/landing-navbar.tsx) & [`components/ui/resizable-navbar.tsx`](file:///components/ui/resizable-navbar.tsx)
- Hero: [`components/landing/landing-hero.tsx`](file:///components/landing/landing-hero.tsx)
- Interactive Features: [`components/landing/landing-interactive-features.tsx`](file:///components/landing/landing-interactive-features.tsx)
- Story Section: [`components/landing/landing-story-section.tsx`](file:///components/landing/landing-story-section.tsx)
- Mentors Block: [`components/landing/landing-mentors-block.tsx`](file:///components/landing/landing-mentors-block.tsx)
- Program Catalog: [`components/landing/landing-program-showcase.tsx`](file:///components/landing/landing-program-showcase.tsx)
- FAQ: [`components/landing/landing-faq.tsx`](file:///components/landing/landing-faq.tsx)
- Footer: [`components/landing/landing-footer.tsx`](file:///components/landing/landing-footer.tsx)
- Abstract Decorations: [`components/landing/wonder-decorations.tsx`](file:///components/landing/wonder-decorations.tsx)
- Main Page Assembly: [`app/page.tsx`](file:///app/page.tsx)
