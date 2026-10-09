# Eureka Nexus — Security Policy

Security is a core requirement of the Eureka Nexus ecosystem.

## Reporting a vulnerability

Security-sensitive issues should not be disclosed first through a public GitHub issue.

Report vulnerabilities privately to:

`official@eurekanexus.pt`

Recommended subject:

`SECURITY — Eureka Nexus vulnerability report`

Please include, when possible:

- Affected repository or component
- Affected version
- Technical description
- Reproduction steps
- Expected behaviour
- Observed behaviour
- Potential security impact
- Relevant logs or screenshots that do not expose secrets

Do not include private keys, seed phrases or unrelated personal information.

---

## Sensitive information

Never commit, publish or send:

- Seed phrases
- Private keys
- Operator signing keys
- Relayer secrets
- API keys
- Passwords
- Authentication tokens
- `.env` files
- Keystore files
- Production database credentials
- RPC credentials intended to remain private

---

## Eureka Nexus Miner

The official Eureka Nexus Miner should only require the user's public BNB Smart Chain wallet address for reward attribution.

The official Miner must never require:

- Seed phrase
- Private key
- Wallet recovery phrase
- Exchange password
- Exchange API secret

If software claiming to be the official Miner requests those credentials, do not use it.

Official releases:

https://github.com/Eureka-Nexus/eureka-miner/releases

---

## EKNX contract verification

Always verify the official EKNX contract through official Eureka Nexus sources.

Official EKNX contract:

`0xF54913A8d5E2AEBD0B62c6411cCf1b5B4aB069c9`

Network:

BNB Smart Chain Mainnet

Chain ID:

`56`

Official contracts page:

https://eurekanexus.pt/contracts.html

---

## Website security

The public website must expose only information intended to be public.

Examples include:

- Public blockchain addresses
- Public documentation
- Verified software download information
- Read-only mining network information
- Official project links

Private operator credentials must never be embedded in public JavaScript or HTML.

---

## Mining infrastructure

Administrative mining endpoints must remain private unless intentionally designed for public read-only use.

The following must never be published:

- Signing keys
- Relayer private keys
- Operator credentials
- Internal administrative tokens
- Private RPC credentials
- Infrastructure passwords

Public mining endpoints should expose only intended read-only data.

---

## Automatic payout infrastructure

Automatic payout infrastructure must keep all signing material private.

Public users should only see information required to verify:

- Reward state
- Payout state
- Transaction hash
- Public wallet addresses
- Public blockchain events

---

## Eureka identity service

API provider credentials must remain outside the public repository.

Production secrets must be supplied through secure runtime configuration.

Generated user identity information must not be committed to GitHub.

This includes:

- Generated character images
- Private user profiles
- Recovery secrets
- Authentication data
- Private identity metadata

---

## Launch Curve security

The future EKNX Launch Curve must remain disabled until its production configuration has completed the applicable:

- Contract validation
- Security testing
- Access-control review
- Payment-token verification
- Pricing-formula validation
- Treasury routing validation
- Liquidity routing validation
- Emergency response planning
- Legal launch gate

No private key or operator secret should ever be placed inside frontend code.

---

## DEX transition

Before a future DEX transition, the project should verify and publicly document:

- Official DEX
- Official trading pair
- Token contract
- Pool contract
- Liquidity addresses
- Migration mechanism
- Relevant transaction hashes

Users should not trust unofficial pool addresses distributed through direct messages or comments.

---

## Dependency and supply-chain security

Public releases should use verifiable release assets and checksums where practical.

Third-party dependencies should be reviewed before inclusion in production software.

---

## Responsible disclosure

Please allow reasonable time for investigation and mitigation before publishing details of a vulnerability.

No bug bounty, payment or financial reward is promised unless a separate official programme explicitly states otherwise.

---

## Official security contact

`official@eurekanexus.pt`

Official website:

https://eurekanexus.pt

Official GitHub:

https://github.com/Eureka-Nexus
