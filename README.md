# cribs.ch – static interim site

Static Astro rebuild of https://cribs.ch (the old PHP 7 CMS by JKweb), running until the
new Laravel-based site is ready. The frontend matches the old site pixel for pixel
(verified with full-page screenshot diffs, desktop + mobile, all pages).

## Develop / build

Requires Node ≥ 22.23 (see `.nvmrc`).

```sh
nvm use
npm install
npm run dev      # http://localhost:4321
npm run build    # → dist/ (upload the contents to the webroot)
```

## Structure

| Path | Purpose |
| --- | --- |
| `src/data/grid.json` | Project overview grid: order, column width (`col-sm-N`), `margin-top`, preview image/video, spacers |
| `src/data/projects.json` | Project detail pages: meta, heading, place/year, category, intro HTML, images, text HTML |
| `src/data/pages.json` | Meta + content for home, Projekte, Büro (intro, team, images, Impressum), Jobs, Datenschutz |
| `src/data/site.json` | Address, Google Analytics ID, asset cache-buster |
| `src/layouts/Base.astro` | `<head>`, scripts and gallery markup shared by all pages |
| `src/components/` | Top section, view switcher, grid, footer, Büro, info page |
| `public/public/` | Original CSS/JS/fonts/icons of the old site (unchanged, same URLs) |
| `public/gallery/`, `public/download/` | All images and the video, under their original URLs |

Content edits: change the JSON in `src/data/`, add new images to `public/gallery/…`, then rebuild.
HTML fields (`intro`, `text`, `bio`, `content`) are rendered as-is.

## URLs

- Same URLs as before: `/de/`, `/de/projekte`, `/de/projekte/<slug>`, `/de/buero`, `/de/jobs`, `/de/info/datenschutz`.
- `/`, `/projekte` and `/buero` are served as real pages (the old JS links to them), with a canonical link to `/de/…`.
- `/en/…` and `/fr/…` (which only ever showed the German content) redirect to `/de/…`
  (`public/.htaccess` on Apache; Astro meta-refresh pages for `/en` and `/fr` elsewhere).
- The empty "Luft" spacer pages are not generated.

`compressHTML` is disabled on purpose: the legacy CSS depends on the whitespace between inline elements.
