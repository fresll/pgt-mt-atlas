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
ID_REGISTRY = Path(__file__).resolve().parent / 'curation' / 'record_ids.yaml'
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
            'citation': p.get('citation_override', ref['citation']),
            'doi': ref['doi'],
            'pmid': p.get('pmid'),
            'pub_status': p['pub_status'],
            'published_date': p.get('published_date'),
            'data_access_note': p.get('data_access_note'),
            'verified': p.get('verified'),
            'doi_exception': p.get('doi_exception'),
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
            'carrier_id': None,
            'id': None,
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


def apply_landscape_corrections(records, corrections):
    """Validate source fingerprints before applying independently sourced curation."""
    excluded = []
    for c in corrections:
        if not c['source'].get('locator') or not c['source'].get('publication'):
            raise EtlError(f"{c['id']}: missing primary-source attribution")
        matches = [r for r in records if r['src'] == c['target']]
        if len(matches) != 1:
            raise EtlError(f"{c['id']}: expected one source row")
        r = matches[0]
        if c['source']['publication'] not in r.get('pubs', [r.get('pub')]):
            raise EtlError(f"{c['id']}: source publication mismatch")
        if any(r.get(k) != v for k, v in c['expected'].items()):
            raise EtlError(f"{c['id']}: Исходник изменился")
        r.setdefault('source_fingerprint', fingerprint('fig3', r))
        r.setdefault('correction_ids', []).append(c['id'])
        r['source_locator'] = c['source']['locator']
        if c['action'] == 'split':
            records.remove(r)
            for value in c['values']:
                item = {**r, 'value': value, 'source_fingerprint': {**r['source_fingerprint'], 'value': value},
                        'parent_id': c['original_id'], 'note': c['note'], 'derivation': 'as_reported_in_dataset'}
                records.append(item)
        elif c['action'] == 'exclude':
            records.remove(r)
            excluded.append({**r, 'id': c['original_id'], 'reason': c['reason']})
        elif c['action'] == 'update':
            r.update(c['set'])
        else:
            raise EtlError(f"{c['id']}: unknown correction action")
    return excluded


def apply_case_corrections(records, corrections):
    for c in corrections:
        matches = [r for r in records if r.get('row', r['src']['row']) == c['row']]
        if len(matches) != 1 or not c['source'].get('locator') or not c['source'].get('publication'):
            raise EtlError(f"{c['id']}: invalid case correction")
        r = matches[0]
        if c['source']['publication'] not in r.get('pubs', [r.get('pub')]):
            raise EtlError(f"{c['id']}: source publication mismatch")
        if any(r.get(k) != v for k, v in c['expected'].items()):
            raise EtlError(f"{c['id']}: Исходник изменился")
        r.update(c['set'])
        r['source_locator'] = c['source']['locator']
        r['correction_id'] = c['id']


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


def apply_corrections(fig4: list[dict], corrections: list[dict]) -> list[dict]:
    """Прозрачный слой корректировок (curation/corrections.yaml) поверх значений xlsx.

    Исходное значение остаётся в записи (value_source / fraction_source), рядом — идентификатор корректировки.
    Если в xlsx уже не то значение, которое корректировка ожидает (`from`), сборка останавливается."""
    by_row = {(f['src']['sheet'], f['src']['row']): f for f in fig4}
    applied = []
    for c in corrections:
        tg = c['target']
        f = by_row.get((tg['sheet'], tg['row']))
        where = f"корректировка {c['id']} («{tg['sheet']}»!{tg['row']})"
        if f is None or f['embryo'] != tg['embryo']:
            raise EtlError(f'{where}: в xlsx нет записи для {tg["embryo"]}')
        field = c['field']
        if field not in ('value', 'fraction'):
            raise EtlError(f'{where}: неизвестное поле {field}')
        current = f[field]
        if (field == 'value' and f['fraction'] != tg['fraction']) or current != c['from']:
            raise EtlError(f'{where}: в xlsx {field} = {current!r}, корректировка ожидает {c["from"]!r}. '
                           'Исходник изменился — проверьте корректировку заново.')
        f[f'{field}_source'] = current
        f[field] = c['to']
        f.setdefault('corrections', []).append(c['id'])
        applied.append(c)
    return applied


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
            'age': age, 'method': method, 'in_figure': on_plot == 'да', 'on_plot_raw': on_plot.replace('exact-pair plot', 'набора точных пар'),
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


