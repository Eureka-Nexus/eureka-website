#!/usr/bin/env python3
"""Generate 70 authored, SEO-friendly, dependency-free Eureka Nexus 3.0 pages."""
from __future__ import annotations
import html, json, re, sys
from pathlib import Path
from urllib.parse import quote
from content import L, PAGES, SLUGS

ROOT=Path(__file__).resolve().parent.parent
BASE='https://eurekanexus.pt'
EMAIL='official@eurekanexus.pt'
SOCIAL=[('GitHub','https://github.com/Eureka-Nexus'),('X','https://x.com/EurekaNexus'),('Reddit','https://www.reddit.com/user/eurekanexus/')]

def esc(s): return html.escape(str(s),quote=True)
def url(page,lang):
    prefix='' if lang=='pt' else f'/{lang}'
    suffix=SLUGS[page]
    return (prefix+'/' if not suffix else prefix+'/'+suffix)
def absolute(page,lang): return BASE+url(page,lang)
def asset(lang,path): return ('../' if lang!='pt' else '')+path

def neural_graph(lang):
    c=L[lang]
    nodes=[(170,106),(666,150),(724,314),(646,520),(427,599),(193,524),(92,329),(384,63)]
    colors=['#f9c978','#f6d495','#7fe6c4','#ffc972','#f1d6a2','#b0f4d4','#ffcf77','#e6bd81']
    wires=[];dots=[];labels=[]
    for i,(x,y) in enumerate(nodes):
        cx,cy=410,333
        path=f'M{x},{y} Q{(x+cx)/2 + (i%2)*18-9:.1f},{(y+cy)/2-15:.1f} {cx},{cy}'
        pid=f'wire-{i}'
        wires.append(f'<path id="{pid}" d="{path}" class="neural-wire"/><path d="{path}" class="neural-wire-charge" style="animation-delay:-{i*1.2:.1f}s"/>')
        dots.append(f'<circle r="3.2" class="neural-packet" fill="{colors[i]}"><animateMotion dur="{5.2+i*.48:.1f}s" repeatCount="indefinite" keyTimes="0;1" keyPoints="0;1" calcMode="linear" begin="-{i*.78:.1f}s"><mpath href="#{pid}"/></animateMotion></circle>')
        anch=('middle' if x < 120 else ('end' if x < 330 else ('start' if x > 520 else 'middle')))
        dx= 0 if anch=='middle' else (-16 if anch=='end' else 16)
        ty=y-21 if anch=='middle' else y+4
        labels.append(f'<g class="graph-node"><circle cx="{x}" cy="{y}" r="17" class="node-orbit"/><circle cx="{x}" cy="{y}" r="5.3" fill="{colors[i]}" class="node-dot"/><text x="{x+dx}" y="{ty}" text-anchor="{anch}" class="node-caption">{esc(c["modules"][i])}</text></g>')
    return '''<div class="neural-wrap" aria-label="Conceptual diagram of neural links">
    <svg class="neural-svg" viewBox="0 0 900 680" role="img" aria-label="Eureka neural modules joined by animated gold data paths">
    <defs><radialGradient id="orbhaze"><stop stop-color="#f1c677" stop-opacity=".17"/><stop offset=".5" stop-color="#37d7aa" stop-opacity=".08"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
    <radialGradient id="orbcore"><stop stop-color="#fff4d1"/><stop offset=".12" stop-color="#ffe1a0"/><stop offset=".35" stop-color="#c99c4d"/><stop offset=".8" stop-color="#173e35"/><stop offset="1" stop-color="#07110d"/></radialGradient>
    <filter id="blurgold"><feGaussianBlur stdDeviation="9"/></filter></defs>
    <circle cx="410" cy="333" r="255" fill="url(#orbhaze)"/>
    <circle cx="410" cy="333" r="230" class="orb-ring ring-one"/>
    <circle cx="410" cy="333" r="183" class="orb-ring ring-two"/>
    <circle cx="410" cy="333" r="126" class="orb-ring ring-three"/>
    <circle cx="410" cy="333" r="87" class="orb-ring ring-four"/>
    <g class="neural-wires">'''+''.join(wires)+'''</g>
    <g class="neural-packets">'''+''.join(dots)+'''</g>
    <circle cx="410" cy="333" r="65" fill="#fac77e" opacity=".18" filter="url(#blurgold)" class="core-breath"/>
    <circle cx="410" cy="333" r="64" class="orb-shell"/>
    <circle cx="410" cy="333" r="40" fill="url(#orbcore)" class="orb-heart"/>
    <path d="M410 297 L442 332 L410 368 L378 332 Z" stroke="#ffe2a3" stroke-width="1.8" fill="#0c1a18" opacity=".9"/>
    <circle cx="410" cy="333" r="7" fill="#fff6d5" class="pulse-center"/>
    <g class="neural-labels">'''+''.join(labels)+'''</g>
    <text x="410" y="420" text-anchor="middle" class="orb-label">EUREKA / CORE</text>
    </svg>
    <div class="holo-grid"></div><span class="orbit-readout">CORE SIGNAL <strong>◆</strong> NON-LIVE VISUALIZATION</span>
    </div>'''

