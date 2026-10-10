"""PGT-mt Atlas ETL: сопроводительная таблица обзора → нормализованная база (CSV) + atlas.json для сайта.

Исходный xlsx только читается. Формулы xlsx игнорируются (в файле нет кэшированных значений),
все производные величины считаются здесь.

    python3 -m atlas_etl.build            # из каталога etl/
    python3 -m atlas_etl.build --check    # только проверки, без записи файлов
"""
from __future__ import annotations

import argparse
import csv
import datetime as dt
import hashlib
import json
import re
import statistics
import sys
from collections import Counter, defaultdict
from dataclasses import dataclass
from pathlib import Path

import openpyxl
import yaml

ROOT = Path(__file__).resolve().parents[2]
SOURCE_XLSX = ROOT / 'data' / 'Сопроводительная информация.xlsx'
MANIFEST = ROOT / 'data' / 'SOURCE_MANIFEST.sha256'
TOFILO_ESM2 = ROOT / 'references' / '10815_2026_4012_MOESM2_ESM.xlsx'
HERE = Path(__file__).resolve().parent
OUT_JSON = ROOT / 'site' / 'src' / 'data' / 'atlas.json'
OUT_CSV = ROOT / 'site' / 'public' / 'data'

DOI_RE = re.compile(r'10\.\d{4,9}/[^\s;|,]+')


class EtlError(Exception):
    pass


def load_yaml(name: str):
    return yaml.safe_load((HERE / name).read_text(encoding='utf-8'))


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def clean_num(x):
    """Числа xlsx без артефактов плавающей точки (23.6666666666667 → 23.6666666666667, 0.1000000001 → 0.1)."""
    if x is None:
        return None
    return round(float(x), 10)


# ---------------------------------------------------------------- публикации

@dataclass
class Pubs:
    by_id: dict
    alias: dict
    by_doi: dict

    def resolve(self, label: str, where: str) -> str:
        if label not in self.alias:
            raise EtlError(f'{where}: источник «{label}» не сопоставлен ни с одной публикацией (publications.yaml/aliases)')
        return self.alias[label]


def load_publications() -> Pubs:
    refs = {r['no']: r for r in load_yaml('curation/review_references.yaml')['references']}
    by_id, alias, by_doi = {}, {}, {}
    for p in load_yaml('curation/publications.yaml')['publications']:
        ref = refs[p['review_ref_no']]
        rec = {
            'id': p['id'],
            'review_ref_no': p['review_ref_no'],
            'short': p['short'],
            'citation': ref['citation'],
            'doi': ref['doi'],
            'pmid': p.get('pmid'),
            'pub_status': p['pub_status'],
            'published_date': p.get('published_date'),
            'data_access_note': p.get('data_access_note'),
            'verified': p.get('verified'),
            'supplementary': p.get('supplementary'),
        }
        if rec['pub_status'] == 'published' and rec['doi'] is None:
            raise EtlError(f"{p['id']}: статус published, но в рукописи нет DOI")
        by_id[p['id']] = rec
        if rec['doi']:
            by_doi[rec['doi'].lower()] = p['id']
        for a in p.get('aliases') or []:
            if a in alias:
                raise EtlError(f'алиас «{a}» указан дважды')
            alias[a] = p['id']
    return Pubs(by_id, alias, by_doi)


# ---------------------------------------------------------------- словари

class Vocab:
    def __init__(self):
        v = load_yaml('vocab.yaml')
        self.labels = v['labels']
        self.stage_map = v['stage_map']
        self.material_map = v['material_map']
        self.fraction_map = v['fraction_map']
        self.tissue_prefix = v['tissue_prefix_map']
        self.phase_map = v['phase_map']
        self.vclass = v['variant_class']

    @staticmethod
    def _get(m, key, what):
        if key not in m:
            raise EtlError(f'{what}: строка «{key}» отсутствует в vocab.yaml')
        return m[key]

    def stage(self, s):
        return self._get(self.stage_map, s, 'стадия')

    def material(self, s):
        return self._get(self.material_map, s, 'материал')

    def fraction(self, s):
        return self._get(self.fraction_map, s, 'фракция')

    def phase(self, s):
        return self._get(self.phase_map, s, 'этап')

    def tissue(self, s):
        low = s.lower()
        for prefix, code in self.tissue_prefix.items():
            if low.startswith(prefix):
                return code
        raise EtlError(f'ткань: строка «{s}» не сопоставлена (vocab.yaml/tissue_prefix_map)')

    def variant_class(self, v):
        return self.vclass.get(v, self.vclass['default'])


