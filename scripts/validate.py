#!/usr/bin/env python3
"""Local packaging checks; does not claim approval by the HACS catalogue."""
from pathlib import Path
import hashlib, json, re, subprocess, sys
ROOT=Path(__file__).resolve().parents[1]
def check():
    hacs=json.loads((ROOT/'hacs.json').read_text())
    pkg=json.loads((ROOT/'package.json').read_text())
    assert pkg['name']=='antarikfox-atmosphere'
    assert hacs['filename']==pkg['name']+'.js'
    code=(ROOT/'dist'/hacs['filename']).read_text()
    assert f"VERSION='{pkg['version']}'" in code
    assert '__PLATE__' not in code and '__FOG__' not in code
    assert code.count('data:image/png;base64,')==2
    assert (ROOT/'downloads/antarikfox-atmosphere.js.txt').read_text()==code
    assert code in (ROOT/'docs/index.html').read_text()
    assert (ROOT/'LICENSE').is_file() and (ROOT/'THIRD_PARTY_NOTICES.md').is_file()
    subprocess.run(['node','--check',str(ROOT/'dist'/hacs['filename'])],check=True)
    forbidden=['sensor.gostinaia_klimat_', 'sensor.spalnia_', '192.168.', 'antarikfoxmusic@']
    for p in ROOT.rglob('*'):
        if not p.is_file() or '.git' in p.parts or '__pycache__' in p.parts or p==Path(__file__):continue
        if p.suffix.lower() in {'.png','.pyc'}:continue
        text=p.read_text(errors='ignore')
        for marker in forbidden:assert marker not in text, f'Private example in {p.relative_to(ROOT)}'
    print('PASS: HACS filename/layout, version, embedded assets, matching outputs, JS syntax, public examples')
if __name__=='__main__':check()