def apply_offspring_note_corrections(notes, corrections, stats):
    for correction in corrections:
        matches = [n for n in notes if n['row'] == correction['row']]
        if len(matches) != 1 or matches[0]['text'] != correction['expected']:
            raise EtlError(f"{correction['id']}: source note changed")
        if not correction['source'].get('publication') or not correction['source'].get('locator'):
            raise EtlError('Missing offspring-note provenance')
        matches[0].update(text=correction['text'].format(**stats), correction_id=correction['id'], source=correction['source'])
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


ESM_HEADER = ('Embryo number', 'Sample / fraction', 'Coverage at m.14487')
ESM_VALUE_HEADER = 'Heteroplasmy (%)'
ESM_RESTORE_HINT = (
    'Нужен опубликованный ESM 2 статьи Tofilo et al. 2026 (J Assist Reprod Genet, Supplementary Table S2): '
    'references/10815_2026_4012_MOESM2_ESM.xlsx. Файл хранится в Git: восстановите его командой '
    '`git checkout -- references/10815_2026_4012_MOESM2_ESM.xlsx` (или скачайте ESM 2 со страницы статьи, '
    'PMID 42649365, и положите без изменений). Без него сверка с ESM и пометки расхождений исчезли бы '
    'с сайта, поэтому сборка остановлена.')


def read_tofilo_esm2(path: Path) -> dict[int, dict]:
    """ESM 2 Tofilo 2026 → {номер эмбриона: {фракция: значение}}. Отсутствие файла или чужая структура — ошибка."""
    if not path.exists():
        raise EtlError(f'нет обязательного файла {path}. {ESM_RESTORE_HINT}')
    try:
        ws = openpyxl.load_workbook(path, data_only=True).active
    except Exception as e:  # повреждённый или не-xlsx файл
        raise EtlError(f'не удалось прочитать {path}: {e}. {ESM_RESTORE_HINT}') from e
    header = next(ws.iter_rows(min_row=1, max_row=1, values_only=True), ())
    if tuple(header[:3]) != ESM_HEADER or len(header) < 9 or header[8] != ESM_VALUE_HEADER:
        raise EtlError(f'{path}: неожиданная структура листа «{ws.title}» (заголовок {header!r}); '
                       f'ожидались столбцы {ESM_HEADER + (ESM_VALUE_HEADER,)}. {ESM_RESTORE_HINT}')
    esm = defaultdict(dict)
    for i, r in rows(ws, 2):
        if not r[0]:
            continue
        if r[1] not in ESM_FRACTION:
            raise EtlError(f'{path}, строка {i}: неизвестная фракция {r[1]!r}. {ESM_RESTORE_HINT}')
        try:
            n = int(str(r[0]).split()[-1])
        except ValueError as e:
            raise EtlError(f'{path}, строка {i}: неожиданный номер эмбриона {r[0]!r}. {ESM_RESTORE_HINT}') from e
        esm[n][ESM_FRACTION[r[1]]] = {'value': clean_num(r[8]), 'coverage': r[2], 'label': r[1]}
    if not esm or any('te_biopsy' not in fr for fr in esm.values()):
        raise EtlError(f'{path}: нет строк «TE biopsy» для всех эмбрионов. {ESM_RESTORE_HINT}')
    return esm


