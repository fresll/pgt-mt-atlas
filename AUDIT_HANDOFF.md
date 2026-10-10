# PGT-mt Atlas — передача на независимый аудит

*Подготовлено 10.10.2026. Created and curated by Ilya Mazunin.*

Документ описывает состояние проекта, переданного на независимую научную, визуальную и техническую проверку.
При подготовке не добавлялись функции и не менялся дизайн. Единственное изменение кода — слияние
готовой ветки `design/sketchbook-responsive`, которое прошло без конфликтов (см. раздел 2).

---

## 1. Ветка и коммит

| | |
|---|---|
| Репозиторий | `fresll/pgt-mt-atlas` (приватный) |
| Ветка | `design/scientific-sketchbook` |
| Проверенный коммит (код и данные) | `abafc58a62134806a8f2f70d2163bd7331ce5d0d`, «Merge design/sketchbook-responsive: responsive frame and fluid typography» |
| Следующий коммит | добавляет только этот файл (`AUDIT_HANDOFF.md`), код и данные не меняются |
| Версия набора данных | `2026-10-10`, источник `data/Сопроводительная информация.xlsx`, SHA-256 `6ef93fd0109935521f571040c5c9f282a1c055310aafa7e733ff6f26ed73ecea` |

## 2. Целостность: какие этапы есть в ветке

| Этап | Где в коде | Статус |
|---|---|---|
| Scientific Sketchbook (главная, навигация, типографика) | `site/src/styles.css`, `components/Layout.tsx`, `components/Sketch.tsx`, `illustrations/*.svg` | ✓ (коммит `f956c45`) |
| Адаптивная рамка и плавная (fluid) типографика | `site/src/styles.css` | ✓ влито при подготовке аудита из `design/sketchbook-responsive` (`abb3e71`): слияние без конфликтов, менялись только `styles.css` и скриншоты в `design/review/sketchbook-responsive/` |
| Подробная биография Ильи Мазунина | `site/src/data/creator.ts`, `pages/Curator.tsx`, маршрут `/{en,ru}/ilya-mazunin/` | ✓ (`6963fea`) |
| Четыре интерактивных научных раздела | `pages/science/Fig3–Fig6.tsx`: Heteroplasmy Landscape, Embryo Concordance, Embryo-to-Offspring, PGT-mt × PGT-A Model | ✓ |
| Contribute Data и Excel-шаблон | `pages/Contribute.tsx`, `lib/contribute.ts`, `etl/atlas_etl/submission_template.py` → `site/public/templates/PGT-mt_Research_Data_Submission_v1.0.xlsx` | ✓ (`04b1c51`) |
| Fundamentals: шесть глав и три симулятора | `content/fundamentals/{ru,en}.ts`, `pages/fundamentals/Fundamentals.tsx`, `components/fundamentals/Widgets.tsx`, `model/bottleneck.ts` | ✓ (`0f05606`, `9dc8243`). Симуляторы: гетероплазмия (`#model-heteroplasmy`), бутылочное горлышко (`#model-bottleneck`), бластоциста и биопсия (`#model-blastocyst`) |
| Локализация RU/EN | `site/src/i18n/ru.ts` (эталон ключей), `en.ts` (тип `Dict` — расхождение ключей ломает `tsc`) | ✓; замечания — в разделе 8 |

**Ветки в `origin`, которые не входят в текущую ветку:**

| Ветка | Состояние |
|---|---|
| `atlas-preview` (`163fc61`, «Creator page, independent positioning and redesigned home page») | Ответвлена от `50fb6cb`, то есть раньше этапа 1 (`e429f16`). Это ранний вариант страницы создателя и главной. В текущей ветке его заменили страница куратора `/ilya-mazunin/` и главная Scientific Sketchbook. **Не вливалась:** ветка устарела, при слиянии были бы конфликты в `Layout.tsx`, `Home.tsx`, `i18n/*`. Из неё в текущую ветку не попали портреты в WebP и `docs/creator_profile_review.md` (список расхождений CV). Перенос — по решению куратора. |
| `main` (`c473625`), `claude/confident-ptolemy-76bwnx`, `atlas-stage1-independent-design`, `atlas-stage1-review` | Целиком содержатся в текущей ветке (нет коммитов, которых не было бы здесь). |
| `design/sketchbook-responsive` | Влита (см. выше). |

