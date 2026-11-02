import type { APIRoute } from 'astro';
import projects from '../data/projects.json';
import pages from '../data/pages.json';
import site from '../data/site.json';

const text = (html: string) =>
  html.replace(/<br\s*\/?>/g, ' ').replace(/<[^>]+>/g, '').replace(/&nbsp;| /g, ' ').replace(/\s+/g, ' ').trim();

export const GET: APIRoute = ({ site: base }) => {
  const url = (p: string) => new URL(p, base).href;
  const a = site.address;
  const team = pages.buero.team
    .map((m) => `- ${m.name}: ${text(m.bio).replace(m.name, '').replace(/ geboren .*/, '').trim()}`)
    .join('\n');
  const list = projects
    .map((p) => `- [${p.heading}](${url(`/de/projekte/${p.slug}`)}): ${[p.place, p.category].filter(Boolean).join(', ')}. ${text(p.intro)}`)
    .join('\n');

  const body = `# ${a.company}

> ${pages.home.description}

${a.company}, ${a.street}, ${a.city}. Tel. ${a.phone}, ${a.email}

## Seiten

- [Projekte](${url('/de/projekte')}): Übersicht aller Projekte
- [Büro](${url('/de/buero')}): Büro, Team und Impressum
- [Jobs](${url('/de/jobs')}): Offene Stellen
- [Datenschutz](${url('/de/info/datenschutz')}): Datenschutzerklärung

## Projekte

${list}

## Team

${team}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
