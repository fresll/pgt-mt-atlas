// Типизированный доступ к atlas.json (генерируется etl/atlas_etl/build.py — не редактировать вручную).
// Правила выборок совпадают с ETL (etl/atlas_etl/curation/rules.yaml).
import raw from './atlas.json'

export type Lang = 'en' | 'ru'
export type Bilingual = { ru: string; en: string }
export type Qualifier = 'exact' | 'not_detected' | 'less_than' | 'interval' | 'qualitative'
export type SrcRef = { sheet: string; row: number }

export interface Publication {
  id: string
  review_ref_no: number
  short: string
  citation: string
  doi: string | null
  pmid: string | null
  pub_status: 'published' | 'in_press' | 'conference_abstract' | 'preprint'
  published_date: string | null
  data_access_note: Bilingual | null
  verified: { date: string; by: string; note: string } | null
  supplementary: { file: string; label: string; content: string }[] | null
}

export interface EmbryoObservation {
  id: string
  variant: string
  pub: string
  value: number | null
  q: Qualifier
  low: number | null
  high: number | null
  lod: number | null
  stage: string
  stage_raw: string
  sample: string
  material_raw: string
  derivation: string
  derivation_evidence: string | null
  note: string | null
  doi_in_sheet: string | null
  src: SrcRef
}

export interface FractionObservation {
  embryo: string
  pub: string
  variant: string
  cls: 'pathogenic' | 'neutral_polymorphism' | 'uncertain_significance'
  fraction: 'te_biopsy' | 'icm' | 'remaining_te'
  fraction_raw: string
  value: number
  src: SrcRef
}

export interface CleavagePair {
  embryo: string
  variant: string
  pub: string
  b1: number
  b2: number
  range: number
  lod: number
  src: SrcRef
}

export interface OffspringPair {
  id: string
  child: string
  pub: string
  variant: string
  emb: number | null
  emb_q: Qualifier
  emb_raw: string | null
  phase: 'prenatal' | 'postnatal'
  tissue: string
  tissue_raw: string
  value: number | null
  q: Qualifier
  value_raw: string | null
  age: string | null
  method: string | null
  in_figure: boolean
  on_plot_raw: string
  src: SrcRef
}

export interface Table1Row {
  row: number
  variant: string
  phenotype: string
  pool_range: string
  transferred: string
  offspring: string
  reference_raw: string
  pubs: string[]
  data_type: string
  value_origin: string
  src: SrcRef
}

export interface Verification {
  publication: string
  embryo: string | null
  esm_fraction: string
  esm_label: string
  esm_value: number | number[]
  dataset_value: number | number[] | null
  dataset_fraction: string | null
  status: 'match' | 'value_mismatch' | 'fraction_label_mismatch' | 'not_in_dataset' | 'missing_in_dataset' | 'mismatch'
  source: string
  comment_ru?: string
  comment_en?: string
}

export interface Threshold {
  id: string
  value?: number
  range?: [number, number]
  publication: string | null
  ru: string
  en: string
}

export interface Atlas {
  meta: { dataset_version: string; source_file: string; source_sha256: string; generator: string }
  labels: Record<string, Record<string, Bilingual>>
  publications: Publication[]
  fig3: EmbryoObservation[]
  fig3_blocks: { variant: string; sources: string[] }[]
  fig4: FractionObservation[]
  cleavage: CleavagePair[]
  fig5: OffspringPair[]
  fig5_notes: { row: number; text: string }[]
  table1: Table1Row[]
  hu2026_within_embryo: {
    pub: string
    variant: string
    biopsy_value: number
    description: string
    samples: { sample: number; cells_raw: string; n_cells_raw: string; depth: number; value: number; src: SrcRef }[]
  }
  tajima2007_excluded: { pub: string; excluded_reason: string; items: unknown[] }
  thresholds: Threshold[]
  model: {
    p_eupl: { age: number; value: number }[]
    p_eupl_publication: string
    p_eupl_locator: string | null
    n_max: number
    fig6_variants: string[]
    formula: { p_both: string; p_at_least_one: string }
  }
  verification: Verification[]
  stats: {
    fig3: { n: number; by_variant: Record<string, { n: number; le18: { k: number; n: number }; le30: { k: number; n: number } }>; pooled_le18: { k: number; n: number } }
    fig4: Record<string, number>
    fig5: { n_pairs: number; n_children: number; n_low_embryo: number; n_concordant_low: number; discordant_ids: string[] }
  }
}

export const atlas = raw as unknown as Atlas

export const pubById: Record<string, Publication> = Object.fromEntries(atlas.publications.map((p) => [p.id, p]))

export function label(group: string, code: string, lang: Lang): string {
  return atlas.labels[group]?.[code]?.[lang] ?? code
}

export function doiUrl(doi: string): string {
  return `https://doi.org/${doi}`
}

/** Засчитывается ли эмбрион как ≤ границы: интервал — только по верхней границе (середина не импутируется). */
export function atOrBelow(o: Pick<EmbryoObservation, 'q' | 'value' | 'high'>, threshold: number): boolean {
  const v = o.q === 'interval' ? o.high : o.value
  return v !== null && v <= threshold
}

export function fractionAtOrBelow(obs: EmbryoObservation[], threshold: number): { k: number; n: number } {
  return { k: obs.filter((o) => atOrBelow(o, threshold)).length, n: obs.length }
}

export function obsByVariant(obs: EmbryoObservation[] = atlas.fig3): Map<string, EmbryoObservation[]> {
  const m = new Map<string, EmbryoObservation[]>()
  for (const o of obs) {
    if (!m.has(o.variant)) m.set(o.variant, [])
    m.get(o.variant)!.push(o)
  }
  return m
}

/** Записи сверки, относящиеся к эмбриону рис. 4 (сейчас — только Tofilo 2026 vs ESM 2). */
export function verificationFor(embryo: string): Verification[] {
  return atlas.verification.filter((v) => v.embryo === embryo)
}

export function hasVerificationIssue(embryo: string): boolean {
  return verificationFor(embryo).some((v) => v.status === 'value_mismatch' || v.status === 'fraction_label_mismatch')
}

export function median(xs: number[]): number {
  const s = [...xs].sort((a, b) => a - b)
  const m = Math.floor(s.length / 2)
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2
}

/** Встраиваемые эмбрионы рис. 4: фракция → значение. */
export function fig4Embryos(): { embryo: string; pub: string; variant: string; cls: string; fr: Partial<Record<FractionObservation['fraction'], number>> }[] {
  const m = new Map<string, { embryo: string; pub: string; variant: string; cls: string; fr: Partial<Record<FractionObservation['fraction'], number>> }>()
  for (const f of atlas.fig4) {
    if (!m.has(f.embryo)) m.set(f.embryo, { embryo: f.embryo, pub: f.pub, variant: f.variant, cls: f.cls, fr: {} })
    m.get(f.embryo)!.fr[f.fraction] = f.value
  }
  return [...m.values()]
}

export function rangeOf(fr: Partial<Record<string, number>>): number {
  const v = Object.values(fr) as number[]
  return Math.max(...v) - Math.min(...v)
}
