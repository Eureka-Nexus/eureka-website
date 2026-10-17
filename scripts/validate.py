#!/usr/bin/env python3
"""Offline validation of all generated locales, links, metadata, safety claims, assets."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import re, json, sys
from content import L,PAGES,SLUGS
ROOT=Path(__file__).resolve().parent.parent
class Parser(HTMLParser):
 def __init__(self):super().__init__();self.attrs=[];self.lang='';self.title=False;self.forms=0;self.ids=set()
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='html':self.lang=a.get('lang')
  if tag=='title':self.title=True
  if 'id' in a:self.ids.add(a['id'])
  if tag=='form':self.forms+=1
  for prop in ('href','src'):
   if prop in a:self.attrs.append((tag,prop,a[prop]))
errors=[];count=0
assert (ROOT/'CNAME').read_text().strip()=='eurekanexus.pt'
for lc,c in L.items():
 for pg in PAGES:
  fn='index.html' if pg=='index' else SLUGS[pg]
  path=(ROOT if lc=='pt' else ROOT/lc)/fn
  if not path.is_file():errors.append(f'MISSING {path}');continue
  s=path.read_text(encoding='utf-8');parser=Parser();parser.feed(s);count+=1
  if parser.lang!=c['locale']:errors.append(f'LANG {path}')
  if not parser.title or 'name="description"' not in s:errors.append(f'METADATA {path}')
  if '<h1' not in s:errors.append(f'NO_H1 {path}')
  if 'prefers-reduced-motion' not in (ROOT/'assets/site.css').read_text():errors.append('REDUCED_MOTION_MISSING')
  if re.search(r'\b(EKNX|KAWPOW|RandomX|Genesis Market|pool\.eurekanexus\.pt)\b',s,re.I):errors.append(f'LEGACY {path}')
  for other in L:
   if f'hreflang="{L[other]["locale"]}"' not in s:errors.append(f'HREFLANG {path} {other}')
  for tag,prop,uri in parser.attrs:
   if uri.startswith(('http:','https:','mailto:','tel:','data:','javascript:')):continue
   if not uri or uri.startswith('#'):
    if uri.startswith('#') and uri[1:] and uri[1:] not in parser.ids:errors.append(f'ANCHOR {path} {uri}')
    continue
   p=urlsplit(uri).path
   if p.startswith('/'):
    dest=ROOT/p.lstrip('/')
   else:dest=path.parent/p
   if p.endswith('/'):dest=dest/'index.html'
   elif not p or dest.is_dir():dest=dest/'index.html'
   if not dest.is_file():errors.append(f'BROKEN {path.relative_to(ROOT)} -> {uri}')
  if pg=='investidores' and parser.forms!=1:errors.append(f'FORM {path}')
media=json.loads((ROOT/'assets/media/manifest.json').read_text())
if not isinstance(media,list):errors.append('MEDIA_FORMAT')
for r in media:
 fn=r.get('file','')
 if not re.fullmatch(r'[\w.-]+\.(?:webp|png|jpe?g|mp4|webm)',fn,re.I):errors.append('MEDIA_UNSAFE_FILENAME')
 elif not (ROOT/'assets/media'/fn).is_file():errors.append(f'MEDIA_MISSING {fn}')
if count!=70:errors.append(f'EXPECTED_70_GOT_{count}')
if len(re.findall(r'<url>',(ROOT/'sitemap.xml').read_text()))!=70:errors.append('SITEMAP')
for e in errors[:40]:print('ERROR',e)
print('HTML_FILES='+str(count));print('LANGUAGES='+','.join(L));print('ERRORS='+str(len(errors)))
if errors:sys.exit(1)
print('EUREKA_SITE_V3_VALIDATION=PASS')
