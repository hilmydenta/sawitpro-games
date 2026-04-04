

## Rekomendasi Peningkatan Analytics & Event Tracking

### Ringkasan Data Saat Ini
- 300 total visits, 54 bounce (18%), avg duration 34 menit
- 199 game sessions, hanya 100 completed (50% drop-off)
- Events: 148 game clicks, 92 section views, 63 CTA clicks, 21 auto-scroll nudges
- 56% mobile, 40% desktop, 4% tablet

### Yang Sudah Di-track
Page visits, game sessions, CTA clicks (hero/sticky), section views (games, ecosystem), social clicks, toko sawit open/close, auto-scroll nudge, toast CTA click

### Yang Belum Di-track (Gap Analysis)

---

### A. Event Tracking Baru (Quick Wins)

**1. Scroll Depth Tracking**
- Track 25%, 50%, 75%, 100% scroll milestones
- File: `src/pages/Index.tsx` — add scroll listener
- Insight: Tahu berapa banyak user yang benar-benar lihat seluruh halaman

**2. Game Completion vs Abandonment**
- Saat ini 50% game sessions tidak punya `ended_at` — artinya user keluar tanpa menutup
- Track `game_abandon` event saat user navigasi away saat game aktif
- File: `src/lib/tracker.ts` — add `beforeunload` handler untuk game sessions

**3. Time-to-First-Interaction**
- Track berapa detik dari page load sampai user pertama kali klik/scroll
- Insight: Apakah hero section cukup engaging?
- File: `src/pages/Index.tsx`

**4. Returning vs New Visitor**
- Gunakan `localStorage` (bukan `sessionStorage`) untuk flag `sp_first_visit`
- Kirim `is_returning: true/false` di `page_visit_start`
- File: `src/lib/tracker.ts` + migration tambah kolom `is_returning` di `page_visits`

**5. UTM Parameter Capture**
- Parse `utm_source`, `utm_medium`, `utm_campaign` dari URL
- Simpan di `page_visits` — penting untuk tahu channel mana yang paling efektif
- File: `src/lib/tracker.ts` + migration tambah kolom UTM di `page_visits`

---

### B. Database & Schema Improvements

**6. Tambah tabel `scroll_depths`**
```
scroll_depths: session_id, depth_percent (25/50/75/100), reached_at
```

**7. Tambah kolom di `page_visits`**
- `is_returning` (boolean)
- `utm_source`, `utm_medium`, `utm_campaign` (text, nullable)
- `time_to_first_interaction_ms` (integer, nullable)

---

### C. Analytics Dashboard (Opsional, Tapi Powerful)

**8. Admin Analytics Page**
- Route `/analytics` dengan password sederhana
- Tampilkan metrik utama: daily visits, bounce rate, avg duration, top games, device breakdown, conversion funnel (visit → game click → game complete)
- Gunakan Recharts (sudah tersedia di project)

---

### D. Metode Alternatif (Tanpa Coding Tambahan)

**9. Heatmap via Clarity (Gratis)**
- Tambahkan Microsoft Clarity script di `index.html`
- Dapat heatmap, session replay, rage clicks — tanpa biaya
- Satu baris `<script>` saja

**10. Funnel Analysis Query**
- Buat SQL query untuk conversion funnel: Visit → Section View → Game Click → Game Complete
- Bisa dijalankan langsung tanpa perubahan kode

---

### Prioritas Implementasi

| Priority | Item | Effort |
|---|---|---|
| 1 | Scroll depth tracking | Kecil |
| 2 | UTM parameter capture | Kecil |
| 3 | Returning visitor flag | Kecil |
| 4 | Time-to-first-interaction | Kecil |
| 5 | Microsoft Clarity integration | Minimal |
| 6 | Game abandonment tracking | Sedang |
| 7 | Admin analytics dashboard | Besar |

### Files yang akan dimodifikasi

| File | Change |
|---|---|
| `src/lib/tracker.ts` | Scroll depth, UTM, returning visitor, TTFI, game abandon |
| `src/pages/Index.tsx` | Scroll depth listener, TTFI listener |
| `index.html` | Clarity script tag |
| `supabase/migrations/` | New columns on `page_visits`, new `scroll_depths` table |
| `src/pages/Analytics.tsx` | (Opsional) Admin dashboard |
| `src/App.tsx` | (Opsional) Route untuk analytics |