## 3. Реализованные разделы (маршруты)

Все страницы есть в двух языковых версиях: `/en/…` и `/ru/…`. Корень `/` перенаправляет на язык.
Базовый путь сборки — `/pgt-mt-atlas/`.

| Раздел | Маршруты |
|---|---|
| Главная | `/{lang}/` |
| Для специалистов | `science/` (оглавление), `science/data/`, `science/heteroplasmy-landscape/`, `science/embryo-concordance/`, `science/embryo-to-offspring/`, `science/pgt-mt-pgt-a-model/`, `science/cases/`, `science/sources/`, `science/methods/` |
| Fundamentals / Основы ПГТ-мт | `fundamentals/`, шесть глав: `mtdna-and-maternal-inheritance/`, `heteroplasmy-and-threshold-effects/`, `mitochondrial-genetic-bottleneck/`, `embryo-development-and-biopsy/`, `how-pgt-mt-works/`, `interpretation-and-limitations/`; библиография `fundamentals/references/` (56 источников) |
| Для пациентов | `patients/` |
| Contribute Data | `contribute/` + скачивание шаблона `templates/PGT-mt_Research_Data_Submission_v1.0.xlsx` |
| О проекте | `about/` |
| Куратор | `ilya-mazunin/` |
| 404 | `404.html` + маршрут `*` |

Наблюдаемые данные и модельный расчёт разделены: модель находится в `site/src/model/`, в интерфейсе её отмечают значки «Наблюдаемые данные» и «Модельный расчёт» (проверяет e2e-тест).

## 4. Структура проекта

```
.github/            CI (ci.yml), еженедельный выпуск данных (weekly-data.yml),
                    мониторинг литературы (literature-watch.yml + scripts/literature_watch.py),
                    деплой Pages (deploy-pages.yml — отключён, нужна переменная PAGES_ENABLED)
CLAUDE.md           правила проекта
README.md           краткое описание и команды
AUDIT_HANDOFF.md    этот документ
data/               исходный набор (xlsx, только чтение) + SOURCE_MANIFEST.sha256
docs/               data_inventory.md (аудит исходных данных и вопросы В1–В10),
                    implementation_plan.md, contributions.md (процесс приёма данных),
                    fundamentals_review.md (вопросы по главам Fundamentals)
etl/                Python ETL: atlas_etl/build.py (xlsx → atlas.json + CSV),
                    curation/{publications,rules,review_references}.yaml, vocab.yaml (словари RU/EN),
                    submission_template.py (генератор Excel-шаблона), tests/, tools/
figures/originals/  эталонные рисунки (TIFF) и matplotlib-скрипты
design/             reference/ — референсы стиля; review/ — скриншоты визуальной проверки
site/               Vite + React 19 + TypeScript, SSG (vite-react-ssg), Plotly
  src/pages/        страницы; science/Fig3–Fig6.tsx — четыре интерактивных раздела
  src/content/fundamentals/  тексты глав RU/EN, библиография, тесты содержания
  src/components/   Layout, графики, таблицы, виджеты-симуляторы
  src/model/        модельные расчёты (scenario.ts — ПГТ-мт × ПГТ-А; bottleneck.ts) + тесты
  src/data/         atlas.json (генерируется ETL), creator.ts, submissionTemplate.json
  src/i18n/         ru.ts (эталон), en.ts
  src/illustrations/ исходные SVG; scripts/sketch/generate.mjs — генератор части SVG
  src/styles.css    токены палитры и стили; src/lib/theme.ts — цвета графиков
  public/           CSV-выгрузки набора, шаблон xlsx, портрет, favicon
  e2e/              Playwright (site.spec.ts, fundamentals.spec.ts), screens.mjs — скриншоты
```

## 5. Локальный запуск (macOS / Linux)

Нужны Python ≥ 3.11 и Node.js 22 (npm 10).