# ---------------------------------------------------------------- чтение листов

def rows(ws, first, last=None):
    for i, r in enumerate(ws.iter_rows(min_row=first, max_row=last, values_only=True), start=first):
        yield i, r


def read_fig3(ws, pubs: Pubs, vocab: Vocab, rules) -> list[dict]:
    deriv = rules['derivation_rules']
    lods = {r['publication']: r for r in rules['lod_rules'] if 'sheet' not in r}
    out = []
    for i, r in rows(ws, 4):
        if r[0] is None:
            continue
        variant, value, stage_raw, material_raw, src, doi_sheet, lo, hi, note = r[:9]
        pub = pubs.resolve(src, f'«Рисунок 3»!E{i}')
        pdoi = pubs.by_id[pub]['doi']
        if doi_sheet and (pdoi is None or doi_sheet.strip().lower() != pdoi.lower()):
            raise EtlError(f'«Рисунок 3»!F{i}: DOI {doi_sheet} не совпадает с DOI рукописи {pdoi} для {pub}')
        if value is None:
            if lo is None or hi is None:
                raise EtlError(f'«Рисунок 3»!{i}: нет ни значения, ни интервала')
            qualifier = 'interval'
        else:
            qualifier = 'not_detected' if value == 0 else 'exact'
        derivation = 'as_reported_in_dataset'
        evidence = None
        for d in deriv:
            if d['publication'] == pub and d.get('variant', variant) == variant \
                    and d.get('material_raw', material_raw) == material_raw:
                derivation, evidence = d['derivation'], d['evidence']
        lod = lods.get(pub)
        out.append({
            'id': f'f3-{i:03d}',
            'variant': variant,
            'pub': pub,
            'value': clean_num(value),
            'q': qualifier,
            'low': clean_num(lo),
            'high': clean_num(hi),
            'lod': lod['lod_pct'] if lod and qualifier == 'not_detected' else None,
            'stage': vocab.stage(stage_raw),
            'stage_raw': stage_raw,
            'sample': vocab.material(material_raw),
            'material_raw': material_raw,
            'derivation': derivation,
            'derivation_evidence': evidence,
            'note': note,
            'doi_in_sheet': doi_sheet,
            'src': {'sheet': 'Рисунок 3', 'row': i},
        })
    return out


def read_fig4(ws, pubs: Pubs, vocab: Vocab) -> list[dict]:
    out = []
    for i, r in rows(ws, 4):
        if r[0] is not None and str(r[0]).startswith('Панель Б'):
            break
        if r[0] is None or not isinstance(r[4], (int, float)):
            continue
        out.append({
            'embryo': r[0],
            'pub': pubs.resolve(r[1], f'«Рисунок 4»!B{i}'),
            'variant': r[2],
            'cls': vocab.variant_class(r[2]),
            'fraction': vocab.fraction(r[3]),
            'fraction_raw': r[3],
            'value': clean_num(r[4]),
            'src': {'sheet': 'Рисунок 4', 'row': i},
        })
    return out


def read_cleavage(ws, pubs: Pubs, rules) -> list[dict]:
    lod = next(r['lod_pct'] for r in rules['lod_rules'] if r.get('sheet') == 'Бластомеры (дробление)')
    out = []
    for i, r in rows(ws, 4):
        if not r[0] or not str(r[0]).startswith('Monnot'):
            continue
        b1, b2 = clean_num(r[3]), clean_num(r[4])
        out.append({'embryo': r[0], 'variant': r[1], 'pub': pubs.resolve(r[6], f'«Бластомеры»!G{i}'),
                    'b1': b1, 'b2': b2, 'range': abs(b1 - b2), 'lod': lod,
                    'src': {'sheet': 'Бластомеры (дробление)', 'row': i}})
    return out


