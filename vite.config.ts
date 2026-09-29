import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Vercel (dominio oficial lp.pizzaprime.com.br) serve na raiz; a Vercel define VERCEL=1 no build.
  // GitHub Pages publica como project page: https://f5estrategia.github.io/pizza-prime-lp2/
  base: process.env.VERCEL ? "/" : "/pizza-prime-lp2/",
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
