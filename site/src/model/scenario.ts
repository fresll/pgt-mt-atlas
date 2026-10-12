// Scenario calculations, not an individual clinical prediction.
// See docs/mathematical_model.md for events, denominators and identifiability.

export function pBoth(pHet: number, pEupl: number): number {
  check(pHet, 'p_het')
  check(pEupl, 'p_eupl')
  return pHet * pEupl
}

export function pAtLeastOne(pHet: number, pEupl: number, n: number): number {
  return independentAtLeastOne(pBoth(pHet, pEupl), n)
}

export function curve(pHet: number, pEupl: number, nMax: number): { n: number; p: number }[] {
  count(nMax)
  pBoth(pHet, pEupl)
  return Array.from({ length: nMax }, (_, i) => ({ n: i + 1, p: pAtLeastOne(pHet, pEupl, i + 1) }))
}

/** Independent embryos with the same joint pass probability q. */
export function independentAtLeastOne(q: number, n: number): number {
  check(q, 'q')
  count(n)
  if (n === 0 || q === 0) return 0
  if (q === 1) return 1
  return -Math.expm1(n * Math.log1p(-q))
}

/**
 * Q ~ Beta(alpha,beta), S|Q ~ Binomial(N,Q).
 * rho concerns the binary JOINT pass event, not continuous heteroplasmy.
 * rho is a scenario input, not fitted to Atlas. rho=1 is the perfect-dependence limit.
 */
export function betaBinomialAtLeastOne(mu: number, rho: number, n: number): number {
  check(mu, 'mu')
  check(rho, 'rho')
  count(n)
  if (rho === 0 || mu === 0 || mu === 1 || n === 0) return independentAtLeastOne(mu, n)
  if (rho === 1) return mu
  let logNone = 0
  for (let j = 0; j < n; j++) {
    // Stable concentration/(concentration+j), including rho close to zero.
    logNone += Math.log1p(-mu * ((1 - rho) / (1 - rho + j * rho)))
  }
  return -Math.expm1(logNone)
}

/** Fixed h/e with independence of the two tests, optional shared-Q sensitivity. */
export function scenarioProbability(pHet: number, pEupl: number, n: number, rho = 0): number {
  return betaBinomialAtLeastOne(pBoth(pHet, pEupl), rho, n)
}

/** Bounds on the joint probability from marginals; not a confidence interval. */
export function jointBounds(h: number, e: number): { low: number; high: number } {
  check(h, 'h')
  check(e, 'e')
  return { low: Math.max(0, h + e - 1), high: Math.min(h, e) }
}

/** Reference 95% Wilson interval, conditional on an iid binomial likelihood. */
export function wilson95(k: number, n: number): { low: number; high: number } | null {
  count(n)
  if (!Number.isInteger(k) || k < 0 || k > n) throw new RangeError('k must be an integer within [0, n]')
  if (n === 0) return null
  const z = 1.959963984540054
  const p = k / n
  const denominator = 1 + z * z / n
  const center = (p + z * z / (2 * n)) / denominator
  const half = z * Math.sqrt(p * (1 - p) / n + z * z / (4 * n * n)) / denominator
  return { low: Math.max(0, center - half), high: Math.min(1, center + half) }
}

function check(p: number, name: string): void {
  if (!(p >= 0 && p <= 1)) throw new RangeError(`${name} must be within [0, 1]`)
}

function count(n: number): void {
  if (!Number.isSafeInteger(n) || n < 0) throw new RangeError('N must be a non-negative safe integer')
}
