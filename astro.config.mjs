// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://cribs.ch',
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
  },
  // Old EN/FR URLs only ever showed the German content under a broken title.
  redirects: {
    '/en': '/de/',
    '/fr': '/de/',
  },
  // Keep whitespace between tags exactly as authored: the legacy CSS relies on
  // inline-element spacing (images, headings) like the original PHP output.
  compressHTML: false,
  devToolbar: { enabled: false },
});
