# KIRARA Design System

Tema petualangan budaya Madura versi 2.0. UI Kit kanonis: `/ui-kit`. Spesifikasi token sumber: `design-tokens.json`; CSS runtime Next.js: `app/globals.css`, dengan tata letak halaman masuk/menu di `components/student-layout.module.css`. `styles.css` dan `admin.css` di root merupakan referensi historis prototipe.

## Arah visual

Lanskap desa, cream hangat, bingkai kayu, terracotta, emas/hijau, serta Sakera dan Marlena menyatukan pengalaman siswa. Halaman baca/kuis memakai panel opak agar teks terbaca. Area admin menekankan daftar, label, editor, dan status lokal.

- Gunakan satu tujuan utama per halaman dan normal flow flex/grid.
- Konten bacaan, jawaban, dan form berada pada permukaan opak.
- Status benar/salah/draf/terbit harus memiliki teks selain warna.
- Mobile mengatur ulang komposisi; teks dan kontrol tidak dikecilkan menjadi screenshot.
- Gambar konten tampil utuh; hanya lanskap dekoratif yang boleh memakai cover-crop.
- Pertahankan label, keyboard focus, target sentuh, reflow, dan reduced-motion. Sasaran desain tidak sama dengan sertifikasi aksesibilitas.

## Palette

| Token CSS | Nilai | Penggunaan |
|---|---|---|
| `--background` | `#FFF9F2` | Ground utama |
| `--surface` | `#FFF4DD` | Panel cream dan papan |
| `--reading-surface` | `#FFFFFF` | Bacaan, kuis, input, frame gambar |
| `--surface-secondary` | `#F6EADF` | Area sekunder dan disabled |
| `--primary` | `#A83D24` | Aksi dan lokasi aktif |
| `--primary-hover` | `#852D19` | Hover dan kedalaman aksi |
| `--primary-soft` | `#FBE9E1` | Pilihan aktif dan penekanan ringan |
| `--text` | `#382B24` | Teks utama |
| `--muted` | `#69584A` | Helper dan caption |
| `--world-wood` | `#8A5038` | Bingkai utama |
| `--world-wood-dark` | `#613A2B` | Teks papan dan kedalaman |
| `--world-wood-light` | `#C28A62` | Bingkai komponen |
| `--world-plaque-line` | `#E4BD95` | Detail panel dan separator |
| `--world-sky` | `#A7D1D7` | Acuan langit dan cadangan latar |
| `--world-meadow` | `#AFC797` | Acuan lanskap |
| `--gold` / `--gold-text` | `#F2BF45` / `#604600` | Reward dengan teks terbaca |
| `--reward-surface` | `#FFF2CA` | Background lencana dan poin |
| `--success` / `--success-soft` | `#2D6845` / `#E8F2E8` | Benar dan sukses |
| `--error` / `--error-soft` | `#AE2634` / `#FCECEF` | Salah dan error |
| `--focus` | `#214F75` | Fokus keyboard |

Teks isi memakai foreground gelap pada panel terang, dengan sasaran kontras minimal 4.5:1. Teks putih dipakai pada aksi terracotta yang gelap. Status memiliki teks atau ikon selain warna. Tidak ada dark mode pada cakupan ini.

## Tipografi

Maksimal dua keluarga font: **Trebuchet MS** untuk heading dan **Segoe UI** untuk body, keduanya dengan fallback sans-serif. Ini pilihan implementasi dari spesifikasi, bukan identifikasi pasti font pada screenshot. Tidak ada unduhan font eksternal.

| Hierarki | Ukuran | Weight / line-height |
|---|---|---|
| Display | `clamp(32px,4vw,56px)` | 700 / 1.2 |
| Page title | `clamp(28px,2.4vw,40px)` | 700 / 1.2–1.3 |
| Section | 24px | 700 / 1.2–1.4 |
| Card | 20px | 700 / 1.3 |
| Body | 18px | 400 / 1.6 |
| Reader | 18px, dapat diperbesar 22px | 400 / 1.7 |
| Label/caption | 16px | 400 atau 600 / 1.5–1.6 |

Outline cream terbatas pada judul besar di atas lanskap. Paragraf reader maksimal 65ch. Judul dan copy utama membungkus utuh; label aksi, waktu, jumlah, dan status tetap terbaca tanpa pemotongan. Data panjang di detail membungkus; nama profil menggunakan wrapping agar tidak keluar panel.