def verify_tofilo(fig3, fig4, esm_path: Path | None = None) -> list[dict]:
    """Сверка набора с ESM 2. Расхождения только помечаются; значения набора не переписываются."""
    esm = read_tofilo_esm2(esm_path or TOFILO_ESM2)
    # сверяется исходная (xlsx) версия набора; исправленные записи получают resolution = corrected
    ds = defaultdict(dict)
    for f in fig4:
        if f['pub'] == 'tofilo2026':
            src = {**f, 'value': f.get('value_source', f['value']), 'fraction': f.get('fraction_source', f['fraction'])}
            ds[int(f['embryo'].split('_')[1])][src['fraction']] = src
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
            d = rec.get('dataset_fraction') and ds[n].get(rec['dataset_fraction'])
            corr = (d or {}).get('corrections')
            rec['resolution'] = 'corrected' if corr else None
            rec['correction_ids'] = corr or []
            if corr:
                rec['atlas_value'] = d['value'] if 'value_source' not in d else next(
                    x['value'] for x in fig4 if x['src'] == d['src'])
                rec['atlas_fraction'] = next(x['fraction'] for x in fig4 if x['src'] == d['src'])
            out.append(rec)
    # биоптаты ТЭ рисунка 3 (без номеров эмбрионов) сверяются как мультимножество
    f3 = sorted(m['value'] for m in fig3 if m['pub'] == 'tofilo2026')
    e3 = sorted(esm[n]['te_biopsy']['value'] for n in esm)
    out.append({'publication': 'tofilo2026', 'embryo': None, 'esm_fraction': 'te_biopsy',
                'esm_label': 'TE biopsy (all embryos)', 'esm_value': e3, 'dataset_value': f3,
                'dataset_fraction': 'te_biopsy', 'source': src_ref + '; «Рисунок 3»',
                'status': 'match' if f3 == e3 else 'value_mismatch'})
    return out


# ---------------------------------------------------------------- стабильные идентификаторы (B2)

# Отпечаток записи — поля, прочитанные из источника (до слоя корректировок). Номер строки xlsx в него не входит,
# поэтому перестановка или вставка строк не меняет идентификаторы.
ID_KINDS = {
    'fig3': ('HL', ('pub', 'variant', 'value', 'low', 'high', 'stage_raw', 'material_raw', 'note', 'doi_in_sheet')),
    'fig4': ('EC', ('pub', 'embryo', 'variant', 'fraction_raw', 'value')),
    'cleavage': ('CL', ('pub', 'embryo', 'variant', 'b1', 'b2')),
}


def fingerprint(kind: str, rec: dict) -> dict:
    if 'source_fingerprint' in rec:
        return rec['source_fingerprint']
    fields = ID_KINDS[kind][1]
    src = {**rec, 'value': rec.get('value_source', rec.get('value'))}
    return {k: src.get(k) for k in fields}


def legacy_id(kind: str, rec: dict) -> str:
    row = rec['src']['row']
    return {'fig3': f'f3-{row:03d}', 'fig4': f'f4-{row:03d}', 'cleavage': f'cl-{row:03d}'}[kind]


