declare const DELCOM_BASEURL: string;
declare const IMAGE_OPTIMIZER: "vercel" | "netlify" | "none";

interface ImportMetaEnv {
  readonly VITE_DELCOM_BASEURL: string;
  readonly VITE_IMAGE_OPTIMIZER?: string;
  readonly APP_PORT: string;
  readonly PORT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
