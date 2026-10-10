import dataPathway from '../illustrations/data-pathway.svg?raw'
import hero from '../illustrations/hero.svg?raw'
import mark from '../illustrations/mark.svg?raw'
import mitochondrion from '../illustrations/mitochondrion.svg?raw'
import teBiopsy from '../illustrations/te-biopsy.svg?raw'

// Иллюстрации Scientific Sketchbook (генерируются scripts/sketch/generate.mjs).
// Встраиваются как inline SVG, чтобы цвета чернил брались из CSS-токенов и следовали теме.
// blastocyst.svg — отдельная иллюстрация для будущих страниц; в бандл не входит, пока не используется.
const SVG = { hero, mark, mitochondrion, teBiopsy, dataPathway } as const
export type IllustrationName = keyof typeof SVG

export function Illustration({ name, className }: { name: IllustrationName; className?: string }) {
  // подпись к рисунку даёт окружающий <figure>; сам SVG декоративен для экранных читалок
  const svg = SVG[name].replace('<svg ', '<svg aria-hidden="true" focusable="false" ').replace(/ role="img" aria-label="[^"]*"/, '').replace(/<title>[^<]*<\/title>/, '')
  return <span className={`sk-illustration ${className ?? ''}`} dangerouslySetInnerHTML={{ __html: svg }} />
}

/** Линия «от руки» — подчёркивание заголовков и ссылок. */
export function HandRule({ className, tone = 'ink' }: { className?: string; tone?: 'ink' | 'red' }) {
  return (
    <svg className={`sk-rule ${tone} ${className ?? ''}`} viewBox="0 0 400 14" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path d="M3 8.5C48 6.2 96 5.1 150 6.4S262 9.6 318 7.1 382 5.4 397 6.6" />
      <path className="second" d="M9 10.2C70 8.4 128 7.6 190 8.6S300 10.1 360 8.2 388 8 394 8.9" />
    </svg>
  )
}
