import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'node:path';
export default defineConfig({
  root: __dirname,
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@store-builder/i18n': resolve(__dirname, '../../libs/i18n/src/index.ts'),
      '@store-builder/contracts': resolve(
        __dirname,
        '../../libs/contracts/src/index.ts',
      ),
      '@store-builder/shared-types': resolve(
        __dirname,
        '../../libs/shared-types/src/index.ts',
      ),
      '@store-builder/validation': resolve(
        __dirname,
        '../../libs/validation/src/index.ts',
      ),
      '@store-builder/utils': resolve(
        __dirname,
        '../../libs/utils/src/index.ts',
      ),
      '@store-builder/api-client': resolve(
        __dirname,
        '../../libs/api-client/src/index.ts',
      ),
      '@store-builder/ui': resolve(__dirname, '../../libs/ui/src/index.ts'),
    },
  },
  server: { port: 4200, strictPort: true },
  build: { outDir: '../../dist/apps/merchant-panel', emptyOutDir: true },
});