def read_fig5(ws, pubs: Pubs, vocab: Vocab) -> list[dict]:
    out = []
    for i, r in rows(ws, 4, ws.max_row):
        cid = r[0]
        if not isinstance(cid, str) or not re.fullmatch(r'C\d+[a-z]?', cid):
            continue
        src_label, variant, emb, phase, tissue_raw, val, _, age, method, child, on_plot = r[1:12]
        pub = pubs.resolve(src_label, f'«Рисунок 5»!B{i}')
        rec = {
            'id': cid, 'child': re.match(r'C\d+', str(child)).group(0), 'pub': pub, 'variant': variant,
            'phase': vocab.phase(phase), 'tissue': vocab.tissue(tissue_raw), 'tissue_raw': tissue_raw,
            'age': age, 'method': method, 'in_figure': on_plot == 'да', 'on_plot_raw': on_plot,
            'src': {'sheet': 'Рисунок 5', 'row': i},
        }
        if isinstance(emb, (int, float)):
            rec.update(emb=clean_num(emb), emb_q='not_detected' if emb == 0 else 'exact', emb_raw=None)
        else:
            rec.update(emb=None, emb_q='less_than', emb_raw=emb)
        if isinstance(val, (int, float)):
            rec.update(value=clean_num(val), q='not_detected' if val == 0 else 'exact', value_raw=None)
        else:
            m = re.search(r'менее\s+(\d+)', tissue_raw)
            rec.update(value=float(m.group(1)) if m else None, q='less_than' if m else 'qualitative',
                       value_raw=val if val else tissue_raw)
        if rec['in_figure'] and (rec['emb'] is None or rec['q'] not in ('exact', 'not_detected')):
            raise EtlError(f'«Рисунок 5»!{i}: на графике может быть только точная пара')
        out.append(rec)
    return out


def read_fig5_notes(ws) -> list[dict]:
    notes = []
    for i, r in rows(ws, 29, ws.max_row):
        if isinstance(r[0], str) and not re.fullmatch(r'C\d+[a-z]?', r[0]) and r[0] != 'Case ID':
            notes.append({'row': i, 'text': r[0]})
    return notes


def read_table1(ws, pubs: Pubs) -> list[dict]:
    out = []
    for i, r in rows(ws, 4):
        if r[0] is None:
            continue
        ref_text = r[5] or ''
        ids = []
        for d in DOI_RE.findall(ref_text):
            d = d.rstrip('.')
            if d.lower() not in pubs.by_doi:
                raise EtlError(f'«Таблица 1»!F{i}: DOI {d} нет в списке литературы рукописи')
            ids.append(pubs.by_doi[d.lower()])
        if not ids:
            for a, pid in pubs.alias.items():
                if ref_text.startswith(a.split(',')[0].split(' ')[0]):
                    ids.append(pid)
                    break
        if not ids:
            raise EtlError(f'«Таблица 1»!F{i}: не удалось сопоставить «{ref_text}»')
        out.append({'row': i, 'variant': r[0], 'phenotype': r[1], 'pool_range': r[2], 'transferred': r[3],
                    'offspring': r[4], 'reference_raw': ref_text, 'pubs': ids, 'data_type': r[6],
                    'value_origin': r[7], 'src': {'sheet': 'Таблица 1', 'row': i}})
    return out


def read_hu16(ws) -> dict:
    samples = []
    for i, r in rows(ws, 4):
        if not isinstance(r[0], int):
            continue
        samples.append({'sample': r[0], 'cells_raw': r[1], 'n_cells_raw': str(r[2]), 'depth': r[3],
                        'value': clean_num(r[4]), 'src': {'sheet': ws.title, 'row': i}})
    return {'pub': 'hu2026', 'variant': 'm.3250T>C', 'biopsy_value': 17.8, 'description': ws['A2'].value,
            'samples': samples}


def read_tajima(ws, pubs: Pubs) -> dict:
    items = []
    for i, r in rows(ws, 4, 8):
        if r[0]:
            items.append({'embryo': r[0], 'variant': r[1], 'min': r[4], 'max': r[5], 'range': r[6],
                          'src': {'sheet': ws.title, 'row': i}})
    return {'pub': pubs.resolve('Tajima et al., 2007', ws.title), 'excluded_reason': ws['A2'].value, 'items': items}


def read_fig6_sheet(ws) -> list[dict]:
    return [{'age': r[0], 'variant': r[1], 'p_het': r[2], 'p_eupl': r[3], 'n': r[5]}
            for _, r in rows(ws, 4) if r[0]]


