import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import { visualizer } from 'rollup-plugin-visualizer'


export default defineConfig({
  plugins: [
    react(), 
    svgr(),
    visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    })
  ],
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
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('antd')) {
              return 'antd-vendor';
            }
            if (id.includes('react-router')) {
              return 'router-vendor';
            }
            return 'vendor';
          }
          
          if (id.includes('src/pages')) {
            const pageName = id.split('src/pages/')[1].split('/')[0];
            return `page-${pageName}`;
          }
          
          if (id.includes('src/features')) {
            const featureName = id.split('src/features/')[1].split('/')[0];
            return `feature-${featureName}`;
          }

          if (id.includes('src/shared')) {
            return 'shared';
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  server: {
    port: 3000 // Бек принемает кросс запросы только на порту 3000. Кто не согласен, ругайтесь с ними :)
  }
})
