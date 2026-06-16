# AgriWeight

Sistem manajemen timbangan digital untuk hasil pertanian, dibangun dengan React + Vite dan Firebase Realtime Database. Mendukung penimbangan real-time via perangkat IoT (ESP32/Arduino) tanpa server backend terpisah.

## Fitur

- **Login & Autentikasi** — Firebase Authentication dengan proteksi rute
- **Dashboard** — Statistik ringkasan, grafik 7 hari, dan 5 rekaman terbaru secara real-time
- **Input Timbangan** — Antarmuka penimbangan real-time yang terhubung ke perangkat IoT via Firebase RTDB
- **Riwayat Data** — Tabel rekaman dengan pencarian, paginasi, edit, dan hapus data
- **Notifikasi** — Dialog box untuk konfirmasi dan hasil setiap aksi (tambah, edit, hapus, login, logout)
- **Responsif** — Tampilan mobile (card list + bottom nav) dan desktop (sidebar + tabel)

## Tech Stack

| Teknologi | Versi |
|-----------|-------|
| React | 19 |
| Vite | 6 |
| Firebase SDK | 10 (modular) |
| Tailwind CSS | 3 |
| React Router DOM | 7 |

## Struktur Firebase RTDB

```
/
├── devices/
│   └── SCALE-01/
│       ├── status          # "idle" | "menimbang" | "selesai"
│       ├── petani_name
│       └── current_weight
└── weight_records/
    └── WR-{timestamp}/
        ├── id
        ├── nama_alat
        ├── hasil_timbangan
        ├── nama_petani
        ├── created_at
        └── updated_at
```

## Cara Menjalankan Lokal

**1. Clone repositori**
```bash
git clone https://github.com/username/agri-weight.git
cd agri-weight
```

**2. Install dependensi**
```bash
npm install
```

**3. Buat file `.env`** dari contoh yang tersedia:
```bash
cp .env.example .env
```
Isi setiap variabel dengan nilai dari Firebase Console project Anda (lihat bagian [Environment Variables](#environment-variables)).

**4. Jalankan dev server**
```bash
npm run dev
```
Buka `http://localhost:5173`

## Environment Variables

| Variabel | Keterangan |
|----------|------------|
| `VITE_FIREBASE_API_KEY` | API Key Firebase |
| `VITE_FIREBASE_AUTH_DOMAIN` | Auth domain project |
| `VITE_FIREBASE_DATABASE_URL` | URL Realtime Database |
| `VITE_FIREBASE_PROJECT_ID` | ID project Firebase |
| `VITE_FIREBASE_STORAGE_BUCKET` | Storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Sender ID |
| `VITE_FIREBASE_APP_ID` | App ID |
| `VITE_FIREBASE_MEASUREMENT_ID` | Analytics Measurement ID |

## Firebase Security Rules

Terapkan rules berikut di Firebase Console → Realtime Database → Rules:

```json
{
  "rules": {
    ".read":  "auth != null",
    ".write": "auth != null"
  }
}
```

## Build & Deploy

**Build production:**
```bash
npm run build
```
Output tersimpan di folder `dist/`.

**Deploy ke Vercel:**
1. Push repositori ke GitHub
2. Import project di [vercel.com](https://vercel.com)
3. Tambahkan semua environment variables di dashboard Vercel
4. Whitelist domain Vercel di Firebase Console → Authentication → Authorized Domains

## Integrasi IoT

Perangkat IoT (ESP32, Arduino, dll.) berkomunikasi melalui Firebase RTDB:

1. Frontend menulis `devices/SCALE-01/status: "menimbang"` saat tombol mulai ditekan
2. Perangkat membaca node tersebut dan mulai menimbang, lalu menulis `current_weight` secara berkala
3. Frontend mendengarkan perubahan `current_weight` secara real-time dan menampilkannya
4. Saat selesai, frontend menyimpan rekaman ke `weight_records/` dan mereset device ke `idle`

## Lisensi

[MIT](LICENSE)
