import react from '@vitejs/plugin-react-swc';
import browserslistToEsbuild from 'browserslist-to-esbuild';
import {defineConfig, mergeConfig} from 'vite';
import {ViteImageOptimizer} from 'vite-plugin-image-optimizer';
import {nodePolyfills} from 'vite-plugin-node-polyfills';
import tsconfigPaths from 'vite-tsconfig-paths';
import {defineConfig as defineTestConfig} from 'vitest/config';

const viteConfig = defineConfig({
  plugins: [nodePolyfills(), tsconfigPaths(), react(), ViteImageOptimizer()],
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
