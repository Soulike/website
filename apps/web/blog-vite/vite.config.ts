import path from 'node:path';

import react from '@vitejs/plugin-react-swc';
import browserslistToEsbuild from 'browserslist-to-esbuild';
import {defineConfig} from 'vite';
import {ViteImageOptimizer} from 'vite-plugin-image-optimizer';
import {nodePolyfills} from 'vite-plugin-node-polyfills';

// https://vite.dev/config/
export default defineConfig({
  plugins: [nodePolyfills(), react(), ViteImageOptimizer()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  build: {
    target: browserslistToEsbuild(),
  },
  server: {
    proxy: {
      '/server': 'https://soulike.tech',
    },
  },
});
