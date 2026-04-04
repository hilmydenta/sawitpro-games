

## Update App Icons from Play Store + Verify Links

### Summary
Replace the 4 app icon images (PetaniPRO, AgenPRO, KUDPRO, KebunPRO) with the actual icons from their Google Play Store listings. All 4 Play Store links have been verified as accessible.

### Play Store Icons Identified

From the Play Store screenshots, each app has a distinct mascot-style icon:
- **PetaniPRO**: Orange SiBrondol character with "PETANI" text on green background
- **AgenPRO**: Gold oil drop with "AGEN" badge on olive/dark background  
- **KUDPRO**: Yellow SiBrondol character with "KUD" text holding money on green background
- **KebunPRO**: Brown SiBrondol character with "KEBUN" text wearing explorer hat on green background

### Changes

**1. Download new icons** — Script to fetch each icon from Google Play CDN
- PetaniPRO: `play-lh.googleusercontent.com/SvQ0J8...`
- AgenPRO, KUDPRO, KebunPRO: Extract URLs from their respective Play Store pages
- Save as `public/images/petanipro-icon.png`, `agenpro-icon.png`, `kudpro-icon.png`, `kebunpro-icon.png` (replacing existing files)

**2. No code changes needed** — `src/data/apps.ts` already references the correct file paths and Play Store URLs. Only the image files themselves need updating.

### Files modified

| File | Change |
|---|---|
| `public/images/petanipro-icon.png` | Replace with Play Store icon |
| `public/images/agenpro-icon.png` | Replace with Play Store icon |
| `public/images/kudpro-icon.png` | Replace with Play Store icon |
| `public/images/kebunpro-icon.png` | Replace with Play Store icon |

### Verification
- All 4 Play Store links confirmed working (checked just now)
- Icons will be downloaded at 240px resolution for crisp display at 40x40px (retina-ready)

