

## Fix: Toko Sawit Tidak Muncul di Iframe

### Masalah
Website `https://toko.sawitpro.id` mengirim header Content Security Policy `frame-ancestors 'none'`, yang artinya situs tersebut **menolak ditampilkan di dalam iframe manapun**. Ini adalah pembatasan dari sisi server Toko Sawit, bukan bug di aplikasi kita.

### Solusi

Karena iframe tidak bisa digunakan, ada 2 pendekatan:

**Opsi A: Buka di Tab Baru (Recommended)**
- Ubah semua `onOpenTokoSawit` agar membuka `window.open("https://toko.sawitpro.id", "_blank")` 
- Hapus seluruh Toko Sawit iframe overlay dari `Index.tsx`
- Tetap track event `toko_sawit_open` dengan source info
- Paling reliable, tidak bergantung pada CSP pihak ketiga

**Opsi B: Proxy via Backend Function**
- Buat edge function yang mem-proxy konten Toko Sawit dan menghapus header CSP
- Kompleks, fragile, dan bisa melanggar kebijakan situs tersebut
- Tidak direkomendasikan

### Rencana Implementasi (Opsi A)

| File | Perubahan |
|---|---|
| `src/pages/Index.tsx` | Hapus state `tokoSawitOpen`/`tokoOpenTime`, hapus iframe overlay, ubah `handleOpenTokoSawit` jadi `window.open()` |
| `src/components/Navbar.tsx` | Tidak perlu ubah — sudah panggil `onOpenTokoSawit` |
| `src/components/Footer.tsx` | Tidak perlu ubah — sudah panggil `onOpenTokoSawit` |
| `src/components/StickyBottomCTA.tsx` | Tidak perlu ubah |
| `src/lib/tracker.ts` | Tetap track `toko_sawit_open` event (tanpa close/duration karena tab baru) |

Kode menjadi lebih sederhana karena tidak perlu manage iframe state lagi.

