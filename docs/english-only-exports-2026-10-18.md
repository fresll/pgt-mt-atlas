# English interface and downloads — 18 October 2026

Baseline: `199b86039d2579b65a37a3e9dfc788161e1141a6`, cloud checkout of `audit/v13-preview`.

## Scope and terminology

The English presentation uses English source-sheet aliases (`Figure 3`–`Figure 6`, `Table 1`) and `Supplementary information.xlsx`, including provenance cards and locators. Cell coordinates, record IDs and scientific interpretations remain unchanged. The original source-file names remain in the canonical scientific data. The shared English presentation dictionary supplies both browser tables and downloadable exports.

The language-switch tooltip deliberately retains `Русский`, as requested. All other English page text, table details, accessibility labels and Plotly text are checked for Cyrillic. The English portrait is cropped with CSS to exclude the distant, unreadable background sign; the original photograph and Russian presentation are unchanged. The duplicate Russian fallback document title has been removed. The shared static 404 defaults to English; JavaScript restores Russian for `/ru/` addresses. With JavaScript disabled, this shared 404 remains English.

## Downloadable files

The build emits eight separate English CSV files under `data/csv/en/`. Both those files and the interactive “Download visible rows” action use the same English dictionary. CSV schemas, row order, record IDs, qualifiers, numbers and empty values are preserved. Existing technical field names, including `_raw` and `comment_ru`, remain compatible with the original schema; their English-export text values are English. A README accompanies the English CSV directory.

The English submission workbook is emitted under `templates/en/`. It retains existing English instructions and dictionary definitions, replaces Russian input labels/comments with those English definitions, removes the duplicate Russian instruction/dictionary columns, and uses the existing English validation messages. Sheet names, input field codes, allowed-value lists and validation formulas/ranges are unchanged. No Cyrillic remains in any generated workbook XML.

Build dependencies include Python 3 and `openpyxl`. Tests compare generated files against the original inputs and verify that source hashes, numerical values, schemas and validation rules remain unchanged. Canonical CSV, workbooks, ETL, scientific datasets and the mathematical model are not edited.

## Validation and release

Validation covers ETL reproducibility, 42 Python tests, TypeScript, 69 unit tests, standard browser tests, the private-review build and the public bilingual build. The public browser suite includes all 22 English pages, 446 selectable details, Plotly text, accessibility attributes, all eight English CSV files, interactive CSV downloads and both language variants of the 404.

Publication uses the existing `audit/v13-preview` Pages workflow, as explicitly authorised. Public pages retain their existing soft-launch `noindex` policy. The private Sites project and its access settings are unchanged. Neither `main` nor `model/uncertainty-2026-10-12` is updated.