def assign_ids(records: dict[str, list[dict]], registry: dict, allow_new: bool, today: str) -> tuple[dict, list[str]]:
    """Сопоставляет записи с реестром curation/record_ids.yaml по отпечатку.

    Совпадающие отпечатки (одинаковые записи одного источника) получают идентификаторы в порядке следования.
    Новые записи получают следующий номер только при allow_new (команда --assign-ids после проверки куратора);
    иначе сборка останавливается. Выбывшие записи остаются в реестре со статусом retired: их ID не переиспользуются."""
    entries = registry.setdefault('records', [])
    new_ids = []
    for kind, recs in records.items():
        prefix = ID_KINDS[kind][0]
        pool = defaultdict(list)
        for e in entries:
            if e['kind'] == kind and not e.get('retired'):
                pool[json.dumps(e['fp'], sort_keys=True, ensure_ascii=False)].append(e)
        used = set()
        for r in recs:
            key = json.dumps(fingerprint(kind, r), sort_keys=True, ensure_ascii=False)
            cand = [e for e in pool.get(key, []) if e['id'] not in used]
            if cand:
                e = cand[0]
            elif allow_new:
                n = 1 + max([int(x['id'].rsplit('-', 1)[1]) for x in entries if x['kind'] == kind and x['pub'] == r['pub']] or [0])
                e = {'id': f"{prefix}-{r['pub']}-{n:03d}", 'kind': kind, 'pub': r['pub'], 'legacy': legacy_id(kind, r),
                     'added': today, 'fp': fingerprint(kind, r)}
                entries.append(e)
                new_ids.append(e['id'])
            else:
                raise EtlError(f"{kind} «{r['src']['sheet']}»!{r['src']['row']}: у записи нет стабильного идентификатора "
                               f'в {ID_REGISTRY.relative_to(ROOT)}. Это новая или изменённая запись: после проверки куратора '
                               'выполните python -m atlas_etl.build --assign-ids (существующие ID не меняются).')
            used.add(e['id'])
            r['id'] = e['id']
            r['legacy_id'] = e['legacy']
        stale = [e['id'] for e in entries if e['kind'] == kind and not e.get('retired') and e['id'] not in used]
        if stale and not allow_new:
            raise EtlError(f'{kind}: записи реестра без соответствия в источнике: {", ".join(stale[:5])}… '
                           'Если запись удалена или изменена намеренно, выполните --assign-ids (ID будут помечены retired).')
        for e in entries:
            if e['id'] in stale:
                e['retired'] = today
    return registry, new_ids


def load_registry() -> dict:
    if not ID_REGISTRY.exists():
        return {'records': []}
    return yaml.safe_load(ID_REGISTRY.read_text(encoding='utf-8')) or {'records': []}


def write_registry(reg: dict):
    lines = ['# Реестр стабильных идентификаторов записей (B2). Генерируется: python -m atlas_etl.build --assign-ids.',
             '# id не зависит от номера строки xlsx; legacy — прежний идентификатор по строке (алиас для старых ссылок).',
             '# fp — отпечаток записи из источника. Выбывшие записи получают retired и не переиспользуются.',
             'records:']
    for e in reg['records']:
        lines.append('  - ' + json.dumps(e, ensure_ascii=False))
    ID_REGISTRY.write_text('\n'.join(lines) + '\n', encoding='utf-8')


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
    rng = {e: round(max(v.values()) - min(v.values()), 10) for e, v in emb.items()}
    pat = [rng[e] for e in emb if meta[e] != 'neutral_polymorphism']
    hv2 = [rng[e] for e in emb if meta[e] == 'neutral_polymorphism']
    plotted = [p for p in fig5 if p['in_figure']]
    low = [p for p in plotted if p['emb'] <= 18]
    conc = [p for p in low if p['value'] <= 18]
    low_children = {p['child'] for p in low}
    discordant_children = {p['child'] for p in low if p not in conc}
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
        'fig5': {'n_records': len(fig5), 'n_low_children': len(low_children),
                 'n_concordant_children': len(low_children - discordant_children),
                 'n_both_nd_pairs': sum(p['q'] == p['emb_q'] == 'not_detected' for p in plotted),
                 'n_both_nd_children': len({p['child'] for p in plotted if p['q'] == p['emb_q'] == 'not_detected'}),
                 'n_pairs': len(plotted), 'n_children': len({p['child'] for p in plotted}),
                 'n_low_embryo': len(low), 'n_concordant_low': len(conc),
                 'discordant_ids': [p['id'] for p in low if p not in conc]},
        'fig6_sheet_check': fig6_check,
    }


