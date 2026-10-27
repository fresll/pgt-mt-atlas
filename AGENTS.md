# Repository working version

- The current production site lives on `main`; GitHub Pages deploys only from `main`.
- Before starting changes, inspect the checkout and fetch the current `origin/main`. Create a task branch from that revision; preserve any user changes. Do not assume an older attached checkout is production.
- `audit/v13-preview`, `model/uncertainty-2026-10-12` and old audit branches are historical. Branch instructions in dated reports do not identify the current production branch.
- The current public site has RU, EN, ES, Simplified Chinese (`zh-Hans`) and Arabic (`ar`). Do not recreate translations that already exist.
- See `docs/current-site.md` for the current site and `.github/workflows/deploy-pages.yml` for publication settings. Preserve scientific source data and calculations during interface or branch maintenance.
