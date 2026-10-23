"""Verify translation release against the published scientific and editorial baseline."""
from pathlib import Path
import subprocess, hashlib, json

ROOT = Path(__file__).resolve().parents[2]
BASE = '2957996f253b408ec0d09bfaeb04b4e787851d4e'
PREFIXES = ('etl/', 'source/', 'references/', 'site/src/model/', 'site/src/illustrations/', 'site/src/figures/', 'site/public/data/', 'site/public/model-version.json')
EXACT = {'site/src/data/atlas.json', 'site/src/i18n/en.ts', 'site/src/i18n/ru.ts', 'site/src/content/fundamentals/en.ts', 'site/src/content/fundamentals/ru.ts', 'site/src/content/fundamentals/references.ts', 'site/src/components/fundamentals/Widgets.tsx', 'site/src/components/Sketch.tsx'}
files = subprocess.check_output(['git','ls-tree','-r','--name-only',BASE],cwd=ROOT,text=True).splitlines()
protected = [p for p in files if p in EXACT or p.startswith(PREFIXES) or p.lower().endswith('.xlsx')]
results=[]
for name in protected:
    source = subprocess.check_output(['git','show',f'{BASE}:{name}'],cwd=ROOT)
    current = (ROOT/name).read_bytes()
    assert source == current, f'Published source changed: {name}'
    results.append({'path':name,'sha256':hashlib.sha256(current).hexdigest()})
raw=json.loads((ROOT/'site/src/data/atlas.json').read_text())
report={'published_commit':BASE,'protected_files_checked':len(results),'dataset_version':raw['meta']['dataset_version'],'records':{k:len(raw[k]) for k in ['fig3','fig4','fig5','cleavage','publications']},'files':results}
print(json.dumps(report,ensure_ascii=False,indent=2))