def variant_classes(vocab: Vocab, variants: set[str], pubs: Pubs) -> dict:
    """Класс каждого варианта и его основание (curation/variant_classification.yaml); класс должен совпадать с vocab."""
    vc = load_yaml('curation/variant_classification.yaml')
    out = {}
    for v in sorted(variants):
        e = vc['variants'].get(v)
        if e is None:
            raise EtlError(f'{v}: нет основания классификации в curation/variant_classification.yaml')
        if e['class'] != vocab.variant_class(v):
            raise EtlError(f'{v}: класс {e["class"]} в variant_classification.yaml ≠ {vocab.variant_class(v)} в vocab.yaml')
        if e['publication'] not in pubs.by_id:
            raise EtlError(f'{v}: публикация {e["publication"]} не найдена')
        if e['status'] != 'not_verified' and not e.get('locator'):
            raise EtlError(f'{v}: статус {e["status"]} требует локатора')
        out[v] = {**e, 'checked': vc['checked']}
    return out


def publication_roles(fig3, fig4, cleav, fig5, table1, rules, classes) -> dict[str, list[dict]]:
    """Роль каждой публикации на сайте — по фактическому использованию в данных, ориентирах и модели."""
    roles = defaultdict(list)

    def add(pub, role, **detail):
        if not any(r['role'] == role and r.get('section') == detail.get('section') for r in roles[pub]):
            roles[pub].append({'role': role, **detail})
    for m in fig3:
        add(m['pub'], 'observations', section='heteroplasmy-landscape')
    for f in fig4:
        add(f['pub'], 'observations', section='embryo-concordance')
    for c in cleav:
        add(c['pub'], 'observations', section='embryo-concordance')
    for x in fig5:
        add(x['pub'], 'observations', section='embryo-to-offspring')
    for r in table1:
        for pid in r['pubs']:
            add(pid, 'case_summary', section='cases')
    for t in rules['thresholds']:
        if t['publication']:
            add(t['publication'], 'threshold', section=t['id'])
    add(rules['model']['p_eupl_publication'], 'model_parameter', section='p_eupl')
    add('tajima2007', 'excluded_data', section='methods')
    for v, e in classes.items():
        if e['status'] != 'not_verified':
            add(e['publication'], 'classification_basis', section=v)
    return dict(roles)


def current_counts(fig3, fig4, cleav, fig5, used_pubs) -> dict:
    """Счётчики текущей версии в тех же определениях, что и baseline.counts (curation/releases.yaml)."""
    return {
        'landscape_values': len(fig3), 'landscape_variants': len({m['variant'] for m in fig3}),
        'concordance_blastocysts': len({f['embryo'] for f in fig4}), 'concordance_records': len(fig4),
        'cleavage_embryos': len(cleav), 'offspring_records': len(fig5),
        'offspring_children': len({p['child'] for p in fig5}),
        'offspring_children_exact_pair': len({p['child'] for p in fig5 if p['in_figure']}), 'publications': len(used_pubs),
    }


# ---------------------------------------------------------------- нормализованные таблицы (CSV)

