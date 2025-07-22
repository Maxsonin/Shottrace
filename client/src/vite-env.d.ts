/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly TMDB_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
