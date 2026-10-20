import { sveltekit } from "@sveltejs/kit/vite";
import bunAdapter from "@sveltejs/adapter-bun";
import netlifyAdapter from "@sveltejs/adapter-netlify";
import vercelAdapter from "@sveltejs/adapter-vercel";
import tailwindcss from "@tailwindcss/vite";
import { svelteTesting } from "@testing-library/svelte/vite";
import { defineConfig, loadEnv } from "vite";
import process from "process";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const port = Number(process.env.APP_PORT || env.APP_PORT) || 3005;

  // Netlify mengisi NETLIFY=true, Vercel mengisi VERCEL=1 saat build.
  // Di lokal/Jenkins tetap pakai adapter-bun.
  const isNetlify = Boolean(process.env.NETLIFY);
  const isVercel = Boolean(process.env.VERCEL);

  // Image optimizer platform (resize + WebP/AVIF) bersifat OPT-IN lewat
  // VITE_IMAGE_OPTIMIZER=vercel|netlify. Default "none": gambar API Delcom dipakai
  // apa adanya. Sempat diaktifkan otomatis di Vercel, tapi sebagian gambar
  // mengembalikan 404 dan request pertama (cache dingin) memperlambat LCP.
  const imageOptimizer =
    env.VITE_IMAGE_OPTIMIZER === "vercel" || env.VITE_IMAGE_OPTIMIZER === "netlify"
      ? env.VITE_IMAGE_OPTIMIZER
      : "none";

  // Di Vercel, API Delcom dipanggil lewat rewrite same-origin (/api/delcom/*, lihat
  // vercel.json). Dengan begitu browser tidak mengirim preflight CORS dan tidak
  // memicu peringatan Lighthouse "Authorization will not be covered by the wildcard
  // symbol (*) in CORS Access-Control-Allow-Headers" dari server Delcom.
  const DELCOM_API = "https://open-api.delcom.org/api/v1";
  const configuredBaseUrl =
    env.VITE_DELCOM_BASEURL ||
    (isNetlify || isVercel ? DELCOM_API : "http://localhost:8000/api/v1");
  const delcomBaseUrl =
    isVercel && configuredBaseUrl === DELCOM_API
      ? "/api/delcom"
      : configuredBaseUrl;

  const adapter = isNetlify
    ? netlifyAdapter()
    : isVercel
      ? vercelAdapter(
          imageOptimizer === "vercel"
            ? {
                images: {
                  sizes: [64, 96, 128, 256, 384, 640, 828, 1080, 1200, 1920],
                  domains: ["open-api.delcom.org"],
                  formats: ["image/webp"],
                  // Nama file gambar memuat timestamp, jadi aman di-cache 1 tahun.
                  minimumCacheTTL: 31536000,
                },
              }
            : {}
        )
      : bunAdapter({
          envPrefix: "APP_",
          serverOptions: {
            port: port,
          },
        });

  return {
    plugins: [
      sveltekit({
        adapter,
        // Sisipkan CSS langsung di <head> agar tidak memblokir render
        inlineStyleThreshold: 100000,
      }),
      tailwindcss(),
      svelteTesting(),
    ],
    server: {
      port: port,
    },
    preview: {
      port: port,
    },
    build: {
      chunkSizeWarningLimit: 1500,
    },
    define: {
      IMAGE_OPTIMIZER: JSON.stringify(imageOptimizer),
      DELCOM_BASEURL: JSON.stringify(delcomBaseUrl),
    },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/setupTests.ts",
      coverage: {
        provider: "v8",
        reporter: ["text", "json", "html", "lcov"],
        include: ["src/**/*.{js,ts,svelte}"],
        exclude: [
          "src/app.d.ts",
          "src/env.d.ts",
          "src/setupTests.ts",
          "src/test-utils.ts",
          "**/*.test.{js,ts}",
          "node_modules/**",
          ".svelte-kit/**",
          ".docs/**",
        ],
        thresholds: {
          lines: 99,
          functions: 99,
          branches: 95,
          statements: 99,
        },
      },
    },
  };
});