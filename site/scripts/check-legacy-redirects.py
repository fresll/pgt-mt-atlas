#!/usr/bin/env python3
"""Run only after cutover; verify real HTTP redirects for every built language page."""
from pathlib import Path
from urllib.error import HTTPError
from urllib.parse import urljoin, urlsplit
from urllib.request import HTTPRedirectHandler, Request, build_opener

OLD = 'https://fresll.github.io/pgt-mt-atlas/'
NEW = 'https://atlas.mazunin.science/'
LANGUAGES = ('ru', 'en', 'es', 'zh-Hans', 'ar')
class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs):
        return None
opener = build_opener(NoRedirect)
paths = sorted(p.relative_to('dist').as_posix().removesuffix('index.html')
               for lang in LANGUAGES for p in Path('dist', lang).rglob('index.html'))
assert len(paths) == 110, f'Expected a complete public build, found {len(paths)} pages'
for path in paths:
    url = OLD + path + '?atlas_redirect_check=1'
    for hop in range(8):
        try:
            response = opener.open(Request(url, headers={'User-Agent': 'Atlas-redirect-check'}), timeout=20)
        except HTTPError as error:
            response = error
        with response:
            status, location = response.status, response.headers.get('Location')
        if 300 <= status < 400 and location:
            url = urljoin(url, location)
            continue
        expected = NEW + path + '?atlas_redirect_check=1'
        assert status == 200 and url == expected and hop > 0, (path, status, url, expected)
        break
    else:
        raise AssertionError(f'Too many redirects: {path}')
    print(f'PASS {path} → {url}')
print(f'PASS: {len(paths)} legacy paths redirect to their exact new URLs with query intact')