```bash
# 1. Данные и ETL
cd etl
python3 -m venv .venv && source .venv/bin/activate
pip install openpyxl pyyaml python-docx pytest
shasum -a 256 -c ../data/SOURCE_MANIFEST.sha256     # на Linux: sha256sum -c
python -m atlas_etl.build --check                   # проверка без записи
python -m pytest -q                                 # эталонные тесты
python -m atlas_etl.build                           # (опц.) пересобрать atlas.json и CSV
deactivate; cd ..

# 2. Сайт
cd site
npm ci
npm run dev            # http://localhost:5173/pgt-mt-atlas/
npm run typecheck
npm test               # модульные тесты (Vitest)
npm run build          # статическая сборка в site/dist
npx playwright install chromium   # один раз: браузер для Playwright 1.64
npm run e2e            # e2e на собранном сайте (сам запускает vite preview :4173)
npm run preview        # http://localhost:4173/pgt-mt-atlas/en/
```

Если Chromium уже установлен в другом месте, `npm run e2e` можно направить на него: `CHROMIUM_PATH=/путь/к/chrome npm run e2e`.

## 6. Результаты сборки и тестов (коммит `abafc58`, Linux, Python 3.13.16, Node 22.22.0, npm 10.9.4)

| Проверка | Результат |
|---|---|
| `sha256sum -c data/SOURCE_MANIFEST.sha256` | OK — исходный xlsx не изменён |
| `python -m atlas_etl.build --check` | OK |
| `python -m pytest -q` (ETL) | **21 passed** |
| Актуальность сгенерированных данных (как в CI: пересборка → `git diff`) | Нет расхождений. Excel-шаблон воспроизводится побайтно |
| `npm ci` | OK |
| `npm run typecheck` | OK, 0 ошибок (включая равенство наборов ключей RU/EN) |
| `npm test` (Vitest) | **27 passed** (5 файлов) |
| `npm run build` | OK. 45 статических HTML-страниц + `404.html`; одно предупреждение о размере чанка (> 500 kB, Plotly) |
| `npm run e2e` (Playwright, Chromium) | **63 passed**: все 22 страницы × 2 языка (44 теста) без ошибок консоли, 4 раздела с графиками рендерят нужное число графиков, плюс сценарии (значки «наблюдение/модель», DOI Tofilo 2026, расхождения ESM, независимость от отдельной публикации, портрет и полная биография на обоих языках, переключатель языка сохраняет раздел, шаблон Contribute, вёрстка на телефоне) |

**Дополнительный обход сайта.** Собственный скрипт, не входящий в тесты проекта, прошёл по сайту из `vite preview` и посетил 87 URL.
- Все внутренние ссылки, CSV, xlsx и изображения отдают 200. Неработающих ссылок и отсутствующих ресурсов нет.
- У всех страниц правильный `lang` и непустой `h1`.
- Ошибки консоли появляются только на URL **без завершающего слеша** (см. раздел 8, п. 1).

**Секреты и персональные данные (публичная сборка `site/dist` и репозиторий).**
- Файлов `.env`, ключей и токенов нет. Workflow ссылаются только на `secrets.NCBI_API_KEY` и `github.token`, то есть на секреты, которыми управляет GitHub.
- В `dist` нет адресов e-mail и телефонов. Контакт куратора не задан (`CURATOR_CONTACT.email = null`). Ссылки на ORCID и Google Scholar равны `null` до утверждения. Опубликованы ссылки на ResearchGate и LinkedIn.
- У портрета в сборке (`img/ilya-mazunin.jpg`) метаданные EXIF удалены.
- `references/`, `profile/` и `docs/*.docx` в сборку не попадают.
- Данные пациентов: в сборке есть только опубликованные обезличенные значения из литературы (эмбрион/образец/ребёнок по идентификатору исследования, ткань, возраст в формате источника). Новых пациентских данных нет. Приём файлов на сайте не реализован намеренно.
- Адреса e-mail в репозитории есть только внутри опубликованных PDF в `references/` (адреса для корреспонденции авторов статей).

