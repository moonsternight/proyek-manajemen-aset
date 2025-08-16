# Sistem Informasi Manajemen Aset - PT. Cyber Network Indonesia

Proyek ini merupakan hasil dari kegiatan Praktik Kerja Lapangan (PKL) di PT. Cyber Network Indonesia. Sistem ini dibangun untuk mendigitalisasi dan mengotomatisasi proses pengelolaan aset perusahaan yang sebelumnya dilakukan secara manual menggunakan Microsoft Excel.

---

## 📜 Deskripsi

Sistem ini adalah aplikasi web dengan arsitektur client-server yang memungkinkan pengelolaan aset secara real-time. Terdapat dua peran pengguna utama: **Admin** dan **Staff**, dengan hak akses yang berbeda. 

Admin bertugas mengelola data master aset, sementara Staff bertugas melakukan pemindahan aset di lapangan. Fitur unggulan dari sistem ini adalah sinkronisasi status aset secara otomatis antara kedua peran tersebut untuk memastikan data selalu akurat dan terpusat.

---

## ✨ Fitur Utama

* **Manajemen Aset (CRUD):** Admin dapat menambah, melihat, dan mengubah detail aset.
* **Manajemen Hak Akses:** Perbedaan kewenangan yang jelas antara peran Admin dan Staff.
* **Sinkronisasi Status Otomatis:** Proses pemindahan oleh Staff secara otomatis mengubah status aset di dashboard Admin ('Stok' ↔ 'Terpasang') dan Staff ('Keluar' ↔ 'Masuk').
* **Riwayat Aset:** Melacak setiap perpindahan atau perubahan lokasi aset.
* **Log Aktivitas:** Mencatat aktivitas penting yang dilakukan oleh Admin (Login, Logout, Tambah, Edit).
* **Filter & Paginasi:** Memudahkan pencarian dan navigasi data aset dalam jumlah besar.

---

## 🛠️ Teknologi yang Digunakan

* **Backend:** Node.js, Express.js
* **Frontend:** React, TypeScript, Vite, Tailwind CSS
* **Database:** MySQL
* **Pengujian API:** Postman

---

## 🚀 Cara Menjalankan Proyek

Untuk menjalankan proyek ini di lingkungan lokal, Anda perlu menyiapkan database, backend, dan frontend secara terpisah.

### **1. Persiapan Database**

1.  Pastikan Anda memiliki server MySQL yang sedang berjalan.
2.  Buat sebuah database baru dengan nama `manajemen_aset`.
3.  Impor struktur tabel menggunakan file `database_schema.sql` yang tersedia di repositori ini.
    ```bash
    # Contoh perintah di terminal MySQL
    mysql -u [username] -p manajemen_aset < database_schema.sql
    ```

### **2. Menjalankan Backend (Server)**

1.  Clone repositori ini dan masuk ke direktori proyek.
    ```bash
    git clone [https://github.com/moonsternight/proyek-manajemen-aset.git](https://github.com/moonsternight/proyek-manajemen-aset.git)
    cd proyek-manajemen-aset
    ```

2.  Masuk ke direktori backend.
    ```bash
    cd MANAJEMEN-ASET/backend-manajemen-aset
    ```

3.  Instal semua dependensi yang dibutuhkan.
    ```bash
    npm install
    ```

4.  Buat file `.env` di dalam folder backend. Isinya adalah konfigurasi koneksi ke database Anda.
    ```
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=password_database_anda
    DB_NAME=manajemen_aset
    ```

5.  Jalankan server backend.
    ```bash
    npm run dev
    ```
    Server akan berjalan di `http://localhost:3000`.

### **3. Menjalankan Frontend (Client)**

1.  Buka terminal **baru**. Dari direktori root proyek (`proyek-manajemen-aset`), masuk ke direktori frontend.
    ```bash
    cd MANAJEMEN-ASET
    ```

2.  Instal semua dependensi yang dibutuhkan.
    ```bash
    npm install
    ```

3.  Jalankan aplikasi React.
    ```bash
    npm run dev
    ```
    Aplikasi akan terbuka secara otomatis di browser pada `http://localhost:5173`.

---