def head(page,lang):
    copy=L[lang]; title,desc,_=copy['pages'][page]
    title=(f'Eureka Nexus 3.0 — {copy["slogan"]}' if page=='index' else f'{title} | Eureka Nexus')
    alternates=''.join(f'<link rel="alternate" hreflang="{esc(L[lc]["locale"])}" href="{esc(absolute(page,lc))}">' for lc in L)
    links=alternates+f'<link rel="alternate" hreflang="x-default" href="{absolute(page,"en")}">'
    return f'''<!doctype html><html lang="{esc(copy['locale'])}"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#040807"><meta name="description" content="{esc(desc)}">
<meta property="og:type" content="website"><meta property="og:site_name" content="Eureka Nexus"><meta property="og:title" content="{esc(title)}"><meta property="og:description" content="{esc(desc)}"><meta property="og:image" content="{BASE}/assets/og.png"><meta property="og:url" content="{absolute(page,lang)}"><meta name="twitter:card" content="summary_large_image">
<link rel="canonical" href="{absolute(page,lang)}">{links}
<link rel="icon" href="{asset(lang,'assets/mark.svg')}" type="image/svg+xml">
<link rel="stylesheet" href="{asset(lang,'assets/site.css')}">
<title>{esc(title)}</title>
<script src="{asset(lang,'assets/site.js')}" defer></script>
</head><body data-language="{lang}" data-page="{page}" class="page-{page}">
<a class="skip" href="#main">{esc(copy['intro'])}</a><canvas id="network-canvas" aria-hidden="true"></canvas>
<div class="grain" aria-hidden="true"></div>'''

def header(page,lang):
    c=L[lang]
    links=''.join(f'<a href="{url(pg,lang)}"'+ (' aria-current="page"' if pg==page else '')+f'>{esc(c["nav"][i])}</a>' for i,pg in enumerate(PAGES[:8]))
    langs=''.join(f'<a href="{url(page,lc)}" data-lang-choice="{lc}" lang="{esc(L[lc]["locale"])}" '+('aria-current="true" ' if lc==lang else '')+f'>{esc(L[lc]["name"])}</a>' for lc in L)
    return f'''<header class="site-header"><div class="header-inner">
    <a href="{url('index',lang)}" class="brand" aria-label="Eureka Nexus home"><span class="brand-symbol"><img src="{asset(lang,'assets/mark.svg')}" alt=""></span><span class="brand-copy">EUREKA<span>NEXUS</span><small>BEYOND REALITY / 03</small></span></a>
    <nav class="desktop-nav" aria-label="{esc(c['language'])}">{links}</nav>
    <div class="header-right"><details class="language-picker"><summary aria-label="{esc(c['language'])}"><span class="lang-glyph">◎</span> {lang.upper()} <span aria-hidden="true">⌄</span></summary><div class="language-options">{langs}</div></details>
    <button class="menu-btn" type="button" data-menu-btn aria-controls="mobile-nav" aria-expanded="false" aria-label="Menu"><span></span><span></span><span></span></button></div>
    </div><nav class="mobile-nav" id="mobile-nav" aria-label="Mobile navigation">{links}</nav></header>'''

def ribbon(lang):
    c=L[lang]
    return f'<div class="system-ribbon"><span class="ribbon-dot"></span><span>EUREKA AI <b>{esc(c["status"])}</b></span><span class="ribbon-sep">/</span><span>COMPUTE NETWORK <b>{esc(c["prepare"])}</b></span><span class="ribbon-sep">/</span><span>EUREKA WORLD <b>{esc(c["concept"])}</b></span></div>'

