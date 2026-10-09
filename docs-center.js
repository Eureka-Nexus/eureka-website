(()=>{
"use strict";

const EN={

heroTitle:"Documentation to verify, not just believe.",
heroLead:"Architecture, Eureka AI, mining, EKNX, contracts, security, market, privacy and research gathered into one entry point.",

statusTitle:"The status of each component matters.",
statusLead:"Operational, deployed, in development and planned do not mean the same thing.",
miningStatus:"Real shares and payouts.",
aiStatus:"Architecture and product under development.",
marketStatus:"Genesis Market is LIVE on-chain on BNB Smart Chain.",

projectTitle:"Vision, architecture and direction.",
projectLead:"Start here to understand Eureka Nexus, how its layers connect and where the project is heading.",

overviewTitle:"Project overview",
overviewText:"Summary of Eureka Nexus, Eureka AI, Mining Network, EKNX and public infrastructure.",

eurekaText:"Persistent identity, memory, continuity, voice, permissioned perception, tools and evolution.",

architectureTitle:"System architecture",
architectureText:"Relationship between Eureka AI, Miner, Mining Server, EKNX, public network and future services.",

roadmapText:"Technical direction and planned evolution without presenting future dates as guarantees.",

technicalTitle:"Infrastructure, mining and protocol.",
technicalLead:"Technical documentation for understanding the network, validated work and blockchain infrastructure.",

technicalWhitepaperTitle:"Technical whitepaper",
technicalWhitepaperText:"Comprehensive technical document covering architecture, AI, mining, network, EKNX, security and risks.",

litepaperText:"Public summary of the Eureka Nexus vision and architecture.",

miningTitle:"Mining Network",
miningText:"CPU RandomX, GPU KAWPOW, share validation, accounting, settlements and automatic payouts.",

contractsTitle:"On-chain architecture",
contractsText:"EKNX contracts, Genesis Market, settlements and public addresses.",

eknxTitle:"Supply, mining and market.",
eknxLead:"Economic and technical documentation for EKNX without promises of price, appreciation or return.",

eknxOverviewText:"Network, contract, supply framework and utility direction.",

tokenomicsText:"Hard cap, Genesis Reserve, mining ceiling, theoretical issuance and market architecture.",

curveText:"Current continuous-curve plan, allocation and conditions before public activation.",

dexText:"Plan for future market transition and decentralised liquidity structure.",

marketInactiveTitle:"Genesis Market is LIVE on-chain.",
marketInactiveText:"Launch Curve and DEX documentation describes the current technical plan and is not an active public offer.",

securityTitle:"Security and public boundaries.",
securityLead:"Security, risk, privacy and regulatory-readiness documentation.",

securityPolicyTitle:"Security Policy",
securityPolicyText:"Security rules, responsible disclosure and protection of public infrastructure.",

riskTitle:"EKNX risks",
riskText:"Technical, blockchain, market and liquidity risks and absence of guarantees.",

micaText:"Technical and documentation readiness checklist. It is not legal advice.",

privacyTitle:"Privacy and data",
privacyText:"Permission principles, data handling and privacy direction for Eureka AI.",

governanceTitle:"IP and governance",
governanceText:"Documentation framework for intellectual property and ecosystem governance.",

legalChecklistTitle:"Legal Checklist",
legalChecklistText:"Items to review before legally significant commercial activations.",

verifyTitle:"Documentation does not replace proof.",
verifyLead:"For operational and on-chain information, also use publicly verifiable sources.",

footerText:"Independent technology project developed in Portugal."
};

const original=new Map();

function translate(){

const select=document.getElementById("langSelect");
const lang=select?.value||"pt";

document.querySelectorAll("[data-docs]").forEach(el=>{

const key=el.dataset.docs;

if(!original.has(el)){
original.set(el,el.innerHTML);
}

if(lang==="en" && EN[key]){
el.innerHTML=EN[key];
}else{
el.innerHTML=original.get(el);
}

});

}

document.addEventListener("DOMContentLoaded",()=>{

translate();

const select=document.getElementById("langSelect");

if(select){
select.addEventListener("change",()=>{
setTimeout(translate,0);
});
}

});

})();