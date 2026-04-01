

## Landing Page Improvements

15 changes across multiple components. Here is the plan:

### 1. Copy assets to project
- Copy SawitPRO logo to `public/images/sawitpro-logo.png`
- Copy SiBrondol images to `public/images/` (pointing pose for hero, jumping for games section, standard for footer)

### 2. Navbar (`src/components/Navbar.tsx`)
- Replace `🌴` emoji + "Kawan Sawit" with SawitPRO logo image + "Sawit Games"
- Change "Toko Sawit" button behavior: instead of `target="_blank"`, trigger a callback to open Toko Sawit in an iframe container (same pattern as game iframe)

### 3. HeroSection (`src/components/HeroSection.tsx`)
- Change H1 to two rows: "Main, Panen & Menang" / "di Sawit Games"
- Change subtitle to: "Mainkan kumpulan Sawit Games dan raih skor tertinggi. Segera Hadir --- Kumpulkan SawitPoin dari setiap permainan dan tukarkan langsung dengan kebutuhan kebun di Toko Sawit!"
- Hide "50 / Maks Poin/Bulan" from stats row (only show "3 Games Seru" and "120+ Level Tersedia")
- Change pill badge text from "Games Petani Kelapa Sawit" to "Sawit Games"
- Add SiBrondol (pointing pose) as a decorative element positioned to the right of the hero content, partially overlapping, with a subtle float animation

### 4. ValueLoopStrip (`src/components/ValueLoopStrip.tsx`)
- Hide entire section (comment out or conditionally render `null`)

### 5. GamesSection (`src/components/GamesSection.tsx`)
- Filter out "sawit-bubble" from the rendered games list
- Add SiBrondol (jumping) as a decorative element near the section heading

### 6. Toko Sawit iframe container (`src/pages/Index.tsx`)
- Add a new state `tokoSawitOpen` alongside `activeGameUrl`
- When `tokoSawitOpen` is true, render an iframe overlay for `https://toko.sawitpro.id` (same pattern as game iframe with back button)
- Pass a callback to Navbar and StickyBottomCTA to trigger this state
- Update all "Toko Sawit" links (hero, sticky CTA, navbar) to open in-page iframe instead of new tab

### 7. AppEcosystem (`src/components/AppEcosystem.tsx`)
- Change H2 to "Games akan segera tersedia di semua aplikasi SawitPRO"
- Hide subtitle paragraph
- Hide "Sudah punya akun SawitPRO?" link at bottom

### 8. Footer (`src/components/Footer.tsx`)
- Change "Kawan Sawit" to "Sawit Games"
- Change description to "Bagian dari ekosistem SawitPRO #TerusTumbuh"
- Add TikTok icon linking to `https://www.tiktok.com/@sawitpro.id`
- Add Instagram icon linking to `https://www.instagram.com/sawitpro.id/`
- Add SawitPRO logo image at top
- Use inline SVG for TikTok and Instagram icons (no new packages needed)

### 9. StickyBottomCTA (`src/components/StickyBottomCTA.tsx`)
- Change "Toko Sawit" button to trigger iframe open callback instead of `target="_blank"`

### 10. Data files
- No changes to `games.ts` (filtering done in component)

### Files modified
| File | Changes |
|---|---|
| `public/images/` | 4 new image assets |
| `src/components/Navbar.tsx` | Logo, name, Toko Sawit callback |
| `src/components/HeroSection.tsx` | H1, subtitle, hide stat, SiBrondol element |
| `src/components/ValueLoopStrip.tsx` | Return null |
| `src/components/GamesSection.tsx` | Filter sawit-bubble, SiBrondol element |
| `src/components/AppEcosystem.tsx` | H2 text, hide subtitle + login link |
| `src/components/Footer.tsx` | Name, description, social icons, logo |
| `src/components/StickyBottomCTA.tsx` | Toko Sawit callback |
| `src/pages/Index.tsx` | Add tokoSawitOpen state + iframe, pass callbacks |

