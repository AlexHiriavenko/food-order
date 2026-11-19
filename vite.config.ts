import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import handlebars from 'vite-plugin-handlebars';

const base = '/food-order/';
const root = import.meta.dirname;

// Каждая страница — отдельная HTML-точка входа (MPA).
const pages = {
  home: resolve(root, 'index.html'),
  menu: resolve(root, 'menu/index.html'),
  discounts: resolve(root, 'discounts/index.html'),
};

export default defineConfig({
  base,
  appType: 'mpa',

  plugins: [
    handlebars({
      partialDirectory: resolve(root, 'src/components'),
      context: {
        basePath: base,
      },
    }),
  ],
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      input: pages,
    },
  },
});
