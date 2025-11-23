import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  assetsInclude: ["**/*.pdf"],
  server: {
    port: 5173,
    strictPort: false,
    headers: {
      // Add CORS headers for PDFs
      'Access-Control-Allow-Origin': '*',
      'Cross-Origin-Embedder-Policy': 'credentialless',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Resource-Policy': 'cross-origin'
    },
    fs: {
      // Allow serving files from project root
      allow: ['..']
    }
  },
  build: {
    assetsInlineLimit: 0, // Don't inline PDFs as base64
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.pdf')) {
            return 'assets/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
  },
  optimizeDeps: {
    exclude: ['pdfjs-dist']
  }
});
