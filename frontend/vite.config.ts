import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import copy from 'rollup-plugin-copy';

export default defineConfig({
  plugins: [
    react(),
    {
      ...copy({
        targets: [
          { src: 'dist/*', dest: '../static/' } // Copy the contents of 'dist' to '../static'
        ],
        hook: 'writeBundle' // Hook into the writeBundle event to run this after the build
      })
    }
  ],
  build: {
    outDir: 'dist' // Set the output directory to 'dist'
  },
  base: '/app/'
  
});