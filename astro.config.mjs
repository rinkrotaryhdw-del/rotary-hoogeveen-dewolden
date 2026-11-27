// @ts-check
import { defineConfig } from 'astro/config';

// Pas 'site' aan zodra het definitieve domein bekend is.
export default defineConfig({
  site: 'https://rotarydewoldenhoogeveen.nl',
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
  },
});
