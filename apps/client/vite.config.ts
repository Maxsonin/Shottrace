import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig, type PluginOption } from "vite";
import viteCompression from "vite-plugin-compression";
import svgr from "vite-plugin-svgr";

export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
		svgr(),
		viteCompression({
			algorithm: "brotliCompress",
			ext: ".br",
		}),
		visualizer({
			filename: "./reports/stats.html",
			open: true,
		}) as PluginOption,
	],

	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},

	build: {
		outDir: "dist",
		minify: "terser",
		sourcemap: false,
	},
});