# ---------------------------------------------------------------- сверка с ESM (Tofilo 2026)

ESM_FRACTION = {'TE biopsy': 'te_biopsy', 'TE': 'remaining_te', 'ICM': 'icm',
                'ICM+ / TE+ICM fraction': 'combined_te_icm',
                'Residual extra cells/cellular fragments': 'residual_extra_cells'}


def verify_tofilo(fig3, fig4) -> list[dict]:
    if not TOFILO_ESM2.exists():
        return []
    ws = openpyxl.load_workbook(TOFILO_ESM2, data_only=True).active
    esm = defaultdict(dict)
    for _, r in rows(ws, 2):
        if r[0]:
            n = int(str(r[0]).split()[-1])
            esm[n][ESM_FRACTION[r[1]]] = {'value': clean_num(r[8]), 'coverage': r[2], 'label': r[1]}
    ds = defaultdict(dict)
    for f in fig4:
        if f['pub'] == 'tofilo2026':
            ds[int(f['embryo'].split('_')[1])][f['fraction']] = f
    out = []
    src_ref = 'ESM 2 (Supplementary Table S2), Tofilo et al. 2026'
    for n in sorted(esm):
        for frac, e in esm[n].items():
            rec = {'publication': 'tofilo2026', 'embryo': f'Tofilo_{n}', 'esm_fraction': frac,
                   'esm_label': e['label'], 'esm_value': e['value'], 'esm_coverage': e['coverage'],
                   'source': src_ref}
            if frac == 'residual_extra_cells':
                rec.update(status='not_in_dataset', dataset_value=None, dataset_fraction=None,
                           comment_ru='Остаточные клетки и фрагменты под блестящей оболочкой в набор не включены '
                                      '(так задумано в обзоре: их нельзя приравнивать к эмбриональным линиям).',
                           comment_en='Residual extra cells/fragments under the zona are not in the dataset '
                                      '(by design of the review).')
            elif frac == 'combined_te_icm':
                d = ds[n].get('remaining_te')
                rec.update(dataset_fraction='remaining_te' if d else None, dataset_value=d['value'] if d else None,
                           status='fraction_label_mismatch' if d and d['value'] == e['value'] else 'mismatch',
                           comment_ru='Значение совпадает, но в ESM 2 это объединённая фракция «ICM+ / TE+ICM», '
                                      'а в наборе данных — «Оставшаяся ТЭ».',
                           comment_en='Value matches, but ESM 2 labels the fraction as combined “ICM+ / TE+ICM”, '
                                      'whereas the dataset labels it “Remaining TE”.')
            else:
                d = ds[n].get(frac)
                status = 'match' if d and d['value'] == e['value'] else ('missing_in_dataset' if not d else 'value_mismatch')
                rec.update(dataset_fraction=frac, dataset_value=d['value'] if d else None, status=status)
                if status == 'value_mismatch':
                    rec.update(comment_ru=f"В наборе {d['value']}%, в ESM 2 {e['value']}% "
                                          f"(Δ = {round(d['value'] - e['value'], 2)} п.п.).",
                               comment_en=f"Dataset {d['value']}%, ESM 2 {e['value']}% "
                                          f"(Δ = {round(d['value'] - e['value'], 2)} pp).")
            out.append(rec)
    # биоптаты ТЭ рисунка 3 (без номеров эмбрионов) сверяются как мультимножество
    f3 = sorted(m['value'] for m in fig3 if m['pub'] == 'tofilo2026')
    e3 = sorted(esm[n]['te_biopsy']['value'] for n in esm)
    out.append({'publication': 'tofilo2026', 'embryo': None, 'esm_fraction': 'te_biopsy',
                'esm_label': 'TE biopsy (all embryos)', 'esm_value': e3, 'dataset_value': f3,
                'dataset_fraction': 'te_biopsy', 'source': src_ref + '; «Рисунок 3»',
                'status': 'match' if f3 == e3 else 'value_mismatch'})
    return out


# ---------------------------------------------------------------- производные величины

def le(m, th):
    """Засчитывается ли эмбрион как ≤ границы: точное значение — по значению, интервал — по верхней границе."""
    return (m['value'] if m['q'] != 'interval' else m['high']) <= th


