// @ts-check
import { defineConfig } from 'astro/config';

// Pas 'site' aan zodra het definitieve domein bekend is.
export default defineConfig({
  site: 'https://rotary-hoogeveen-dewolden.pages.dev',
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
  },
});
