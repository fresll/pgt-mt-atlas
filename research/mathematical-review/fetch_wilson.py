"""Download unchanged published code at a pinned commit; no package installation."""
from pathlib import Path
from urllib.request import urlopen
SHA='1b6ea43ba9d179175db76c0c2ceebbdf16fd1845'
root=Path(__file__).resolve().parent/'vendor/mtBottleneck'
for name in ['readme.md','R/prepareSimData.R','R/example.R','R/compareMotherSibling.R','jags/mutbeta.jag','jags/censored_pubmutbeta.jag']:
    with urlopen('https://raw.githubusercontent.com/ijwilson/mtBottleneck/'+SHA+'/'+name,timeout=30) as response: value=response.read()
    dest=root/name;dest.parent.mkdir(parents=True,exist_ok=True);dest.write_bytes(value)
    print(name,len(value))
