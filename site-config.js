window.EUREKA_CONFIG = Object.freeze({
  projectName: "Eureka Nexus",
  tokenName: "Eureka Nexus",
  tokenSymbol: "EKNX",
  network: "BNB Smart Chain Mainnet",
  chainId: 56,
  tokenContract: "0xF54913A8d5E2AEBD0B62c6411cCf1b5B4aB069c9",
  genesisMarket: "0x837dBE1D3b67e8315127c36a119E163e713ee73D",
  operationsWallet: "0x839943749d7Aacb823b36F9327eA2AE883809805",
  founderRevenueWallet: "0x42F58c8a09Bce3A00Faf553AAC60B0daF320858b",
  miningFeePercent: 1,
  decimals: 18,

  // Current deployed tokenomics / deployment framework.
  maxSupplyEknx: 100000000,
  genesisAllocationEknx: 1000000,
  miningCapacityEknx: 99000000,
  curveSaleEknx: 650000,
  permanentLiquidityEknx: 350000,

  bscScanToken: "https://bscscan.com/token/0xF54913A8d5E2AEBD0B62c6411cCf1b5B4aB069c9",
  bscScanContract: "https://bscscan.com/address/0xF54913A8d5E2AEBD0B62c6411cCf1b5B4aB069c9",
  bscScanMarket: "https://bscscan.com/address/0x837dBE1D3b67e8315127c36a119E163e713ee73D",
  bscScanFeeWallet: "https://bscscan.com/address/0x42F58c8a09Bce3A00Faf553AAC60B0daF320858b",
  github: "https://github.com/Eureka-Nexus",

  // Live pool integration. Leave blank until a PUBLIC HTTPS endpoint/proxy exists.
  // Expected Eureka Mining Server endpoint: /v1/public/stats
  publicStatsUrl: "https://pool.eurekanexus.pt/v1/public/stats",
  networkUrl: "https://pool.eurekanexus.pt/v1/network",
  healthUrl: "https://pool.eurekanexus.pt/health",
  statsRefreshMs: 15000,
  minerVersion: "1.1.0",
  minerLinuxStatus: "live",
  minerLinuxUrl: "https://github.com/Eureka-Nexus/eureka-miner/releases/download/v1.0.0/Eureka-Nexus-Miner-Official-1.0-Linux-x86_64.tar.gz",

  // Official contact address for all project enquiries.
  contactEmail: "eurekanexusofficial@gmail.com",
  investorsEmail: "eurekanexusofficial@gmail.com",
  partnersEmail: "eurekanexusofficial@gmail.com",
  careersEmail: "eurekanexusofficial@gmail.com",
  pressEmail: "eurekanexusofficial@gmail.com",

  // Downloads: only switch a status to "live" after publishing a verified official build.
  minerWindowsStatus: "live",
  minerWindowsUrl: "https://github.com/Eureka-Nexus/eureka-miner/releases/download/v1.1.0/Eureka-Nexus-Miner-Setup-1.1.0.exe",
  minerAndroidStatus: "soon",
  minerAndroidUrl: "",
  agentDesktopStatus: "soon",
  agentDesktopUrl: "",
  agentAndroidStatus: "soon",
  agentAndroidUrl: "",
  agentIosStatus: "soon",
  agentIosUrl: "",
  capitalStatus: "soon",
  capitalUrl: ""
});