Проверка в браузере выполнялась в headless Chromium в облачной среде. Ручная проверка в Safari и Firefox, а также на реальных мобильных устройствах не проводилась.

## 7. Состав архива `PGT-mt-Atlas-Full-Review.zip`

Архив собирается командой `git archive` из коммита ветки. Поэтому в него не попадают `.git`, `node_modules/`, `site/dist/`, `test-results/`, кэши и неотслеживаемые файлы.

**Включено:** `.github/`, `CLAUDE.md`, `README.md`, `AUDIT_HANDOFF.md`, `data/`, `docs/*.md`, `etl/`, `figures/`, `design/`, `site/` (исходники, SVG, стили, локализация, тесты, `package-lock.json`, публичные CSV и Excel-шаблон).

Из `references/` включён один файл: `references/10815_2026_4012_MOESM2_ESM.xlsx`. Это опубликованные дополнительные материалы (ESM 2) статьи Tofilo et al., 2026, J Assist Reprod Genet. ETL читает его для автоматической сверки (`verify_tofilo` в `etl/atlas_etl/build.py`). Без этого файла `build` молча выдаёт пустой блок `verification` и снимает пометки о расхождениях, а `test_tofilo_esm2_verification` падает.

**Исключено (могут понадобиться для научного аудита; передаются только по решению куратора):**

| Путь | Почему исключено | Для чего нужно аудитору |
|---|---|---|
| `references/` (≈158 МБ, 84 файла; кроме ESM 2 Tofilo 2026, см. выше) | Издательские PDF и ESM под авторским правом. Ранняя неопубликованная рукопись `Tofilo et al 2026 PGTmt 14487.pdf`. В PDF есть e-mail авторов | Сверка значений и цитат с первоисточниками, проверка DOI с издательских PDF |
| `docs/Тофило_Мазунин_ПГТ-мт_ActaNaturae_ru.docx` | Рукопись обзора, не опубликована (вопрос В2) | Сверка контрольных чисел (`docs/data_inventory.md`, раздел 3). Только по ней запускается `etl/tools/extract_references.py`; результат (`review_references.yaml`) уже есть в архиве |
| `profile/` (CV 2026 EN/RU в PDF, исходное фото с EXIF) | Непубличные персональные CV | Сверка биографии на странице куратора (`site/src/data/creator.ts`) с CV |

Без исключённых файлов проект собирается, тестируется и запускается полностью. Это проверено: архив распакован в пустой каталог, затем выполнены ETL-тесты, typecheck, unit-тесты, сборка и e2e.

## 8. Известные ошибки и замечания

1. **Ссылки переключателя языка без завершающего слеша** (например, `/pgt-mt-atlas/ru/about`). При навигации внутри сайта всё работает. GitHub Pages перенаправляет такой URL на версию со слешем. Но при прямом открытии в `vite preview` возвращается корневой `index.html`, и в консоли появляется ошибка React #418 (hydration mismatch). Обход нашёл 42 таких URL без слеша; при прямом входе на каждом из них появляется эта ошибка. Серьёзность низкая, не исправлялось.
2. **Предупреждение сборки о размере чанка** больше 500 kB (Plotly в основном бандле).
3. **Статический `<title>`** — «PGT-mt Atlas» на всех страницах. Заголовок обновляется в браузере, но без JS и для поисковиков остаётся общим. Сейчас стоит `noindex, nofollow`, это сделано намеренно до публикации.
4. **Русские строки на английских страницах** берутся из исходных данных и кураторских заметок, перевода нет. Решение за куратором:
   - `en/science/embryo-to-offspring/`: «нет — цензурировано», «нет — исключено из exact-pair plot» — дословно из xlsx;
   - `en/science/sources/`: заметка о проверке Tofilo 2026 из `publications.yaml` («название, журнал, дата публикации и DOI совпадают с рукописью»);
   - имя файла `Сопроводительная информация.xlsx` в подвале и на страницах данных и методов.
