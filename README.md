# PGT-mt Atlas

Самостоятельная, постоянно обновляемая пятиязычная (RU/EN/ES/ZH/AR) научная база опубликованных индивидуальных значений
гетероплазмии мтДНК при преимплантационном генетическом тестировании (ПГТ-мт).
Created and curated by Ilya Mazunin. Правила проекта — в `CLAUDE.md`.

> **Текущий сайт:** https://fresll.github.io/pgt-mt-atlas/ — опубликованы RU, EN, ES, ZH и AR.
> **Основная ветка — `main`.** GitHub Pages публикуется из `main`. Изменения готовятся в отдельных ветках от актуальной `origin/main`.
> `audit/v13-preview` сохранена как историческая ветка и больше не является источником публикации.

## Структура

| Путь | Содержание |
|---|---|
| `data/Сопроводительная информация.xlsx` | Исходный набор данных (только чтение). Контрольная сумма — `data/SOURCE_MANIFEST.sha256` |
| `docs/` | Рукопись обзора, `data_inventory.md` (аудит), `implementation_plan.md` (план) |
| `figures/originals/` | Исходные рисунки и matplotlib-скрипты обзора (эталон логики рисунков) |
| `references/` | PDF и дополнительные материалы публикаций. **В сборку сайта не попадает** |
| `etl/` | Конвейер данных: xlsx → нормализованные таблицы (CSV) + `site/src/data/atlas.json` |
| `site/` | Сайт: Vite + React + TypeScript + Plotly, статическая генерация страниц |
| `.github/workflows/` | CI, еженедельный выпуск данных, мониторинг литературы, деплой GitHub Pages из `main` |

## Данные

```bash
cd etl
pip install openpyxl pyyaml python-docx pytest
python -m atlas_etl.build      # пересобрать atlas.json и CSV
python -m pytest -q            # эталонные тесты: воспроизведение контрольных чисел набора
```

* Исходный xlsx не изменяется. Если он изменён намеренно, обновите манифест
  (`python -m atlas_etl.build --write-manifest`) в PR с меткой `data-change`.
* Обязательный вход: опубликованный ESM 2 Tofilo et al. 2026 (`references/10815_2026_4012_MOESM2_ESM.xlsx`); без него сборка останавливается.
* Корректировки по опубликованным источникам — только слоем `etl/atlas_etl/curation/corrections.yaml` (xlsx не меняется);
  журнал — `docs/data_provenance_log.md`; версии набора — `curation/releases.yaml`.
* Стабильные ID записей — `curation/record_ids.yaml`. Новая запись без ID останавливает сборку; после проверки куратора:
  `python -m atlas_etl.build --assign-ids` (существующие ID не меняются).
* Кураторские файлы: `etl/atlas_etl/curation/publications.yaml` (статусы и проверка публикаций),
  `rules.yaml` (правила рисунков и вывода значений со ссылкой на ячейку xlsx), `etl/atlas_etl/vocab.yaml` (словари RU/EN).
* `review_references.yaml` генерируется из списка литературы рукописи: `python3 etl/tools/extract_references.py`.

## Сайт

```bash
cd site
npm ci
npm run dev          # разработка
npm test             # модульные тесты (модель ПГТ-мт × ПГТ-А, раскладка распределения гетероплазмии)
npm run build        # статическая сборка в site/dist (base: /pgt-mt-atlas/)
npm run e2e          # Playwright (нужен собранный сайт)
```

Для сборки и модульных тестов нужны Python 3 и `openpyxl` (`python3 -m pip install openpyxl`).
Сборка создаёт английские копии CSV и шаблона Excel в `site/dist`; исходные научные файлы не изменяются.

Наблюдаемые данные (Heteroplasmy Landscape, Embryo Concordance, Embryo-to-Offspring) и модельный расчёт
(PGT-mt × PGT-A Model) разделены в данных, в коде (`site/src/model/`)
и в интерфейсе (значки «Наблюдаемые данные» / «Модельный расчёт»).

Исторический отчёт переноса испанской локализации: `/es/` (22 страницы), ветка `release/spanish-public`, основа `2957996` (данные 2026-10-15, модель 2026-10-12). [Аудит переноса, решения и проверки](docs/spanish-current-release-audit.md); [финальная языковая сверка](docs/spanish-final-language-audit.md). Предыдущие испанские отчёты помечены как исторические. Испанская версия включена в текущий сайт из `main`.

Научные записи, источники и модель сохраняются. Испанские подписи добавлены слоем представления. Статические CSV и шаблон ведут к текущим английским экспортам; выгрузка видимых записей сохраняет исходные значения и метаданные. Для проверки неизменности научной основы: `python site/scripts/audit-spanish-release.py`.

Для локальной сборки всех трёх публичных языковых версий без публикации:

```bash
cd site
ATLAS_BASE=/pgt-mt-atlas/ ATLAS_SOFT_LAUNCH=0 ATLAS_PUBLIC_LAUNCH=1 \
ATLAS_CANONICAL_BASE=https://fresll.github.io/pgt-mt-atlas/ \
VITE_ATLAS_PRIVATE_PREVIEW=0 VITE_ATLAS_ENGLISH_PUBLIC=1 npm run build
node e2e/static-server.mjs 4177 /pgt-mt-atlas
```

Испанский адрес: `http://localhost:4177/pgt-mt-atlas/es/`. Эти команды не выполняют deploy или push.
