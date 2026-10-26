import raw from '../src/data/atlas.json' with { type: 'json' }
const recordIds = [...new Set([...raw.fig3, ...raw.fig4, ...raw.fig5, ...raw.cleavage].flatMap(row => Object.entries(row).filter(([key,value]) => ['id','embryo','child','legacy_id'].includes(key) && typeof value === 'string').map(([,value]) => String(value))))].sort((a,b)=>b.length-a.length)
/** Scientific notation and source attribution that are deliberately preserved. */
const allowed = new Set(`A B C H E N P Q SD CI K Bin TE ICM HV2 DNA mtDNA PGT mt M PNG JSON LoD VUS X Y PN ND
Monnot Spath Treff Heindryckx Hyslop Sallevelt Tofilo Steffann Thorburn Ji Mizuguchi Hu Hellebrekers
Rubens Janssen Mitalipov Otten Rossignol Wright Fisher Kimura et al
EC HL CL C5g C5e C5f C5h C5a C5b C5c C12a C12b C2
`.split(/\s+/))

export function unexpectedChartWords(value: unknown): string[] {
  const text = typeof value === 'string' ? value : Array.isArray(value) ? value.map(v=>unexpectedChartWords(v).join(' ')).join(' ') : ''
  // Plotly template variables and HTML markup are implementation syntax, not displayed words.
  let visible = text
  for(const id of recordIds) visible = visible.replaceAll(id, '').replaceAll(id.replaceAll('_', ''), '')
  visible = visible.replace(/%\{[^}]+\}/g, '').replace(/<[^>]*>/g,' ')
    .replace(/\b(?:Monnot|Spath|Treff|Heindryckx|Hyslop|Sallevelt|Tofilo|Steffann|Thorburn|Ji|Mizuguchi|Hu)\d{4}n\b/g, '')
    .replace(/m\.\d+[ACGT]>[ACGT](?:\/[ACGT])?/g, '')
    .replace(/\b(?:HL|EC|CL)-[a-z0-9-]+\b/g, '').replace(/\bC\d+[a-z]?\b/g,'').replace(/\b(?:Monnot|Treff|Rubens|Tofilo|Sallevelt|Hu|Janssen2024)_[A-Za-z0-9_]+\b/g, '')
  return (visible.match(/[A-Za-z][A-Za-z0-9]*/g) ?? []).filter(w=>!allowed.has(w) && w !== 'n' && w !== 'x' && w !== 'y')
}
