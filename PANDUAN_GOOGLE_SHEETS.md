# Menghubungkan CatatanPetani ke Google Sheets

## 1. Buat spreadsheet
1. Login ke akun Google dan buka https://sheets.google.com.
2. Buat **Blank spreadsheet**.
3. Beri nama `DATABASE_CATATANPETANI`.

## 2. Pasang Apps Script
1. Dari spreadsheet, pilih **Extensions > Apps Script**.
2. Hapus kode contoh pada `Code.gs`.
3. Buka file `Google_Apps_Script_Code.gs` dari paket ini, salin seluruh isinya ke editor.
4. Ganti `API_KEY` pada baris awal dengan kunci acak pribadi minimal 16 karakter.
5. Klik **Save**.

## 3. Buat tabel database
1. Pilih fungsi `setupDatabase` pada dropdown fungsi.
2. Klik **Run**.
3. Pilih akun Google, tinjau izin, lalu klik **Allow / Izinkan**.
4. Kembali ke spreadsheet. Script membuat delapan tab: `Data_Lahan`, `Musim_Tanam`, `Aktivitas`, `Biaya_Produksi`, `Persediaan`, `Mutasi_Stok`, `Hasil_Panen`, dan `Penjualan`.

Jangan mengubah nama tab atau header kolom.

## 4. Deploy sebagai Web App
1. Klik **Deploy > New deployment**.
2. Pilih jenis **Web app**.
3. Description: `CatatanPetani Database API`.
4. Execute as: **Me**.
5. Who has access: **Anyone**.
6. Klik **Deploy** dan berikan izin jika diminta.
7. Salin **Web app URL** yang berakhiran `/exec`, bukan URL editor.

Keamanan: endpoint Web App dapat dijangkau publik, tetapi operasi data memerlukan API_KEY. Spreadsheet dapat tetap private. Jangan bagikan API_KEY atau URL bersama API_KEY. Siapa pun yang memiliki kunci tersebut dapat membaca dan mengubah database.

Jika kode Apps Script diubah, buka **Deploy > Manage deployments > Edit**, pilih **New version**, lalu Deploy lagi.

## 5. Hubungkan aplikasi
1. Buka CatatanPetani dari GitHub Pages.
2. Masuk ke menu **Cadangan Data**.
3. Tempel URL Web App `/exec`.
4. Masukkan API_KEY yang sama persis dengan yang ada di Code.gs.
5. Klik **Simpan koneksi**.

## 6. Sinkronisasi pertama
- Klik **Kirim data perangkat ke Sheets** jika data yang benar ada di perangkat ini. Tindakan ini mengganti isi tabel di Google Sheets dengan data lokal perangkat.
- Klik **Ambil data dari Sheets** jika data yang benar sudah ada di spreadsheet. Tindakan ini mengganti data lokal perangkat dengan data dari Google Sheets.

Buat backup JSON terlebih dahulu. Pilih tindakan dengan hati-hati.

Setelah sinkronisasi awal, perubahan data yang disimpan di aplikasi dikirim otomatis ke Sheets. Untuk perangkat lain, masukkan URL dan API_KEY yang sama, lalu klik **Ambil data dari Sheets** untuk sinkronisasi awal.

## 7. Batasan dan catatan
- Data tetap memiliki salinan lokal di browser.
- Saat offline, data tetap tersimpan lokal; setelah online, lakukan sinkronisasi manual.
- Versi ini mengirim seluruh kumpulan data saat sinkronisasi, bukan menggabungkan konflik per baris. Hindari mengedit dari beberapa perangkat secara bersamaan.
- Buat backup JSON secara berkala.
- Jangan menghapus tab atau mengubah header.
