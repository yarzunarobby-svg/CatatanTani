# CatatanPetani

Aplikasi pencatatan usaha tani padi dan jagung berbasis web (PWA).

## Upload ke GitHub Pages
1. Buat repository baru di GitHub.
2. Ekstrak ZIP ini.
3. Upload **seluruh isi folder** ke root repository. Pastikan `index.html` langsung berada di root.
4. Buka **Settings → Pages**.
5. Pada **Build and deployment**, pilih **Deploy from a branch**.
6. Pilih branch `main` dan folder `/ (root)`, lalu klik **Save**.
7. Tunggu situs diterbitkan, kemudian buka URL GitHub Pages.

## Instal di Android
1. Buka URL GitHub Pages melalui Google Chrome di HP Android.
2. Buka menu Chrome (⋮).
3. Pilih **Install app / Instal aplikasi** atau **Add to Home screen / Tambahkan ke layar utama**.
4. Ikuti instruksi Chrome.

PWA dan service worker memerlukan HTTPS. GitHub Pages menyediakan HTTPS setelah situs dipublikasikan.

## Penyimpanan data
- Data disimpan pada browser/perangkat melalui localStorage.
- Data tidak otomatis tersinkron antarperangkat atau antar pengguna.
- Buat backup JSON dari menu **Cadangan Data** secara berkala.
- Sinkronisasi cloud dan multi-pengguna memerlukan backend/database.

## Isi paket
- `index.html`: aplikasi.
- `manifest.webmanifest`: konfigurasi PWA.
- `sw.js`: service worker untuk cache/offline shell.
- `icons/`: ikon aplikasi.


## Database Google Sheets
Lihat `PANDUAN_GOOGLE_SHEETS.md` dan `Google_Apps_Script_Code.gs` untuk menghubungkan aplikasi ke Google Sheets.
