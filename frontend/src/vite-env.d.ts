/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_AXIOS_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
