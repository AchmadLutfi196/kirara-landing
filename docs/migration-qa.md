# Migrasi dan QA KIRARA

**Status:** browser acceptance selesai untuk route, onboarding, aktivitas siswa, galeri, serta CRUD admin. Aplikasi diuji melalui `http://localhost:3000` pada Chromium desktop 1440px, desktop 1280px untuk header, serta viewport mobile 390px. Tidak ada deployment yang dilakukan.

## Kontrak dan perubahan migrasi

Rute siswa diuji langsung dan dimuat ulang: `/masuk`, `/menu`, `/cerita`, tiga `/baca/...`, `/mini-game`, `/kuis`, `/hasil`, `/karya`, `/profil`, `/materi`, dan `/ui-kit`. Rute admin yang diuji: `/admin`, `/admin/konten`, `/admin/kuis`, `/admin/mini-game`, `/admin/karya`, `/admin/siswa`, dan `/admin/pengaturan`.

Sumber prototipe menggunakan `kirara.v1` dan `kirara.admin.v1`; Next.js menggunakan `kirara.next.v2`. Import membaca namespace lama pada origin yang sama. Uji import memeriksa data siswa tetap terambil ketika namespace admin rusak, bentuk objek sampul cerita lama, data nested yang rusak, serta id cerita tak dikenal yang tidak boleh memberi poin. Membuka cuplikan bukan menyelesaikan cerita. Materi/cerita draf tidak tampil pada siswa; publikasi lokal menghubungkan konten ke halaman siswa. Sampul dapat diterbitkan tersendiri tanpa menerbitkan draf teks.

`index.html`, `app.js`, `admin.js`, `styles.css`, dan `admin.css` adalah sumber historis, bukan runtime Next.js. Inventaris awal menemukan sintaks rusak di `app.js`; implementer telah memperbaikinya. Aplikasi kanonis menggunakan rute App Router dan data browser lokal.

Matching memakai pilihan dua kartu melalui sentuhan/klik dan keyboard, sesuai cakupan mobile yang disetujui koordinator. Tali drag dari prototipe lama tidak dipertahankan. Pasangan benar terkunci ketika jawaban salah diperbaiki; hadiah Mini Game 500 dan kuis sempurna 20 tidak terduplikasi.

## Hasil browser

| Skenario | Hasil |
|---|---|
| Rute langsung, reload, error halaman, overflow pada desktop 1440px | Lulus pada rerun desktop. Run awal berbenturan dengan restart dev server dan timeout `/cerita`; rerun stabil lulus. |
| Akses langsung tanpa nama | `/menu` dan `/kuis` mengarahkan pengunjung baru ke `/masuk`; area admin tetap dapat dibuka tanpa profil siswa. |
| Semua rute siswa/admin pada viewport 390px, reload dan overflow horizontal | Lulus. |
| Header pada 1280px dan 1440px; tautan satu baris, menu desktop tersembunyi, CTA membaca terracotta | Lulus pada rerun. |
| Menu mobile dan matching lewat keyboard; galeri unggah serta editor admin tidak overflow | Lulus. |
| Validasi onboarding, masuk menu, nama bertahan setelah reload | Lulus. |
| Storage lama dan current dengan JSON/nested records rusak; import student/admin dan objek sampul lama | Lulus tanpa uncaught page error; id cerita palsu tidak menambah poin. |
| Kuis salah/benar, hasil, pengulangan tanpa poin ganda | Lulus. |
| Matching koreksi jawaban salah, kunci jawaban benar, hasil dan hadiah satu kali | Lulus. |
| Unggah JPG/PNG/WebP: MIME salah, ukuran >2 MB, bytes gambar invalid ditolak; gambar valid menunggu moderasi | Lulus. Persetujuan menampilkan karya; dialog Escape mengembalikan fokus; apresiasi dapat toggle. |
| Admin cerita: simpan draf tersembunyi, publish terlihat di reader, tanda selesai memberi 50 sekali, arsip/pulihkan | Lulus. Naskah di test merupakan fixture QA terisolasi, bukan klaim cerita resmi. |
| Terbitkan sampul saja dan pulihkan sampul asli tanpa menerbitkan judul/naskah draf | Lulus. |
| Materi: draf tersembunyi, istilah duplikat ditolak, materi terbit tampil di Materi dan Mini Game | Lulus pada rerun setelah accessible name field distabilkan. |
| CRUD katalog admin: buat draf cerita, terbitkan agar terbaca siswa, poin sekali, hapus; buat/terbitkan/hapus materi tambahan | Lulus. Materi tambahan tampil di Materi; permainan tetap memakai lima pasangan sumber. |

Dua kegagalan sementara berasal dari lingkungan/harness: server development restart saat uji desktop dan selector nama textarea sebelum hubungan label diperbaiki. Rerun desktop dan materi lulus; implementasi kini memberi label dan kontrol asosiasi eksplisit. Ringkasan rerun menggantikan hasil sementara tersebut dalam [hasil JSON](qa-results.json), yang mencatat alasan keduanya.

## Verifikasi revisi tata letak siswa — 16 Oktober 2026

Penilaian visual dan pemindaian mekanis dijalankan oleh dua agen Impeccable secara terpisah. Revisi mencakup halaman masuk/menu, jarak judul dan deskripsi, panduan kuis, profil, urutan isi pembaca pada mobile, toolbar galeri, serta kerapatan Mini Game. CSS entry lama yang tidak digunakan telah dihapus setelah beralih ke CSS Module.

- `npm run typecheck` dan `npm run build` lulus.
- Seluruh 16 skenario `tests/migration.e2e.cjs` lulus pada development server. Kewajiban mengisi nama, keyboard, hadiah satu kali, publikasi konten, serta CRUD admin tetap terverifikasi.
- Build produksi diperiksa pada lebar 320, 390, 768, 1024, dan 1440px untuk delapan rute siswa: menu, cerita, pembaca Jokotole, Mini Game, kuis, karya, profil, dan materi. Tidak ditemukan overflow horizontal atau uncaught browser error, termasuk dengan nama siswa panjang.
- Validasi formulir nama dan jumlah kolom menu diperiksa pada kelima ukuran tersebut. Pada 390px, pertanyaan kuis dimulai sebelum posisi vertikal 700px.
- Screenshot masuk/menu/kuis/profil pada 1440 dan 390px ditinjau secara visual. Artefak sementara memakai awalan `/tmp/kirara-student-after-` dan `/tmp/kirara-student-production-`; hasil regresi berada di `/tmp/kirara-student-layout-qa`.

## Batas yang belum diuji

Pengujian berjalan pada Chromium desktop dalam viewport emulasi; tidak mencakup perangkat fisik/browser lain, kamera nyata, kapasitas storage browser pada kondisi penuh, autentikasi/backend, sinkronisasi antardevais, atau deployment. Tali drag prototipe, activity log historis, dan penghapusan unggahan tidak termasuk penerimaan migrasi ini. Data tetap lokal dan area admin tidak memakai autentikasi.

Hasil 16 skenario yang lulus tersimpan pada [hasil JSON](qa-results.json). Screenshot sementara berada pada direktori `QA_OUTPUT` di mesin penguji (default `/tmp/kirara-next-qa`); jalankan ulang perintah README untuk menghasilkan gambar baru.