def frac_counts(ms, th):
    return {'k': sum(le(m, th) for m in ms), 'n': len(ms)}


def derive_stats(fig3, fig4, cleav, fig5, fig6_sheet, rules) -> dict:
    by_var = defaultdict(list)
    for m in fig3:
        by_var[m['variant']].append(m)
    fig3_stats = {v: {'n': len(ms), 'le18': frac_counts(ms, 18), 'le30': frac_counts(ms, 30)}
                  for v, ms in by_var.items()}
    emb = defaultdict(dict)
    meta = {}
    for f in fig4:
        emb[f['embryo']][f['fraction']] = f['value']
        meta[f['embryo']] = f['cls']
    rng = {e: max(v.values()) - min(v.values()) for e, v in emb.items()}
    pat = [rng[e] for e in emb if meta[e] != 'neutral_polymorphism']
    hv2 = [rng[e] for e in emb if meta[e] == 'neutral_polymorphism']
    plotted = [p for p in fig5 if p['in_figure']]
    low = [p for p in plotted if p['emb'] <= 18]
    conc = [p for p in low if p['value'] <= 18]
    # сверка листа «Рисунок 6» (округлённые p_гет) с долями из набора
    fig6_check = []
    for r in fig6_sheet:
        exact = fig3_stats[r['variant']]['le18']
        fig6_check.append({'variant': r['variant'], 'sheet_p_het': r['p_het'], 'exact': exact['k'] / exact['n']})
    return {
        'fig3': {'n': len(fig3), 'by_variant': fig3_stats, 'pooled_le18': frac_counts(fig3, 18),
                 'pooled_le30': frac_counts(fig3, 30)},
        'fig4': {'n_embryos': len(emb), 'n_pathogenic': len(pat), 'n_hv2': len(hv2),
                 'median_range_pathogenic': statistics.median(pat), 'median_range_hv2': statistics.median(hv2),
                 'median_range_all': statistics.median(rng.values()), 'max_range_pathogenic': max(pat),
                 'share_le5_pathogenic': sum(x <= 5 for x in pat) / len(pat),
                 'share_le5_all': sum(x <= 5 for x in rng.values()) / len(rng),
                 'n_cleavage': len(cleav), 'median_range_cleavage': statistics.median(c['range'] for c in cleav),
                 'max_range_cleavage': max(c['range'] for c in cleav)},
        'fig5': {'n_pairs': len(plotted), 'n_children': len({p['child'] for p in plotted}),
                 'n_low_embryo': len(low), 'n_concordant_low': len(conc),
                 'discordant_ids': [p['id'] for p in low if p not in conc]},
        'fig6_sheet_check': fig6_check,
    }


# ---------------------------------------------------------------- нормализованные таблицы (CSV)

