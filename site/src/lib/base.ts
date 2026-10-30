/**
 * Корень сайта во время работы.
 *
 * Сборка выполняется с base из vite.config.ts (собственный домен: /). В браузере корень берётся
 * из фактического адреса собранного скрипта (все чанки лежат в <корень>/assets/), поэтому фото, CSV,
 * шаблон и маршруты работают и тогда, когда собранный сайт открыт по другому пути (свой домен, форк,
 * локальный сервер в dist/). При статической генерации и в dev-режиме используется base из конфигурации.
 */
export const SITE_BASE: string =
  import.meta.env.SSR || import.meta.env.DEV || typeof window === 'undefined'
    ? import.meta.env.BASE_URL
    : new URL(/* @vite-ignore */ '../', import.meta.url).pathname

/** Адрес файла из public/ (img/…, data/csv/…, templates/…) относительно корня сайта. */
export function asset(path: string): string {
  return SITE_BASE + path.replace(/^\//, '')
}
