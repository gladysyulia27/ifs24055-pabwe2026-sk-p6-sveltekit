export type ImageOptimizer = "vercel" | "netlify" | "none";

// Hanya host ini yang didaftarkan di image optimizer (lihat vite.config.ts & netlify.toml).
const OPTIMIZABLE_HOSTS = ["open-api.delcom.org"];

// Kualitas 75 adalah nilai default yang diterima image optimizer Vercel.
const QUALITY = 75;

function isOptimizable(url: string): boolean {
  try {
    const { protocol, hostname } = new URL(url);
    return protocol === "https:" && OPTIMIZABLE_HOSTS.includes(hostname);
  } catch {
    return false;
  }
}

/**
 * Mengembalikan URL gambar yang sudah dioptimasi (resize + format modern + cache panjang)
 * lewat image optimizer Vercel/Netlify. Jika optimizer tidak aktif (lokal/Jenkins)
 * atau URL bukan dari API Delcom (mis. blob: preview), URL asli dikembalikan.
 */
export function optimizeImage(
  url: string,
  width: number,
  mode: ImageOptimizer = IMAGE_OPTIMIZER
): string {
  if (mode === "none" || !isOptimizable(url)) return url;
  const base = mode === "vercel" ? "/_vercel/image" : "/.netlify/images";
  return `${base}?url=${encodeURIComponent(url)}&w=${width}&q=${QUALITY}`;
}

/**
 * Membuat nilai atribut srcset untuk beberapa lebar. Mengembalikan undefined bila
 * gambar tidak bisa dioptimasi, sehingga atribut srcset tidak dirender.
 */
export function optimizeSrcset(
  url: string,
  widths: number[],
  mode: ImageOptimizer = IMAGE_OPTIMIZER
): string | undefined {
  if (mode === "none" || !isOptimizable(url)) return undefined;
  return widths.map((w) => `${optimizeImage(url, w, mode)} ${w}w`).join(", ");
}
