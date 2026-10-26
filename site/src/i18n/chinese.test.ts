import { describe, expect, it, vi } from 'vitest'
import en from './en'
import zh from './zh'
import enChapters from '../content/fundamentals/en'
import zhChapters from '../content/fundamentals/zh'
import display from './display-zh.json'
import raw from '../data/atlas.json'
import { chineseText } from './chinese-text'
import { scientificText, observationText } from './scientificText'
import { citeIds, linkPaths } from '../content/fundamentals/markup'
import { switchLangPath } from '../components/Layout'
function leaves(value: unknown, path = ''): Record<string,string> {
  if(typeof value === 'string') return { [path]:value }
  if(!value || typeof value !== 'object') return {}
  return Object.assign({},...Object.entries(value).map(([k,v])=>leaves(v,`${path}.${k}`)))
}
const slots = (s:string) => [...s.matchAll(/\{\{([^}]+)\}\}/g)].map(m=>m[1]).sort()
const ids = (s:string) => s.match(/m\.\d+(?:[ACGT>]+(?:\/[ACGT])?|del[ACGT]?)|MT-[A-Z0-9]+/g) ?? []
function numbers(s:string): string[] {
  const text = s.replace(/\[@[^\]]+\]/g,'').replace(/1\.2 million|120万/g,'1200000').replace(/(\d),(\d{3})(?=\D|$)/g,'$1$2')
  return (text.match(/\d+(?:\.\d+)?/g) ?? []).sort()
}
function assertText(source:string, target:string, key:string) {
  expect(target.trim(),key).not.toBe('')
  expect(slots(target),key).toEqual(slots(source))
  expect(citeIds(target),key).toEqual(citeIds(source))
  expect(linkPaths(target),key).toEqual(linkPaths(source))
  expect(ids(target),key).toEqual(ids(source))
  expect(target,key).not.toMatch(/[А-Яа-яЁё]/)
}
describe('Simplified Chinese localization',()=>{
  it('preserves interface keys, interpolation, citations and clinical numbers',()=>{
    const a=leaves(en),b=leaves(zh)
    expect(Object.keys(b).sort()).toEqual(Object.keys(a).sort())
    for(const [k,t] of Object.entries(b)) {
      assertText(a[k],t,k)
      const source = k === '.sources.verificationSummary' ? a[k].replace('October','10') : a[k]
      expect(numbers(t),k).toEqual(numbers(source))
    }
  })
  it('preserves chapter structure, links, molecular identifiers and quantitative statements',()=>{
    const a=leaves(enChapters),b=leaves(zhChapters)
    expect(Object.keys(b)).toEqual(Object.keys(a))
    for(const [k,t] of Object.entries(b)) {
      assertText(a[k],t,k)
      if(/\.(slug|t|to)$/.test(k)||k.includes('.widgets.')) expect(t,k).toBe(a[k])
      const source=a[k].replace('one month','1 month').replace('other three','other 3')
      expect(numbers(t),k).toEqual(numbers(source))
    }
    for(const [i,c] of zhChapters.chapters.entries()) for(const level of ['essentials','advanced'] as const) {
      expect(c[level].map(b=>b.t)).toEqual(enChapters.chapters[i][level].map(b=>b.t))
      c[level].forEach((block,j)=>{
        const orig=enChapters.chapters[i][level][j]
        if(block.t==='flow'&&orig.t==='flow') expect(block.phases.map(p=>p[1])).toEqual(orig.phases.map(p=>p[1]))
      })
    }
  })
  it('preserves descriptive overlay numbers and immutable scientific source records',()=>{
    const before=JSON.stringify(raw)
    for(const [source,t] of Object.entries(display)) {
      expect(t).not.toMatch(/[А-Яа-яЁё]/)
      if(!/[А-Яа-яЁё]/.test(source)) expect(numbers(t),source).toEqual(numbers(source))
      expect(ids(t),source).toEqual(ids(source))
    }
    function visit(v:unknown) {
      if(!v||typeof v!=='object')return
      const obj=v as Record<string,unknown>
      if(typeof obj.en==='string'&&typeof obj.ru==='string') {
        const t=chineseText(obj.en)
        if(!['ICM','Ilya Mazunin'].includes(obj.en)) expect(t,obj.en).not.toBe(obj.en)
        expect(scientificText({en:obj.en,ru:obj.ru},'zh-Hans')).toBe(t)
      }
      Object.values(obj).forEach(visit)
    }
    visit(raw)
    expect(observationText('18 нед гестации','zh-Hans')).toBe('孕18周')
    expect(observationText(null,'zh-Hans')).toBeNull()
    expect(JSON.stringify(raw)).toBe(before)
  })
  it('preserves section, query and anchor for every Chinese language switch',()=>{
    for(const from of ['en','ru','es','zh-Hans'] as const) for(const to of ['en','ru','es','zh-Hans'] as const)
      expect(switchLangPath(`/pgt-mt-atlas/${from}/science/embryo-concordance`,from,to,'?x=1','#content')).toBe(`/${to}/science/embryo-concordance/?x=1#content`)
  })
  it('opens public Chinese only with an explicit release flag', async()=>{
    vi.stubEnv('VITE_ATLAS_PRIVATE_PREVIEW','0'); vi.stubEnv('VITE_ATLAS_CHINESE_PUBLIC','1'); vi.resetModules()
    const { LANGS } = await import('./index')
    expect(LANGS).toContain('zh-Hans')
    vi.unstubAllEnvs(); vi.resetModules()
  })
  it('exposes Chinese routes only under both private review flags', async()=>{
    for(const privateFlag of ['0','1']) for(const reviewFlag of ['0','1']) {
      vi.stubEnv('VITE_ATLAS_PRIVATE_PREVIEW',privateFlag);vi.stubEnv('VITE_ATLAS_CHINESE_REVIEW',reviewFlag);vi.resetModules()
      const {LANGS}=await import('./index')
      expect(LANGS.includes('zh-Hans')).toBe(privateFlag==='1'&&reviewFlag==='1')
    }
    vi.unstubAllEnvs();vi.resetModules()
  })
})