5. **Страница куратора** показывает биографию на втором языке в раскрывающемся блоке («другая языковая версия»). Это сделано намеренно, ошибкой не является.
6. **Внутренние идентификаторы** `Fig3–Fig6.tsx`, ключи `fig3…fig6` в `atlas.json` и правила в `rules.yaml` соответствуют нумерации рисунков обзора. В интерфейсе разделы названы независимо, как требует CLAUDE.md. Наследие в коде и данных — на усмотрение аудитора.
7. **Playwright 1.64** требует браузер своей версии: `npx playwright install chromium`. В облачной среде использовался заранее установленный Chromium через `CHROMIUM_PATH`.
8. **Сверка с ESM зависит от необязательного файла.** Если `references/10815_2026_4012_MOESM2_ESM.xlsx` отсутствует, `atlas_etl.build` не выдаёт ошибку, а возвращает пустой список сверки (`build.py`, `verify_tofilo`). Пересборка без этого файла незаметно удалит пометки о расхождениях с сайта. Не исправлялось.
9. **В xlsx нет кэшированных значений формул** (листы «Рисунок 5»!H, «Рисунок 6»!E,G, «Hu 2026»). ETL вычисляет производные значения сам (`docs/data_inventory.md`, п. 5.3).

## 9. Нереализованные или частично работающие функции

- **Contribute Data.** Канал связи с куратором не активирован (`CURATOR_CONTACT.email = null`). Защищённой передачи файлов, загрузки и формы нет, это сделано намеренно. Лицензия набора и формат цитирования «будут объявлены» (В3). Порядок активации описан в `docs/contributions.md`, раздел 5.
- **Профили куратора.** Ссылки на ORCID и Google Scholar ждут утверждения (`null`).
- **Публикация сайта** отключена: в `deploy-pages.yml` нет переменной `PAGES_ENABLED`. Сайт не опубликован, репозиторий приватный.
- **`weekly-data.yml` и `literature-watch.yml`** работают только в GitHub Actions. В этой среде их не запускали. Мониторинг литературы создаёт issue и ничего не меняет в данных. Для повышенных лимитов PubMed нужен секрет `NCBI_API_KEY`.
- **Раздел для пациентов.** Рецензент (медицинский генетик или генетический консультант) и юридический дисклеймер не определены (В8).
- **Наборы данных из Contribute Data** в базу пока не поступали. Все значения взяты из одного xlsx.
- Ранний вариант страницы создателя и портреты в WebP из ветки `atlas-preview` не перенесены (раздел 2).

## 10. Непроверенные научные утверждения и библиографические ссылки

Ниже перечислены вопросы, открытые в документах проекта. При подготовке аудита они не исправлялись.

**Данные (`docs/data_inventory.md`, разделы 5–7):**
- **В9.** Tofilo 2026, эмбрион 6: в xlsx ВКМ 11,4 % и оставшаяся ТЭ 11,9 %, в ESM 2 — 11,3 % и 11,7 %. Если верны значения ESM 2, медиана размаха для 21 патогенной бластоцисты меняется с 2,1 до 2,2 п.п. На сайте записи помечены, значения не изменены.
- **В10.** Tofilo 2026, эмбрионы 3 и 4: в ESM 2 фракция «ICM+ / TE+ICM», в наборе — «Оставшаяся ТЭ».
- **В4.** Правило включения вариантов Hyslop 2025 в Heteroplasmy Landscape (включены только два варианта).
- **В5.** Значения Treff 2012, Sallevelt 2017 и Spath 2021 — исходные или усреднённые.
- **В6.** Точное место в источнике [42] для p_эупл = 0,7 / 0,5 / 0,3 и допустимость интерполяции по возрасту в модели.
- **5.2.** Номера ссылок в примечаниях xlsx сдвинуты относительно рукописи. На сайте ссылки строятся по `study_id` и DOI.
- **5.6.** Thorburn: DOI отсутствует и не подбирался.
- **5.7.** `Hyslop 2025 Supplemental File 1.pdf`, по-видимому, относится к другой работе (m.11778). Файл не используется.
- **5.9.** В «Таблице 1» xlsx 30 строк, в рукописи 17. Так задумано («расширенная версия»).