def normalized_tables(pubs, fig3, fig4, cleav, fig5, vocab):
    publication = [{k: p[k] for k in ('id', 'review_ref_no', 'short', 'doi', 'pmid', 'pub_status',
                                      'published_date', 'citation')} for p in pubs.by_id.values()]
    variants = sorted({m['variant'] for m in fig3} | {f['variant'] for f in fig4} | {p['variant'] for p in fig5})
    variant = [{'variant_id': v, 'variant_class': vocab.variant_class(v)} for v in variants]
    embryo, sample, measurement, membership = [], [], [], []
    for m in fig3:
        eid = m['id'].replace('f3-', 'emb-f3-')
        embryo.append({'embryo_id': eid, 'publication_id': m['pub'], 'variant_id': m['variant'],
                       'stage': m['stage'], 'stage_raw': m['stage_raw']})
        sid = eid + '-s1'
        sample.append({'sample_id': sid, 'embryo_id': eid, 'sample_type': m['sample'], 'material_raw': m['material_raw']})
        measurement.append({'measurement_id': m['id'], 'sample_id': sid, 'value_pct': m['value'], 'qualifier': m['q'],
                            'value_low_pct': m['low'], 'value_high_pct': m['high'], 'lod_pct': m['lod'],
                            'derivation': m['derivation'], 'note_raw': m['note'],
                            'src_sheet': m['src']['sheet'], 'src_row': m['src']['row']})
        membership.append({'figure': 'fig3', 'record_id': m['id'], 'included': True, 'exclusion_reason': None})
    seen = set()
    for f in fig4:
        eid = 'emb-' + f['embryo']
        if eid not in seen:
            seen.add(eid)
            embryo.append({'embryo_id': eid, 'publication_id': f['pub'], 'variant_id': f['variant'],
                           'stage': 'blastocyst', 'stage_raw': None})
        sid = f"{eid}-{f['fraction']}"
        sample.append({'sample_id': sid, 'embryo_id': eid, 'sample_type': f['fraction'], 'material_raw': f['fraction_raw']})
        mid = f"f4-{f['src']['row']:03d}"
        measurement.append({'measurement_id': mid, 'sample_id': sid, 'value_pct': f['value'],
                            'qualifier': 'not_detected' if f['value'] == 0 else 'exact', 'value_low_pct': None,
                            'value_high_pct': None, 'lod_pct': None, 'derivation': 'as_reported_in_dataset',
                            'note_raw': None, 'src_sheet': f['src']['sheet'], 'src_row': f['src']['row']})
        membership.append({'figure': 'fig4', 'record_id': mid, 'included': True, 'exclusion_reason': None})
    for c in cleav:
        eid = 'emb-' + c['embryo']
        embryo.append({'embryo_id': eid, 'publication_id': c['pub'], 'variant_id': c['variant'],
                       'stage': 'cleavage', 'stage_raw': 'дробление (день 3)'})
        for k in ('b1', 'b2'):
            sid = f'{eid}-{k}'
            sample.append({'sample_id': sid, 'embryo_id': eid, 'sample_type': 'single_blastomeres', 'material_raw': k})
            mid = f"cl-{c['src']['row']:03d}-{k}"
            measurement.append({'measurement_id': mid, 'sample_id': sid, 'value_pct': c[k],
                                'qualifier': 'not_detected' if c[k] == 0 else 'exact', 'value_low_pct': None,
                                'value_high_pct': None, 'lod_pct': c['lod'] if c[k] == 0 else None,
                                'derivation': 'as_reported_in_dataset', 'note_raw': None,
                                'src_sheet': c['src']['sheet'], 'src_row': c['src']['row']})
            membership.append({'figure': 'fig4C', 'record_id': mid, 'included': True, 'exclusion_reason': None})
    offspring_measurement = []
    for p in fig5:
        offspring_measurement.append({
            'pair_id': p['id'], 'child_id': p['child'], 'publication_id': p['pub'], 'variant_id': p['variant'],
            'embryo_value_pct': p['emb'], 'embryo_qualifier': p['emb_q'], 'embryo_raw': p['emb_raw'],
            'phase': p['phase'], 'tissue': p['tissue'], 'tissue_raw': p['tissue_raw'], 'value_pct': p['value'],
            'qualifier': p['q'], 'value_raw': p['value_raw'], 'age_raw': p['age'], 'method_raw': p['method'],
            'delta_pp': round(p['value'] - p['emb'], 10) if p['in_figure'] else None,
            'src_sheet': p['src']['sheet'], 'src_row': p['src']['row']})
        membership.append({'figure': 'fig5', 'record_id': p['id'], 'included': p['in_figure'],
                           'exclusion_reason': None if p['in_figure'] else p['on_plot_raw']})
    return {'publication': publication, 'variant': variant, 'embryo': embryo, 'sample': sample,
            'measurement': measurement, 'offspring_measurement': offspring_measurement,
            'figure_membership': membership}


def write_csv(path: Path, records: list[dict]):
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open('w', newline='', encoding='utf-8') as fh:
        fields = list(dict.fromkeys(k for r in records for k in r))
        w = csv.DictWriter(fh, fieldnames=fields)
        w.writeheader()
        w.writerows(records)


# ---------------------------------------------------------------- сборка

