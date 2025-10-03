import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'


export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      '@': '/src'
    }
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
        }
      }
    }
  },
  server: {
    port: 3000 // Бек принемает кросс запросы только на порту 3000. Кто не согласен, ругайтесь с ними :)
  }
})