def hero(page,lang):
    c=L[lang]; title,lead,_=c['pages'][page]
    is_home=page=='index'
    h=(f'{esc(c["hero"])}<br><em>{esc(c["hero2"])}</em>' if is_home else esc(title))
    txt=c['herolead'] if is_home else lead
    tag=esc(c['eyebrow'] if is_home else c['nav'][PAGES.index(page)].upper())
    btn1=url('eureka-ai' if is_home else 'desenvolvimento',lang)
    btn2=url('desenvolvimento' if is_home else 'index',lang)
    lab1=c['enter'] if is_home else c['development'];lab2=c['development'] if is_home else c['explore']
    return f'''<section class="hero {'home-hero' if is_home else 'inner-hero'}" id="top">
    <div class="hero-shadow" aria-hidden="true"></div><div class="hero-frame" aria-hidden="true"></div>
    <div class="hero-layout"><div class="hero-content">
    <p class="kicker reveal"><span class="gold-dot"></span>{tag}</p>
    <h1 class="hero-title reveal">{h}</h1>
    <p class="hero-description reveal">{esc(txt)}</p>
    <div class="hero-buttons reveal"><a class="action-primary" href="{btn1}">{esc(lab1)} <span>↗</span></a><a class="action-ghost" href="{btn2}">{esc(lab2)} <span>→</span></a></div>
    <div class="hero-footnote reveal"><span>▱ {esc(c['status'])}</span><span>✦ {esc(c['planned'])}: VOICE / VISION / WORLD</span></div>
    </div><div class="hero-visual" aria-hidden="true">{neural_graph(lang)}</div></div>
    <div class="hero-bottom"><span>01 / EUREKA NEXUS</span><span class="scroll-cue">SCROLL TO DISCOVER <b>↓</b></span><span>{esc(c['slogan'])}</span></div>
    </section>'''

def quote_section(lang):
    c=L[lang]
    return f'''<section class="section pledge-section"><div class="container pledge"><div><p class="section-eyebrow">// EUREKA / PRINCIPLE</p><h2 class="pledge-title reveal">{esc(c['learn'])}</h2></div><p class="pledge-copy reveal">{esc(c['frontier_text'])}</p></div></section>'''

def cards_section(page,lang):
    c=L[lang];title,lead,cards=c['pages'][page]
    intro=(c['paths'] if page=='index' else c['nav'][PAGES.index(page)].upper())
    card_html=''.join(f'''<article class="system-card reveal"><div class="card-top"><span>0{i+1} / SYSTEM</span><span class="card-cross">✣</span></div><h3>{esc(t)}</h3><p>{esc(body)}</p><div class="card-line"></div></article>''' for i,(t,body) in enumerate(cards))
    return f'''<section class="section panels-section" id="ecosystem"><div class="container"><div class="section-heading reveal"><p class="section-eyebrow">// {esc(intro)}</p><h2>{esc(c['architecture'] if page=='index' else title)}</h2><p>{esc(c['archlead'] if page=='index' else lead)}</p></div><div class="systems-grid">{card_html}</div></div></section>'''

def architecture_section(lang):
    c=L[lang]
    item_html=''.join(f'<div class="architecture-item reveal"><span class="arch-index">0{i+1}</span><span class="arch-dot"></span><div><h3>{esc(c["modules"][i])}</h3><p>{esc(c["module_blurbs"][i])}</p></div></div>' for i in range(8))
    return f'''<section class="section architecture-section" id="architecture"><div class="container architecture-layout"><div class="architecture-copy reveal"><p class="section-eyebrow">// EUREKA / NEURAL ARCHITECTURE</p><h2>{esc(c['architecture'])}</h2><p>{esc(c['archlead'])}</p><a class="text-link" href="{url('eureka-ai',lang)}">{esc(c['core_cta'])} ↗</a><div class="signal-block"><span class="signal-led"></span> {esc(c['frontier'])}</div></div><div class="architecture-list">{item_html}</div></div></section>'''

def roadmap_section(lang):
    c=L[lang]
    timeline=''.join(f'<div class="roadmap-step reveal"><span class="roadmap-number">0{i+1}</span><span class="roadmap-rail"></span><div><h3>{esc(t)}</h3><p>{esc(c["stage_desc"][i])}</p><span class="stage-label">{esc(c["status"] if i==0 else c["prepare"] if i<3 else c["planned"])}</span></div></div>' for i,t in enumerate(c['stages']))
    return f'''<section class="section timeline-section"><div class="container"><div class="section-heading reveal"><p class="section-eyebrow">// ROADMAP / NON-LIVE</p><h2>{esc(c['roadmap'])}</h2><p>{esc(c['roadmaplead'])}</p></div><div class="roadmap-grid">{timeline}</div></div></section>'''

