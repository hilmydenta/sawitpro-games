

## Visual Improvements Plan

### Changes

**1. HeroSection — remove stats, reduce spacing, reposition SiBrondol**
- Remove the entire stats row (lines 110-121)
- Reduce `mb-10` on CTA buttons to `mb-4`
- Move SiBrondol from `hidden lg:block absolute right-[5%]` to visible on all screens, centered below the CTA buttons area with smaller size on mobile (`w-[100px] sm:w-[140px] lg:w-[180px]`), using relative positioning within the content flow instead of absolute

**2. GamesSection — reduce top padding gap**
- Reduce scroll indicator `mt-12` → `mt-6` in HeroSection to tighten the gap between hero and games section

**3. Sawit Bubble — re-enable with new URL**
- Update `games.ts`: change Sawit Bubble URL to `https://sawitPRO-bubble-games.replit.app/`, remove `comingSoon: true`
- Remove the filter in `GamesSection.tsx` that excludes sawit-bubble

**4. App icons — use uploaded images**
- Copy uploaded PetaniPRO, AgenPRO, KUDPRO, KebunPRO images to `public/images/`
- Change `apps.ts` icon field from emoji string to image path
- Update `AppEcosystem.tsx` to render `<img>` instead of `<span>` for icons

**5. Event tracking improvements**
- Add `trackEvent("toko_sawit_open")` when Toko Sawit iframe opens
- Add `trackEvent("toko_sawit_close", { duration_seconds })` when closing
- Add `trackEvent("cta_click", { cta: "hero_main" | "hero_toko" | "sticky_main" | "sticky_toko" })` on all CTA button clicks
- Add `trackEvent("section_view", { section })` in each section via `useInView` callbacks
- Add `trackEvent("app_card_click", { app_name })` in AppEcosystem
- Add `trackEvent("social_click", { platform })` in Footer for TikTok/Instagram

### Files modified

| File | Change |
|---|---|
| `public/images/` | 4 new app icon images (petanipro-icon.png, agenpro-icon.png, kudpro-icon.png, kebunpro-icon.png) |
| `src/components/HeroSection.tsx` | Remove stats row, reduce CTA margin, reposition SiBrondol inline for mobile visibility |
| `src/components/GamesSection.tsx` | Remove sawit-bubble filter |
| `src/data/games.ts` | Update Sawit Bubble URL, remove comingSoon flag |
| `src/data/apps.ts` | Change icon from emoji to image path |
| `src/components/AppEcosystem.tsx` | Render `<img>` for app icons |
| `src/pages/Index.tsx` | Add tracking calls for Toko Sawit open/close, pass tracking to CTAs |
| `src/lib/tracker.ts` | Add `trackTokoSawitOpen`/`Close` helpers with duration tracking |
| `src/components/StickyBottomCTA.tsx` | Add CTA click tracking |
| `src/components/Footer.tsx` | Add social link click tracking |

