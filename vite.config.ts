import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 8080
  },
  build: {
    outDir: 'dist'
  },
  resolve: {
    alias: {
      'src': '/src'
    }
  }
});
