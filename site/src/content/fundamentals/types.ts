// Структура глав Fundamentals. Тексты — в ru.ts (эталон структуры), en.ts и es.ts;
// совпадение структуры и ссылок языковых версий проверяет fundamentals.test.ts.
//
// Разметка строк (см. markup.tsx):
//   [@id] / [@id1; @id2]   — ссылка на источник из references.ts (автор, год → библиография главы);
//   [[текст|путь/]]         — внутренняя ссылка на раздел атласа: путь от /<язык>/;
//   *курсив*, **выделение**.

export type WidgetId = 'heteroplasmy' | 'threshold' | 'bottleneck' | 'development' | 'blastocyst'

export type Block =
  | { t: 'p'; x: string }
  | { t: 'h'; x: string }
  | { t: 'ul'; items: string[] }
  | { t: 'steps'; items: [string, string][] }
  | { t: 'def'; items: [string, string][] }
  | { t: 'key'; x: string }
  | { t: 'caution'; x: string }

export interface DataLink {
  to: string
  label: string
  text: string
}

export interface Chapter {
  slug: string
  title: string
  /** одна строка для оглавления */
  short: string
  lead: string
  essentials: Block[]
  advanced: Block[]
  /** схемы и модели, общие для обоих уровней чтения */
  widgets: WidgetId[]
  data: DataLink[]
}

export interface FundamentalsContent {
  chapters: Chapter[]
}
