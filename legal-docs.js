(()=>{
  'use strict';

  const DOCS={
    privacy:{
      title:{
        pt:'Eureka Nexus · Privacidade',
        en:'Eureka Nexus · Privacy',
        es:'Eureka Nexus · Privacidad',
        fr:'Eureka Nexus · Confidentialité'
      },

      description:{
        pt:'Política de privacidade Eureka Nexus e Founding Pre-Round.',
        en:'Eureka Nexus and Founding Pre-Round privacy policy.',
        es:'Política de privacidad de Eureka Nexus y Founding Pre-Round.',
        fr:'Politique de confidentialité Eureka Nexus et Founding Pre-Round.'
      },

      brand:{
        pt:'PRIVACIDADE',
        en:'PRIVACY',
        es:'PRIVACIDAD',
        fr:'CONFIDENTIALITÉ'
      },

      eyebrow:{
        pt:'PRIVACIDADE · DADOS',
        en:'PRIVACY · DATA',
        es:'PRIVACIDAD · DATOS',
        fr:'CONFIDENTIALITÉ · DONNÉES'
      },

      hero:{
        pt:'Privacidade <span class="gradient">desde a conceção.</span>',
        en:'Privacy <span class="gradient">by design.</span>',
        es:'Privacidad <span class="gradient">desde el diseño.</span>',
        fr:'Confidentialité <span class="gradient">dès la conception.</span>'
      },

      lead:{
        pt:'Informação sobre os dados tratados pelo site Eureka Nexus e pela Founding Pre-Round.',
        en:'Information about data processed by the Eureka Nexus website and the Founding Pre-Round.',
        es:'Información sobre los datos tratados por el sitio Eureka Nexus y la Founding Pre-Round.',
        fr:'Informations sur les données traitées par le site Eureka Nexus et la Founding Pre-Round.'
      },

      version:{
        pt:'Versão de privacidade',
        en:'Privacy version',
        es:'Versión de privacidad',
        fr:'Version de confidentialité'
      },

      versionId:'PREROUND-PRIVACY-2026-10-05-v1'
    },

    terms:{
      title:{
        pt:'Eureka Nexus · Termos & Risco',
        en:'Eureka Nexus · Terms & Risk',
        es:'Eureka Nexus · Términos y Riesgo',
        fr:'Eureka Nexus · Conditions & Risques'
      },

      description:{
        pt:'Termos, condições e informação de risco da Eureka Nexus Founding Pre-Round.',
        en:'Terms, conditions and risk information for the Eureka Nexus Founding Pre-Round.',
        es:'Términos, condiciones e información de riesgo de la Eureka Nexus Founding Pre-Round.',
        fr:'Conditions et informations sur les risques de la Eureka Nexus Founding Pre-Round.'
      },

      brand:{
        pt:'TERMOS & RISCO',
        en:'TERMS & RISK',
        es:'TÉRMINOS Y RIESGO',
        fr:'CONDITIONS & RISQUES'
      },

      eyebrow:{
        pt:'TERMOS · FOUNDING PRE-ROUND · RISCO',
        en:'TERMS · FOUNDING PRE-ROUND · RISK',
        es:'TÉRMINOS · FOUNDING PRE-ROUND · RIESGO',
        fr:'CONDITIONS · FOUNDING PRE-ROUND · RISQUE'
      },

      hero:{
        pt:'Construir com ambição. <span class="gradient">Comunicar com clareza.</span>',
        en:'Build with ambition. <span class="gradient">Communicate with clarity.</span>',
        es:'Construir con ambición. <span class="gradient">Comunicar con claridad.</span>',
        fr:'Construire avec ambition. <span class="gradient">Communiquer avec clarté.</span>'
      },

      lead:{
        pt:'Termos indicativos, funcionamento da Founding Pre-Round, blockchain, EKNX e informação de risco.',
        en:'Indicative terms, Founding Pre-Round operation, blockchain, EKNX and risk information.',
        es:'Términos indicativos, funcionamiento de la Founding Pre-Round, blockchain, EKNX e información de riesgo.',
        fr:'Conditions indicatives, fonctionnement de la Founding Pre-Round, blockchain, EKNX et informations sur les risques.'
      },

      version:{
        pt:'Versão dos termos',
        en:'Terms version',
        es:'Versión de los términos',
        fr:'Version des conditions'
      },

      versionId:'PREROUND-TERMS-2026-10-05-v1'
    }
  };

  const supported=['pt','en','es','fr'];

  const docName=
    document.body?.dataset?.legalDoc;

  if(!docName || !DOCS[docName]){
    return;
  }

  const cfg=DOCS[docName];

  function currentLang(){
    const value=
      window.Eureka?.lang?.() ||
      localStorage.getItem('eureka-lang') ||
      'pt';

    return supported.includes(value)
      ? value
      : 'pt';
  }

  function apply(lang){
    const selected=
      supported.includes(lang)
        ? lang
        : 'pt';

    document.documentElement.lang=selected;

    document
      .querySelectorAll('[data-lang-panel]')
      .forEach(panel=>{
        panel.hidden=
          panel.dataset.langPanel!==selected;
      });

    document.title=
      cfg.title[selected] ||
      cfg.title.pt;

    const meta=
      document.querySelector(
        'meta[name="description"]'
      );

    if(meta){
      meta.content=
        cfg.description[selected] ||
        cfg.description.pt;
    }

    const brand=
      document.querySelector(
        '.brand small'
      );

    if(brand){
      brand.textContent=
        cfg.brand[selected] ||
        cfg.brand.pt;
    }

    const eyebrow=
      document.querySelector(
        '.page-hero .eyebrow'
      );

    if(eyebrow){
      eyebrow.textContent=
        cfg.eyebrow[selected] ||
        cfg.eyebrow.pt;
    }

    const hero=
      document.querySelector(
        '.page-hero h1'
      );

    if(hero){
      hero.innerHTML=
        cfg.hero[selected] ||
        cfg.hero.pt;
    }

    const lead=
      document.querySelector(
        '.page-hero p'
      );

    if(lead){
      lead.textContent=
        cfg.lead[selected] ||
        cfg.lead.pt;
    }

    const footerVersion=
      document.querySelector(
        '.footer-bottom span:last-child'
      );

    if(footerVersion){
      footerVersion.textContent=
        `${cfg.version[selected] || cfg.version.pt} · ${cfg.versionId}`;
    }
  }

  addEventListener(
    'eureka:language',
    event=>apply(
      event.detail.lang
    )
  );

  apply(currentLang());
})();
