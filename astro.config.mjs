// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://kh7al.site',
  vite: {
    plugins: [tailwindcss()]
  }
});
