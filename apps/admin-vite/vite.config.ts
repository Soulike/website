import react from '@vitejs/plugin-react-swc';
import {defineConfig} from 'vite';
import {ViteImageOptimizer} from 'vite-plugin-image-optimizer';
import {nodePolyfills} from 'vite-plugin-node-polyfills';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
  plugins: [nodePolyfills(), tsconfigPaths(), react(), ViteImageOptimizer()],
  server: {
    proxy: {
      '/server': 'https://admin.soulike.tech',
    },
  },
});