## Token, bentuk, dan elevasi

- Spacing: 4, 8, 12, 16, 24, 32, 48, 64, 96px.
- Radius: kontrol 12px, kartu 16px, panel/papan 24px.
- Border: 2px pada komponen umum; maksimal 4px pada bingkai papan utama. Detail dekoratif tipis boleh 1px.
- `--world-panel-shadow`: kedalaman bawah ringan 4px dan shadow lembut.
- `--world-control-shadow`: kedalaman bawah 4px untuk kontrol utama.
- `--world-board-shadow` dan `--world-board-inset`: kedalaman 8px serta bingkai dalam untuk papan menu.
- Halaman masuk/menu memakai token `--world-*` dan token global yang sama. Tema entry bukan palette kedua.
- Ikon SVG outline yang ada: viewBox 24, stroke 2, rounded caps/joins. Tidak memakai emoji fungsional.
- Tombol minimal 48px, input minimal 52px, target sentuh minimal 44px, pin Mini Game 44px.
- Fokus keyboard outline biru 3px, offset 4px; papan menu dapat memakai outline 4px.

## Implementasi React

App Router memuat rute kanonis, shell dan provider client bersama. Komponen siswa dan admin memakai React state/props; data lokal tidak diakses saat render server. Tidak ada runtime `innerHTML` prototipe yang menjadi entry aplikasi baru.

UI mencakup onboarding/menu, cerita/pembaca, matching, kuis/hasil, galeri, profil, materi, UI Kit, dan tujuh bagian admin. Nama komponen konkret berada di `components/`; fungsi `renderHeader()`, `miniGame()`, dan lainnya dalam dokumentasi lama adalah nama sumber historis.

UI Kit saat ini merupakan contoh ringkas kontrol/status, input, progres, panduan karakter, dan lanskap. Ia bukan katalog lengkap seluruh state interaksi prototipe.

## Interaksi dan isi

Onboarding memvalidasi nama dan menyimpan profil perangkat. Membuka cuplikan tidak memberi reward cerita. Refleksi dan perubahan profil bersifat lokal. Audio dan naskah yang tidak tersedia harus dinyatakan jelas.

Matching menghubungkan lima kartu gambar dan istilah, memeriksa jawaban serta mengizinkan koreksi. Migrasi memakai dua pilihan kartu (klik/sentuh) dan keyboard sebagai interaksi matching. Tali drag-and-drop dari prototipe historis tidak menjadi kontrak UI baru. Kuis memberi feedback jawaban dan hasil dari bank soal lokal terbit. Hadiah tidak boleh bertambah berulang saat aktivitas diulang.

Galeri berisi contoh referensi serta unggahan lokal; pengambilan foto bukan OCR. Admin memisahkan draf/publikasi serta moderasi karya. Tidak ada login, backend, atau data sekolah terverifikasi yang diasumsikan.

## Responsif dan verifikasi

Sasaran: desktop lapang, bacaan dibatasi lebar, mobile 390px satu kolom untuk isi panjang dan form, dua kolom pasangan dengan teks membungkus, serta navigasi compact. Uji overflow harus mencakup rute siswa dan admin. Screenshot dan hasil browser aktual dicatat pada [laporan QA](docs/migration-qa.md); spesifikasi ini tidak menyatakan seluruh breakpoint atau teknologi bantu telah diuji.

Menu belajar memakai tiga kolom pada desktop lebar, dua kolom pada tablet/ponsel, dan satu kolom di bawah 360px. Formulir nama dan pratinjau cerita dikelompokkan; ilustrasi pendamping tidak memperlebar form. Progres profil berada pada panel opak, dan panduan kuis menjadi baris ringkas pada layar kecil. Pada layar kecil, isi bacaan mendahului ilustrasi dan informasi audio pendukung.

## Asal aset

`public/assets/` menyajikan logo, karakter, cerita, karya, dan latar lokal. Sumber historis tetap di `assets/`; provenance crop tercatat di `assets/provenance.json`. Latar desa 1556 × 1011px diedit dari ilustrasi pengguna untuk menghilangkan UI dan merekonstruksi bagian lanskap. Batas ketajaman/label mengikuti screenshot sumber. Tidak ada klaim keaslian geografis.

Migrasi tidak melakukan deployment. Perintah aktual, batas penyimpanan, dan status verifikasi tersedia di [README.md](README.md).
