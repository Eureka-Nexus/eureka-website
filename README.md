# Eureka Nexus Website

Production-ready static website for **eurekanexus.pt**.

## Public pages
- `index.html` — main ecosystem site with Eureka intro animation
- `company.html` — investors, team, careers, partnerships and contacts
- `network.html` — public mining network dashboard
- `contracts.html` — official BSC addresses and tokenomics
- `privacy.html` / `terms.html` — baseline privacy and risk notices

## Important configuration
Edit only `site-config.js` for addresses, contact emails, public pool endpoint and release download URLs.

## Before go-live
1. Confirm/create email aliases listed in `site-config.js`.
2. Keep download statuses as `soon` until verified public builds exist.
3. Expose the Mining Server through a secure public HTTPS read-only endpoint before setting `publicStatsUrl`.
4. Implement and test the fixed 1% mining-pool fee in the current production Mining Server before public mining launch.
5. Never upload private keys, seed phrases, signer secrets or `.env` files.

See `/docs` for deployment, GitHub and go-live notes.
