#!/usr/bin/env python3
"""Validate internal HTML links, PT/EN pages, local assets and safety claims."""
from pathlib import Path
from html.parser import HTMLParser
import re,sys,xml.etree.ElementTree as ET
ROOT=Path(__file__).resolve().parent.parent
EXPECTED=['index','eureka-ai','mundo-digital','compute-node','desenvolvimento','investidores','futura-moeda','contactos','privacidade','termos']
class Links(HTMLParser):
    def __init__(self):super().__init__();self.targets=[];self.ids=set();self.lang=None;self.images=[];self.forms=0;self.title=False
    def handle_starttag(self,tag,attrs):
        data=dict(attrs)
        if tag=='html':self.lang=data.get('lang')
        if 'id' in data:self.ids.add(data['id'])
        if tag=='a':self.targets.append(data.get('href',''))
        if tag in ('img','script','link','video'):
            key={'img':'src','script':'src','link':'href','video':'src'}[tag]
            if data.get(key) and (tag!='link' or data.get('rel') in ('stylesheet','icon')):self.images.append(data[key])
        if tag=='form':self.forms+=1
errors=[];total=0
for lang in ('pt','en'):
 for pg in EXPECTED:
    path=(ROOT/'en' if lang=='en' else ROOT)/('index.html' if pg=='index' else pg+'.html')
    if not path.exists():errors.append(f'NOT_FOUND {path}');continue
    s=path.read_text(encoding='utf-8'); parser=Links();parser.feed(s);total+=1
    if parser.lang!=('en' if lang=='en' else 'pt-PT'):errors.append(f'BAD_LANGUAGE {path}: {parser.lang}')
    if '<title>' not in s or 'name="description"' not in s:errors.append(f'MISSING_METADATA {path}')
    if 'hreflang="en"' not in s or 'hreflang="pt-PT"' not in s:errors.append(f'NO_HREFLANG {path}')
    if re.search(r'\b(EKNX|KAWPOW|RandomX|Stratum|Genesis Market)\b',s,re.I):errors.append(f'LEGACY_TERM {path}')
    if 'LIVE ON-CHAIN' in s or 'guaranteed earnings' in s.lower():errors.append(f'RISKY_CLAIM {path}')
    for link in parser.targets+parser.images:
        if link.startswith(('http://','https://','mailto:','tel:','data:','javascript:')):continue
        if link.startswith('#'):
            if link[1:] and link[1:] not in parser.ids:errors.append(f'BROKEN_ANCHOR {path} {link}')
            continue
        if not link:continue
        target=link.split('#',1)[0].split('?',1)[0]
        filetarget=ROOT/target.lstrip('/') if target.startswith('/') else path.parent/target
        if target=='/':filetarget=ROOT/'index.html'
        if target=='/en/':filetarget=ROOT/'en/index.html'
        if not filetarget.exists():errors.append(f'BROKEN_LINK {path} {link}')
        if '# ' in link:errors.append(f'MALFORMED_LINK {path} {link}')
    if pg=='investidores' and parser.forms!=1:errors.append(f'INVESTOR_FORM_MISSING {path}')
for p in ['CNAME','.nojekyll','404.html','robots.txt','sitemap.xml','assets/site.js','assets/site.css','assets/mark.svg','assets/og.svg','assets/og.png','assets/media/manifest.json']:
 if not (ROOT/p).is_file():errors.append(f'MISSING {p}')
ET.parse(ROOT/'sitemap.xml')
if (ROOT/'CNAME').read_text().strip()!='eurekanexus.pt':errors.append('BAD_CNAME')
manifest=(ROOT/'assets/media/manifest.json').read_text();import json
if not isinstance(json.loads(manifest),list):errors.append('BAD_MEDIA_MANIFEST')
print(f'HTML_FILES={total}')
print('LANGUAGES=PT_EN')
print(f'VALIDATION_ERRORS={len(errors)}')
for e in errors[:100]:print('ERROR:',e)
if errors:sys.exit(1)
print('EUREKA_SITE_VALIDATION=PASS')