def path_section(lang):
    c=L[lang]
    pages=['eureka-ai','mundo-digital','compute-node','desenvolvimento','investidores','futura-moeda']
    panels=''.join(f'''<a class="portal-card reveal" href="{url(pg,lang)}"><span class="portal-sequence">{i+1:02d} / 06</span><span class="portal-glyph">{['◈','⌘','⟡','⌁','⌬','✦'][i]}</span><h3>{esc(c['nav'][PAGES.index(pg)])}</h3><span class="portal-link">{esc(c['view'])} ↗</span></a>''' for i,pg in enumerate(pages))
    return f'''<section class="section portal-section"><div class="container"><div class="section-heading reveal"><p class="section-eyebrow">// 06 DOORS / ONE SYSTEM</p><h2>{esc(c['paths'])}</h2><p>{esc(c['pathlead'])}</p></div><div class="portal-grid">{panels}</div></div></section>'''

def dev_gallery(lang):
    c=L[lang]
    return f'''<section class="section gallery-section" id="real-evidence"><div class="container"><div class="section-heading reveal"><p class="section-eyebrow">// LAB / VERIFIABLE EVIDENCE</p><h2>{esc(c['gallery'])}</h2><p>{esc(c['gallerylead'])}</p></div><div class="gallery-grid" data-media-gallery data-empty="{esc(c['gallery_empty'])}"><div class="gallery-empty"><span class="empty-signal">✧</span><p>{esc(c['gallery_empty'])}</p><span class="stage-label">{esc(c['prepare'])}</span></div></div></div></section>'''

def investor_form(lang):
    c=L[lang]
    interest_types=['Eureka AI','Compute Network','Research / Investigación','Strategic partnership']
    options=''.join(f'<option value="{esc(x)}">{esc(x)}</option>' for x in interest_types)
    return f'''<section class="section form-section"><div class="container form-layout"><div class="reveal"><p class="section-eyebrow">// CONTACT / PARTNERSHIPS</p><h2>{esc(c['invest_mail'])}</h2><p>{esc(c['no_offer'])}</p><p>{esc(c['email_notice'])}</p></div><form class="contact-form reveal" data-interest-form data-recipient="{EMAIL}"><label>{esc(c['name_label'])}<input name="name" required maxlength="90" autocomplete="name"></label><label>Email<input type="email" name="email" required maxlength="180" autocomplete="email"></label><label>{esc(c['country'])}<input name="country" maxlength="75" autocomplete="country-name"></label><label>{esc(c['interest'])}<select name="type">{options}</select></label><label class="form-wide">{esc(c['message'])}<textarea name="message" maxlength="1600" rows="5" required></textarea></label><label class="agree form-wide"><input type="checkbox" name="agree" required><span>{esc(c['agree'])}</span></label><button class="action-primary form-wide" type="submit">{esc(c['invest_mail'])} ↗</button></form></div></section>'''

def contact_section(lang):
    c=L[lang]
    links=f'<a href="mailto:{EMAIL}">{EMAIL} ↗</a>' + ''.join(f'<a href="{esc(link)}" rel="noopener noreferrer" target="_blank">{name} ↗</a>' for name,link in SOCIAL)
    return f'''<section class="section contact-section"><div class="container contact-layout"><div class="reveal"><p class="section-eyebrow">// OFFICIAL CHANNELS</p><h2>{esc(c['quicklinks'])}</h2><p>{esc(c['contact_lead'])}</p></div><div class="contact-links reveal">{links}</div></div></section>'''

def legal_summary(lang):
    c=L[lang]
    return f'<div class="notice-box reveal"><span>ⓘ</span><p>{esc(c["legal_notice"])} {esc(c["no_offer"])} {esc(c["frontier_text"])}</p></div>'

