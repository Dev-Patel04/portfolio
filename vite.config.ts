import { defineConfig } from 'vite'

export default defineConfig({
  // Set base to repository name for GitHub Pages deployment
  // Change 'f1-portfolio' to your actual repository name if different
  base: process.env.NODE_ENV === 'production' ? '/f1-portfolio/' : '/',
  
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    
    // Generate sourcemaps for better debugging
    sourcemap: false,
    
    // Optimize for production
    minify: 'esbuild',
    
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  
  server: {
    host: true,
    port: 5173,
  },
  
  preview: {
    port: 4173,
  },
})