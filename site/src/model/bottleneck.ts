// Образовательная модель митохондриального бутылочного горлышка (Fundamentals, глава 3).
// Однократная выборка Райта — Фишера: каждый виртуальный ооцит получает N сегрегирующих единиц,
// выбранных независимо из пула с долей мутантной мтДНК h0; K ~ Bin(N, h0), h = K / N.
// Это модельный расчёт, а не наблюдаемые данные и не прогноз для конкретной пациентки.

/** Детерминированный генератор (mulberry32): одинаковый результат при статической генерации и в браузере. */
export function rng(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Гетероплазмия (доля 0–1) для count виртуальных ооцитов. */
export function simulateOocytes(h0: number, N: number, count: number, seed: number): number[] {
  if (!(h0 >= 0 && h0 <= 1)) throw new RangeError('h0 must be within [0, 1]')
  if (!Number.isInteger(N) || N < 1) throw new RangeError('N must be a positive integer')
  const r = rng(seed)
  const out: number[] = []
  for (let i = 0; i < count; i++) {
    let k = 0
    for (let j = 0; j < N; j++) if (r() < h0) k++
    out.push(k / N)
  }
  return out
}

/** Теоретическое стандартное отклонение h: sqrt(h0(1 − h0) / N). */
export const theoreticalSd = (h0: number, N: number) => Math.sqrt((h0 * (1 - h0)) / N)

/** Квантиль отсортированного массива (линейная интерполяция). */
export function quantile(sorted: number[], q: number): number {
  if (!sorted.length) return NaN
  const pos = (sorted.length - 1) * q
  const lo = Math.floor(pos), hi = Math.ceil(pos)
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (pos - lo)
}

export function summarize(values: number[]) {
  const s = [...values].sort((a, b) => a - b)
  return { min: s[0], q1: quantile(s, 0.25), median: quantile(s, 0.5), q3: quantile(s, 0.75), max: s[s.length - 1] }
}

/** Укладка точек в столбики по ширине бина (в долях 0–1): [x центра бина, номер в столбике]. */
export function stackDots(values: number[], bin: number): [number, number][] {
  const counts = new Map<number, number>()
  return values.map((v) => {
    const b = Math.min(Math.floor(v / bin + 1e-9), Math.round(1 / bin) - 1)
    const k = counts.get(b) ?? 0
    counts.set(b, k + 1)
    return [(b + 0.5) * bin, k]
  })
}
