

## Bounce Rate Improvements + "Dunia Sawit" Placeholder

### Summary
Implement all 5 bounce rate reduction ideas plus add a "Dunia Sawit" coming-soon game card.

### Changes

**1. Auto-scroll nudge** — `src/components/HeroSection.tsx`
- Add a `useEffect` that scrolls to `#games` after 5s of idle (no scroll/touch). Cancel on any interaction.

**2. First game card pulse** — `src/components/GameCard.tsx`
- Add a subtle pulse/glow animation on the first card (`index === 0`) after 3s delay using CSS keyframes.

**3. Engagement toast** — `src/pages/Index.tsx`
- Show a Sonner toast after 4s: "🎮 3 Games tersedia — coba sekarang!" with an action that scrolls to `#games`.

**4. CTA copy change** — `src/components/StickyBottomCTA.tsx`
- Change "🎮 Mulai Main" → "🎮 Main Gratis"

**5. "Dunia Sawit" coming soon card** — `src/data/games.ts`
- Add a 4th game entry with `comingSoon: true`, id `dunia-sawit`, icon `🌍`, badge `ADVENTURE`, tagline `Jelajahi dunia kelapa sawit`, empty url. The existing `GameCard` already handles `comingSoon` (disabled button showing "Segera Hadir", reduced opacity, no click).

### Files modified

| File | Change |
|---|---|
| `src/components/HeroSection.tsx` | Add 5s idle auto-scroll nudge to `#games` |
| `src/components/GameCard.tsx` | Add pulse animation on first card after 3s |
| `src/pages/Index.tsx` | Add 4s engagement toast |
| `src/components/StickyBottomCTA.tsx` | Change CTA text to "Main Gratis" |
| `src/data/games.ts` | Add "Dunia Sawit" coming-soon entry |
| `src/index.css` | Add `@keyframes card-pulse` if needed |

