# 💣 Minesweeper Modern (React + TypeScript + Tailwind CSS)

Game Minesweeper modern dengan logika klasik, desain neo-retro, dan kustomisasi ukuran grid (baris & kolom) secara fleksibel dengan ukuran standar **8x8** (10 ranjau).

![Minesweeper](https://img.shields.io/badge/React-18-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-6.1-646cff?logo=vite)

---

## ✨ Fitur Utama

- 🌐 **Dukungan Multi-bahasa (Bilingual EN / ID)**: Dilengkapi tombol bendera (🇬🇧 English / 🇮🇩 Indonesia) untuk mengubah bahasa antarmuka secara instan, dengan **Bahasa Inggris (English) sebagai default**.
- 📐 **Ukuran Grid Kustom**: Bebas mengatur jumlah baris (*row*) dan kolom (*column*) dari 4×4 hingga 40×40 serta mengatur jumlah ranjau sesuai keinginan.
- 🎯 **Preset Standar**:
  - **Pemula (Default)**: 8 × 8 (10 Ranjau)
  - **Menengah**: 16 × 16 (40 Ranjau)
  - **Ahli**: 16 × 30 (99 Ranjau)
  - **Kustom**: Bebas atur ukuran baris, kolom, dan persentase kerapatan ranjau (12% santai, 16% standar, 22% sulit).
- 🛡️ **Jaminan Klik Pertama Selalu Aman (*First-Click Safety*)**: Klik pertama dijamin tidak pernah mengenai ranjau dan otomatis membuka area aman di sekitarnya.
- ⚡ **Chord Action (Double Click / Fast Reveal)**: Klik angka yang sudah dikelilingi bendera yang tepat untuk membuka sisa kotak sekitar secara instan.
- 🚩 **Mode Bendera & Touch Friendly**: Dukungan klik kanan untuk meletakkan bendera di desktop, serta tombol toggle mode bendera khusus perangkat mobile/touchscreen.
- ⏱️ **Digital LCD Display**: Timer detik dan penghitung sisa ranjau bergaya retro LED display.
- 🔊 **Efek Suara Web Audio API**: Efek suara sintetis instan tanpa memerlukan file audio eksternal (bisa dimatikan/mute kapan saja).
- 🎉 **Animasi Kemenangan**: Efek konfeti (*canvas-confetti*) saat berhasil menuntaskan seluruh kotak aman.
- 🏆 **Penyimpanan Rekor Terbaik (*High Score*)**: Waktu tercepat disimpan di `localStorage` per konfigurasi grid.

---

## 🚀 Cara Menjalankan

### 1. Jalankan Mode Development

```bash
npm run dev
```

Buka `http://localhost:5173` di browser Anda.

### 2. Build untuk Produksi

```bash
npm run build
```

Hasil build yang siap dideploy akan berada di direktori `dist/`.

### 3. Preview Hasil Build

```bash
npm run preview
```

---

## 🎮 Kontrol Permainan

| Aksi | Desktop | Mobile / Touch |
| --- | --- | --- |
| **Buka Kotak** | Klik Kiri | Ketuk kotak |
| **Beri Bendera** | Klik Kanan | Aktifkan ikon 🚩 lalu ketuk kotak |
| **Chord (Buka Sekitar)** | Double Click / Klik pada angka yang sudah sesuai bendera | Ketuk angka |
| **Mulai Ulang** | Klik tombol Emoji wajah 🙂 | Ketuk tombol Emoji wajah 🙂 |

# devsecops-minesweeper-typescript
