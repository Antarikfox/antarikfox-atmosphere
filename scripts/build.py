#!/usr/bin/env python3
"""Rebuild the self-contained card and demo using Python's standard library."""
from pathlib import Path
import base64
ROOT=Path(__file__).resolve().parents[1]
def build():
    source=(ROOT/'src/antarikfox-atmosphere.js').read_text(encoding='utf-8')
    for token,name in [('__PLATE__','atmosphere-body.png'),('__FOG__','atmosphere-fog.png')]:
        assert source.count(token)==1, f'Missing/duplicate token {token}'
        data=base64.b64encode((ROOT/'assets'/name).read_bytes()).decode('ascii')
        source=source.replace(token,'data:image/png;base64,'+data)
    (ROOT/'dist').mkdir(exist_ok=True)
    (ROOT/'downloads').mkdir(exist_ok=True)
    (ROOT/'docs').mkdir(exist_ok=True)
    (ROOT/'dist/antarikfox-atmosphere.js').write_text(source,encoding='utf-8')
    (ROOT/'downloads/antarikfox-atmosphere.js.txt').write_text(source,encoding='utf-8')
    template=(ROOT/'src/demo.html').read_text(encoding='utf-8')
    demo=(ROOT/'src/demo.js').read_text(encoding='utf-8')
    html=template.replace('__CARD_SCRIPT__','<script>'+source+'</script>').replace('__DEMO_SCRIPT__','<script>'+demo+'</script>')
    (ROOT/'docs/index.html').write_text(html,encoding='utf-8')
    print('Built dist/antarikfox-atmosphere.js, downloads/*.js.txt and docs/index.html')
if __name__=='__main__':build()
