

## SawitPRO Games Landing Page Redesign

### Overview
Complete redesign of the landing page from a light-themed game launcher to a dark-themed, conversion-focused landing page with SawitPoin value loop messaging, game cards, app ecosystem section, and sticky CTAs.

### What Changes

**Global styling overhaul:**
- Replace Nunito + Plus Jakarta Sans fonts with Fraunces (headings) + DM Sans (body) in `index.html` and `tailwind.config.ts`
- Replace light CSS variables in `src/index.css` with dark theme (`#0a1a10` base)
- Add custom keyframes: `leafFall`, `fadeUp`, `pulse`
- Add smooth scroll, custom scrollbar styles, focus-visible outlines

**New files to create:**

| File | Purpose |
|---|---|
| `src/hooks/useInView.ts` | IntersectionObserver hook for scroll-triggered animations |
| `src/hooks/useScrollPosition.ts` | Scroll position hook for sticky CTA visibility |
| `src/data/games.ts` | Games data array (Tanam Sawit, Panen Sawit, Sawit Bubble) with theme colors, URLs, poin values |
| `src/data/apps.ts` | SawitPRO ecosystem apps data |
| `src/components/Navbar.tsx` | Sticky navbar with blur bg, Toko Sawit + Login buttons |
| `src/components/HeroSection.tsx` | Dark hero with leaf particles, H1, stats, CTAs |
| `src/components/ValueLoopStrip.tsx` | 3-step SawitPoin flow (Play → Earn → Redeem) |
| `src/components/GamesSection.tsx` | 3 themed game cards with hover effects |
| `src/components/AppEcosystem.tsx` | 4 SawitPRO app cards |
| `src/components/Footer.tsx` | Dark footer with links |
| `src/components/StickyBottomCTA.tsx` | Mobile sticky bar (appears after 300px scroll) |

**Files to modify:**

| File | Change |
|---|---|
| `index.html` | Replace Google Fonts link with Fraunces + DM Sans |
| `src/index.css` | Complete CSS variable overhaul to dark theme, new keyframes, scrollbar, smooth scroll |
| `tailwind.config.ts` | Update font families, add new keyframes/animations, adjust container max-width |
| `src/pages/Index.tsx` | Replace entire page content with new sections; keep game iframe logic and tracker integration |
| `src/components/GameCard.tsx` | Rewrite with themed card design (color props, poin badge, hover gradient) |

**What's preserved:**
- Game iframe overlay logic (open/close with back button)
- All tracker calls (`trackPageVisit`, `trackGameStart`, `trackGameEnd`)
- Existing game URLs for Tanam Sawit and Panen Sawit
- Supabase integration and edge function

**Note on "Sawit Bubble":** The prompt introduces a new game not in the current codebase. It will be added as a card with a placeholder URL or coming-soon state (replacing "Dunia Sawit").

### Technical Details

- Leaf particles: 18 absolutely positioned `🌿` spans with CSS-only `leafFall` animation, randomized delays/durations, rendered only on hover-capable devices via `window.matchMedia('(hover: hover)')`
- Scroll

<lov-plan>

## SawitPRO Games Landing Page Redesign

### Overview
Complete redesign of the landing page from a light-themed game launcher to a dark-themed, conversion-focused landing page with SawitPoin value loop messaging, game cards, app ecosystem section, and sticky CTAs.

### What Changes

**Global styling overhaul:**
- Replace Nunito + Plus Jakarta Sans fonts with Fraunces (headings) + DM Sans (body) in `index.html` and `tailwind.config.ts`
- Replace light CSS variables in `src/index.css` with dark theme (`#0a1a10` base)
- Add custom keyframes: `leafFall`, `fadeUp`, `pulse`
- Add smooth scroll, custom scrollbar styles, focus-visible outlines

**New files to create:**

| File | Purpose |
|---|---|
| `src/hooks/useInView.ts` | IntersectionObserver hook for scroll-triggered fade-up animations |
| `src/hooks/useScrollPosition.ts` | Scroll position hook for sticky bottom CTA visibility |
| `src/data/games.ts` | Games array with theme colors, URLs, poin values, badges |
| `src/data/apps.ts` | SawitPRO ecosystem apps array |
| `src/components/Navbar.tsx` | Sticky navbar — blur bg, "Kawan Sawit" branding, Toko Sawit + Login buttons |
| `src/components/HeroSection.tsx` | Dark hero with radial glow, leaf particles (desktop only), H1, subtitle, CTA buttons, stats row, scroll indicator |
| `src/components/ValueLoopStrip.tsx` | 3-step SawitPoin flow: Play → Earn → Redeem, with info banner |
| `src/components/GamesSection.tsx` | Section wrapper with heading + 3 GameCard instances |
| `src/components/AppEcosystem.tsx` | 4 SawitPRO app cards (PetaniPRO, AgenPRO, KUDPRO, KebunPRO) |
| `src/components/Footer.tsx` | Dark footer with logo, app links, copyright |
| `src/components/StickyBottomCTA.tsx` | Fixed bottom bar on mobile, appears after 300px scroll |

**Files to modify:**

| File | Change |
|---|---|
| `index.html` | Replace Google Fonts with Fraunces + DM Sans |
| `src/index.css` | Full dark theme CSS variables, new keyframes, custom scrollbar, smooth scroll |
| `tailwind.config.ts` | Update font families, add leafFall/fadeUp/pulse keyframes, adjust container |
| `src/pages/Index.tsx` | Replace page content with new section components; preserve iframe overlay + tracker |
| `src/components/GameCard.tsx` | Rewrite: themed colors, poin badge, hover gradient lift, accent CTA button |

**What's preserved:**
- Game iframe overlay logic (open/close with back button bar)
- All tracker calls (`trackPageVisit`, `trackGameStart`, `trackGameEnd`)
- Existing game URLs for Tanam Sawit and Panen Sawit
- Supabase/tracker integration untouched

**Note:** "Sawit Bubble" replaces "Dunia Sawit" per the prompt spec. Its URL will point to the existing Dunia Sawit URL with the card restyled as a bubble shooter theme.

### Technical Details

- **Leaf particles**: 18 `🌿` spans with CSS `leafFall` animation, random delays (0-12s) and durations (7-13s). Only rendered on hover-capable devices via `window.matchMedia('(hover: hover)')`.
- **Scroll animations**: `useInView` hook wraps `IntersectionObserver` with `threshold: 0.1`. Each section applies `fadeUp` with staggered `animation-delay` on children.
- **Sticky bottom CTA**: `useScrollPosition` returns Y offset; bar transitions in via `translate-y` when scroll > 300px. Hidden on desktop via `lg:hidden`.
- **Game card hover**: CSS transition to shifted gradient background, accent border color, and `translateY(-6px)`.
- **All external links**: `target="_blank" rel="noopener noreferrer"`.
- **Responsive**: mobile-first single column; `sm:` 2-col game cards + ecosystem; `lg:` 3-col game cards.

### Implementation Order
1. Update `index.html` fonts + `src/index.css` dark theme + `tailwind.config.ts`
2. Create hooks (`useInView`, `useScrollPosition`)
3. Create data files (`games.ts`, `apps.ts`)
4. Build all section components (Navbar → Hero → ValueLoop → Games → Ecosystem → Footer → StickyBottomCTA)
5. Rewrite `GameCard.tsx` with new themed design
6. Rewrite `Index.tsx` to compose all sections, keeping iframe overlay + tracker

