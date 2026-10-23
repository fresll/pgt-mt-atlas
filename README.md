# PGT-mt Atlas

Самостоятельная, постоянно обновляемая трёхъязычная (EN/RU/ES) научная база опубликованных индивидуальных значений
гетероплазмии мтДНК при преимплантационном генетическом тестировании (ПГТ-мт).
Created and curated by Ilya Mazunin. Правила проекта — в `CLAUDE.md`.

> **Статус:** предварительная версия. Сайт **не опубликован**, репозиторий приватный.
> Публикация — только после явного решения куратора (`docs/implementation_plan.md`, раздел 7).

## Структура

| Путь | Содержание |
|---|---|
| `data/Сопроводительная информация.xlsx` | Исходный набор данных (только чтение). Контрольная сумма — `data/SOURCE_MANIFEST.sha256` |
| `docs/` | Рукопись обзора, `data_inventory.md` (аудит), `implementation_plan.md` (план) |
| `figures/originals/` | Исходные рисунки и matplotlib-скрипты обзора (эталон логики рисунков) |
| `references/` | PDF и дополнительные материалы публикаций. **В сборку сайта не попадает** |
| `etl/` | Конвейер данных: xlsx → нормализованные таблицы (CSV) + `site/src/data/atlas.json` |
| `site/` | Сайт: Vite + React + TypeScript + Plotly, статическая генерация страниц |
| `.github/workflows/` | CI, еженедельный выпуск данных, мониторинг литературы, деплой (отключён) |

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

Наблюдаемые данные (Heteroplasmy Landscape, Embryo Concordance, Embryo-to-Offspring) и модельный расчёт
(PGT-mt × PGT-A Model) разделены в данных, в коде (`site/src/model/`)
и в интерфейсе (значки «Наблюдаемые данные» / «Модельный расчёт»).

Испанская локализация: `/es/` (22 страницы). Терминологические решения, ограничения и проверки — в `docs/spanish-localization.md`; повторная проверка по испаноязычным публикациям и национальным платформам — в `docs/spanish-language-audit.md`. Цитируемые исходные данные и библиография сохраняют язык оригинала; экспортируемые CSV и шаблон не переводятся.

Проверка испанских графиков, увеличения и всплывающих подписей: `docs/spanish-chart-qa.md`.
