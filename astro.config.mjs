// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';

// The site is prerendered by default (static output). Only the anonymous apply
// endpoint opts into on-demand rendering (`export const prerender = false`), so
// a Node adapter is required to build and run that single server route.
// https://astro.build/config
export default defineConfig({
  output: 'static',
  adapter: node({ mode: 'standalone' }),

  vite: {
    plugins: [tailwindcss()],
  },

  server: {
    host: '0.0.0.0',
  },
});