def normalized_tables(pubs, fig3, fig4, cleav, fig5, vocab):
    publication = [{k: p[k] for k in ('id', 'short', 'doi', 'pmid', 'pub_status',
                                      'published_date', 'citation')} for p in pubs.by_id.values()]
    variants = sorted({m['variant'] for m in fig3} | {f['variant'] for f in fig4} | {p['variant'] for p in fig5})
    vc = load_yaml('curation/variant_classification.yaml')
    variant = [{'variant_id': v, 'variant_class': vocab.variant_class(v),
                'class_basis_status': vc['variants'][v]['status'], 'class_basis_publication': vc['variants'][v]['publication'],
                'class_basis_locator': vc['variants'][v]['locator'], 'class_checked': vc['checked']} for v in variants]
    embryo, sample, measurement, membership = [], [], [], []
    for m in fig3:
        eid = 'emb-' + m['id']
        embryo.append({'embryo_id': eid, 'publication_id': m['pub'], 'variant_id': m['variant'],
                       'stage': m['stage'], 'stage_raw': m['stage_raw']})
        sid = eid + '-s1'
        sample.append({'sample_id': sid, 'embryo_id': eid, 'sample_type': m['sample'], 'material_raw': m['material_raw']})
        measurement.append({'measurement_id': m['id'], 'legacy_id': m['legacy_id'], 'sample_id': sid, 'value_pct': m['value'], 'qualifier': m['q'],
                            'value_low_pct': m['low'], 'value_high_pct': m['high'], 'lod_pct': m['lod'],
                            'derivation': m['derivation'], 'note_raw': m['note'],
                            'source_locator': m.get('source_locator'), 'carrier_id': m.get('carrier_id'),
                            'src_sheet': m['src']['sheet'], 'src_row': m['src']['row']})
        membership.append({'analysis': 'landscape', 'record_id': m['id'], 'included': True, 'exclusion_reason': None})
    seen = set()
    for f in fig4:
        eid = 'emb-' + f['embryo']
        if eid not in seen:
            seen.add(eid)
            embryo.append({'embryo_id': eid, 'publication_id': f['pub'], 'variant_id': f['variant'],
                           'stage': 'blastocyst', 'stage_raw': None})
        sid = f"{eid}-{f['fraction']}"
        sample.append({'sample_id': sid, 'embryo_id': eid, 'sample_type': f['fraction'], 'material_raw': f['fraction_raw']})
        mid = f['id']
        measurement.append({'measurement_id': mid, 'legacy_id': f['legacy_id'], 'sample_id': sid, 'value_pct': f['value'],
                            'qualifier': 'not_detected' if f['value'] == 0 else 'exact', 'value_low_pct': None,
                            'value_high_pct': None, 'lod_pct': None, 'derivation': 'as_reported_in_dataset',
                            'note_raw': None, 'value_source_pct': f.get('value_source', f['value']),
                            'fraction_source': f.get('fraction_source', f['fraction']),
                            'correction_ids': ';'.join(f.get('corrections', [])) or None,
                            'src_sheet': f['src']['sheet'], 'src_row': f['src']['row']})
        membership.append({'analysis': 'concordance', 'record_id': mid, 'included': True, 'exclusion_reason': None})
    for c in cleav:
        eid = 'emb-' + c['embryo']
        embryo.append({'embryo_id': eid, 'publication_id': c['pub'], 'variant_id': c['variant'],
                       'stage': 'cleavage', 'stage_raw': 'дробление (день 3)'})
        for k in ('b1', 'b2'):
            sid = f'{eid}-{k}'
            sample.append({'sample_id': sid, 'embryo_id': eid, 'sample_type': 'single_blastomeres', 'material_raw': k})
            mid = f"{c['id']}-{k}"
            measurement.append({'measurement_id': mid, 'legacy_id': f"{c['legacy_id']}-{k}", 'sample_id': sid, 'value_pct': c[k],
                                'qualifier': 'not_detected' if c[k] == 0 else 'exact', 'value_low_pct': None,
                                'value_high_pct': None, 'lod_pct': c['lod'] if c[k] == 0 else None,
                                'derivation': 'as_reported_in_dataset', 'note_raw': None,
                                'src_sheet': c['src']['sheet'], 'src_row': c['src']['row']})
            membership.append({'analysis': 'cleavage-concordance', 'record_id': mid, 'included': True, 'exclusion_reason': None})
    offspring_measurement = []
    for p in fig5:
        offspring_measurement.append({
            'pair_id': p['id'], 'child_id': p['child'], 'publication_id': p['pub'], 'variant_id': p['variant'],
            'embryo_value_pct': p['emb'], 'embryo_qualifier': p['emb_q'], 'embryo_raw': p['emb_raw'],
            'phase': p['phase'], 'tissue': p['tissue'], 'tissue_raw': p['tissue_raw'], 'value_pct': p['value'],
            'qualifier': p['q'], 'value_raw': p['value_raw'], 'age_raw': p['age'], 'method_raw': p['method'],
            'delta_pp': round(p['value'] - p['emb'], 10) if p['in_figure'] and not (p['q'] == p['emb_q'] == 'not_detected') else None,
            'delta_qualifier': ('both_not_detected' if p['q'] == p['emb_q'] == 'not_detected' else 'lower_bound' if p['q'] == 'not_detected' else 'upper_bound' if p['emb_q'] == 'not_detected' else 'exact') if p['in_figure'] else None,
            'pmid': pubs.by_id[p['pub']]['pmid'], 'source_locator': p.get('source_locator'),
            'carrier_id': p.get('carrier_id'), 'lod_pct': p.get('lod'), 'embryo_lod_pct': p.get('emb_lod'),
            'src_sheet': p['src']['sheet'], 'src_row': p['src']['row']})
        membership.append({'analysis': 'offspring', 'record_id': p['id'], 'included': p['in_figure'],
                           'exclusion_reason': None if p['in_figure'] else p['on_plot_raw']})
    return {'publication': publication, 'variant': variant, 'embryo': embryo, 'sample': sample,
            'measurement': measurement, 'offspring_measurement': offspring_measurement,
            'analysis_membership': membership}


