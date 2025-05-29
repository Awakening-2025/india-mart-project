import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 8080,         // 👈 Set frontend port to 8080
    open: true,         // Optional: opens browser automatically
  },
});
