import { defineConfig } from 'vite';

import { name } from './package.json';


export default defineConfig({
  root: './',
  publicDir: './dist',
  build: {
    sourcemap: false,
    emptyOutDir: true,
    outDir: './dist/extension',
    lib: {
      name,
      formats: ['es'],
      fileName: () => `index.js`,
      entry: './src/extension.ts',
    },
  },
  server: {
    port: 5555,
    cors: { origin: '*' },
  }
})
