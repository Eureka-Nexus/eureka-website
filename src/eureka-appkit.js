import {
  createAppKit
} from "@reown/appkit";

import {
  EthersAdapter
} from "@reown/appkit-adapter-ethers";

import {
  bsc
} from "@reown/appkit/networks";


const PROJECT_ID =
  "2d3edadff86d98178da8cdb5215dbc6f";


const metadata = {
  name:
    "Eureka Nexus",

  description:
    "EKNX Genesis Market on BNB Smart Chain",

  url:
    "https://eurekanexus.pt",

  icons:[
    "https://eurekanexus.pt/assets/eknx-genesis-coin.png"
  ]
};


const modal =
  createAppKit({

    adapters:[
      new EthersAdapter()
    ],

    networks:[
      bsc
    ],

    defaultNetwork:
      bsc,

    projectId:
      PROJECT_ID,

    metadata,

    themeMode:
      "dark",

    enableReconnect:
      true,

    features:{
      analytics:
        true,

      email:
        false,

      socials:
        false,

      swaps:
        false,

      connectMethodsOrder:[
        "wallet"
      ]
    },

    themeVariables:{
      "--w3m-accent":
        "#d7af3f",

      "--w3m-border-radius-master":
        "2px"
    }
  });


let currentAccount = {
  isConnected:
    false,

  address:
    null
};


let currentProvider = null;


function getProvider(){

  try{

    const provider =
      modal.getWalletProvider?.() ||
      modal.walletProvider ||
      currentProvider ||
      null;


    if(
      provider &&
      typeof provider.request === "function"
    ){

      currentProvider =
        provider;

    }


    return currentProvider;

  }catch{

    return currentProvider;

  }

}


async function waitForProvider(
  timeoutMs=7000
){

  const started =
    Date.now();


  while(
    Date.now() - started <
    timeoutMs
  ){

    const provider =
      getProvider();


    if(
      provider &&
      typeof provider.request ===
        "function"
    ){

      return provider;

    }


    await new Promise(
      resolve=>
        setTimeout(
          resolve,
          100
        )
    );

  }


  return null;

}


function snapshot(){

  return {
    isConnected:
      Boolean(
        currentAccount.isConnected &&
        currentAccount.address
      ),

    address:
      currentAccount.address ||
      null,

    provider:
      getProvider()
  };

}


async function emitAccount(){

  const detail =
    snapshot();


  if(
    detail.isConnected &&
    !detail.provider
  ){

    detail.provider =
      await waitForProvider(
        7000
      );

  }


  window.dispatchEvent(
    new CustomEvent(
      "eureka:appkit-account",
      {
        detail
      }
    )
  );

}


modal.subscribeAccount(
  account=>{

    currentAccount = {
      isConnected:
        Boolean(
          account?.isConnected
        ),

      address:
        account?.address ||
        null
    };


    console.info(
      "[EKNX APPKIT] account:",
      currentAccount.isConnected
        ? currentAccount.address
        : "disconnected"
    );


    void emitAccount();

  }
);


async function open(){

  console.info(
    "[EKNX APPKIT] opening wallet selector"
  );


  await modal.open({
    view:
      "Connect",

    namespace:
      "eip155"
  });

}


async function disconnect(){

  console.info(
    "[EKNX APPKIT] disconnect"
  );


  await modal.disconnect();

}


window.EurekaAppKit = {

  version:
    "1.0.0",

  projectId:
    PROJECT_ID,

  open,

  disconnect,

  snapshot,

  getProvider,

  waitForProvider,

  modal
};


window.dispatchEvent(
  new Event(
    "eureka:appkit-ready"
  )
);


console.info(
  "[EKNX APPKIT] ready · BNB Smart Chain · Reown AppKit"
);
