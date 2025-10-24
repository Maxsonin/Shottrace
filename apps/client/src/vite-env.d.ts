/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
	readonly VITE_API_URL: string;
	readonly TMDB_TOKEN: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
