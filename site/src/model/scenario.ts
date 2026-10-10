// Сценарный расчёт рисунка 6 (МОДЕЛЬ, не наблюдения).
// p_обе = p_гет × p_эупл;  P(≥1) = 1 − (1 − p_обе)^N.
// Допущения (не доказаны): независимость гетероплазмии и плоидности; независимость бластоцист;
// внутрисемейная корреляция не учитывается. Индивидуальную вероятность расчёт не даёт.

export function pBoth(pHet: number, pEupl: number): number {
  check(pHet, 'p_het')
  check(pEupl, 'p_eupl')
  return pHet * pEupl
}

export function pAtLeastOne(pHet: number, pEupl: number, n: number): number {
  if (!Number.isInteger(n) || n < 0) throw new RangeError('N must be a non-negative integer')
  return 1 - (1 - pBoth(pHet, pEupl)) ** n
}

export function curve(pHet: number, pEupl: number, nMax: number): { n: number; p: number }[] {
  return Array.from({ length: nMax }, (_, i) => ({ n: i + 1, p: pAtLeastOne(pHet, pEupl, i + 1) }))
}

function check(p: number, name: string) {
  if (!(p >= 0 && p <= 1)) throw new RangeError(`${name} must be within [0, 1]`)
}
