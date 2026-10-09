(() => {
"use strict";

/* =========================================================
   EKNX GENESIS LIVE
   Read-only BNB Smart Chain market telemetry
   No wallet connection. No transactions.
   ========================================================= */

const MARKET =
  "0x837dBE1D3b67e8315127c36a119E163e713ee73D";


const SELECTOR_SOLD       = "0x02c7e7af";
const SELECTOR_RESERVE    = "0x1b73576a";
const SELECTOR_LAUNCHED   = "0x8091f3bf";
const SELECTOR_GRADUATED  = "0xe7c2b772";


const E18  = 10n ** 18n;
const SALE = 650000n * E18;

const RPCS = [
  "https://bsc-rpc.publicnode.com",
  "https://1rpc.io/bnb",
  "https://bsc-dataseed.binance.org/"
];

/*
  RPCs específicos para histórico de eventos.
  PublicNode exige token pessoal para archive/log history,
  por isso não o usamos aqui.
*/

let rpcId = 1;
let refreshing = false;
let activeRpc = "";

const SCRIPT = document.currentScript;

const TEXT = {
  pt:{
    live:"EKNX GENESIS · LIVE ON-CHAIN",
    title:"GENESIS <strong>LIVE</strong>",
    price:"PREÇO AGORA · 1 EKNX",
    sold:"EKNX ADQUIRIDOS",
    buyers:"PARTICIPANTES",
    reserve:"RESERVA GENESIS",
    last:"ÚLTIMA COMPRA",
    action:"ABRIR GENESIS",
    noBuys:"Ainda sem compras públicas",
    activityUnavailable:"Atividade a sincronizar",
    offline:"Ligação BSC indisponível",
    notLaunched:"Market indisponível",
    graduated:"GRADUADO"
  },

  en:{
    live:"EKNX GENESIS · LIVE ON-CHAIN",
    title:"GENESIS <strong>LIVE</strong>",
    price:"PRICE NOW · 1 EKNX",
    sold:"EKNX ACQUIRED",
    buyers:"PARTICIPANTS",
    reserve:"GENESIS RESERVE",
    last:"LATEST BUY",
    action:"OPEN GENESIS",
    noBuys:"No public purchases yet",
    activityUnavailable:"Activity syncing",
    offline:"BSC connection unavailable",
    notLaunched:"Market unavailable",
    graduated:"GRADUATED"
  }
};

function lang(){
  const l =
    localStorage.getItem("eureka-lang") ||
    document.documentElement.lang ||
    "pt";

  return l === "en" ? "en" : "pt";
}

function t(){
  return TEXT[lang()];
}

function installCss(){
  if(document.getElementById("eknxGenesisLiveCss")) return;

  const href = SCRIPT
    ? new URL("genesis-live.css", SCRIPT.src).href
    : "genesis-live.css";

  const link = document.createElement("link");

  link.id = "eknxGenesisLiveCss";
  link.rel = "stylesheet";
  link.href = href;

  document.head.appendChild(link);
}

async function callEndpoint(url,method,params){
  const controller = new AbortController();
  const timer = setTimeout(
    () => controller.abort(),
    6500
  );

  try{
    const response = await fetch(url,{
      method:"POST",
      mode:"cors",
      cache:"no-store",
      headers:{
        "content-type":"application/json"
      },
      body:JSON.stringify({
        jsonrpc:"2.0",
        id:rpcId++,
        method,
        params
      }),
      signal:controller.signal
    });

    if(!response.ok){
      throw new Error(
        "HTTP "+response.status
      );
    }

    const json = await response.json();

    if(json.error){
      throw new Error(
        json.error.message ||
        "JSON-RPC error"
      );
    }

    activeRpc = url;

    return json.result;

  }finally{
    clearTimeout(timer);
  }
}

async function rpc(method,params=[]){
  let lastError = null;

  for(const endpoint of RPCS){
    try{
      return await callEndpoint(
        endpoint,
        method,
        params
      );
    }catch(error){
      lastError = error;

      console.warn(
        "[EKNX Genesis RPC]",
        endpoint,
        error?.message || error
      );
    }
  }

  throw lastError ||
    new Error("All BSC RPC endpoints failed");
}

function fromHex(v){
  if(!v || v === "0x") return 0n;
  return BigInt(v);
}

function boolHex(v){
  return fromHex(v) !== 0n;
}

function formatUnits(
  value,
  decimals=18,
  maxFraction=8
){
  const base =
    10n ** BigInt(decimals);

  const whole =
    value / base;

  let fraction =
    (value % base)
      .toString()
      .padStart(decimals,"0")
      .slice(0,maxFraction)
      .replace(/0+$/,"");

  return (
    whole.toLocaleString("en-US") +
    (fraction ? "."+fraction : "")
  );
}

function formatEknx(value){
  const whole =
    Number(value / E18);

  const fraction =
    Number(value % E18) / 1e18;

  const number =
    whole + fraction;

  return new Intl.NumberFormat(
    lang()==="pt" ? "pt-PT" : "en-US",
    {
      maximumFractionDigits:
        number < 100 ? 2 : 0
    }
  ).format(number);
}

function reserveAt(x){
  if(x < 0n) x = 0n;
  if(x > SALE) x = SALE;

  const linear =
    (11n * E18 * x) /
    SALE;

  const quadratic =
    (14n * E18 * x * x) /
    SALE /
    SALE;

  return linear + quadratic;
}

function currentOneTokenPrice(sold){
  if(sold >= SALE) return 0n;

  const after =
    sold + E18 > SALE
      ? SALE
      : sold + E18;

  return (
    reserveAt(after) -
    reserveAt(sold)
  );
}

function shortWallet(address){
  if(!address) return "—";

  return (
    address.slice(0,6) +
    "…" +
    address.slice(-4)
  );
}

function createUi(){
  if(document.getElementById(
    "eknxGenesisLive"
  )) return;

  document.body.classList.add(
    "eknx-genesis-live-active"
  );

  const root =
    document.createElement("aside");

  root.id = "eknxGenesisLive";

  root.innerHTML = `
    <div class="egl-shell">
      <div class="egl-main">

        <div class="egl-brand">
          <div class="egl-live">
            <i class="egl-dot"></i>
            <span data-egl="live"></span>
          </div>
          <span
            class="egl-title"
            data-egl-html="title">
          </span>
        </div>

        <div class="egl-stat egl-stat-price">
          <span data-egl="price"></span>
          <b id="eglPrice">—</b>
        </div>

        <div class="egl-stat">
          <span data-egl="sold"></span>
          <b id="eglSold">—</b>
        </div>

        <div class="egl-stat egl-buyers">
          <span data-egl="buyers"></span>
          <b id="eglBuyers">—</b>
        </div>

        <div class="egl-stat egl-reserve">
          <span data-egl="reserve"></span>
          <b id="eglReserve">—</b>
        </div>

        <div class="egl-stat egl-last">
          <span data-egl="last"></span>
          <b id="eglLast">—</b>
        </div>

        <a class="egl-action"
           href="market.html"
           data-egl="action">
        </a>

      </div>

      <div class="egl-progress-wrap">
        <div
          id="eglProgress"
          class="egl-progress">
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(root);

  applyLanguage();
}

function applyLanguage(){
  const d = t();

  document
    .querySelectorAll("[data-egl]")
    .forEach(el=>{
      const key =
        el.dataset.egl;

      if(d[key] !== undefined){
        el.textContent = d[key];
      }
    });

  document
    .querySelectorAll("[data-egl-html]")
    .forEach(el=>{
      const key =
        el.dataset.eglHtml;

      if(d[key] !== undefined){
        el.innerHTML = d[key];
      }
    });
}

async function ethCall(selector){
  return rpc(
    "eth_call",
    [{
      to:MARKET,
      data:selector
    },"latest"]
  );
}

async function loadCoreMarket(){

  /*
    Deliberately independent calls.

    A failure in historical event indexing
    must NEVER hide current contract state.
  */

  const [
    soldRaw,
    reserveRaw,
    launchedRaw,
    graduatedRaw
  ] = await Promise.all([
    ethCall(SELECTOR_SOLD),
    ethCall(SELECTOR_RESERVE),
    ethCall(SELECTOR_LAUNCHED),
    ethCall(SELECTOR_GRADUATED)
  ]);

  return {
    sold:fromHex(soldRaw),
    reserve:fromHex(reserveRaw),
    launched:boolHex(launchedRaw),
    graduated:boolHex(graduatedRaw)
  };
}

async function loadActivity(){

  try{

    const url =
      window.EUREKA_CONFIG
        ?.genesisActivityUrl ||
      "https://pool.eurekanexus.pt/v1/genesis/activity";


    const controller =
      new AbortController();

    const timer =
      setTimeout(
        ()=>{
          controller.abort();
        },
        10000
      );


    let response;

    try{

      response =
        await fetch(
          url,
          {
            cache:"no-store",
            signal:
              controller.signal,
            headers:{
              "Accept":
                "application/json"
            }
          }
        );

    }finally{

      clearTimeout(
        timer
      );

    }


    if(!response.ok){

      throw new Error(
        "Genesis activity HTTP "+
        response.status
      );

    }


    const data =
      await response.json();


    if(
      !data ||
      data.ok !== true
    ){

      throw new Error(
        "Invalid Genesis activity response"
      );

    }


    const buyers =
      Number(
        data.participants
      );

    const purchases =
      Number(
        data.purchases
      );


    if(
      !Number.isSafeInteger(buyers) ||
      buyers < 0 ||
      !Number.isSafeInteger(purchases) ||
      purchases < 0
    ){

      throw new Error(
        "Invalid Genesis activity counters"
      );

    }


    let last =
      null;


    if(
      data.last_purchase
    ){

      const purchase =
        data.last_purchase;


      const amount =
        BigInt(
          String(
            purchase.amount_wei
          )
        );


      const cost =
        BigInt(
          String(
            purchase.bnb_cost_wei
          )
        );


      const netSold =
        BigInt(
          String(
            purchase.net_sold_wei
          )
        );


      const buyer =
        String(
          purchase.wallet || ""
        );


      const txHash =
        String(
          purchase.tx_hash || ""
        );


      /*
        Mantemos os nomes usados pela
        implementação anterior e alguns
        aliases úteis para compatibilidade.
      */
      last = {

        buyer,
        amount,
        cost,
        netSold,
        txHash,

        wallet:
          buyer,

        tokenAmount:
          amount,

        bnbCost:
          cost,

        transactionHash:
          txHash,

        blockNumber:
          Number(
            purchase.block_number || 0
          ),

        logIndex:
          Number(
            purchase.log_index || 0
          )

      };

    }


    console.info(
      "[EKNX Genesis activity API]",
      "purchases:",
      purchases,
      "participants:",
      buyers,
      "syncing:",
      data.syncing === true
    );


    return {

      available:true,

      buyers,

      purchases,

      last,

      syncing:
        data.syncing === true,

      indexedThroughBlock:
        Number(
          data.indexed_through_block ||
          0
        )

    };


  }catch(error){

    console.warn(
      "[EKNX Genesis activity API]",
      error?.message ||
      error
    );


    return {

      available:false,

      buyers:0,

      purchases:0,

      last:null,

      error:
        error?.message ||
        String(error)

    };

  }

}

function renderCore(data){

  const d = t();

  const price =
    document.getElementById(
      "eglPrice"
    );

  const sold =
    document.getElementById(
      "eglSold"
    );

  const reserve =
    document.getElementById(
      "eglReserve"
    );

  const progress =
    document.getElementById(
      "eglProgress"
    );

  if(!data.launched){

    if(price){
      price.textContent =
        d.notLaunched;
    }

    return;
  }

  if(data.graduated){

    if(price){
      price.textContent =
        d.graduated;
    }

    if(reserve){
      reserve.textContent =
        d.graduated;
    }

  }else{

    const one =
      currentOneTokenPrice(
        data.sold
      );

    if(price){
      price.textContent =
        formatUnits(
          one,
          18,
          10
        ) +
        " BNB";
    }

    if(reserve){
      reserve.textContent =
        formatUnits(
          data.reserve,
          18,
          6
        ) +
        " / 25 BNB";
    }
  }

  if(sold){
    sold.textContent =
      formatEknx(
        data.sold
      ) +
      " / 650.000";
  }

  if(progress){

    const bp =
      data.sold *
      10000n /
      SALE;

    const pct =
      Number(bp) /
      100;

    progress.style.width =
      Math.max(
        0,
        Math.min(100,pct)
      )+"%";
  }

  document
    .getElementById(
      "eknxGenesisLive"
    )
    ?.classList
    .remove("egl-error");
}

function renderActivity(data){

  const d = t();

  const buyers =
    document.getElementById(
      "eglBuyers"
    );

  const last =
    document.getElementById(
      "eglLast"
    );

  if(!data.available){

    if(buyers){
      buyers.textContent = "—";
    }

    if(last){
      last.textContent =
        d.activityUnavailable;
    }

    return;
  }

  if(buyers){
    buyers.textContent =
      String(data.buyers);
  }

  if(last){

    if(!data.last){

      last.textContent =
        d.noBuys;

    }else{

      last.textContent =
        formatEknx(
          data.last.amount
        ) +
        " EKNX · " +
        shortWallet(
          data.last.buyer
        );
    }
  }
}

function renderOffline(error){

  const d = t();

  const root =
    document.getElementById(
      "eknxGenesisLive"
    );

  root?.classList.add(
    "egl-error"
  );

  const price =
    document.getElementById(
      "eglPrice"
    );

  if(price){
    price.textContent =
      d.offline;
  }

  console.error(
    "[EKNX Genesis core]",
    error
  );
}

async function refresh(){

  if(refreshing) return;

  refreshing = true;

  try{

    const core =
      await loadCoreMarket();

    renderCore(core);

    if(core.sold === 0n){

      renderActivity({
        available:true,
        buyers:0,
        last:null
      });

    }else{

      const activity =
        await loadActivity();

      renderActivity(
        activity
      );
    }

    console.info(
      "[EKNX Genesis]",
      "RPC:",
      activeRpc,
      "sold:",
      formatEknx(core.sold),
      "reserve:",
      formatUnits(
        core.reserve,
        18,
        6
      ),
      "BNB"
    );

  }catch(error){

    renderOffline(error);

  }finally{

    refreshing = false;

  }
}

function boot(){

  installCss();
  createUi();

  window.EKNXGenesisLive = {
    refresh,
    rpc:()=>activeRpc
  };

  addEventListener(
    "eureka:language",
    ()=>{
      applyLanguage();
      refresh();
    }
  );

  refresh();

  setInterval(
    refresh,
    20000
  );
}

if(
  document.readyState ===
  "loading"
){
  document.addEventListener(
    "DOMContentLoaded",
    boot,
    {once:true}
  );
}else{
  boot();
}

})();


/* ==========================================================
   EKNX GENESIS · MARKET PRESENTATION
   Animated ticker + Genesis coin
   ========================================================== */

(() => {

  const COPY = {

    pt:
      "🇵🇹  EKNX GENESIS LIVE  ·  650.000 EKNX NA GENESIS CURVE  ·  350.000 EKNX RESERVADOS PARA LIQUIDEZ DEX  ·  GRADUAÇÃO A 25 BNB  ·  BNB SMART CHAIN  ·  LIVE ON-CHAIN  🇵🇹",

    en:
      "🇵🇹  EKNX GENESIS LIVE  ·  650,000 EKNX IN THE GENESIS CURVE  ·  350,000 EKNX RESERVED FOR DEX LIQUIDITY  ·  GRADUATION AT 25 BNB  ·  BNB SMART CHAIN  ·  LIVE ON-CHAIN  🇵🇹"

  };


  function currentLang(){

    const value =
      localStorage.getItem("eureka-lang") ||
      document.documentElement.lang ||
      "pt";

    return value === "en"
      ? "en"
      : "pt";
  }


  function renderTicker(){

    const banner =
      document.querySelector(
        ".market-launch-banner-2026"
      );

    if(!banner) return;

    banner.setAttribute(
      "href",
      "market.html"
    );

    const copy =
      COPY[currentLang()];

    banner.innerHTML = `
      <div class="eureka-genesis-ticker-viewport">
        <div class="eureka-genesis-ticker-track">

          <span class="eureka-genesis-ticker-segment">
            ${copy}
          </span>

          <span class="eureka-genesis-ticker-segment"
                aria-hidden="true">
            ${copy}
          </span>

        </div>
      </div>
    `;
  }


  function addGenesisCoin(){

    const section =
      document.getElementById("market");

    if(!section) return;

    const head =
      section.querySelector(".section-head");

    if(!head) return;

    head.classList.add(
      "genesis-head-2026"
    );

    let figure =
      head.querySelector(
        ".genesis-coin-visual-2026"
      );

    if(!figure){

      figure =
        document.createElement("figure");

      figure.className =
        "genesis-coin-visual-2026";

      figure.innerHTML = `
        <div class="genesis-coin-orbit"></div>

        <img
          src="assets/eknx-genesis-coin.png"
          alt="EKNX · Eureka Nexus"
          loading="lazy">

        <span>
          EKNX · GENESIS
        </span>
      `;

      const img =
        figure.querySelector("img");

      img.addEventListener(
        "error",
        ()=>{
          figure.classList.add(
            "coin-image-missing"
          );
        }
      );

      head.appendChild(
        figure
      );
    }
  }


  function apply(){

    renderTicker();
    addGenesisCoin();

  }


  addEventListener(
    "eureka:language",
    apply
  );


  if(
    document.readyState ===
    "loading"
  ){

    document.addEventListener(
      "DOMContentLoaded",
      apply,
      {once:true}
    );

  }else{

    apply();

  }

})();
