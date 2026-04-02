

## Reduce Section Padding

Tighten vertical spacing across all sections for a cleaner, more compact feel.

### Changes

| File | Current | New |
|---|---|---|
| `src/components/HeroSection.tsx` | `py-16 sm:py-24` | `py-10 sm:py-16` |
| `src/components/GamesSection.tsx` | `py-16` | `py-10` |
| `src/components/AppEcosystem.tsx` | `py-16` | `py-10` |
| `src/components/Footer.tsx` | `py-10 pb-24` | `py-8 pb-20` |

Also reduce internal spacing (margin-bottom on headings/subtitles) by ~25% where appropriate (e.g. `mb-10` → `mb-6` on game cards container, `mb-6` → `mb-4` on hero pill badge).

