# Arabic text review — paused at user's request, 2026-10-27
Resume at 14:55 Europe/Moscow. User requested stopping and saving; do not perform further substantive work until scheduled run.

Workspace: /workspace/atlas-arabic-draft. Preserve existing staged changes and unstaged work. Previous responsive checkpoint branch fix/arabic-responsive-charts, commit 6184194. Public site and other locales must remain unchanged. Existing owner-private preview appgprj_6adfa787b9f88191865b7a07427e12d6 at https://atlas-arabic-review-20261026.elatedmink17.chatgpt.site/ar/. Current turn has NOT updated preview. Sites get_site successfully verified owner-only access this turn.

Read the Arabic UI, all six chapters, descriptive dictionary, and extracted rendered DOM, attributes and Plotly trace text across 22 Arabic routes with details expanded; artifact artifacts/arabic-text-audit.json is BEFORE latest changes. Browser audit script site/audit-arabic.mjs (untracked) can be reused. /usr/bin/chromium, Playwright installed. Local preview already listening on 127.0.0.1:4173/pgt-mt-atlas/; requires escalated tool environment for browser/server access.

Changes already saved in working files:
- display-ar.json: short publication labels et al. -> وآخرون.
- Sources, Data, Concordance, Offspring, Landscape, Methods and PubRef UI now use sourceText for most short citations; IDs table headings Arabic.
- Fundamentals index letters A/B/C -> أ/ب/ج for AR only.
- Curator يدرس -> يُدرّس (teaches, not studies).
- AR scroll hint now generic whole-chart and bidirectional arrow.
- paired comparisons wording, missing على after contain, comparison of fetal/child tissue wording, grammar of two reference thresholds corrected.

Still to finish:
1. Landscape has two ${p.short} tooltip strings and groupObs[0] short label NOT yet wrapped; these still show et al. Replace with localized short display.
2. Consider restricting short-citation formatting explicitly to AR (new publicationText(value,lang) helper returns arabicText only for AR, otherwise unchanged), rather than sourceText for all locales, to guarantee no other language changes. This proposed helper was NOT implemented: attempted Python command used wrong cwd path and failed before editing.
3. Re-run DOM/trace audit after final build; check for et al outside original full bibliography, ID and Latin model letters, native controls, chart hover text. Preserve scientific abbreviations, gene codes, identifiers, author names, original bibliography and file names. No Russian/Chinese prose found in initial DOM extraction. Full original citations remain English intentionally.
4. Typecheck succeeded for saved edits. Private build succeeded with VITE_ATLAS_PRIVATE_PREVIEW=1 VITE_ATLAS_ARABIC_REVIEW=1 VITE_ATLAS_ENGLISH_REVIEW=1 VITE_ATLAS_CHINESE_REVIEW=1 npm run build. Logs /tmp/arabic-text-build.log. Unit tests 89 passed, 5 failed only spawnSync EPERM sandbox (launch.test.ts and english-text.test.ts); rerun with execution permissions. Log /tmp/arabic-text-unit.log. Do not claim all tests pass yet. Run relevant existing Arabic Playwright test after final edits, strengthen if needed.
5. Write concise audit report and checkpoint without disturbing current staged state. Update existing owner-private Sites preview, never public site/PR. /tmp/update-arabic-preview.py from previous turn copies dist to /workspace/sites/atlas-arabic-review, commits/pushes using credential on hidden stdin, archives; review script before reuse (message currently says responsive changes). Read Sites skill and native tool schemas. Credentials must not be logged/saved. Existing source helper absent in local workspace.

No external messages authorized. No additional independent agent spawned; this is another model review by main assistant, not human Arabic specialist certification.
