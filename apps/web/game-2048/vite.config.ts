import path from 'node:path';

import react from '@vitejs/plugin-react-swc';
import browserslistToEsbuild from 'browserslist-to-esbuild';
import {defineConfig, mergeConfig} from 'vite';
import {ViteImageOptimizer} from 'vite-plugin-image-optimizer';
import {nodePolyfills} from 'vite-plugin-node-polyfills';
import {defineConfig as defineTestConfig} from 'vitest/config';

const viteConfig = defineConfig({
  plugins: [nodePolyfills(), react(), ViteImageOptimizer()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  build: {
    target: browserslistToEsbuild(),
  },
});

const vitestConfig = defineTestConfig({
  test: {
    environment: 'jsdom',
    coverage: {
      enabled: true,
    },
  },
});

export default mergeConfig(viteConfig, vitestConfig);
