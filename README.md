# 🌟 Arnisekai

Arnisekai adalah platform streaming anime dan donghua yang menyediakan akses gratis ke berbagai konten animasi dari Jepang dan China. Dibangun dengan teknologi modern untuk memberikan pengalaman menonton yang optimal.

## ✨ Fitur Utama

- 🎬 Streaming anime dan donghua secara gratis
- 🔍 Pencarian real-time dengan tampilan hasil yang interaktif
- 🎨 Antarmuka pengguna yang modern dan responsif
- 🌐 Dukungan untuk berbagai kualitas video
- 📱 Tampilan yang responsif untuk semua perangkat
- 🔄 Pembaruan konten secara berkala
- 🎯 Navigasi yang mudah dan intuitif

## 🛠️ Teknologi yang Digunakan

- **Next.js 14** - Framework React untuk produksi
- **Tailwind CSS** - Framework CSS untuk styling
- **API Integration** - Integrasi dengan berbagai sumber konten melalui API routes
- **Server-Side Rendering** - Performa dan SEO yang optimal
- **Progressive Web App** - Pengalaman aplikasi native

## 🚀 Cara Menjalankan Proyek

1. **Clone repositori**
   ```bash
   git clone https://github.com/NPMA7/arnisekai.git
   cd arnisekai
   ```

2. **Install dependensi**
   ```bash
   npm install
   # atau
   yarn install
   ```

3. **Konfigurasi environment**
   - Buat file `.env.local`
   - Tambahkan konfigurasi yang diperlukan:
   ```env
   ANIME_BASE_URL=https://anyapi-beta.vercel.app/v1/anime/?
   DONGHUA_BASE_URL=https://anyapi-beta.vercel.app/v1/donghua/?
   API_KEY=your_api_key
   ```

4. **Jalankan development server**
   ```bash
   npm run dev
   # atau
   yarn dev
   ```

5. **Buka browser**
   - Buka [http://localhost:3000](http://localhost:3000)

## 📦 Struktur Proyek

```
arnisekai/
├── src/
│   ├── app/                 # Routing dan halaman
│   ├── components/          # Komponen yang dapat digunakan kembali
│   ├── lib/                 # Konfigurasi dan fungsi utilitas
│   │   └── apiConfig.js     # Fungsi utilitas untuk URL API
│   ├── pages/               # API routes dan server-side functions
│   │   └── api/             # API routes yang bertindak sebagai proxy
│   └── styles/              # File CSS global dan modul
├── public/                  # Aset statis
└── package.json             # Dependensi dan skrip
```

## 🔒 Arsitektur Keamanan

Aplikasi ini menggunakan API routes untuk mengamankan kunci API dan URL endpoint eksternal:

- ✅ Kunci API disimpan secara eksklusif di server dan tidak terekspos ke sisi klien
- ✅ Semua permintaan ke API eksternal dirutekan melalui proxy server Next.js
- ✅ Validasi permintaan dilakukan di server sebelum diteruskan ke API eksternal
- ✅ Fallback URL disediakan untuk kasus ketika variabel lingkungan tidak tersedia
- ✅ Penggunaan fungsi utilitas untuk konsistensi pemanggilan API (`getAnimeUrl` dan `getDonghuaUrl`)

API route bertindak sebagai perantara keamanan:
```
Browser/Client → Next.js API Routes → External API
                 (adds API key)
```

## 🌈 Fitur yang Akan Datang

- [ ] Sistem autentikasi pengguna
- [ ] Daftar tontonan pribadi
- [ ] Sistem komentar dan diskusi
- [ ] Dukungan untuk lebih banyak sumber konten
- [ ] Fitur unduhan untuk menonton offline

## 📝 Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).

## 📞 Kontak

Jika Anda memiliki pertanyaan atau saran, jangan ragu untuk:
- Membuat issue di GitHub
- Menghubungi kami melalui email

---

Dibuat dengan ❤️ oleh Tim Arnisekai
