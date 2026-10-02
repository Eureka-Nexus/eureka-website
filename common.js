(()=>{
  const C=window.EUREKA_CONFIG||{};
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const fmt=n=>new Intl.NumberFormat(document.documentElement.lang||'pt-PT').format(Number(n||0));
  const short=a=>a&&a.length>18?`${a.slice(0,8)}…${a.slice(-6)}`:(a||'—');
  const dict={
    pt:{home:'Início',ai:'Eureka AI',agent:'Agent',capital:'Capital',miner:'Miner',network:'Rede',company:'Investidores & Equipa',downloads:'Downloads',contracts:'Contratos',comingSoon:'Brevemente',learnMore:'Saber mais',contact:'Contacto',privacy:'Privacidade',terms:'Termos'},
    en:{home:'Home',ai:'Eureka AI',agent:'Agent',capital:'Capital',miner:'Miner',network:'Network',company:'Investors & Team',downloads:'Downloads',contracts:'Contracts',comingSoon:'Coming soon',learnMore:'Learn more',contact:'Contact',privacy:'Privacy',terms:'Terms'},
    es:{home:'Inicio',ai:'Eureka AI',agent:'Agent',capital:'Capital',miner:'Miner',network:'Red',company:'Inversores y Equipo',downloads:'Descargas',contracts:'Contratos',comingSoon:'Próximamente',learnMore:'Saber más',contact:'Contacto',privacy:'Privacidad',terms:'Términos'},
    fr:{home:'Accueil',ai:'Eureka AI',agent:'Agent',capital:'Capital',miner:'Miner',network:'Réseau',company:'Investisseurs & Équipe',downloads:'Téléchargements',contracts:'Contrats',comingSoon:'Bientôt',learnMore:'En savoir plus',contact:'Contact',privacy:'Confidentialité',terms:'Conditions'},
    de:{home:'Start',ai:'Eureka AI',agent:'Agent',capital:'Capital',miner:'Miner',network:'Netzwerk',company:'Investoren & Team',downloads:'Downloads',contracts:'Verträge',comingSoon:'Demnächst',learnMore:'Mehr erfahren',contact:'Kontakt',privacy:'Datenschutz',terms:'Bedingungen'}
  };
  const supported=['pt','en'];
  function applyCommon(lang){const d=dict[lang]||dict.pt;$$('[data-common]').forEach(el=>{const v=d[el.dataset.common];if(v)el.textContent=v});document.documentElement.lang=lang;const sel=$('#langSelect');if(sel)sel.value=lang;localStorage.setItem('eureka-lang',lang);window.dispatchEvent(new CustomEvent('eureka:language',{detail:{lang}}));}
  window.Eureka={config:C,fmt,short,lang:()=>localStorage.getItem('eureka-lang')||'pt',setLanguage:applyCommon};
  const initial=supported.includes(localStorage.getItem('eureka-lang'))?localStorage.getItem('eureka-lang'):'pt';applyCommon(initial);
  $('#langSelect')?.addEventListener('change',e=>applyCommon(e.target.value));
  $('#menuBtn')?.addEventListener('click',()=>$('#nav')?.classList.toggle('open'));
  $$('#nav a').forEach(a=>a.addEventListener('click',()=>$('#nav')?.classList.remove('open')));
  const canvas=$('#space');if(canvas){const ctx=canvas.getContext('2d');let w=0,h=0,dpr=1,stars=[];function resize(){dpr=Math.min(devicePixelRatio||1,1.5);w=innerWidth;h=innerHeight;canvas.width=w*dpr;canvas.height=h*dpr;canvas.style.width=w+'px';canvas.style.height=h+'px';ctx.setTransform(dpr,0,0,dpr,0,0);stars=Array.from({length:Math.min(150,Math.floor(w*h/10500))},()=>({x:Math.random()*w,y:Math.random()*h,r:Math.random()*1.1+.2,a:Math.random()*.55+.12,s:Math.random()*.08+.018}))}function draw(){ctx.clearRect(0,0,w,h);for(const s of stars){s.y+=s.s;if(s.y>h){s.y=0;s.x=Math.random()*w}ctx.beginPath();ctx.fillStyle=`rgba(185,193,255,${s.a})`;ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fill()}requestAnimationFrame(draw)}resize();draw();addEventListener('resize',resize,{passive:true})}
  const io=('IntersectionObserver'in window)?new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.07,rootMargin:'0px 0px -30px'}):null;$$('.reveal').forEach(el=>io?io.observe(el):el.classList.add('visible'));
  $$('[data-config-email]').forEach(el=>{const key=el.dataset.configEmail,val=C[key];if(val){el.textContent=val;if(el.tagName==='A')el.href=`mailto:${val}`}});
  $$('[data-contract]').forEach(el=>el.textContent=C.tokenContract||'—');$$('[data-fee-wallet]').forEach(el=>el.textContent=C.founderRevenueWallet||'—');$$('[data-genesis-market]').forEach(el=>el.textContent=C.genesisMarket||'—');
  $$('[data-copy]').forEach(btn=>btn.addEventListener('click',async()=>{const key=btn.dataset.copy;const value=C[key]||btn.dataset.copyValue||'';if(!value)return;try{await navigator.clipboard.writeText(value);const t=btn.textContent;btn.textContent='✓';setTimeout(()=>btn.textContent=t,1000)}catch{}}));
  $$('[data-link]').forEach(el=>{const u=C[el.dataset.link];if(u)el.href=u});
})();
