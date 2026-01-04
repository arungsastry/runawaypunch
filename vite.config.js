import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solid()],
  base: '/runawaypunch/',
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
});
