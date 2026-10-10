# EKNX Genesis Market — Live Bonding Curve

Status:

**LIVE ON-CHAIN**

Network:

**BNB Smart Chain Mainnet · Chain ID 56**

This document describes the current deployed Genesis Market architecture.

It does not guarantee future price, liquidity, demand, resale, DEX price
or investment return and does not constitute legal or regulatory approval.

## Market Reserve

Total Genesis Market Reserve:

**1,000,000 EKNX**

Deployed allocation:

- **650,000 EKNX** assigned to the live Genesis bonding curve
- **350,000 EKNX** reserved for liquidity at graduation

The Genesis Market is currently active on-chain.

## Bonding curve

The deployed Genesis Market uses a continuous progressive bonding curve.

The price is calculated from the on-chain curve state.

There are no artificial €5 / €10 / €15 fixed price tiers.

Current pricing model:

**Price is calculated live on-chain by the deployed Genesis bonding curve**

The project does not guarantee:

- That all 650,000 EKNX will be purchased
- That the Genesis Curve will fully sell out
- Any future EKNX price
- Appreciation
- Profit or yield
- Guaranteed resale
- Guaranteed liquidity
- Any DEX price

Crypto-assets can lose part or all of their market value.

## Active payment asset

The currently deployed Genesis Market operates with:

**BNB**

on BNB Smart Chain.

USDT, USDC, ETH-compatible assets, BTC-compatible assets or other tokens
must not be represented as active Genesis Market payment methods unless a
separate supported implementation is deployed, verified and publicly documented.

Users must not send unsupported tokens or assets from another blockchain
directly to the Genesis Market contract.

## Graduation

The deployed Genesis Market graduates when the bonding-curve reserve reaches:

**25 BNB**

According to the deployed contract logic, graduation routes:

- **21 BNB + 350,000 EKNX** to DEX liquidity
- **3 BNB** to the operations wallet
- **1 BNB** to the founder wallet

The DEX stage is therefore:

**NOT ACTIVE — PENDING GRADUATION**

## DEX transition

Graduation is part of the deployed smart-contract logic.

It is not described as a manual future market-launch switch.

Technical, security, operational and legally applicable readiness should
therefore be maintained before the graduation threshold is reached.

See:

`DEX-MIGRATION.md`

## Risk and legal status

Technical deployment does not itself establish regulatory compliance.

The project must continue to review and document, where applicable:

- Deployed-contract / source equivalence
- Security
- Market terms
- Risk disclosures
- Legal classification
- MiCA applicability
- White-paper requirements
- Notification / publication requirements
- Geographic or eligibility restrictions
- Privacy
- AML/KYC requirements
- Tax and accounting treatment

See:

`MICA-READINESS.md`

`../LEGAL-CHECKLIST.md`

`../EKNX-RISK-DISCLOSURE.md`

## Verification principle

Do not rely only on descriptive documentation.

Users, reviewers and auditors should verify the current deployed contracts,
on-chain state, official addresses and published source independently.

## Status vocabulary

Project documentation should use these terms consistently:

- **LIVE ON-CHAIN** — deployed and active on-chain
- **NOT ACTIVE** — not currently active
- **PENDING GRADUATION** — dependent on the deployed graduation condition
- **PLANNED** — future functionality not yet deployed

The Genesis Market bonding curve is **LIVE ON-CHAIN**.

The DEX stage is **NOT ACTIVE — PENDING GRADUATION**.
