(() => {
  'use strict';
  document.documentElement.classList.add('js');
  const mediaReduced = matchMedia('(prefers-reduced-motion: reduce)');
  const smallScreen = matchMedia('(max-width: 700px)');
  const menuBtn = document.querySelector('[data-menu-btn]');
  const mobileNav = document.getElementById('mobile-nav');
  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', () => {
      const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', String(!expanded));
      mobileNav.classList.toggle('is-open', !expanded);
    });
    for (const link of mobileNav.querySelectorAll('a')) link.addEventListener('click', () => {
      mobileNav.classList.remove('is-open');
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  }
  for (const item of document.querySelectorAll('[data-lang-choice]')) item.addEventListener('click', () => {
    try { localStorage.setItem('eureka_preferred_language', item.dataset.langChoice); sessionStorage.setItem('eureka_language_navigation', '1'); } catch (_) {}
  });
  const reveals = document.querySelectorAll('.reveal');
  if (mediaReduced.matches || !('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('visible'));
  } else {
    const observer = new IntersectionObserver(entries => {
      for (const item of entries) if (item.isIntersecting) {
        item.target.classList.add('visible'); observer.unobserve(item.target);
      }
    }, { rootMargin: '0px 0px -30px 0px', threshold: .07 });
    reveals.forEach(el => observer.observe(el));
  }
  const svg = document.querySelector('.neural-wrap');
  if (svg && !mediaReduced.matches && !smallScreen.matches) {
    let px = 0, py = 0;
    window.addEventListener('pointermove', event => {
      px = (event.clientX / innerWidth - .5) * 13;
      py = (event.clientY / innerHeight - .5) * 13;
      svg.style.transform = `translate3d(${px}px,${py}px,0)`;
    }, {passive:true});
  }

  // Moving golden particles: visualization only; no fake live telemetry.
  const canvas = document.getElementById('network-canvas');
  if (canvas && !mediaReduced.matches) {
    const ctx = canvas.getContext('2d', { alpha: true });
    if (ctx) {
      let nodes = [], w = 0, h = 0, raf = 0, visible = !document.hidden, last = 0;
      const resize = () => {
        const dpr = Math.min(devicePixelRatio || 1, 1.6);
        w = innerWidth; h = innerHeight;
        canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const count = Math.min(smallScreen.matches ? 24 : 75, Math.max(16, Math.round(w * h / 22000)));
        nodes = Array.from({ length: count }, () => ({
          x: Math.random()*w, y: Math.random()*h, vx:(Math.random()-.5)*.17, vy:(Math.random()-.5)*.17, r:Math.random()*1.5+.5, gold:Math.random()>.2
        }));
      };
      const render = stamp => {
        if (!visible) return;
        raf = requestAnimationFrame(render);
        if (stamp-last < 38) return;
        const step = Math.min((stamp-last)/38 || 1, 3); last = stamp;
        ctx.clearRect(0, 0, w, h);
        for (let i=0;i<nodes.length;i++) {
          const a=nodes[i];a.x+=a.vx*step;a.y+=a.vy*step;
          if(a.x<0)a.x=w;if(a.x>w)a.x=0;if(a.y<0)a.y=h;if(a.y>h)a.y=0;
          ctx.beginPath();ctx.fillStyle=a.gold?'rgba(255,211,139,.66)':'rgba(102,216,164,.48)';ctx.arc(a.x,a.y,a.r,0,Math.PI*2);ctx.fill();
          if (i>0 && i%2===0) {
            const b=nodes[i-1],dx=a.x-b.x,dy=a.y-b.y,dist=dx*dx+dy*dy;
            if(dist<18000){ctx.beginPath();ctx.strokeStyle=`rgba(235,189,111,${.11*(1-dist/18000)})`;ctx.lineWidth=.6;ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}
          }
        }
      };
      document.addEventListener('visibilitychange', () => {
        visible = !document.hidden;
        if (visible) {last=0;cancelAnimationFrame(raf);raf=requestAnimationFrame(render);} else cancelAnimationFrame(raf);
      });
      window.addEventListener('resize', resize, {passive:true});
      resize();raf=requestAnimationFrame(render);
      mediaReduced.addEventListener?.('change', event => {if(event.matches) {visible=false;cancelAnimationFrame(raf);ctx.clearRect(0,0,w,h);} });
    }
  }

  const gallery = document.querySelector('[data-media-gallery]');
  if(gallery) {
    const language = document.body.dataset.language;
    const base = language==='pt'?'assets/media/':'../assets/media/';
    fetch(base+'manifest.json',{cache:'no-store'}).then(r=>r.ok?r.json():Promise.reject(Error('manifest'))).then(records=>{
      if(!Array.isArray(records)||records.length===0)return;
      for(const record of records){
        if(!record||typeof record.file!=='string'||!/^[\w.-]+\.(?:webp|png|jpe?g|mp4|webm)$/i.test(record.file))continue;
        const title=String(record.title?.[language]||record.title?.en||record.file).slice(0,160);
        const figure=document.createElement('figure');let el;
        if(/\.(mp4|webm)$/i.test(record.file)){
          el=document.createElement('video');el.controls=true;el.preload='metadata';el.playsInline=true;
        }else{el=document.createElement('img');el.loading='lazy';el.alt=title;}
        el.src=base+record.file;el.addEventListener('error',()=>figure.remove());figure.appendChild(el);
        const caption=document.createElement('figcaption');caption.textContent=title;figure.appendChild(caption);gallery.appendChild(figure);
      }
      if(gallery.children.length>1)gallery.querySelector('.gallery-empty')?.remove();
    }).catch(()=>{});
  }
  for (const form of document.querySelectorAll('[data-interest-form]')) form.addEventListener('submit',e=>{
    e.preventDefault();if(!form.reportValidity())return;
    const data=new FormData(form);
    const keys=['name','email','country','type','message'];
    const labels=['Name / Organization','Email','Country','Interest','Message'];
    const body=keys.map((key,i)=>labels[i]+': '+String(data.get(key)||'').slice(0,1800)).join('\n');
    location.href='mailto:'+(form.dataset.recipient||'official@eurekanexus.pt')+'?subject='+encodeURIComponent('Eureka Nexus — Partnership inquiry')+'&body='+encodeURIComponent(body);
  });
})();
