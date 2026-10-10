"""Еженедельный отчёт куратору: новые публикации-кандидаты (PubMed) и сверка DOI набора (Crossref).

Ничего не меняет в данных — только печатает Markdown-отчёт для issue.
"""
import datetime as dt
import json
import os
import urllib.parse
import urllib.request
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[2]
QUERY = ('("preimplantation genetic testing"[tiab] OR "preimplantation genetic diagnosis"[tiab] OR PGT-mt[tiab]) '
         'AND (mitochondrial DNA[tiab] OR mtDNA[tiab]) AND heteroplasmy[tiab]')


def get(url: str) -> dict:
    req = urllib.request.Request(url, headers={'User-Agent': 'pgt-mt-atlas literature watch'})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)


def pubmed_new(days: int = 14) -> list[dict]:
    key = os.environ.get('NCBI_API_KEY')
    base = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/'
    q = {'db': 'pubmed', 'term': QUERY, 'reldate': days, 'datetype': 'edat', 'retmode': 'json', 'retmax': 50}
    if key:
        q['api_key'] = key
    ids = get(base + 'esearch.fcgi?' + urllib.parse.urlencode(q))['esearchresult']['idlist']
    if not ids:
        return []
    s = {'db': 'pubmed', 'id': ','.join(ids), 'retmode': 'json'}
    res = get(base + 'esummary.fcgi?' + urllib.parse.urlencode(s))['result']
    return [res[i] for i in ids]


def known_dois() -> dict:
    refs = yaml.safe_load((ROOT / 'etl/atlas_etl/curation/review_references.yaml').read_text(encoding='utf-8'))
    return {r['doi'].lower(): r for r in refs['references'] if r['doi']}


def main():
    print(f'# Literature watch — {dt.date.today().isoformat()}\n')
    print('Кандидаты требуют ручной проверки куратором; значения в набор автоматически не добавляются.\n')
    known = known_dois()
    try:
        items = pubmed_new()
        print(f'## Новые записи PubMed за 14 дней ({len(items)})\n')
        for it in items:
            doi = next((a['value'] for a in it.get('articleids', []) if a['idtype'] == 'doi'), None)
            flag = ' — уже в списке литературы' if doi and doi.lower() in known else ''
            print(f"- PMID {it['uid']}: {it.get('title', '').strip()} ({it.get('source', '')}, {it.get('pubdate', '')})"
                  f"{f' doi:{doi}' if doi else ''}{flag}")
    except Exception as e:  # noqa: BLE001 — отчёт не должен падать из-за сети
        print(f'PubMed недоступен: {e}')
    print('\n## Сверка DOI списка литературы с Crossref\n')
    for doi, ref in known.items():
        try:
            msg = get('https://api.crossref.org/works/' + urllib.parse.quote(doi))['message']
            year = (msg.get('issued', {}).get('date-parts') or [[None]])[0][0]
            if str(year) not in ref['citation']:
                print(f"- [{ref['no']}] doi:{doi}: год в Crossref {year} не найден в описании рукописи")
        except Exception as e:  # noqa: BLE001
            print(f"- [{ref['no']}] doi:{doi}: не удалось проверить ({e})")
    print('\n(Пустой раздел сверки = расхождений не найдено.)')


if __name__ == '__main__':
    main()
