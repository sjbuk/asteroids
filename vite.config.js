import { defineConfig } from 'vite';

export default defineConfig({
  root: 'public',
  server: {
    host: true,
    port: 5173
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true
  }
});
