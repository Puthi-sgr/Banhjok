import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const githubPagesBase = '/Banhjok/';

export default defineConfig({
  base: githubPagesBase,
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    allowedHosts: true,
  },
});
