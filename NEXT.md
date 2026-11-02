# cribs.ch – progress

## Done (2026-11-02)

- Static Astro rebuild of the old PHP 7 site (JKweb CMS), pixel-identical to the live site.
  Checked with full-page Playwright screenshot diffs against https://cribs.ch: all 33 pages,
  desktop 1440px and mobile 390px, 0 differing pixels.
- Content extracted into `src/data/*.json`. The original CSS/JS/fonts and all gallery images
  and the video are kept under their original URLs.
- URLs: `/de/…` as before; `/`, `/projekte` and `/buero` work as aliases; `/en` and `/fr`
  redirect to `/de/`; new 404 page, `sitemap.xml`, `robots.txt` (allow all) and `llms.txt`
  (generated from `src/data`). The empty "Luft" spacer pages are dropped.
- Google Analytics is commented out in `src/layouts/Base.astro`, so no tracking script is shipped.
- Repo: https://github.com/marceli-to/cribs.ch (`main`).
- Local: https://cribs.ch.test (Herd, SSL) serves `dist/` via `LocalValetDriver.php`.

## Next

- [ ] Google Analytics (G-03R04KNEDY) is commented out in `src/layouts/Base.astro` (2026-11-02).
      Decide with the client whether to re-enable it. If it stays off, update the Datenschutzerklärung,
      which still describes Google Analytics.
- [ ] Confirm with the client: the old robots.txt had `Disallow: *` (site blocked for search engines,
      sitemap pointing to the hosting domain). The new one allows indexing. Change it if blocking was intended.
- [ ] Choose hosting for go-live. `public/.htaccess` assumes Apache. On Netlify or Vercel,
      add their redirect config for deeper `/en/…` and `/fr/…` URLs.
- [ ] Deploy `dist/` and switch DNS / webroot from the PHP site. Afterwards, smoke-test that
      no request still goes to old dynamic URLs.
- [ ] Client review. The only intentional differences from the old site are the `/en`, `/fr`
      redirects, the 404 page, the dropped "Luft" pages, GA being off and robots.txt now allowing
      indexing. The footer © year is set at build time, so rebuild after New Year.
- [ ] Later: the new design on a Laravel backend. `src/data/*.json` can serve as the content
      import source.
