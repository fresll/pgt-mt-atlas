/**
 * Published-series summaries checked against original articles/supplements.
 * Fixed endpoint: H <= 18%, strict euploid result. ND assumed below threshold
 * for Spath; LOD unspecified. These summaries DO NOT calibrate scenario inputs.
 */
export const jointEvidence = [
  { key: 'ji', publication: 'ji2021', locator: 'Table 3, p. 3256', variant: 'm.3697G>A', n: 15, h: 1, confirmedEuploid: 3, joint: 0, informative: 14 },
  { key: 'spathB', publication: 'spath2021', locator: 'Supplemental Table 3, pp. 1–2', variant: 'm.8993T>G', n: 14, h: 14, confirmedEuploid: 10, joint: 10, informative: 14 },
  { key: 'spathD', publication: 'spath2021', locator: 'Supplemental Table 3, pp. 2–3', variant: 'm.3243A>G', n: 9, h: 8, confirmedEuploid: 3, joint: 3, informative: 9 },
] as const
