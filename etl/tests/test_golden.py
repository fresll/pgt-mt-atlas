"""Эталонные тесты: ETL обязан воспроизводить числа рукописи обзора (docs/data_inventory.md, раздел 3)."""
import json
from fractions import Fraction

import pytest

from atlas_etl import build as b


@pytest.fixture(scope='module')
def atlas():
    b.check_manifest(b.sha256(b.SOURCE_XLSX))
    return b.build()


def test_fig3_counts(atlas):
    s = atlas['stats']['fig3']
    assert s['n'] == 187
    expected = {  # вариант: (n, ≤18%, ≤30%)
        'm.3243A>G': (87, 41, 52), 'm.14487T>C': (28, 6, 8), 'm.8993T>G': (26, 24, 24),
        'm.3697G>A': (21, 1, 3), 'm.10197G>A': (9, 5, 5), 'm.10191T>C': (8, 8, 8), 'm.3250T>C': (8, 8, 8),
    }
    got = {v: (x['n'], x['le18']['k'], x['le30']['k']) for v, x in s['by_variant'].items()}
    assert got == expected
    assert s['pooled_le18'] == {'k': 93, 'n': 187}


def test_fig3_intervals_not_imputed(atlas):
    iv = [m for m in atlas['fig3'] if m['q'] == 'interval']
    assert [(m['low'], m['high'], m['value']) for m in iv] == [(26, 45, None), (84, 88, None)]


def test_fig4(atlas):
    s = atlas['stats']['fig4']
    assert (s['n_embryos'], s['n_pathogenic'], s['n_hv2']) == (40, 21, 19)
    assert round(s['median_range_pathogenic'], 1) == 2.1
    assert s['median_range_hv2'] == 1.0
    assert round(s['median_range_all'], 1) == 1.2
    assert round(s['share_le5_pathogenic'], 2) == 0.76 and s['share_le5_all'] == 0.85
    assert s['max_range_pathogenic'] == 8
    assert (s['n_cleavage'], s['median_range_cleavage'], s['max_range_cleavage']) == (22, 1, 6)


def test_fig5(atlas):
    s = atlas['stats']['fig5']
    assert (s['n_pairs'], s['n_children'], s['n_low_embryo'], s['n_concordant_low']) == (22, 8, 20, 16)
    assert s['discordant_ids'] == ['C5e', 'C5f', 'C5g', 'C5h']
    excluded = {p['id']: p['q'] for p in atlas['fig5'] if not p['in_figure']}
    assert excluded == {'C5d': 'less_than', 'C13': 'qualitative'}


def test_fig6_example():
    """Пример из рукописи: m.3243A>G, 35 лет → ≈24 / 55 / 80% при N = 1 / 3 / 6."""
    p = Fraction(41, 87) * Fraction(1, 2)
    got = [round(float(1 - (1 - p) ** n), 2) for n in (1, 3, 6)]
    assert got == [0.24, 0.55, 0.8]


def test_no_invented_doi(atlas):
    pubs = {p['id']: p for p in atlas['publications']}
    assert pubs['thorburn2009']['doi'] is None
    for m in atlas['fig3']:
        assert m['doi_in_sheet'] is None or m['doi_in_sheet'] == pubs[m['pub']]['doi']


def test_tofilo_published(atlas):
    t = {p['id']: p for p in atlas['publications']}['tofilo2026']
    assert t['pub_status'] == 'published'
    assert t['doi'] == '10.1007/s10815-026-04012-y'
    assert t['published_date'] == '2026-08-27' and t['pmid'] == '42649365'


def test_tofilo_esm2_verification(atlas):
    v = atlas['verification']
    status = {(r['embryo'], r['esm_fraction']): r['status'] for r in v if r['embryo']}
    assert status[('Tofilo_6', 'icm')] == 'value_mismatch'
    assert status[('Tofilo_6', 'remaining_te')] == 'value_mismatch'
    assert status[('Tofilo_3', 'combined_te_icm')] == 'fraction_label_mismatch'
    assert status[('Tofilo_4', 'combined_te_icm')] == 'fraction_label_mismatch'
    assert sum(s == 'match' for s in status.values()) == 12


def test_values_in_range(atlas):
    for m in atlas['fig3'] + atlas['fig4']:
        if m.get('value') is not None:
            assert 0 <= m['value'] <= 100


def test_json_serializable(atlas):
    json.dumps(atlas, ensure_ascii=False)


# --- ESM 2 Tofilo 2026 обязателен: без него сборка не должна молча снимать пометки расхождений

def test_missing_esm2_fails_build(tmp_path, monkeypatch):
    monkeypatch.setattr(b, 'TOFILO_ESM2', tmp_path / 'absent.xlsx')
    with pytest.raises(b.EtlError, match='10815_2026_4012_MOESM2_ESM.xlsx'):
        b.build()
    assert b.main([]) == 1  # обычный запуск ETL завершается ошибкой, файлы не пишутся
    assert b.main(['--check']) == 1


def test_unreadable_esm2_fails(atlas, tmp_path):
    bad = tmp_path / 'esm.xlsx'
    bad.write_bytes(b'not an xlsx')
    with pytest.raises(b.EtlError, match='не удалось прочитать'):
        b.verify_tofilo(atlas['fig3'], atlas['fig4'], bad)


def test_esm2_wrong_structure_fails(atlas, tmp_path):
    import openpyxl
    wb = openpyxl.Workbook()
    wb.active.append(['Embryo', 'Fraction', 'Value'])
    wb.active.append(['Embryo 1', 'TE biopsy', 11.4])
    path = tmp_path / 'esm.xlsx'
    wb.save(path)
    with pytest.raises(b.EtlError, match='неожиданная структура'):
        b.verify_tofilo(atlas['fig3'], atlas['fig4'], path)


def test_esm2_discrepancy_detected_not_rewritten(atlas, tmp_path):
    """Подмена значения в копии ESM выявляется как расхождение; значения набора остаются прежними."""
    import openpyxl
    src = openpyxl.load_workbook(b.TOFILO_ESM2)
    ws = src.active
    row = next(r for r in ws.iter_rows(min_row=2) if r[0].value == 'Embryo 1' and r[1].value == 'ICM')
    original = row[8].value
    row[8].value = original + 5
    path = tmp_path / 'esm.xlsx'
    src.save(path)
    before = [(f['embryo'], f['fraction'], f['value']) for f in atlas['fig4']]
    v = {(r['embryo'], r['esm_fraction']): r for r in b.verify_tofilo(atlas['fig3'], atlas['fig4'], path) if r['embryo']}
    assert v[('Tofilo_1', 'icm')]['status'] == 'value_mismatch'
    assert v[('Tofilo_1', 'icm')]['dataset_value'] == original
    assert [(f['embryo'], f['fraction'], f['value']) for f in atlas['fig4']] == before
