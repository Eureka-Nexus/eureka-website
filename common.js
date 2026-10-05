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
  window.Eureka={config:C,fmt,short,escape:value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),lang:()=>localStorage.getItem('eureka-lang')||'pt',setLanguage:applyCommon};
  const initial=supported.includes(localStorage.getItem('eureka-lang'))?localStorage.getItem('eureka-lang'):'pt';applyCommon(initial);
  $('#langSelect')?.addEventListener('change',e=>applyCommon(e.target.value));
  const menu=$('#menuBtn'), nav=$('#nav');
  if(menu&&nav){menu.setAttribute('aria-controls','nav');menu.setAttribute('aria-expanded','false');menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open))});addEventListener('keydown',e=>{if(e.key==='Escape'){nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}})}
  $$('#nav a').forEach(a=>a.addEventListener('click',()=>{nav?.classList.remove('open');menu?.setAttribute('aria-expanded','false')}));
  $$('[data-config-email]').forEach(el=>{const key=el.dataset.configEmail,val=C[key];if(val){el.textContent=val;if(el.tagName==='A')el.href=`mailto:${val}`}});
  $$('[data-contract]').forEach(el=>el.textContent=C.tokenContract||'—');$$('[data-fee-wallet]').forEach(el=>el.textContent=C.founderRevenueWallet||'—');$$('[data-genesis-market]').forEach(el=>el.textContent=C.genesisMarket||'—');
  $$('[data-copy]').forEach(btn=>btn.addEventListener('click',async()=>{const key=btn.dataset.copy;const value=C[key]||btn.dataset.copyValue||'';if(!value)return;try{await navigator.clipboard.writeText(value);const t=btn.textContent;btn.textContent='✓';setTimeout(()=>btn.textContent=t,1000)}catch{}}));
  $$('[data-link]').forEach(el=>{const u=C[el.dataset.link];if(u)el.href=u});

  // EUREKA_SOCIAL_BAR_2026
  const socialNetworks=[
    {key:'socialGithub', name:'GitHub', icon:'assets/social/github.svg'},
    {key:'socialX', name:'X', icon:'assets/social/x.svg'},
    {key:'socialReddit', name:'Reddit', icon:'assets/social/reddit.svg'},
    {key:'socialYoutube', name:'YouTube', icon:'assets/social/youtube.svg'},
    {key:'socialDiscord', name:'Discord', icon:'assets/social/discord.svg'},
    {key:'socialTelegram', name:'Telegram', icon:'assets/social/telegram.svg'},
    {key:'socialTiktok', name:'TikTok', icon:'assets/social/tiktok.svg'},
    {key:'socialLinkedin', name:'LinkedIn', icon:'assets/social/linkedin.svg'}
  ];

  const socialBlock=document.createElement('div');
  socialBlock.className='shell social-hub';
  socialBlock.innerHTML=
    '<div class="social-hub-head">'+
      '<div><span class="social-eyebrow">EUREKA NEXUS / SOCIAL</span>'+
      '<strong>Follow the project</strong></div>'+
      '<span class="social-soon-note">Official channels only</span>'+
    '</div>'+
    '<div class="social-links"></div>';

  const socialLinks=socialBlock.querySelector('.social-links');

  socialNetworks.forEach(n=>{
    const status=C[n.key+'Status']||'soon';
    const url=C[n.key+'Url']||'';

    const item=document.createElement(status==='live'&&url?'a':'div');
    item.className='social-link '+(status==='live'&&url?'live':'soon');

    if(status==='live'&&url){
      item.href=url;
      item.target='_blank';
      item.rel='noopener noreferrer';
    }

    item.innerHTML=
      '<span class="social-mark"><img src="'+n.icon+'" alt="" loading="lazy"></span>'+
      '<span class="social-copy"><b>'+n.name+'</b>'+
      '<small>'+(status==='live'?'Official':'Brevemente')+'</small></span>';

    socialLinks.appendChild(item);
  });

  const footer=document.querySelector('.footer');

  if(footer){
    footer.insertBefore(socialBlock, footer.firstChild);
  }

})();
