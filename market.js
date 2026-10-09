(() => {
"use strict";


const MARKET =
  "0x837dBE1D3b67e8315127c36a119E163e713ee73D";

const TOKEN =
  "0xF54913A8d5E2AEBD0B62c6411cCf1b5B4aB069c9";

const CHAIN_ID_HEX = "0x38";

const BSC_SCAN =
  "https://bscscan.com/tx/";

const RPCS = [
  "https://bsc-rpc.publicnode.com",
  "https://1rpc.io/bnb",
  "https://bsc-dataseed.binance.org/"
];

const SELECTOR_QUOTE_BUY =
  "0x4beb394c";

const SELECTOR_BUY =
  "0xd20d0a2f";

const SELECTOR_CURVE_POSITION =
  "0xdb61914f";

const SELECTOR_SOLD =
  "0x02c7e7af";

const SELECTOR_RESERVE =
  "0x1b73576a";

const SELECTOR_LAUNCHED =
  "0x8091f3bf";

const SELECTOR_GRADUATED =
  "0xe7c2b772";

const SELECTOR_BALANCE_OF =
  "0x70a08231";


const E18 = 10n ** 18n;
const SALE = 650000n * E18;

let account = null;
let currentState = null;
let quoteTimer = null;
let pendingTx = false;
let rpcId = 1;
let walletProvider = null;
let connectedWalletName = "";

const boundWalletProviders = new WeakSet();

const discoveredWallets = new Map();

let walletEventsBound = false;


const COPY = {

  pt:{

    live:"● EKNX GENESIS · LIVE ON-CHAIN",

    title:
      "Compra EKNX diretamente através da Genesis Curve.",

    lead:
      "O Genesis Market está ativo na BNB Smart Chain. A quantidade escolhida é cotada diretamente pelo smart contract antes da confirmação na tua carteira.",

    onchain:
      "SMART CONTRACT ON-CHAIN",

    marketContract:
      "Genesis Market Contract",

    currentPrice:
      "PREÇO ATUAL · 1 EKNX",

    sold:
      "EKNX ADQUIRIDOS",

    reserve:
      "RESERVA GENESIS",

    remaining:
      "DISPONÍVEIS NA CURVE",

    progress:
      "Progresso da Genesis Curve",

    buyTitle:
      "Comprar EKNX",

    amountLabel:
      "Quantidade EKNX",

    quote:
      "Cotação on-chain",

    maxPayment:
      "Máximo enviado",

    refundInfo:
      "O contrato devolve automaticamente qualquer BNB enviado acima do custo final da compra.",

    connect:
      "LIGAR CARTEIRA",

    connected:
      "CARTEIRA LIGADA",

    wallet:
      "Carteira",

    curvePosition:
      "Posição Genesis",

    mainnetConfirm:
      "Compreendo que esta operação é realizada na BNB Smart Chain Mainnet e utiliza BNB real.",

    buyButton:
      "COMPRAR EKNX",

    howTitle:
      "Como funciona",

    how1:
      "Escolhe a quantidade de EKNX. A cotação vem diretamente do contrato.",

    how2:
      "Liga uma carteira compatível com BNB Smart Chain.",

    how3:
      "Confirma a transação na própria carteira. O site nunca recebe a tua chave privada.",

    how4:
      "Depois da confirmação on-chain, os EKNX são transferidos diretamente pelo Genesis Market para a tua carteira.",

    structure:
      "Estrutura Genesis",

    risk:
      "EKNX é um criptoativo e o seu valor pode variar. Consulta os termos e informação de risco antes de participar.",

    enterAmount:
      "Introduz uma quantidade válida de EKNX.",

    minAmount:
      "A compra mínima é 1 EKNX.",

    exceedsRemaining:
      "A quantidade excede o EKNX disponível na Genesis Curve.",

    walletMissing:
      "Não foi encontrada uma carteira Web3. Usa MetaMask, Trust Wallet ou outro browser compatível.",

    connecting:
      "A ligar à carteira…",

    wrongNetwork:
      "A mudar para BNB Smart Chain…",

    ready:
      "Carteira pronta. Confirma a quantidade e a operação Mainnet.",

    confirmMainnet:
      "Confirma primeiro que compreendes que esta é uma transação Mainnet com BNB real.",

    quoting:
      "A atualizar cotação on-chain…",

    walletConfirm:
      "Confirma a compra na tua carteira…",

    submitted:
      "Transação enviada. A aguardar confirmação on-chain…",

    confirmed:
      "Compra confirmada on-chain.",

    rejected:
      "A transação foi cancelada na carteira.",

    failed:
      "Não foi possível concluir a transação.",

    notLive:
      "O Genesis Market não está disponível para compras.",

    graduated:
      "O Genesis Market já graduou para a fase seguinte.",

    loading:
      "A carregar…"

  },


  en:{

    live:"● EKNX GENESIS · LIVE ON-CHAIN",

    title:
      "Buy EKNX directly through the Genesis Curve.",

    lead:
      "The Genesis Market is active on BNB Smart Chain. Your selected amount is quoted directly by the smart contract before you confirm the transaction in your wallet.",

    onchain:
      "SMART CONTRACT ON-CHAIN",

    marketContract:
      "Genesis Market Contract",

    currentPrice:
      "CURRENT PRICE · 1 EKNX",

    sold:
      "EKNX ACQUIRED",

    reserve:
      "GENESIS RESERVE",

    remaining:
      "AVAILABLE IN CURVE",

    progress:
      "Genesis Curve progress",

    buyTitle:
      "Buy EKNX",

    amountLabel:
      "EKNX amount",

    quote:
      "On-chain quote",

    maxPayment:
      "Maximum sent",

    refundInfo:
      "The contract automatically refunds any BNB sent above the final purchase cost.",

    connect:
      "CONNECT WALLET",

    connected:
      "WALLET CONNECTED",

    wallet:
      "Wallet",

    curvePosition:
      "Genesis position",

    mainnetConfirm:
      "I understand this transaction takes place on BNB Smart Chain Mainnet and uses real BNB.",

    buyButton:
      "BUY EKNX",

    howTitle:
      "How it works",

    how1:
      "Choose the EKNX amount. The quote is read directly from the contract.",

    how2:
      "Connect a wallet compatible with BNB Smart Chain.",

    how3:
      "Confirm the transaction in your wallet. The website never receives your private key.",

    how4:
      "After on-chain confirmation, EKNX is transferred directly by the Genesis Market to your wallet.",

    structure:
      "Genesis structure",

    risk:
      "EKNX is a crypto-asset and its value can vary. Review the terms and risk information before participating.",

    enterAmount:
      "Enter a valid EKNX amount.",

    minAmount:
      "The minimum purchase is 1 EKNX.",

    exceedsRemaining:
      "The amount exceeds the EKNX available in the Genesis Curve.",

    walletMissing:
      "No Web3 wallet was detected. Use MetaMask, Trust Wallet or another compatible browser.",

    connecting:
      "Connecting wallet…",

    wrongNetwork:
      "Switching to BNB Smart Chain…",

    ready:
      "Wallet ready. Confirm the amount and the Mainnet transaction.",

    confirmMainnet:
      "Confirm first that you understand this is a Mainnet transaction using real BNB.",

    quoting:
      "Updating on-chain quote…",

    walletConfirm:
      "Confirm the purchase in your wallet…",

    submitted:
      "Transaction submitted. Waiting for on-chain confirmation…",

    confirmed:
      "Purchase confirmed on-chain.",

    rejected:
      "The transaction was cancelled in the wallet.",

    failed:
      "The transaction could not be completed.",

    notLive:
      "The Genesis Market is not available for purchases.",

    graduated:
      "The Genesis Market has already graduated to the next phase.",

    loading:
      "Loading…"

  }

};


function lang(){

  return (
    localStorage.getItem("eureka-lang") === "en"
      ? "en"
      : "pt"
  );

}


function tx(){

  return COPY[lang()];

}


function applyLanguage(){

  const d = tx();

  document
    .querySelectorAll("[data-mk]")
    .forEach(el=>{

      const key =
        el.dataset.mk;

      if(d[key] !== undefined){

        el.textContent =
          d[key];

      }

    });


  const connect =
    document.getElementById(
      "connectWalletBtn"
    );

  if(connect && account){

    connect.textContent =
      d.connected;

  }

}


function pad64(value){

  return value
    .replace(/^0x/,"")
    .padStart(64,"0");

}


function encodeUint(value){

  return pad64(
    value.toString(16)
  );

}


function encodeAddress(address){

  return pad64(
    address
      .toLowerCase()
      .replace(/^0x/,"")
  );

}


function parseUnits(value){

  value =
    String(value)
      .trim()
      .replace(",", ".");

  if(
    !/^\d+(\.\d{0,18})?$/.test(value)
  ){

    throw new Error(
      tx().enterAmount
    );

  }

  let [
    whole,
    fraction = ""
  ] = value.split(".");

  fraction =
    fraction.padEnd(18,"0");

  return (
    BigInt(whole) * E18 +
    BigInt(fraction || "0")
  );

}


function rawUnits(value){

  const whole =
    value / E18;

  let fraction =
    (value % E18)
      .toString()
      .padStart(18,"0")
      .replace(/0+$/,"");

  return (
    whole.toString() +
    (fraction ? "."+fraction : "")
  );

}


function formatUnits(
  value,
  maxFraction=8
){

  const whole =
    value / E18;

  let fraction =
    (value % E18)
      .toString()
      .padStart(18,"0")
      .slice(0,maxFraction)
      .replace(/0+$/,"");

  return (
    whole.toLocaleString("en-US") +
    (fraction ? "."+fraction : "")
  );

}


function formatEknx(value){

  const number =
    Number(value) / 1e18;

  return new Intl.NumberFormat(
    lang()==="pt"
      ? "pt-PT"
      : "en-US",
    {
      maximumFractionDigits:
        number < 100
          ? 4
          : 0
    }
  ).format(number);

}


function toRpcHex(value){

  return "0x"+
    value.toString(16);

}


function fromRpcHex(value){

  if(
    !value ||
    value === "0x"
  ){

    return 0n;

  }

  return BigInt(value);

}


async function rpc(
  method,
  params=[]
){

  let lastError;

  for(const url of RPCS){

    try{

      const controller =
        new AbortController();

      const timer =
        setTimeout(
          ()=>controller.abort(),
          6500
        );

      const response =
        await fetch(
          url,
          {
            method:"POST",
            headers:{
              "content-type":
                "application/json"
            },
            body:JSON.stringify({
              jsonrpc:"2.0",
              id:rpcId++,
              method,
              params
            }),
            signal:
              controller.signal
          }
        );

      clearTimeout(timer);

      if(!response.ok){

        throw new Error(
          "HTTP "+
          response.status
        );

      }

      const json =
        await response.json();

      if(json.error){

        throw new Error(
          json.error.message ||
          "RPC error"
        );

      }

      return json.result;

    }catch(error){

      lastError =
        error;

    }

  }

  throw lastError ||
    new Error(
      "BSC RPC unavailable"
    );

}


async function ethCall(
  to,
  data
){

  return rpc(
    "eth_call",
    [{
      to,
      data
    },"latest"]
  );

}


async function contractUint(
  selector
){

  return fromRpcHex(
    await ethCall(
      MARKET,
      selector
    )
  );

}


async function readState(){

  const [
    sold,
    reserve,
    launchedRaw,
    graduatedRaw,
    priceOneRaw
  ] =
    await Promise.all([
      contractUint(
        SELECTOR_SOLD
      ),
      contractUint(
        SELECTOR_RESERVE
      ),
      contractUint(
        SELECTOR_LAUNCHED
      ),
      contractUint(
        SELECTOR_GRADUATED
      ),
      ethCall(
        MARKET,
        SELECTOR_QUOTE_BUY+
        encodeUint(E18)
      )
    ]);


  const launched =
    launchedRaw !== 0n;

  const graduated =
    graduatedRaw !== 0n;

  return {
    sold,
    reserve,
    launched,
    graduated,
    priceOne:
      fromRpcHex(
        priceOneRaw
      )
  };

}


function renderState(state){

  currentState =
    state;

  const remaining =
    state.sold < SALE
      ? SALE - state.sold
      : 0n;


  document
    .getElementById(
      "marketCurrentPrice"
    )
    .textContent =
      state.graduated
        ? tx().graduated
        : formatUnits(
            state.priceOne,
            12
          )+" BNB";


  document
    .getElementById(
      "marketSold"
    )
    .textContent =
      formatEknx(
        state.sold
      )+
      " / 650.000";


  document
    .getElementById(
      "marketReserve"
    )
    .textContent =
      formatUnits(
        state.reserve,
        6
      )+
      " / 25 BNB";


  document
    .getElementById(
      "marketRemaining"
    )
    .textContent =
      formatEknx(
        remaining
      )+
      " EKNX";


  const bp =
    state.sold *
    10000n /
    SALE;

  const percent =
    Number(bp) / 100;


  document
    .getElementById(
      "marketProgressText"
    )
    .textContent =
      percent.toFixed(2)+"%";


  document
    .getElementById(
      "marketProgressBar"
    )
    .style.width =
      Math.min(
        100,
        Math.max(
          0,
          percent
        )
      )+"%";


  const badge =
    document.getElementById(
      "marketStateBadge"
    );


  if(state.graduated){

    badge.textContent =
      "GRADUATED";

  }else if(state.launched){

    badge.textContent =
      "LIVE";

  }else{

    badge.textContent =
      "OFFLINE";

  }


  updateBuyButton();

}


async function refreshState(){

  try{

    renderState(
      await readState()
    );

  }catch(error){

    console.error(
      "[EKNX MARKET]",
      error
    );

    setStatus(
      "BSC RPC unavailable",
      "error"
    );

  }

}


async function quoteAmount(){

  const input =
    document.getElementById(
      "buyAmount"
    );


  const quoteEl =
    document.getElementById(
      "buyQuote"
    );


  const maxEl =
    document.getElementById(
      "buyMaxPayment"
    );


  if(
    !input.value.trim()
  ){

    quoteEl.textContent =
      "—";

    maxEl.textContent =
      "—";

    updateBuyButton();

    return null;

  }


  try{

    const amount =
      parseUnits(
        input.value
      );


    if(amount < E18){

      throw new Error(
        tx().minAmount
      );

    }


    if(
      currentState &&
      amount >
      SALE -
      currentState.sold
    ){

      throw new Error(
        tx().exceedsRemaining
      );

    }


    const raw =
      await ethCall(
        MARKET,
        SELECTOR_QUOTE_BUY+
        encodeUint(amount)
      );


    const cost =
      fromRpcHex(raw);


    const buffer =
      cost / 200n + 1n;


    const maxPayment =
      cost + buffer;


    quoteEl.textContent =
      formatUnits(
        cost,
        12
      )+
      " BNB";


    maxEl.textContent =
      formatUnits(
        maxPayment,
        12
      )+
      " BNB";


    input.dataset.amountWei =
      amount.toString();

    input.dataset.quoteWei =
      cost.toString();

    input.dataset.maxWei =
      maxPayment.toString();


    setStatus(
      "",
      ""
    );


    updateBuyButton();


    return {
      amount,
      cost,
      maxPayment
    };


  }catch(error){

    delete input.dataset.amountWei;
    delete input.dataset.quoteWei;
    delete input.dataset.maxWei;

    quoteEl.textContent =
      "—";

    maxEl.textContent =
      "—";

    setStatus(
      error.message,
      "error"
    );

    updateBuyButton();

    return null;

  }

}


function setStatus(
  message,
  type=""
){

  const el =
    document.getElementById(
      "tradeStatus"
    );

  el.textContent =
    message || "";

  el.className =
    "market-trade-status"+
    (
      type
        ? " "+type
        : ""
    );

}


function short(
  address
){

  return (
    address.slice(0,6)+
    "…"+
    address.slice(-4)
  );

}


const PREFERRED_WALLETS = [

  {
    id:"metamask",
    name:"MetaMask",
    match:(info,p)=>{

      const named =
        /metamask/i.test(info?.name || "") ||
        /metamask/i.test(info?.rdns || "");

      const incompatible =
        p?.isTrust === true ||
        p?.isTrustWallet === true ||
        p?.isCoinbaseWallet === true ||
        p?.isBinance === true ||
        p?.isOkxWallet === true ||
        p?.isBraveWallet === true;

      return (
        named ||
        (
          p?.isMetaMask === true &&
          !incompatible
        )
      );

    }
  },

  {
    id:"trust",
    name:"Trust Wallet",
    match:(info,p)=>
      /trust/i.test(info?.name || "") ||
      /trust/i.test(info?.rdns || "") ||
      p?.isTrust === true ||
      p?.isTrustWallet === true
  },

  {
    id:"binance",
    name:"Binance Wallet",
    match:(info,p)=>
      /binance/i.test(info?.name || "") ||
      /binance/i.test(info?.rdns || "") ||
      p?.isBinance === true
  },

  {
    id:"okx",
    name:"OKX Wallet",
    match:(info,p)=>
      /okx/i.test(info?.name || "") ||
      /okx/i.test(info?.rdns || "") ||
      p?.isOkxWallet === true
  },

  {
    id:"coinbase",
    name:"Coinbase Wallet",
    match:(info,p)=>
      /coinbase/i.test(info?.name || "") ||
      /coinbase/i.test(info?.rdns || "") ||
      p?.isCoinbaseWallet === true
  }

];


function walletKey(info, provider){

  if(info?.uuid){
    return info.uuid;
  }

  if(info?.rdns){
    return info.rdns;
  }

  if(provider?.isMetaMask){
    return "metamask";
  }

  if(
    provider?.isTrust ||
    provider?.isTrustWallet
  ){
    return "trust";
  }

  return (
    info?.name ||
    "wallet-"+discoveredWallets.size
  );

}


function walletDisplayName(info, provider){

  if(info?.name){
    return info.name;
  }

  if(provider?.isMetaMask){
    return "MetaMask";
  }

  if(
    provider?.isTrust ||
    provider?.isTrustWallet
  ){
    return "Trust Wallet";
  }

  if(provider?.isCoinbaseWallet){
    return "Coinbase Wallet";
  }

  if(provider?.isBraveWallet){
    return "Brave Wallet";
  }

  return "Web3 Wallet";
}



function strictWalletFamily(
  info,
  provider
){

  const name =
    String(
      info?.name || ""
    ).toLowerCase();


  const rdns =
    String(
      info?.rdns || ""
    ).toLowerCase();


  const identity =
    name + " " + rdns;


  /*
    EIP-6963 identity is the strongest signal.
  */

  if(/trust/.test(identity)){
    return "trust";
  }

  if(/binance/.test(identity)){
    return "binance";
  }

  if(/okx|okex/.test(identity)){
    return "okx";
  }

  if(/coinbase/.test(identity)){
    return "coinbase";
  }

  if(/metamask/.test(identity)){
    return "metamask";
  }


  /*
    Wallet-specific flags come next.
  */

  if(
    provider?.isTrust === true ||
    provider?.isTrustWallet === true
  ){
    return "trust";
  }


  if(
    provider?.isBinance === true ||
    provider?.isBinanceWallet === true
  ){
    return "binance";
  }


  if(
    provider?.isOkxWallet === true
  ){
    return "okx";
  }


  if(
    provider?.isCoinbaseWallet === true
  ){
    return "coinbase";
  }


  /*
    MetaMask MUST come last because other
    wallets may expose isMetaMask=true for
    compatibility.
  */

  if(
    provider?.isMetaMask === true
  ){
    return "metamask";
  }


  return "other";

}


function walletSelectionScore(
  wallet,
  family
){

  if(
    strictWalletFamily(
      wallet?.info,
      wallet?.provider
    ) !== family
  ){
    return -10000;
  }


  let score = 0;


  if(wallet?.info?.uuid){
    score += 100;
  }


  if(wallet?.info?.rdns){
    score += 80;
  }


  if(wallet?.info?.name){
    score += 60;
  }


  return score;

}


function registerWallet(
  info,
  provider
){

  if(
    !provider ||
    typeof provider.request !== "function"
  ){
    return;
  }


  const key =
    walletKey(
      info,
      provider
    );


  const existing =
    discoveredWallets.get(
      key
    );


  if(existing){

    if(
      !existing.providers
        .includes(provider)
    ){
      existing.providers.push(
        provider
      );
    }


    if(
      info &&
      Object.keys(info).length
    ){
      existing.info = {
        ...existing.info,
        ...info
      };
    }


    if(
      info?.name
    ){
      existing.name =
        info.name;
    }


    return;
  }


  discoveredWallets.set(
    key,
    {
      key,

      info:
        info || {},

      provider,

      providers:[
        provider
      ],

      name:
        walletDisplayName(
          info,
          provider
        )
    }
  );

}

function discoverLegacyWallets(){

  const injected =
    window.ethereum;


  if(injected){

    const providers =
      Array.isArray(
        injected.providers
      )
        ? injected.providers
        : [injected];


    providers.forEach(
      provider=>{

        registerWallet(
          {},
          provider
        );

      }
    );

  }


  /*
    Some extensions also expose a wallet-specific
    provider outside window.ethereum.

    Registering these gives us a second transport
    when the EIP-6963 proxy has a broken extension
    channel in Chrome/Edge.
  */

  const explicit = [

    {
      info:{
        name:"Trust Wallet",
        rdns:"com.trustwallet"
      },
      provider:
        window.trustwallet?.ethereum ||
        window.trustwallet
    },

    {
      info:{
        name:"Binance Wallet",
        rdns:"com.binance.wallet"
      },
      provider:
        window.binancew3w?.ethereum ||
        window.BinanceChain
    },

    {
      info:{
        name:"OKX Wallet",
        rdns:"com.okex.wallet"
      },
      provider:
        window.okxwallet
    },

    {
      info:{
        name:"Coinbase Wallet",
        rdns:"com.coinbase.wallet"
      },
      provider:
        window.coinbaseWalletExtension
    }

  ];


  explicit.forEach(
    entry=>{

      if(
        entry.provider &&
        typeof entry.provider.request ===
          "function"
      ){

        registerWallet(
          entry.info,
          entry.provider
        );

      }

    }
  );

}

function startWalletDiscovery(){

  window.addEventListener(
    "eip6963:announceProvider",
    event=>{

      const detail =
        event.detail;

      if(
        !detail?.provider
      ){
        return;
      }

      registerWallet(
        detail.info,
        detail.provider
      );

    }
  );


  /*
    Ask all EIP-6963 compatible wallets
    to identify themselves.
  */
  window.dispatchEvent(
    new Event(
      "eip6963:requestProvider"
    )
  );


  /*
    Fallback for older injected wallets.
  */
  discoverLegacyWallets();

}


function safeWalletIcon(info){

  const icon =
    info?.icon;

  if(
    typeof icon === "string" &&
    (
      icon.startsWith("data:image/") ||
      icon.startsWith("https://")
    )
  ){
    return icon;
  }

  return "";
}


function createWalletSelector(){

  let modal =
    document.getElementById(
      "eurekaWalletModal"
    );

  if(modal){
    return modal;
  }

  modal =
    document.createElement(
      "div"
    );

  modal.id =
    "eurekaWalletModal";

  modal.className =
    "eureka-wallet-modal";

  modal.hidden =
    true;

  modal.innerHTML = `
    <div
      class="eureka-wallet-backdrop"
      data-wallet-close>
    </div>

    <section
      class="eureka-wallet-dialog"
      role="dialog"
      aria-modal="true">

      <div class="eureka-wallet-head">

        <div>

          <span class="eureka-wallet-kicker">
            EKNX · GENESIS
          </span>

          <h2 id="walletDialogTitle"></h2>

          <p id="walletDialogLead"></p>

        </div>

        <button
          type="button"
          class="eureka-wallet-close"
          data-wallet-close>
          ×
        </button>

      </div>


      <div class="eureka-wallet-network">

        <span class="wallet-bnb-icon">
          BNB
        </span>

        <div>
          <b id="walletNetworkTitle">
            BNB SMART CHAIN MAINNET
          </b>

          <small>
            Chain ID 56 · BNB
          </small>
        </div>

        <span class="wallet-network-ok">
          ●
        </span>

      </div>


      <div
        id="preferredWalletOptions"
        class="eureka-wallet-options">
      </div>


      <div
        id="otherWalletBlock"
        class="other-wallet-block"
        hidden>

        <span
          id="otherWalletTitle"
          class="other-wallet-title">
        </span>

        <div
          id="otherWalletOptions"
          class="eureka-wallet-options">
        </div>

      </div>


      <div class="eureka-wallet-security">

        <b id="walletSecurityTitle"></b>

        <span id="walletSecurityText"></span>

      </div>

    </section>
  `;

  document.body.appendChild(
    modal
  );

  modal
    .querySelectorAll(
      "[data-wallet-close]"
    )
    .forEach(
      element=>
        element.addEventListener(
          "click",
          closeWalletSelector
        )
    );

  return modal;

}

function walletSelectorText(){

  if(lang()==="en"){

    return {
      title:"Choose your wallet",
      lead:"Select the wallet you want to use with EKNX Genesis Market.",
      detected:"DETECTED",
      missing:"NOT DETECTED",
      others:"OTHER DETECTED WALLETS",
      network:"BNB SMART CHAIN MAINNET",
      securityTitle:"Your keys remain in your wallet.",
      securityText:"Eureka Nexus never asks for your seed phrase or private key."
    };

  }

  return {
    title:"Escolhe a tua carteira",
    lead:"Seleciona a carteira que queres utilizar no EKNX Genesis Market.",
    detected:"DETETADA",
    missing:"NÃO DETETADA",
    others:"OUTRAS CARTEIRAS DETETADAS",
    network:"BNB SMART CHAIN MAINNET",
    securityTitle:"As tuas chaves permanecem na carteira.",
    securityText:"Eureka Nexus nunca pede seed phrase nem chave privada."
  };

}

function renderWalletSelector(){

  const modal =
    createWalletSelector();

  const copy =
    walletSelectorText();


  document
    .getElementById(
      "walletDialogTitle"
    )
    .textContent =
      copy.title;


  document
    .getElementById(
      "walletDialogLead"
    )
    .textContent =
      copy.lead;


  document
    .getElementById(
      "walletNetworkTitle"
    )
    .textContent =
      copy.network;


  document
    .getElementById(
      "walletSecurityTitle"
    )
    .textContent =
      copy.securityTitle;


  document
    .getElementById(
      "walletSecurityText"
    )
    .textContent =
      copy.securityText;


  document
    .getElementById(
      "otherWalletTitle"
    )
    .textContent =
      copy.others;


  const preferredContainer =
    document.getElementById(
      "preferredWalletOptions"
    );


  const otherContainer =
    document.getElementById(
      "otherWalletOptions"
    );


  preferredContainer.innerHTML = "";
  otherContainer.innerHTML = "";


  const all =
    Array.from(
      discoveredWallets.values()
    );


  const used =
    new Set();


  function createOption(
    name,
    wallet
  ){

    const detected =
      Boolean(wallet);


    const button =
      document.createElement(
        "button"
      );


    button.type =
      "button";


    button.className =
      "eureka-wallet-option "+
      (
        detected
          ? "wallet-detected"
          : "wallet-missing"
      );


    const icon =
      wallet
        ? safeWalletIcon(
            wallet.info
          )
        : "";


    button.innerHTML = `
      <span class="eureka-wallet-icon">
        ${
          icon
            ? `<img src="${icon}" alt="">`
            : `<span>◆</span>`
        }
      </span>

      <span class="eureka-wallet-name">

        <b>
          ${name}
        </b>

        <small>
          ${
            detected
              ? copy.detected
              : copy.missing
          }
        </small>

      </span>

      <span class="eureka-wallet-arrow">
        ${
          detected
            ? "→"
            : "—"
        }
      </span>
    `;


    if(detected){

      button.addEventListener(
        "click",
        async ()=>{

          closeWalletSelector();

          connectedWalletName =
            name;

          await connectSelectedWallet(
            wallet
          );

        }
      );

    }else{

      button.disabled =
        true;

    }


    return button;

  }


  PREFERRED_WALLETS.forEach(
    preferred=>{

      const wallet =
        all
          .filter(
            candidate=>
              strictWalletFamily(
                candidate.info,
                candidate.provider
              ) ===
              preferred.id
          )
          .sort(
            (a,b)=>
              walletSelectionScore(
                b,
                preferred.id
              ) -
              walletSelectionScore(
                a,
                preferred.id
              )
          )[0];


      if(wallet){
        used.add(
          wallet.key
        );
      }


      preferredContainer.appendChild(
        createOption(
          preferred.name,
          wallet || null
        )
      );

    }
  );


  const others =
    all.filter(
      wallet=>
        !used.has(
          wallet.key
        )
    );


  const otherBlock =
    document.getElementById(
      "otherWalletBlock"
    );


  otherBlock.hidden =
    others.length === 0;


  others.forEach(
    wallet=>{

      otherContainer.appendChild(
        createOption(
          wallet.name,
          wallet
        )
      );

    }
  );


  modal.hidden =
    false;


  document.body.classList.add(
    "wallet-modal-open"
  );

}

function closeWalletSelector(){

  const modal =
    document.getElementById(
      "eurekaWalletModal"
    );

  if(modal){
    modal.hidden =
      true;
  }

  document.body.classList.remove(
    "wallet-modal-open"
  );

}


function bindWalletEvents(
  provider
){

  if(
    !provider ||
    typeof provider.on !== "function"
  ){
    return;
  }


  if(
    boundWalletProviders.has(
      provider
    )
  ){
    return;
  }


  boundWalletProviders.add(
    provider
  );


  provider.on(
    "accountsChanged",
    async accounts=>{

      account =
        accounts?.[0] ||
        null;


      if(account){

        await refreshWallet();

      }else{

        disconnectWallet();

      }


      applyLanguage();

      updateBuyButton();

    }
  );


  provider.on(
    "chainChanged",
    async ()=>{

      await refreshState()
        .catch(()=>{});

      if(account){

        await refreshWallet()
          .catch(()=>{});

      }

    }
  );

}

function walletPreferredType(
  wallet
){

  return (
    PREFERRED_WALLETS.find(
      preferred=>{

        try{

          return preferred.match(
            wallet?.info,
            wallet?.provider
          );

        }catch{

          return false;

        }

      }
    ) || null
  );

}


function walletProviderCandidates(
  wallet,
  selectedFamily = null
){

  const result =
    [];


  function add(
    provider
  ){

    if(
      !provider ||
      typeof provider.request !==
        "function" ||
      result.includes(
        provider
      )
    ){
      return;
    }


    result.push(
      provider
    );

  }


  /*
    Provider represented by the button selected
    by the user is always first.
  */

  add(
    wallet?.provider
  );


  /*
    Additional fallback providers must belong
    to EXACTLY the same wallet family.
  */

  if(selectedFamily){

    discoveredWallets.forEach(
      candidate=>{

        if(
          strictWalletFamily(
            candidate.info,
            candidate.provider
          ) !== selectedFamily
        ){
          return;
        }


        add(
          candidate.provider
        );

      }
    );

  }


  console.info(
    "[EKNX WALLET] strict selection:",
    selectedFamily ||
      wallet?.name ||
      "other",
    "candidates:",
    result.length
  );


  return result;

}

function isWalletTransportError(
  error
){

  const message =
    String(
      error?.message || ""
    );


  return (
    /broadcast channel unavailable/i.test(
      message
    ) ||
    /channel secret not available/i.test(
      message
    ) ||
    /message port closed/i.test(
      message
    ) ||
    /disconnected port/i.test(
      message
    ) ||
    /could not establish connection/i.test(
      message
    ) ||
    /receiving end does not exist/i.test(
      message
    ) ||
    /connection closed/i.test(
      message
    ) ||
    /provider disconnected/i.test(
      message
    )
  );

}


async function requestWalletAccounts(
  wallet
){

  const candidates =
    walletProviderCandidates(
      wallet
    );


  if(!candidates.length){

    throw new Error(
      tx().walletMissing
    );

  }


  let lastError = null;


  for(
    let i=0;
    i<candidates.length;
    i++
  ){

    const provider =
      candidates[i];


    try{

      const accounts =
        await provider.request({
          method:
            "eth_requestAccounts"
        });


      if(
        accounts?.length
      ){

        return {
          provider,
          accounts
        };

      }


    }catch(error){

      lastError =
        error;


      /*
        Never try another provider when the
        user rejected the request or another
        wallet request is already pending.
      */

      if(
        error?.code === 4001 ||
        error?.code === -32002
      ){
        throw error;
      }


      /*
        Fallback is deliberately limited to
        extension transport/channel failures.

        Authentication, permissions and other
        wallet errors must remain visible.
      */

      if(
        !isWalletTransportError(
          error
        )
      ){
        throw error;
      }


      console.warn(
        "[EKNX WALLET] provider transport failed; trying alternate provider",
        i + 1,
        "/",
        candidates.length
      );

    }

  }


  throw (
    lastError ||
    new Error(
      tx().failed
    )
  );

}


async function connectSelectedWallet(
  wallet
){

  /*
    Do not keep a stale provider from a previous
    failed connection attempt.
  */

  account =
    null;

  walletProvider =
    null;


  try{

    setStatus(
      tx().connecting
    );


    const connection =
      await requestWalletAccounts(
        wallet
      );


    walletProvider =
      connection.provider;


    const accounts =
      connection.accounts;


    await ensureBsc(
      walletProvider
    );


    account =
      accounts[0];


    bindWalletEvents(
      walletProvider
    );


    const connect =
      document.getElementById(
        "connectWalletBtn"
      );


    connect.textContent =
      (
        connectedWalletName ||
        wallet.name
      )+
      " · "+
      tx().connected;


    document
      .getElementById(
        "walletPanel"
      )
      .hidden =
        false;


    const network =
      document.getElementById(
        "walletNetwork"
      );


    if(network){

      network.textContent =
        "BNB Smart Chain · Chain ID 56";

    }


    setStatus(
      tx().ready,
      "ok"
    );


    await refreshWallet();


  }catch(error){

    console.error(
      "[EKNX WALLET]",
      error
    );


    account =
      null;

    walletProvider =
      null;

    connectedWalletName =
      "";


    const panel =
      document.getElementById(
        "walletPanel"
      );

    if(panel){
      panel.hidden = true;
    }


    const connect =
      document.getElementById(
        "connectWalletBtn"
      );

    if(connect){
      connect.textContent =
        tx().connect;
    }


    setStatus(
      walletErrorText(
        error
      ),
      "error"
    );

  }


  applyLanguage();

  updateBuyButton();

}

function detectWalletProvider(){

  const injected =
    window.ethereum;

  if(!injected){
    return null;
  }

  const providers =
    Array.isArray(
      injected.providers
    )
      ? injected.providers
      : [injected];


  const metamask =
    providers.find(
      p => p?.isMetaMask
    );

  if(metamask){
    return metamask;
  }


  const trust =
    providers.find(
      p =>
        p?.isTrust ||
        p?.isTrustWallet
    );

  if(trust){
    return trust;
  }


  return (
    providers[0] ||
    injected
  );

}


function walletErrorText(error){

  const d = tx();

  const code =
    error?.code;

  const message =
    String(
      error?.message || ""
    );


  if(code === 4001){
    return d.rejected;
  }


  if(
    code === -32002 ||
    /already pending/i.test(message)
  ){
    return lang()==="pt"
      ? "Já existe um pedido da carteira pendente. Abre a extensão da carteira e conclui ou cancela esse pedido."
      : "A wallet request is already pending. Open the wallet extension and complete or cancel it.";
  }


  if(
    isWalletTransportError(
      error
    )
  ){
    return lang()==="pt"
      ? "Não foi possível comunicar com a carteira escolhida. Desbloqueia a extensão e tenta novamente ou escolhe outra carteira."
      : "Could not communicate with the selected wallet. Unlock the extension and try again or choose another wallet.";
  }


  if(
    /unauthorized|not authorized/i.test(
      message
    )
  ){
    return lang()==="pt"
      ? "A carteira não autorizou o acesso. Abre a carteira, desbloqueia-a e tenta novamente."
      : "The wallet did not authorize access. Unlock the wallet and try again.";
  }


  if(
    /chain|network/i.test(message)
  ){
    return lang()==="pt"
      ? "Não foi possível mudar automaticamente para BNB Smart Chain. Seleciona BNB Smart Chain Mainnet na carteira e tenta novamente."
      : "The wallet could not switch automatically to BNB Smart Chain. Select BNB Smart Chain Mainnet in the wallet and try again.";
  }


  if(message){
    return (
      d.failed +
      " · " +
      message.slice(0,180)
    );
  }


  return d.failed;
}


async function ensureBsc(
  provider = walletProvider
){

  const ethereum =
    provider ||
    detectWalletProvider();

  if(!ethereum){
    throw new Error(
      tx().walletMissing
    );
  }

  walletProvider =
    ethereum;


  const current =
    await ethereum.request({
      method:
        "eth_chainId"
    });


  if(
    current.toLowerCase() ===
    CHAIN_ID_HEX
  ){

    return;

  }


  setStatus(
    tx().wrongNetwork
  );


  try{

    await ethereum.request({
      method:
        "wallet_switchEthereumChain",
      params:[
        {
          chainId:
            CHAIN_ID_HEX
        }
      ]
    });

  }catch(error){

    if(
      error.code !== 4902
    ){

      throw error;

    }


    await ethereum.request({
      method:
        "wallet_addEthereumChain",
      params:[
        {
          chainId:
            CHAIN_ID_HEX,

          chainName:
            "BNB Smart Chain",

          nativeCurrency:{
            name:"BNB",
            symbol:"BNB",
            decimals:18
          },

          rpcUrls:[
            "https://bsc-rpc.publicnode.com"
          ],

          blockExplorerUrls:[
            "https://bscscan.com"
          ]
        }
      ]
    });

  }

}



function appKitAvailable(){

  return Boolean(
    window.EurekaAppKit &&
    typeof window.EurekaAppKit.open ===
      "function"
  );

}


async function applyAppKitAccount(
  detail
){

  if(
    !detail?.isConnected ||
    !detail?.address
  ){

    return;

  }


  try{

    const provider =
      detail.provider ||
      await window
        .EurekaAppKit
        ?.waitForProvider?.(
          7000
        ) ||
      window
        .EurekaAppKit
        ?.getProvider?.();


    if(
      !provider ||
      typeof provider.request !==
        "function"
    ){

      throw new Error(
        "Wallet connected but provider is not ready"
      );

    }


    walletProvider =
      provider;

    account =
      detail.address;

    connectedWalletName =
      "WalletConnect";


    await ensureBsc(
      walletProvider
    );


    bindWalletEvents(
      walletProvider
    );


    const connect =
      document.getElementById(
        "connectWalletBtn"
      );


    if(connect){

      connect.textContent =
        tx().connected;

    }


    const panel =
      document.getElementById(
        "walletPanel"
      );


    if(panel){

      panel.hidden =
        false;

    }


    const network =
      document.getElementById(
        "walletNetwork"
      );


    if(network){

      network.textContent =
        "BNB Smart Chain · Chain ID 56";

    }


    setStatus(
      tx().ready,
      "ok"
    );


    await refreshWallet();


    updateBuyButton();


    console.info(
      "[EKNX APPKIT] Eureka market synchronized:",
      account
    );


  }catch(error){

    console.error(
      "[EKNX APPKIT] synchronization failed",
      error
    );


    setStatus(
      walletErrorText(
        error
      ),
      "error"
    );

  }

}


function clearConnectedWalletUi(){

  account =
    null;

  walletProvider =
    null;

  connectedWalletName =
    "";


  const panel =
    document.getElementById(
      "walletPanel"
    );


  if(panel){

    panel.hidden =
      true;

  }


  const connect =
    document.getElementById(
      "connectWalletBtn"
    );


  if(connect){

    connect.textContent =
      tx().connect;

  }


  const confirm =
    document.getElementById(
      "mainnetConfirm"
    );


  if(confirm){

    confirm.checked =
      false;

  }


  updateBuyButton();

}


async function connectWallet(){

  setStatus(
    "",
    ""
  );


  /*
    Primary connector:
    Reown AppKit / WalletConnect.

    Works with:
    - desktop browser extensions
    - QR connection
    - Android wallet deep links
    - iOS wallet deep links
  */

  if(
    appKitAvailable()
  ){

    try{

      setStatus(
        tx().connecting
      );


      await window
        .EurekaAppKit
        .open();


      return;


    }catch(error){

      console.error(
        "[EKNX APPKIT] open failed",
        error
      );


      /*
        AppKit failure must not make the Genesis
        Market unusable. Keep the proven v12
        extension selector as fallback.
      */

      setStatus(
        lang()==="pt"
          ? "AppKit indisponível. A usar ligação direta à carteira…"
          : "AppKit unavailable. Using direct wallet connection…"
      );

    }

  }


  /*
    v12 desktop fallback.
  */

  window.dispatchEvent(
    new Event(
      "eip6963:requestProvider"
    )
  );


  discoverLegacyWallets();


  await new Promise(
    resolve=>
      setTimeout(
        resolve,
        120
      )
  );


  renderWalletSelector();

}

async function disconnectWallet(){

  if(
    window.EurekaAppKit &&
    typeof window.EurekaAppKit.disconnect ===
      "function"
  ){

    try{

      const state =
        window
          .EurekaAppKit
          .snapshot?.();


      if(
        state?.isConnected
      ){

        await window
          .EurekaAppKit
          .disconnect();

      }

    }catch(error){

      console.warn(
        "[EKNX APPKIT] disconnect warning",
        error
      );

    }

  }


  clearConnectedWalletUi();


  setStatus(
    lang()==="pt"
      ? "Carteira desligada do Eureka Nexus."
      : "Wallet disconnected from Eureka Nexus.",
    "ok"
  );

}

async function refreshWallet(){

  if(!account) return;


  const [
    bnbRaw,
    tokenBalanceRaw,
    curveRaw
  ] =
    await Promise.all([

      (walletProvider || detectWalletProvider()).request({
        method:"eth_getBalance",
        params:[
          account,
          "latest"
        ]
      }),

      ethCall(
        TOKEN,
        SELECTOR_BALANCE_OF+
        encodeAddress(account)
      ),

      ethCall(
        MARKET,
        SELECTOR_CURVE_POSITION+
        encodeAddress(account)
      )

    ]);


  document
    .getElementById(
      "walletAddress"
    )
    .textContent =
      short(account);


  document
    .getElementById(
      "walletBnb"
    )
    .textContent =
      formatUnits(
        fromRpcHex(bnbRaw),
        6
      );


  document
    .getElementById(
      "walletEknx"
    )
    .textContent =
      formatEknx(
        fromRpcHex(
          tokenBalanceRaw
        )
      );


  document
    .getElementById(
      "walletCurvePosition"
    )
    .textContent =
      formatEknx(
        fromRpcHex(
          curveRaw
        )
      );

}


function updateBuyButton(){

  const button =
    document.getElementById(
      "buyEknxBtn"
    );


  const input =
    document.getElementById(
      "buyAmount"
    );


  const confirm =
    document.getElementById(
      "mainnetConfirm"
    );


  const marketOk =
    currentState &&
    currentState.launched &&
    !currentState.graduated;


  button.disabled =
    pendingTx ||
    !marketOk ||
    !account ||
    !confirm.checked ||
    !input.dataset.amountWei ||
    !input.dataset.maxWei;

}


async function waitForReceipt(
  hash
){

  for(
    let i=0;
    i<90;
    i++
  ){

    const receipt =
      await rpc(
        "eth_getTransactionReceipt",
        [hash]
      );


    if(receipt){

      return receipt;

    }


    await new Promise(
      resolve=>
        setTimeout(
          resolve,
          2000
        )
    );

  }


  throw new Error(
    "Transaction confirmation timeout"
  );

}


async function buy(){

  if(pendingTx) return;


  if(!account){

    await connectWallet();

    return;

  }


  if(
    !document
      .getElementById(
        "mainnetConfirm"
      )
      .checked
  ){

    setStatus(
      tx().confirmMainnet,
      "error"
    );

    return;

  }


  if(
    !currentState?.launched
  ){

    setStatus(
      tx().notLive,
      "error"
    );

    return;

  }


  if(
    currentState?.graduated
  ){

    setStatus(
      tx().graduated,
      "error"
    );

    return;

  }


  try{

    pendingTx =
      true;

    updateBuyButton();


    setStatus(
      tx().quoting
    );


    const quote =
      await quoteAmount();


    if(!quote){

      return;

    }


    await ensureBsc();


    setStatus(
      tx().walletConfirm
    );


    const transaction = {
      from:
        account,

      to:
        MARKET,

      value:
        toRpcHex(
          quote.maxPayment
        ),

      data:
        SELECTOR_BUY+
        encodeUint(
          quote.amount
        )
    };


    const hash =
      await (walletProvider || detectWalletProvider()).request({
        method:
          "eth_sendTransaction",
        params:[
          transaction
        ]
      });


    const link =
      document.getElementById(
        "tradeTxLink"
      );


    link.href =
      BSC_SCAN+
      hash;

    link.hidden =
      false;


    setStatus(
      tx().submitted
    );


    const receipt =
      await waitForReceipt(
        hash
      );


    if(
      receipt.status !== "0x1"
    ){

      throw new Error(
        "Transaction reverted"
      );

    }


    setStatus(
      tx().confirmed,
      "ok"
    );


    await refreshState();

    await refreshWallet();

    await quoteAmount();


    if(
      window.EKNXGenesisLive
    ){

      window
        .EKNXGenesisLive
        .refresh();

    }


  }catch(error){

    console.error(
      "[EKNX BUY]",
      error
    );


    setStatus(
      walletErrorText(error),
      "error"
    );


  }finally{

    pendingTx =
      false;

    updateBuyButton();

  }

}


function installEvents(){

  window.addEventListener(
    "eureka:appkit-account",
    async event=>{

      const detail =
        event.detail;


      if(
        detail?.isConnected
      ){

        await applyAppKitAccount(
          detail
        );

      }else if(
        account &&
        window.EurekaAppKit
      ){

        clearConnectedWalletUi();

      }

    }
  );


  window.addEventListener(
    "eureka:appkit-ready",
    async ()=>{

      const detail =
        window
          .EurekaAppKit
          ?.snapshot?.();


      if(
        detail?.isConnected
      ){

        await applyAppKitAccount(
          detail
        );

      }

    }
  );


  document
    .getElementById(
      "connectWalletBtn"
    )
    .addEventListener(
      "click",
      connectWallet
    );


  document
    .getElementById(
      "buyEknxBtn"
    )
    .addEventListener(
      "click",
      buy
    );


  document
    .getElementById(
      "disconnectWalletBtn"
    )
    .addEventListener(
      "click",
      disconnectWallet
    );


  document
    .getElementById(
      "mainnetConfirm"
    )
    .addEventListener(
      "change",
      updateBuyButton
    );


  document
    .getElementById(
      "buyAmount"
    )
    .addEventListener(
      "input",
      ()=>{

        clearTimeout(
          quoteTimer
        );

        quoteTimer =
          setTimeout(
            quoteAmount,
            300
          );

      }
    );


  document
    .querySelectorAll(
      "[data-quick]"
    )
    .forEach(button=>{

      button.addEventListener(
        "click",
        ()=>{

          document
            .getElementById(
              "buyAmount"
            )
            .value =
              button.dataset.quick;

          quoteAmount();

        }
      );

    });


  document
    .getElementById(
      "maxAvailableBtn"
    )
    .addEventListener(
      "click",
      ()=>{

        if(!currentState){
          return;
        }

        const remaining =
          SALE -
          currentState.sold;

        document
          .getElementById(
            "buyAmount"
          )
          .value =
            rawUnits(
              remaining
            );

        quoteAmount();

      }
    );


  addEventListener(
    "eureka:language",
    ()=>{

      applyLanguage();

      if(
        !document
          .getElementById(
            "eurekaWalletModal"
          )
          ?.hidden
      ){
        renderWalletSelector();
      }

      refreshState();

      quoteAmount();

    }
  );



}


async function boot(){

  startWalletDiscovery();

  createWalletSelector();

  applyLanguage();

  installEvents();


  const appKitState =
    window
      .EurekaAppKit
      ?.snapshot?.();


  if(
    appKitState?.isConnected
  ){

    await applyAppKitAccount(
      appKitState
    );

  }


  await refreshState();

  setInterval(
    refreshState,
    15000
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