def write_csv(path: Path, records: list[dict]):
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open('w', newline='', encoding='utf-8') as fh:
        fields = list(dict.fromkeys(k for r in records for k in r))
        w = csv.DictWriter(fh, fieldnames=fields)
        w.writeheader()
        w.writerows(records)


# ---------------------------------------------------------------- сборка

def build(allow_new_ids: bool = False) -> dict:
    pubs = load_publications()
    vocab = Vocab()
    rules = load_yaml('curation/rules.yaml')
    wb = openpyxl.load_workbook(SOURCE_XLSX, data_only=True)
    fig3 = read_fig3(wb['Рисунок 3'], pubs, vocab, rules)
    fig4 = read_fig4(wb['Рисунок 4'], pubs, vocab)
    correction_layer = load_yaml('curation/corrections.yaml')
    corrections = apply_corrections(fig4, correction_layer['corrections'])
    excluded_landscape = apply_landscape_corrections(fig3, correction_layer['landscape_corrections'])
    cleav = read_cleavage(wb['Бластомеры (дробление)'], pubs, rules)
    fig5 = read_fig5(wb['Рисунок 5'], pubs, vocab)
    apply_case_corrections(fig5, correction_layer['offspring_corrections'])
    for record in correction_layer['offspring_additions']:
        if record['source']['publication'] != record['pub'] or not record['source']['locator']:
            raise EtlError('Invalid offspring augmentation provenance')
        if any(p['id'] == record['id'] for p in fig5):
            raise EtlError('Duplicate offspring ID')
        fig5.append(record)
    locators = load_yaml('curation/provenance.yaml')['locators']
    for record in [*fig3, *fig4, *fig5]:
        primary = locators.get(record['pub'])
        if primary:
            record['source_locator'] = primary + (('; embryo ' + record['embryo']) if 'embryo' in record else '') + ('; ' + record['source_locator'] if record.get('source_locator') else '')
    registry, new_ids = assign_ids({'fig3': fig3, 'fig4': fig4, 'cleavage': cleav}, load_registry(), allow_new_ids,
                                   dt.date.today().isoformat())
    for record in fig3:
        embryo = load_yaml('curation/provenance.yaml')['record_embryos'].get(record['id'])
        if embryo:
            record['source_locator'] += '; embryo / sample: ' + embryo
    table1 = read_table1(wb['Таблица 1'], pubs)
    apply_case_corrections(table1, correction_layer['case_corrections'])
    fig6_sheet = read_fig6_sheet(wb['Рисунок 6'])
    stats = derive_stats(fig3, fig4, cleav, fig5, fig6_sheet[:4], rules)
    # те же статистики по исходной (xlsx) версии — для журнала зависимых пересчётов
    fig4_source = [{**f, 'value': f.get('value_source', f['value']), 'fraction': f.get('fraction_source', f['fraction'])}
                   for f in fig4]
    stats['fig4_source_xlsx'] = derive_stats(fig3, fig4_source, cleav, fig5, fig6_sheet[:4], rules)['fig4']
    for t in rules['thresholds']:
        if t['publication'] and t['publication'] not in pubs.by_id:
            raise EtlError(f"ориентир {t['id']}: нет публикации {t['publication']}")
    used = {m['pub'] for m in fig3} | {f['pub'] for f in fig4} | {p['pub'] for p in fig5} | \
           {c['pub'] for c in cleav} | {i for r in table1 for i in r['pubs']} | \
           {t['publication'] for t in rules['thresholds'] if t['publication']} | {rules['model']['p_eupl_publication'], 'tajima2007'}
    releases = load_yaml('curation/releases.yaml')
    classes = variant_classes(vocab, {m['variant'] for m in fig3} | {f['variant'] for f in fig4} | {x['variant'] for x in fig5}
                              | {c['variant'] for c in cleav}, pubs)
    roles = publication_roles(fig3, fig4, cleav, fig5, table1, rules, classes)
    if set(roles) - used:
        raise EtlError(f'роли без публикации в наборе: {set(roles) - used}')
    atlas = {
        'meta': {
            'dataset_version': dt.date.today().isoformat(),
            'source_file': str(SOURCE_XLSX.relative_to(ROOT)),
            'source_sha256': sha256(SOURCE_XLSX),
            'generator': 'etl/atlas_etl/build.py',
            'baseline': releases['baseline'],
            'changes': releases['changes'],
            'current_counts': current_counts(fig3, fig4, cleav, fig5, used),
        },
        'labels': vocab.labels,
        'publications': [{**p, 'roles': roles.get(p['id'], [])} for p in pubs.by_id.values() if p['id'] in used],
        'variant_classes': classes,
        'excluded_landscape': excluded_landscape,
        'fig3': fig3,
        'fig3_blocks': rules['fig3_blocks'],
        'fig4': fig4,
        'cleavage': cleav,
        'fig5': fig5,
        'fig5_notes': apply_offspring_note_corrections(read_fig5_notes(wb['Рисунок 5']), correction_layer['offspring_note_corrections'], stats['fig5']),
        'table1': table1,
        'hu2026_within_embryo': read_hu16(wb['Hu 2026 (16 проб эмбриона)']),
        'tajima2007_excluded': read_tajima(wb['Tajima 2007 (не используется)'], pubs),
        'thresholds': rules['thresholds'],
        'model': {**rules['model'], 'fig6_variants': rules['fig6_variants'],
                  'formula': {'p_both': 'p_het × p_eupl', 'p_at_least_one': '1 − (1 − p_both)^N'}},
        'verification': verify_tofilo(fig3, fig4),
        'corrections': corrections,
        'stats': stats,
    }
    atlas['_registry'], atlas['_new_ids'] = registry, new_ids
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
    ap.add_argument('--assign-ids', action='store_true',
                    help='после проверки куратора: выдать стабильные ID новым записям, выбывшие пометить retired')
    a = ap.parse_args(argv)
    try:
        digest = sha256(SOURCE_XLSX)
        if a.write_manifest:
            MANIFEST.write_text(f'{digest}  {SOURCE_XLSX.relative_to(ROOT).as_posix()}\n', encoding='utf-8')
        check_manifest(digest)
        atlas = build(allow_new_ids=a.assign_ids)
    except EtlError as e:
        print(f'ОШИБКА ETL: {e}', file=sys.stderr)
        return 1
    registry, new_ids = atlas.pop('_registry'), atlas.pop('_new_ids')
    if a.check:
        print(json.dumps(atlas['stats'], ensure_ascii=False, indent=1))
        return 0
    if a.assign_ids:
        write_registry(registry)
        print(f'реестр ID: новых {len(new_ids)}; всего {len(registry["records"])} → {ID_REGISTRY.relative_to(ROOT)}')
    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    OUT_JSON.write_text(json.dumps(atlas, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
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
