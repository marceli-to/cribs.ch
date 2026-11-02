import type { APIRoute } from 'astro';
import projects from '../data/projects.json';

export const GET: APIRoute = ({ site }) => {
  const paths = ['/de/', '/de/projekte', '/de/buero', '/de/jobs', '/de/info/datenschutz', ...projects.map((p) => `/de/projekte/${p.slug}`)];
  const urls = paths.map((p) => `<url><loc>${new URL(p, site).href}</loc></url>`).join('');
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml' } }
  );
};
