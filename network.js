(()=>{
  'use strict';

  const C=window.EUREKA_CONFIG||{};
  const $=s=>document.querySelector(s);

  const short=a=>
    a&&a.length>18
      ? `${a.slice(0,8)}…${a.slice(-6)}`
      : (a||'—');

  const esc=window.Eureka.escape;

  const TEXT={
    pt:{
      online:'● Online',
      idle:'Inativo',
      noMiners:'Ainda não existem dados públicos de mineração.',
      noPayouts:'Ainda não existem pagamentos automáticos.',
      unavailable:'Dados indisponíveis'
    },
    en:{
      online:'● Online',
      idle:'Idle',
      noMiners:'No public mining data yet.',
      noPayouts:'No automatic payouts yet.',
      unavailable:'Data unavailable'
    },
    es:{
      online:'● Online',
      idle:'Inactivo',
      noMiners:'Todavía no hay datos públicos de minería.',
      noPayouts:'Todavía no hay pagos automáticos.',
      unavailable:'Datos no disponibles'
    },
    fr:{
      online:'● En ligne',
      idle:'Inactif',
      noMiners:'Aucune donnée publique de minage pour le moment.',
      noPayouts:'Aucun paiement automatique pour le moment.',
      unavailable:'Données indisponibles'
    }
  };

  const LOCALE={
    pt:'pt-PT',
    en:'en-GB',
    es:'es-ES',
    fr:'fr-FR'
  };

  let lang=
    window.Eureka?.lang?.() ||
    localStorage.getItem('eureka-lang') ||
    'pt';

  let lastStats=null;
  let lastNetwork=null;

  const els={
    connected:$('#sConnected'),
    workers:$('#sWorkers'),
    wallets:$('#sWallets'),
    epoch:$('#sEpoch'),
    state:$('#networkState'),
    body:$('#topMinersBody'),
    payouts:$('#payoutsBody')
  };

  const t=key=>
    TEXT[lang]?.[key] ??
    TEXT.pt[key] ??
    key;

  function renderStats(data){
    lastStats=data;

    const ps=data.public_stats||data;

    els.connected.textContent=
      ps.connected_miners??0;

    els.workers.textContent=
      ps.active_workers??0;

    els.wallets.textContent=
      ps.total_wallets_ever??0;

    els.state.textContent='API ONLINE';

    $('#networkDot')?.classList.add('connected');

    const rows=
      Array.isArray(ps.top_miners)
        ? ps.top_miners
        : [];

    els.body.innerHTML=
      rows.length
        ? rows.slice(0,20).map(r=>`
          <tr>
            <td>${esc(r.rank??'—')}</td>
            <td class="wallet-short">${esc(short(r.wallet))}</td>
            <td>${Number(r.accepted_shares||0).toLocaleString(LOCALE[lang]||'pt-PT')}</td>
            <td>${esc(r.cumulative_eknx||'0')} EKNX</td>
            <td>${r.active?t('online'):t('idle')}</td>
          </tr>
        `).join('')
        : `<tr><td colspan="5" class="empty">${t('noMiners')}</td></tr>`;

    // Production API compatibility:
    // latest_payouts is preferred. latest_claims is accepted only as
    // a legacy backend field name; the public UI represents automatic payouts.
    const payouts=
      Array.isArray(ps.latest_payouts)
        ? ps.latest_payouts
        : Array.isArray(ps.latest_claims)
          ? ps.latest_claims
          : [];

    els.payouts.innerHTML=
      payouts.length
        ? payouts.slice(0,20).map(r=>`
          <tr>
            <td>${
              r.block_time
                ? new Date(r.block_time).toLocaleString(
                    LOCALE[lang]||'pt-PT'
                  )
                : '—'
            }</td>
            <td class="wallet-short">${esc(short(r.wallet))}</td>
            <td>${esc(r.amount_eknx||r.amount||'0')} EKNX</td>
            <td>${esc(r.settlement_day??'—')}</td>
            <td>${
              r.tx_hash
                ? `<a class="text-link"
                     href="https://bscscan.com/tx/${encodeURIComponent(r.tx_hash)}"
                     target="_blank"
                     rel="noopener">BscScan</a>`
                : '—'
            }</td>
          </tr>
        `).join('')
        : `<tr><td colspan="5" class="empty">${t('noPayouts')}</td></tr>`;
  }

  function renderNetwork(data){
    lastNetwork=data;
    els.epoch.textContent=
      data.current_epoch ??
      data.epoch ??
      '—';
  }

  async function refresh(){
    if(!C.publicStatsUrl&&!C.networkUrl) return;

    try{
      const jobs=[];

      if(C.publicStatsUrl){
        jobs.push(
          fetch(
            C.publicStatsUrl,
            {cache:'no-store'}
          )
          .then(r=>{
            if(!r.ok) throw Error('stats');
            return r.json();
          })
          .then(renderStats)
        );
      }

      if(C.networkUrl){
        jobs.push(
          fetch(
            C.networkUrl,
            {cache:'no-store'}
          )
          .then(r=>{
            if(!r.ok) throw Error('network');
            return r.json();
          })
          .then(renderNetwork)
        );
      }

      await Promise.all(jobs);
    }catch{
      els.state.textContent=t('unavailable');

      [
        'connected',
        'workers',
        'wallets',
        'epoch'
      ].forEach(
        key=>els[key].textContent='—'
      );

      $('#networkDot')
        ?.classList
        .remove('connected');
    }
  }

  addEventListener(
    'eureka:language',
    event=>{
      lang=event.detail.lang||'pt';

      if(lastStats){
        renderStats(lastStats);
      }

      if(lastNetwork){
        renderNetwork(lastNetwork);
      }
    }
  );

  refresh();

  if(C.publicStatsUrl||C.networkUrl){
    setInterval(
      refresh,
      Math.max(
        5000,
        C.statsRefreshMs||15000
      )
    );
  }
})();
