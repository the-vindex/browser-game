import { defineConfig } from 'vite';

export default defineConfig({
  base: '/browser-game/', // Adjust this to your GitHub repository name
  server: {
    port: 8080
  },
  build: {
    outDir: 'docs'
  },
  resolve: {
    alias: {
      'src': '/src'
    }
  }
});
