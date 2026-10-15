import { useEffect, useState } from 'react'

export interface ChartTheme {
  model: string
  ink: string
  ink2: string
  muted: string
  grid: string
  surface: string
  s1: string
  s2: string
  s3: string
  s4: string
  bandGreen: string
  bandBlue: string
  bandRed: string
  accent: string
  critical: string
  warn: string
}

// Цвета графиков берутся из CSS-токенов Scientific Sketchbook (styles.css); здесь — значения светлой темы на случай,
// когда токены недоступны (статическая генерация): чернила #34406E, синий #1F3FB4, красный #D42A2F.
const LIGHT: ChartTheme = {
  model: '#8e5c8a', ink: '#34406e', ink2: '#4a5582', muted: '#5f6787', grid: '#e4e8f5', surface: '#ffffff',
  s1: '#1f3fb4', s2: '#b8662a', s3: '#137f80', s4: '#8e5c8a',
  bandGreen: '#e3f1eb', bandBlue: '#e3eaf3', bandRed: '#f7e7dc', accent: '#1f3fb4', critical: '#d42a2f', warn: '#c9772f',
}

function read(): ChartTheme {
  if (typeof window === 'undefined') return LIGHT
  const cs = getComputedStyle(document.documentElement)
  const v = (name: string, fb: string) => cs.getPropertyValue(name).trim() || fb
  return {
    model: v('--model-ink', LIGHT.model), ink: v('--ink', LIGHT.ink), ink2: v('--ink-2', LIGHT.ink2), muted: v('--muted', LIGHT.muted),
    grid: v('--grid', LIGHT.grid), surface: v('--surface', LIGHT.surface),
    s1: v('--s1', LIGHT.s1), s2: v('--s2', LIGHT.s2), s3: v('--s3', LIGHT.s3), s4: v('--s4', LIGHT.s4),
    bandGreen: v('--band-green', LIGHT.bandGreen), bandBlue: v('--band-blue', LIGHT.bandBlue),
    bandRed: v('--band-red', LIGHT.bandRed), accent: v('--accent', LIGHT.accent),
    critical: v('--critical', LIGHT.critical), warn: v('--flag', LIGHT.warn),
  }
}

/** Цвета графиков из CSS-токенов; пересчитываются при смене темы. */
export function useChartTheme(): ChartTheme {
  const [theme, setTheme] = useState<ChartTheme>(LIGHT)
  useEffect(() => {
    const update = () => setTheme(read())
    update()
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    mq.addEventListener('change', update)
    const obs = new MutationObserver(update)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => {
      mq.removeEventListener('change', update)
      obs.disconnect()
    }
  }, [])
  return theme
}

export function baseLayout(th: ChartTheme) {
  return {
    paper_bgcolor: th.surface,
    plot_bgcolor: th.surface,
    font: { family: "'IBM Plex Sans', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif", color: th.ink2, size: 14 },
    hoverlabel: { bgcolor: th.surface, bordercolor: th.grid, font: { color: th.ink, size: 14 } },
    margin: { l: 64, r: 16, t: 24, b: 56 },
    showlegend: false,
  }
}

export function axis(th: ChartTheme, extra: Record<string, unknown> = {}) {
  return {
    gridcolor: th.grid,
    zerolinecolor: th.grid,
    linecolor: th.muted,
    tickcolor: th.muted,
    tickfont: { color: th.ink2, size: 13 },
    title: { font: { color: th.ink2, size: 14 } },
    ...extra,
  }
}
