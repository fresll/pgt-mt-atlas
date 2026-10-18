# Public English release and language navigation

The curator explicitly authorised publishing the English version on GitHub Pages on 18 October 2026, superseding the earlier restriction to owner-only English review. The Sites project remains private and is not republished or reconfigured by this release.

Baseline: `audit/v13-preview` at `0ca41d1facc260b4b090375e3b86e04e1c9b8a4f`, checked against the cloud remote before editing.

## Changes

- Header language link: a globe icon with EN/RU, a descriptive accessible name, target-language metadata and a 44 px minimum target. Switches to the same section and retains query parameters and anchors. Native static links also work without JavaScript.
- Explicit `VITE_ATLAS_ENGLISH_PUBLIC=1` in the Pages build enables English routes and static HTML. Private previews still require their existing English-review flag; the public flag cannot override that setting.
- Both language choices are available on the generated 404 page.
- Pages retains the existing soft-launch search policy (`noindex, follow`, no sitemap), analytics and hosting path.
- Public-build browser checks cover all 22 sections in each language, two hosting paths, widths of 320/390/1440 px, keyboard switching, reloads, query/anchor retention, no-JavaScript navigation and four interactive English chart pages. The existing closed-English fallback build remains covered by its original e2e suite.

Scientific data, ETL, mathematical model, translations, source attribution and bibliography are unchanged in this release. The unresolved terminology questions remain in `2026-10-18-sitewide-en-editorial-review.md`.

## Validation

- ETL `--check`: passed; Python tests: 42 passed.
- Typecheck: passed; unit tests: 62 passed, including the public/private English build-flag matrix.
- Standard build: passed; original e2e suite: 84 passed on the first run (two workers).
- Exact private English-review build: passed; 46 HTML files checked for non-indexing, English access, disabled analytics and absence of sitemap.
- Public bilingual build: passed; 46 HTML files checked for `noindex, follow`, no language redirects, language links and absence of sitemap. Crawler access remains allowed.
- Public browser suite: 34 passed on the first run (two workers), covering all 22 sections in both languages, keyboard/mobile/no-JavaScript navigation and English charts.
- Visual inspection: the switch fits the 320 px phone viewport.
- GitHub `main` and `model/uncertainty-2026-10-12` retain their existing revisions.

The publication commit intentionally omits `[skip ci]`: the curator has now authorised the public Pages deployment. The workflow repeats validation and checks anonymous HTTPS responses for every deployed HTML page in both languages after publication.