def footer(lang):
    c=L[lang]
    quick=''.join(f'<a href="{url(p,lang)}">{esc(c["nav"][i])}</a>' for i,p in enumerate(PAGES[1:8],1))
    policy=f'<a href="{url("privacidade",lang)}">{esc(c["nav"][8])}</a><a href="{url("termos",lang)}">{esc(c["nav"][9])}</a>'
    social=''.join(f'<a href="{link}" target="_blank" rel="noopener noreferrer">{name} ↗</a>' for name,link in SOCIAL)
    return f'''<footer class="site-footer"><div class="container"><div class="footer-main"><div class="footer-brand"><p class="section-eyebrow">EUREKA NEXUS / 03</p><h2>{esc(c['footer'])}</h2><p>{esc(c['footer_status'])}</p><span class="footer-micro">PORTUGAL · RESEARCH & DEVELOPMENT</span></div><div class="footer-menu"><h3>EXPLORE</h3>{quick}</div><div class="footer-menu"><h3>CONNECT</h3>{social}<a href="mailto:{EMAIL}">{EMAIL}</a>{policy}</div></div><div class="footer-base"><span>© 2026 EUREKA NEXUS</span><span>BEYOND REALITY · {esc(c['status'])}</span><a href="#top">↑ TOP</a></div></div></footer>'''

def auto_language(lang,page):
    if lang!='pt' or page!='index': return ''
    # Only first entry to the root; explicit selected language gets precedence.
    return '''<script>(function(){try{if(sessionStorage.getItem('eureka_language_navigation'))return;
var selected=localStorage.getItem('eureka_preferred_language');
if(selected==='pt')return;
var candidates=selected?[selected]:((navigator.languages&&navigator.languages.length)?Array.from(navigator.languages):[navigator.language||'en']);
var m='en';for(var j=0;j<candidates.length;j++){var b=String(candidates[j]).toLowerCase(),v=b.startsWith('zh')?'zh':b.split('-')[0];if(['pt','en','es','fr','de','ru','zh'].indexOf(v)!==-1){m=v;break;}}
if(m!=='pt'){sessionStorage.setItem('eureka_language_navigation','1');location.replace('/'+m+'/');}
}catch(e){}})();</script>'''

def build_page(page,lang):
    out=head(page,lang)+auto_language(lang,page)+header(page,lang)+'<main id="main">'+hero(page,lang)
    out+=ribbon(lang)+quote_section(lang)+cards_section(page,lang)
    if page in ('index','eureka-ai','compute-node','mundo-digital'):out+=architecture_section(lang)
    if page in ('index','desenvolvimento','compute-node'):out+=roadmap_section(lang)
    if page in ('index','mundo-digital'):out+=path_section(lang)
    if page=='desenvolvimento':out+=dev_gallery(lang)
    if page=='investidores':out+=investor_form(lang)
    if page in ('contactos','investidores'):out+=contact_section(lang)
    if page in ('termos','privacidade','futura-moeda','investidores'):out+=f'<section class="section disclaimer-section"><div class="container">{legal_summary(lang)}</div></section>'
    out+='</main>'+footer(lang)+'</body></html>'
    return out

def main():
    count=0
    for lang in L:
        folder=ROOT if lang=='pt' else ROOT/lang
        folder.mkdir(parents=True,exist_ok=True)
        for page in PAGES:
            filename='index.html' if page=='index' else SLUGS[page]
            (folder/filename).write_text(build_page(page,lang),encoding='utf-8')
            count+=1
    (ROOT/'CNAME').write_text('eurekanexus.pt\n')
    (ROOT/'.nojekyll').touch()
    (ROOT/'robots.txt').write_text('User-agent: *\nAllow: /\nSitemap: https://eurekanexus.pt/sitemap.xml\n')
    sitemap='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    for pg in PAGES:
        for lang in L:sitemap+=f'  <url><loc>{absolute(pg,lang)}</loc></url>\n'
    sitemap+='</urlset>\n'
    (ROOT/'sitemap.xml').write_text(sitemap,encoding='utf-8')
    (ROOT/'404.html').write_text('<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>404 | Eureka Nexus</title><style>body{background:#040807;color:#e7e9e3;font:18px/1.6 system-ui;margin:12vh auto;max-width:650px;padding:30px}a{color:#f2c677}</style><p>404 / SYSTEM</p><h1>Page not found / Página não encontrada</h1><p><a href="/">Eureka Nexus ↗</a></p></html>')
    print(f'HTML_FILES={count}')
    print('LANGUAGES='+','.join(L))
    print('BUILD=PASS')

if __name__=='__main__':main()
