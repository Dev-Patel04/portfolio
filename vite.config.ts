import { defineConfig } from 'vite'

export default defineConfig({
  // Set base to repository name for GitHub Pages deployment
  // Changed to 'portfolio' to match your actual repo name
  base: process.env.NODE_ENV === 'production' ? '/portfolio/' : '/',
  
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