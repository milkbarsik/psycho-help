import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    outDir: 'build',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
          if (id.includes('src/pages')) {
            const pageName = id.split('src/pages/')[1].split('/')[0];
            return `page-${pageName}`;
          }
        },
      },
    },
  },
  server: {
    port: 3000, // Бек принимает кросс запросы только на порту 3000. Кто не согласен, ругайтесь с ними :)

    // TODO: убрать этот прокси
    // Это очень плохое решение, но никак по-другому не работает, так как бек не поддерживает CORS
    proxy: {
      // '/users': { target: 'https://api.psychohelp-mospoly.ru', changeOrigin: true },
      // '/appointments': { target: 'https://api.psychohelp-mospoly.ru', changeOrigin: true },
      // '/therapists': { target: 'https://api.psychohelp-mospoly.ru', changeOrigin: true },
      // '/roles': { target: 'https://api.psychohelp-mospoly.ru', changeOrigin: true },
      // '/news': { target: 'https://api.psychohelp-mospoly.ru', changeOrigin: true },
      '/users': { target: 'http://95.31.169.106/api', changeOrigin: true },
      '/appointments': { target: 'http://95.31.169.106/api', changeOrigin: true },
      '/therapists': { target: 'http://95.31.169.106/api', changeOrigin: true },
      '/roles': { target: 'http://95.31.169.106/api', changeOrigin: true },
      '/news': { target: 'http://95.31.169.106/api', changeOrigin: true },
    },
  },
});
