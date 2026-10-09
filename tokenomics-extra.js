(()=>{
"use strict";

const EN={
heroTitle:"Hard cap, issuance and circulation are not the same thing.",
heroLead:"This page separates the absolute contract limit, the Genesis Market Reserve, the contractual mining ceiling and the theoretical issuance allowed by the currently implemented schedule.",
supplyTitle:"Five numbers. Five different meanings.",
supplyLead:"The 100 million hard cap does not mean that 100 million EKNX have been created or will necessarily enter circulation.",
hardCap:"Hard maximum",
hardCapNote:"Absolute contract limit.",
genesisNote:"Reserve created for the future market architecture.",
miningCeiling:"Mining / reward ceiling",
miningCeilingNote:"Contractual ceiling. It is not an issuance target.",
lifetimeMining:"Theoretical lifetime mining maximum",
lifetimeMiningNote:"Under the currently implemented emission schedule.",
lifetimeTotal:"Theoretical lifetime total maximum",
lifetimeTotalNote:"Including the Genesis Market Reserve.",
halving:"Halving interval",
halvingNote:"Programmed reduction in the emission schedule.",
supplyWarningTitle:"99 million does not mean 99 million will be mined.",
supplyWarningText:"The 99 million figure is the maximum space the contract allows for mining and rewards. The current emission schedule produces a much lower theoretical maximum. Circulating supply, total supply and the mining ceiling must be considered separately.",
architectureTitle:"Ceiling ≠ issuance ≠ circulation.",
architectureLead:"This distinction prevents contractual capacity from being presented as if it were existing supply.",
contractLimitText:"No combination of the Market Reserve and mining issuance can exceed the hard maximum defined by the contract.",
marketReserveText:"The Genesis Market is LIVE on-chain. Of the 1,000,000 EKNX Genesis allocation, 650,000 EKNX are assigned to the bonding curve and 350,000 EKNX are reserved for liquidity at graduation.",
ceilingText:"It is a maximum allocation and security boundary, not a forecast of how many tokens will actually be issued.",
scheduleText:"If the currently implemented schedule runs through its full mathematical lifetime, theoretical mining issuance remains far below the 99 million ceiling.",
circulatingTitle:"Real state, not hard cap",
circulatingText:"Circulating supply depends on tokens actually issued, distributed and economically available — not on the maximum the contract could allow.",
verifyTitle:"Verify on-chain",
verifyText:"Contracts, payouts and public network activity can be verified through the Proof Center and BNB Smart Chain.",
miningTitle:"Issuance through validated work.",
miningLead:"A balance shown by the Miner does not create EKNX by itself. Work must be validated, accounted for, included in a settlement and published before payout.",
minerNet:"Miner net",
validatedReward:"Of the validated reward.",
projectFee:"Project fee",
poolFee:"Official pool.",
autoPayoutMin:"Automatic payout minimum",
claimableMinimum:"Published and available entitlement.",
payoutCycle:"Payout check cycle",
schedulerText:"Automatic scheduler.",
settlementTitle:"Settlement and payout are not the same thing.",
settlementText:"Accounting is consolidated into cumulative settlements. The payout scheduler periodically checks already-published entitlement and only pays when the conditions are satisfied.",
marketTitle:"Launch Curve first. DEX later.",
marketLead:"The market architecture below represents the current plan and not an active public sale.",
marketStep1:"Genesis Market Reserve.",
marketStep2:"Planned allocation for the Launch Curve.",
marketStep3:"Planned reserve for the future DEX / liquidity stage.",
marketStep4:"Migration only after applicable technical, security and legal conditions.",
curveTitle:"Continuous progressive curve",
curveText:"The current design avoids artificial fixed price steps. The intention is a continuous curve whose price progresses as the allocation is purchased.",
startingText:"Planned initial reference. It is not a guarantee of future price, appreciation or liquidity.",
proceedsText:"At graduation, 21 BNB and 350,000 EKNX are allocated to liquidity; 3 BNB go to operations and 1 BNB to the founder wallet, according to the deployed contract logic.",
marketInactiveTitle:"Genesis Market · LIVE ON-CHAIN",
marketInactiveText:"The Genesis Market is active on BNB Smart Chain. DEX trading is not active until graduation. No future price, liquidity, appreciation or return is guaranteed.",
riskTitle:"No promise of appreciation.",
riskText:"Eureka Nexus does not guarantee an EKNX launch price, appreciation, income, liquidity or future return.",
officialTitle:"Verify addresses before interacting.",
officialLead:"Never use a contract address obtained only from messages, comments or social media.",
proofCenter:"Proof Center",
proofCenterText:"Review payouts, miners, shares, contracts and public infrastructure information.",
docsTitle:"Do not rely on a single page.",
docsLead:"Review contracts, technical documentation, risks and architecture before making decisions related to EKNX."
};

const original=new Map();

function apply(){
  const select=document.getElementById("langSelect");
  const lang=select?.value||"pt";

  document.querySelectorAll("[data-tx]").forEach(el=>{
    const key=el.dataset.tx;

    if(!original.has(el)){
      original.set(el,el.textContent.trim());
    }

    el.textContent=
      lang==="en" && EN[key]
        ? EN[key]
        : original.get(el);
  });
}

document.addEventListener("DOMContentLoaded",()=>{
  apply();

  const select=document.getElementById("langSelect");

  if(select){
    select.addEventListener("change",()=>{
      setTimeout(apply,0);
    });
  }
});

})();