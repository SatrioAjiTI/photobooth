# 📸 AI Image Photobooth (Vue 3 + Replicate API)

Aplikasi web **AI Image Photobooth** interaktif dan modern berbasis **Vue 3**, dirancang khusus untuk event kiosk, photobox studio, dan pameran interaktif dengan transformasi visual kecerdasan buatan bertenaga **Replicate API**.

---

## 🌟 Fitur Utama & Alur 3 Langkah

### 1️⃣ Langkah 1: Ambil / Unggah Foto (Capture & Upload)
- **Kamera Langsung**: Akses webcam / kamera depan / belakang dengan flip camera selector.
- **Timer Hitung Mundur Photobooth**: Pilihan 0s, 3s, atau 5s dengan hitungan visual besar, suara shutter snap sintetis, dan efek kilat layar (*screen flash*).
- **Unggah Galeri**: Drag & drop berkas gambar (PNG, JPG, WEBP) atau pilih dari penyimpanan perangkat.
- **Contoh Model Demo**: Pilihan foto model instan untuk pengujian cepat tanpa webcam.

### 2️⃣ Langkah 2: AI Style Studio (Replicate API & Template Prompt)
- **Template Prompt Terkategori**:
  - 🌄 **Latar (Backgrounds)**: Cyberpunk Neon City, Cherry Blossom Garden, Luxury Gold Ballroom, Retro 80s Diner, Sci-Fi Mars Colony, Tropical Sunset Beach, Pastel Minimalist Studio, Enchanted Forest.
  - 👗 **Kostum (Outfits)**: Cyberpunk Exo-Suit, Royal Renaissance Gala, Batik Nusantara Modern, NASA Astronaut, 90s Vintage Streetwear, Black-Tie Tuxedo/Gown, Fantasy Elven Robe, Superbike Racing Leather.
  - ✨ **Objek & Vibe**: Hologram Neon Glasses, Studio Ringlight Glow, Sparklers & Confetti, Golden Hour Flare, 35mm Film Grain, Floating Magic Orbs.
  - 🎨 **Art Styles**: Studio Photorealistic HD, 3D Disney/Pixar, Studio Ghibli Anime, Cyberpunk Hyperglow, Renaissance Oil Painting.
- **Custom Prompt Input**: Tulis instruksi prompt kustom secara bebas.
- **Slider Kekuatan AI**: Atur tingkat kreativitas (40% - 95%).
- **Interactive Before / After Split Slider**: Bandingkan foto asli dengan hasil transformasi AI secara interaktif.

### 3️⃣ Langkah 3: Unduh, Scan QR, Cetak & Formulir Tamu Wajib
- **Pilihan Bingkai Photobooth**:
  - *Classic Polaroid*
  - *4-Cut Photobooth Strip* (Gaya Life4Cuts Korea)
  - *Cyberpunk Neon Border*
  - *Luxury Royal Gold*
  - *Pastel Lavender Minimalist*
- **Kustomisasi Teks Event**: Ubah judul acara dan tanggal sesuai kebutuhan.
- **Formulir Data Tamu Wajib**:
  - Nama Lengkap
  - Nomor WhatsApp / HP
  - Alamat Email
  - Rating Penilaian Bintang (1–5 Bintang)
  - Komentar Saran & Ulasan
- **Unduh HD**: Simpan berkas PNG resolusi tinggi dengan bingkai photobooth.
- **Scan QR Code HP**: Tamu memindai QR Code untuk mengunduh foto langsung ke smartphone via Wi-Fi lokal.
- **Cetak Langsung (Direct Print)**: Terintegrasi dengan `@media print` yang dioptimalkan untuk ukuran kertas foto 4x6 inch atau strip 2x6 inch.
- **Panel Buku Tamu (Guestbook & Admin)**: Rekap data pengunjung, rating bintang, dan tombol *Export CSV*.

---

## 🚀 Panduan Menjalankan Aplikasi

### 1. Prasyarat
- **Node.js**: Versi 18+ atau yang lebih baru.

### 2. Konfigurasi Token Replicate API (Opsional)
Buka file `.env` dan masukkan token API Anda dari [Replicate](https://replicate.com/account/api-tokens):
```env
REPLICATE_API_TOKEN=r8_xxxxxxxxxxxxxxxxxxxxxxxxx
```
> *Catatan: Anda juga dapat memasukkan token langsung melalui modal **⚙️ Replicate API** di antarmuka web, atau menggunakan **Mode AI Simulator bawaan** tanpa token.*

### 3. Menjalankan Server & Aplikasi
Jalankan perintah berikut di terminal:
```bash
npm run dev
```

Aplikasi akan otomatis berjalan pada:
- **Frontend Kiosk**: `http://localhost:5173`
- **Backend API & QR Download**: `http://localhost:3001`
- **Akses HP Jaringan Lokal**: `http://<IP-LAN-Anda>:5173`
