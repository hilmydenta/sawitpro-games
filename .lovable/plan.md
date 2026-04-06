

## Card Game Compact — Updated

### Perubahan di `src/components/GameCard.tsx`

Layout baru per card:

```text
🌱 Tanam Sawit
Tanam & rawat kebun virtualmu
[ Main Tanam Sawit ]
```

Detail perubahan:
- **Baris pertama**: Icon (28px) + Nama Game horizontal — hapus Poin badge
- **Hapus** badge kategori (FARMING SIM, dll)
- **Hapus** badge poin (+15 Poin, +20 Poin, dll)
- **Hapus** paragraf description panjang
- **Tagline tetap** ditampilkan
- **Button**: "Mainkan Sekarang →" → "Main {title}"
- **Padding/spacing** dikurangi, card lebih compact

### File yang diubah
| File | Perubahan |
|---|---|
| `src/components/GameCard.tsx` | Hapus badge, poin, description; restructure layout; update button text |

Tidak ada perubahan di `src/data/games.ts` — data tetap utuh.

