# ifs24055-pabwe2026-sk-p6-sveltekit

Proyek Studi Kasus 2: Pengembangan Aplikasi Web **Delcom Courses** berbasis **SvelteKit** (TypeScript), **Tailwind CSS v4**, dan **Bun** (`@sveltejs/adapter-bun`). Terhubung langsung dengan Delcom Open API (`https://open-api.delcom.org/docs/1.0/api-courses`).

---

## 🚀 Fitur Utama

1. **Autentikasi & Sesi**:
   - Pendaftaran akun baru (`/auth/register`).
   - Masuk akun (`/auth/login`) dengan penyimpanan token aman di `localStorage`.
   - Proteksi rute berbasis sesi dengan redirect otomatis (`AuthSessionRedirect`).
   - Keluar akun (*logout*).

2. **Manajemen Kursus (CRUD)**:
   - Menampilkan daftar semua kursus dengan filter pencarian dan opsi "Semua / Kursus Saya" (`/`).
   - Tambah kursus baru dengan judul dan deskripsi Markdown (`AddModal`).
   - Ubah informasi kursus (`ChangeModal`).
   - Ubah/unggah foto cover kursus (`ChangeCoverModal`).
   - Hapus kursus dan hapus semua kursus milik pengguna (dengan dialog konfirmasi SweetAlert2).

3. **Materi Pembelajaran (Course Contents)**:
   - Tambah dan edit materi video YouTube (`ContentModal`).
   - Tampilan video interaktif (*responsive YouTube iframe embed*) (`/courses/[courseId]/contents/[contentId]`).
   - Penandaan status materi (Selesai / Belum Selesai).
   - Hapus materi konten kursus.

4. **Keanggotaan Mahasiswa & Progres**:
   - Mengikuti kursus (*join/enroll*) sebagai mahasiswa.
   - Keluar dari kursus (*leave/unenroll*).
   - Indikator persentase progres belajar materi kursus.

5. **Rating & Ulasan**:
   - Pemberian nilai rating (1–5 bintang) beserta komentar ulasan.
   - Perhitungan rata-rata rating kursus (*average rating*).

6. **Pengguna & Profil**:
   - Melihat daftar seluruh pengguna terdaftar (`/users`).
   - Melihat dan memperbarui profil pengguna (`/profile`).
   - Unggah/ganti foto profil.
   - Ganti kata sandi (*password*).

---

## 🛠️ Tech Stack & Konfigurasi

- **Framework**: [SvelteKit](https://kit.svelte.dev/) (Svelte 5)
- **Language**: TypeScript
- **Runtime & Package Manager**: [Bun](https://bun.sh/)
- **Adapter**: `@sveltejs/adapter-bun` (menggunakan prefix env `APP_`, default port: `3005`)
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`)
- **Markdown**: Toast UI Editor (`@toast-ui/editor`)
- **Icons**: Lucide Svelte (`lucide-svelte`)
- **Testing**: Vitest, `@testing-library/svelte`, `@testing-library/jest-dom`, JSDOM, V8 Coverage

---

## ⚙️ Variabel Lingkungan (`.env`)

Konfigurasikan file `.env` berdasarkan `.env.example`:

```env
APP_PORT=3005
VITE_DELCOM_BASEURL=https://open-api.delcom.org/api/v1
```

---

## 📦 Instalasi & Penggunaan

### 1. Instalasi Dependensi

```bash
bun install
```

### 2. Mode Pengembangan (Development)

```bash
bun run dev
```

Aplikasi dapat diakses melalui browser di `http://localhost:3005`.

### 3. Pengujian Unit & Cakupan Kode (Testing & Coverage)

```bash
# Menjalankan seluruh pengujian unit
bun run test

# Menjalankan pengujian dengan laporan cakupan kode (V8)
bun run test:coverage
```

- **Total Test Suites**: 28 file pengujian
- **Total Tests**: 301 pengujian unit (100% lulus)
- **Lines Coverage**: 100.00%
- **Functions Coverage**: 100.00%

### 4. Build & Jalankan untuk Produksi (Production)

```bash
# Kompilasi aplikasi untuk produksi
bun run build

# Menjalankan server produksi Bun
bun start
```

---

## 📂 Struktur Direktori Proyek

```
src/
├── app.d.ts
├── app.html
├── setupTests.ts
├── test-utils.ts
├── hooks/
│   └── useInput.ts
├── helpers/
│   ├── apiHelper.ts
│   └── toolsHelper.ts
├── features/
│   ├── auth/
│   │   ├── api/
│   │   ├── layouts/
│   │   ├── pages/
│   │   └── states/
│   ├── common/
│   │   └── pages/
│   ├── courses/
│   │   ├── api/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── modals/
│   │   ├── pages/
│   │   └── states/
│   └── users/
│       ├── api/
│       ├── pages/
│       └── states/
└── routes/
    ├── +error.svelte
    ├── +layout.svelte
    ├── +layout.ts
    ├── +page.svelte
    ├── auth/
    ├── courses/
    ├── profile/
    └── users/
```
