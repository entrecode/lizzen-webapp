import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solidPlugin()],
  server: {
    port: 3210,
  },
  build: {
    target: 'esnext',
  },
  base: '/lizzen/',
});
