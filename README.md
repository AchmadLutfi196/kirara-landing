# KIRARA — Kisah Rakyat Madura

Aplikasi pembelajaran Next.js dengan rute langsung, antarmuka React, dan data lokal pada browser. Mulai di `/masuk`, isi nama panggilan, lalu jelajahi Menu Utama. Area admin tersedia di `/admin` tanpa autentikasi; seluruh penerbitan dan moderasi berlaku pada perangkat ini.

## Menjalankan

Dari root proyek, gunakan Node.js yang kompatibel dengan versi Next.js pada `package.json` dan npm:

```sh
npm ci
npm run dev
```

Buka `http://localhost:3000/masuk`. Untuk memeriksa tipe dan menjalankan build produksi:

```sh
npm run typecheck
npm run build
npm start
```

Jalankan `npm start` setelah build selesai dan server pengembangan dihentikan. Jangan membuka `index.html` sebagai entry aplikasi Next.js.

## Rute

| Tujuan | Rute |
|---|---|
| Onboarding | `/masuk` |
| Menu Utama | `/menu` |
| Pilih Cerita | `/cerita` |
| Pembaca | `/baca/jokotole`, `/baca/potre-koneng`, `/baca/ke-lesap` |
| Mini Game | `/mini-game` |
| Kuis Budaya | `/kuis` |
| Hasil | `/hasil` |
| Ruang Karya | `/karya` |
| Profil | `/profil` |
| Materi | `/materi` |
| UI Kit | `/ui-kit` |
| Admin | `/admin` dan subrute pada [ADMIN.md](ADMIN.md) |

Rute dapat dibuka langsung dan dimuat ulang. UI Kit berada di rutenya sendiri. Petunjuk `index.html#/...` pada catatan lama merujuk prototipe historis, bukan entry kanonis.

## Perilaku dan batas konten

- Profil, progres, refleksi, apresiasi, unggahan, dan pengelolaan konten disimpan lokal. Tidak ada akun siswa, autentikasi admin, backend, sinkronisasi perangkat, atau publikasi internet.
- Hanya cuplikan Jokotole tersedia dari referensi. Potre Koneng dan Ke’ Lesap memiliki metadata/ilustrasi dengan status naskah belum tersedia. Tidak ada cerita lengkap atau audio narator yang direka.
- Membuka cuplikan tidak berarti cerita selesai. Naskah yang benar-benar diterbitkan pengelola dapat ditandai selesai; poin cerita diberikan sekali.
- Mini Game memiliki lima pasangan budaya dengan pilihan dua kartu (klik/sentuh/keyboard), menggantikan tali drag prototipe historis. Kuis awal memiliki satu soal referensi; admin dapat menyusun soal lokal. Hasil mencerminkan aktivitas yang dikerjakan. Hadiah Mini Game 500 dan kuis sempurna 20 diberikan sekali.
- Galeri awal berisi enam contoh desain dengan nama dan apresiasi contoh. Unggahan gambar adalah file/foto lokal, bukan OCR. JPG/PNG/WebP maksimal 2 MB harus dapat dibaca sebagai gambar. Dukungan kamera tergantung browser/perangkat.
- Draf admin tidak mengubah tampilan siswa; penerbitan, arsip, dan moderasi berlaku pada origin/browser yang sama. Pengaturan peninjauan mengatur unggahan baru.

## Penyimpanan dan migrasi

Aplikasi Next.js memakai `kirara.next.v2`. Data prototipe berasal dari `kirara.v1` (siswa) dan `kirara.admin.v1` (admin). Impor hanya dapat membaca data yang masih ada pada origin dan profil browser yang sama; berpindah dari `file://` atau domain/port lain tidak otomatis memindahkan localStorage. Rincian perilaku import dan hasil pengujian ada di [laporan migrasi/QA](docs/migration-qa.md).

Penyimpanan lokal dapat ditolak atau penuh. Pesan aplikasi menjelaskan kegagalan simpan; perubahan yang hanya bertahan dalam sesi dapat hilang ketika dimuat ulang. Jangan menganggap localStorage sebagai basis data sekolah atau cadangan permanen.

## Struktur dan aset

`app/`, `components/`, dan `lib/` memuat aplikasi Next.js. `public/assets/` melayani aset lokal. `index.html`, `app.js`, `admin.js`, `styles.css`, dan `admin.css` adalah sumber historis prototipe; aplikasi kanonis tidak menjalankannya. `app.js` adalah sumber historis dan bukan entry build Next.js; kesalahan sintaks yang ditemukan saat inventaris telah diperbaiki dalam migrasi.

Karakter, logo, ilustrasi cerita dan karya diekstrak dari screenshot pengguna; asal/crop ada pada `assets/provenance.json` dan salinan publiknya. Sumber screenshot tetap tersimpan di root. Ketajaman serta label yang menyatu pada gambar dibatasi sumber screenshot. Latar desa 1556 × 1011px merupakan hasil edit ilustrasi pengguna untuk menghapus teks/kontrol/karakter depan dan merekonstruksi lanskap; bukan foto geografis. Karakter asli tidak digambar ulang. Latar dekoratif boleh dipotong, sedangkan gambar konten ditampilkan utuh.

[DESIGN.md](DESIGN.md) menjelaskan tema petualangan budaya; [PRODUCT.md](PRODUCT.md) menjelaskan cakupan produk. `design-tokens.json` menyimpan spesifikasi token sumber.

## Verifikasi

Browser acceptance berada di `tests/migration.e2e.cjs`. Script memakai server Next.js yang sudah berjalan dan tidak memulai server. Setelah `npm ci`, siapkan Playwright dan Chromium untuk pengujian lokal:

```sh
npm install --no-save --package-lock=false playwright
npx playwright install chromium
npm run dev
```

Pada terminal kedua:

```sh
BASE_URL=http://localhost:3000 node tests/migration.e2e.cjs
```

`QA_OUTPUT` memilih direktori screenshot dan JSON hasil. `PLAYWRIGHT_MODULE` dan `CHROMIUM_PATH` dapat menunjuk instalasi Playwright/browser yang sudah tersedia. Cakupan dan hasil aktual ada pada [laporan migrasi/QA](docs/migration-qa.md). Berkas bukti di `/tmp` bersifat sementara; jalankan ulang untuk hasil terbaru. Tidak ada deployment dilakukan dan konfigurasi lokal bukan bukti bahwa preview atau production telah terbit.
