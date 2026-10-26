"""Verify Chinese localization against the latest published RU/EN/ES scientific baseline."""
from pathlib import Path
import subprocess, hashlib, json
ROOT = Path(__file__).resolve().parents[2]
BASE = '052091b77db1bba64be2068ac5228c5441b4292a'
PREFIXES = ('data/', 'etl/', 'references/', 'figures/', '.github/', 'site/src/model/', 'site/src/illustrations/', 'site/src/figures/', 'site/public/data/', 'site/public/templates/', 'site/public/model-version.json')
EXACT = {'site/src/data/atlas.json', 'site/src/data/submissionTemplate.json', 'site/src/content/fundamentals/references.ts', 'site/src/components/fundamentals/Widgets.tsx', 'site/src/components/Sketch.tsx', 'site/package-lock.json', 'site/package.json'}
for lang in ('ru','en','es'):
    EXACT.update({f'site/src/i18n/{lang}.ts',f'site/src/content/fundamentals/{lang}.ts'})
files = subprocess.check_output(['git','ls-tree','-r','--name-only',BASE],cwd=ROOT,text=True).splitlines()
results=[]
for path in files:
    if path not in EXACT and not path.startswith(PREFIXES) and not path.endswith('.xlsx'): continue
    original=subprocess.check_output(['git','show',f'{BASE}:{path}'],cwd=ROOT)
    current=(ROOT/path).read_bytes()
    assert original==current,f'Published source changed: {path}'
    results.append({'path':path,'sha256':hashlib.sha256(current).hexdigest()})
raw=json.loads((ROOT/'site/src/data/atlas.json').read_text())
print(json.dumps({'published_commit':BASE,'protected_files_checked':len(results),'dataset_version':raw['meta']['dataset_version'],'records':{k:len(raw[k]) for k in ['fig3','fig4','fig5','cleavage','publications']},'files':results},ensure_ascii=False,indent=2))
