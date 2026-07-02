import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config.js';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default mergeConfig(
  viteConfig,
  defineConfig({
    root: dirname,
    test: {
      environment: 'jsdom',
      setupFiles: './vitest.setup.js',
      globals: true,
    },
  }),
);