**Fundamentals (`docs/fundamentals_review.md`).** В библиографии 56 источников. DOI 54 из них подтверждены по PubMed, 1 — по PDF издателя, 1 — препринт. Требуют подтверждения:
- Volodyaev et al., 2025 (F S Rev): DOI подтверждён по PDF, в PubMed записи нет.
- Franco et al., 2026: препринт bioRxiv, не рецензирован.
- Pickett et al., 2019: в рукописи инициалы «SH», в PubMed «SJ». В Atlas использовано SJ.
- Гены вариантов и комплекс II — общепринятые сведения со ссылкой на Gorman 2016. Нужно подтвердить, что этой ссылки достаточно.
- Burr & Chinnery, 2024: экспоненциальное снижение m.3243A>G в крови с возрастом цитируется по обзору, первичная работа не указана.
- Steffann et al., 2014: случай m.8344A>G (~50–60 %).
- Ориентир 15–30 % для m.3243A>G (Ji et al., 2023).
- Числа из Floros 2018 и Xie 2026 сверены куратором по полному тексту (вопрос закрыт).

**Цитируются, но PDF в репозитории нет** (`data_inventory.md` 2.4.2): Gorman 2016, Stewart & Chinnery 2015, Rossignol 2003, Gupta 2023, Kirillova 2021, Wai 2008, Otten 2018, Hellebrekers 2012 (источник ориентира 18 %), Thorburn 2009, El-Hattab 2015.

**Биография куратора.** `site/src/data/creator.ts` составлен по CV 2026. Расхождения CV были описаны в `docs/creator_profile_review.md` ветки `atlas-preview`; в текущей ветке этого файла нет.

**Общие вопросы:** В2 — можно ли публиковать индивидуальные значения до выхода обзора; В3 — лицензия; В7 — нужна ли английская версия текста обзора.

## 11. Происхождение научных данных и порядок обновления

- **Источник.** `data/Сопроводительная информация.xlsx` — сопроводительная таблица с индивидуальными опубликованными значениями гетероплазмии. Файл только для чтения, неизменность контролирует `data/SOURCE_MANIFEST.sha256` (в CI тоже).
- **Атрибуция.** У каждого значения указаны публикация (`publication.csv`: авторы, DOI, PMID, статус), лист и строка исходной таблицы (`src_sheet`, `src_row` в `measurement.csv` и `offspring_measurement.csv`). Способ получения значения — в поле `derivation`. Статусы и проверка публикаций — в `etl/atlas_etl/curation/publications.yaml`. Правила включения в разделы и вывода значений со ссылкой на ячейку — в `rules.yaml`.
- **Сверка с ESM.** Для Tofilo 2026 ETL автоматически сверяет значения с опубликованным ESM 2 (`verification` в `atlas.json`, `verification.csv`). Расхождения помечаются, но не исправляются.
- **Модель.** ПГТ-мт × ПГТ-А (`site/src/model/scenario.ts`) — сценарный расчёт, не наблюдения. Параметры см. в В6.
- **Выход ETL.** `site/src/data/atlas.json` и `site/public/data/csv/*.csv`. Сейчас 22 публикации, 187 эмбрионов в Heteroplasmy Landscape, 91 запись по фракциям эмбриона (40 эмбрионов), 24 пары «эмбрион → потомство», 30 строк сводной таблицы.
- **Обновление.**
  1. Изменения исходного xlsx делаются только отдельным PR с меткой `data-change` после проверки куратора. Затем выполняются `python -m atlas_etl.build --write-manifest` и `python -m atlas_etl.build`, и результат коммитится.
  2. Еженедельный `weekly-data.yml` пересобирает данные и при изменениях открывает PR без автослияния.
  3. `literature-watch.yml` ищет новые публикации-кандидаты в PubMed, сверяет DOI через Crossref и создаёт issue. В базу ничего не добавляется автоматически.
  4. Новые данные исследователей поступают через шаблон Contribute Data, проходят статусы Submitted → Under review → Validated → Included / Rejected и добавляются в набор только PR куратора (`docs/contributions.md`).
