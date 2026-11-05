import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

// AV-007: compilación de diagnóstico exclusivamente.
// AV-008/AV-009 reemplazarán esta entrada por los módulos de la extensión.
export default defineConfig({
  publicDir: false, // Impide copiar public/manifest.json antes de que AV-009 lo configure.
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    target: 'chrome120',
    lib: {
      entry: fileURLToPath(new URL('./src/tooling/smoke.ts', import.meta.url)),
      formats: ['es'],
      fileName: 'av007-smoke',
    },
  },
});