def build() -> dict:
    pubs = load_publications()
    vocab = Vocab()
    rules = load_yaml('curation/rules.yaml')
    wb = openpyxl.load_workbook(SOURCE_XLSX, data_only=True)
    fig3 = read_fig3(wb['Рисунок 3'], pubs, vocab, rules)
    fig4 = read_fig4(wb['Рисунок 4'], pubs, vocab)
    cleav = read_cleavage(wb['Бластомеры (дробление)'], pubs, rules)
    fig5 = read_fig5(wb['Рисунок 5'], pubs, vocab)
    table1 = read_table1(wb['Таблица 1'], pubs)
    fig6_sheet = read_fig6_sheet(wb['Рисунок 6'])
    stats = derive_stats(fig3, fig4, cleav, fig5, fig6_sheet[:4], rules)
    for t in rules['thresholds']:
        if t['publication'] and t['publication'] not in pubs.by_id:
            raise EtlError(f"ориентир {t['id']}: нет публикации {t['publication']}")
    used = {m['pub'] for m in fig3} | {f['pub'] for f in fig4} | {p['pub'] for p in fig5} | \
           {c['pub'] for c in cleav} | {i for r in table1 for i in r['pubs']} | \
           {t['publication'] for t in rules['thresholds'] if t['publication']} | {rules['model']['p_eupl_publication'], 'tajima2007'}
    atlas = {
        'meta': {
            'dataset_version': dt.date.today().isoformat(),
            'source_file': str(SOURCE_XLSX.relative_to(ROOT)),
            'source_sha256': sha256(SOURCE_XLSX),
            'generator': 'etl/atlas_etl/build.py',
        },
        'labels': vocab.labels,
        'publications': [p for p in pubs.by_id.values() if p['id'] in used],
        'fig3': fig3,
        'fig3_blocks': rules['fig3_blocks'],
        'fig4': fig4,
        'cleavage': cleav,
        'fig5': fig5,
        'fig5_notes': read_fig5_notes(wb['Рисунок 5']),
        'table1': table1,
        'hu2026_within_embryo': read_hu16(wb['Hu 2026 (16 проб эмбриона)']),
        'tajima2007_excluded': read_tajima(wb['Tajima 2007 (не используется)'], pubs),
        'thresholds': rules['thresholds'],
        'model': {**rules['model'], 'fig6_variants': rules['fig6_variants'],
                  'formula': {'p_both': 'p_het × p_eupl', 'p_at_least_one': '1 − (1 − p_both)^N'}},
        'verification': verify_tofilo(fig3, fig4),
        'stats': stats,
    }
    return atlas


def check_manifest(digest: str):
    if not MANIFEST.exists():
        raise EtlError(f'нет {MANIFEST.relative_to(ROOT)}; создайте его: python3 -m atlas_etl.build --write-manifest')
    expected = MANIFEST.read_text().split()[0]
    if expected != digest:
        raise EtlError('исходный xlsx изменился относительно SOURCE_MANIFEST.sha256. Если изменение научно согласовано, '
                       'обновите манифест (--write-manifest) в PR с меткой data-change.')


def main(argv=None) -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument('--check', action='store_true', help='только проверки')
    ap.add_argument('--write-manifest', action='store_true', help='записать SHA-256 исходника')
    a = ap.parse_args(argv)
    try:
        digest = sha256(SOURCE_XLSX)
        if a.write_manifest:
            MANIFEST.write_text(f'{digest}  {SOURCE_XLSX.relative_to(ROOT).as_posix()}\n', encoding='utf-8')
        check_manifest(digest)
        atlas = build()
    except EtlError as e:
        print(f'ОШИБКА ETL: {e}', file=sys.stderr)
        return 1
    if a.check:
        print(json.dumps(atlas['stats'], ensure_ascii=False, indent=1))
        return 0
    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    OUT_JSON.write_text(json.dumps(atlas, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
    pubs, vocab = load_publications(), Vocab()
    tables = normalized_tables(pubs, atlas['fig3'], atlas['fig4'], atlas['cleavage'], atlas['fig5'], vocab)
    for name, recs in tables.items():
        write_csv(OUT_CSV / 'csv' / f'{name}.csv', recs)
    write_csv(OUT_CSV / 'csv' / 'verification.csv',
              [{k: (json.dumps(v, ensure_ascii=False) if isinstance(v, list) else v) for k, v in r.items()
                if k not in ('comment_en',)} for r in atlas['verification']])
    print(f"atlas.json: {OUT_JSON.stat().st_size // 1024} КБ; CSV: {len(tables) + 1} таблиц → "
          f"{OUT_CSV.relative_to(ROOT)}/csv")
    counts = Counter(r['status'] for r in atlas['verification'])
    print('сверка Tofilo 2026 с ESM 2:', dict(counts))
    return 0


if __name__ == '__main__':
    sys.exit(main())
