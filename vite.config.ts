import { defineConfig } from 'vite';

import { name } from './package.json';


export default defineConfig({
  root: './',
  publicDir: './src/assets',
  build: {
    sourcemap: false,
    emptyOutDir: true,
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
