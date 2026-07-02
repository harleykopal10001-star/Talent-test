import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '../.env') });
const { BACKEND_PORT, FRONTEND_PORT } = process.env;

export default defineConfig({
  plugins: [react()],
  server: {
    port: FRONTEND_PORT,
    proxy: {
      '/api': `http://localhost:${BACKEND_PORT}`,
      '/uploads': `http://localhost:${BACKEND_PORT}`,
    },
  },
});
