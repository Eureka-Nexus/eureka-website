# Eureka Nexus 3.0 — Beyond Reality

**Cinematic / animated / seven-language website**, built as static, self-hostable pages for GitHub Pages.

Languages: `pt`, `en`, `es`, `fr`, `de`, `ru`, `zh` (simplified Chinese). 70 actual HTML pages; not third-party machine translation. Browser-language detection on first arrival to `/`, with always-available manual language switching. The seven locale-specific roots are `/`, `/en/`, `/es/`, `/fr/`, `/de/`, `/ru/`, `/zh/`.

Features:
- Animated *golden neural data traffic*: eight moving energy packets travel along SVG links between Neural Core, Memory, Learning, Perception, Compute, Identity, Eureka World, Reasoning.
- Gold/green neural starfield canvas, rings, scroll reveals, gold pulsing status indicators and pointer parallax. Low-density / capped frame-rate mobile rendering; disabled for `prefers-reduced-motion`.
- Homepage, Eureka AI, Eureka World, Compute Network, Development, Investors, Future Token, Contact, Privacy and Terms for all seven locales.
- SEO: canonical URLs, hreflang links, 70-page sitemap, robots, OG preview.
- Authentic development gallery via `assets/media/manifest.json`; starts empty to avoid fictional screenshots being presented as actual product captures.
- No payments or active token/presale. Investor form is a `mailto:` helper; user must send from their email app. No tracker or external front-end dependencies.
- Financial, product and safety caveats. Claims reflect intent and require engineering/legal validation before launch.

## Validate/build

```bash
python3 scripts/build_site.py
python3 scripts/validate.py
node --check assets/site.js
python3 -m http.server 8765
```

Open http://localhost:8765/ and http://localhost:8765/en/; test locale switching.

**Production is NOT changed by building/extracting this ZIP.** The staging helper `deployment/stage-in-github.sh` creates a review branch after validating current main commit and making a complete Git bundle. Never blindly overwrite a newer `main`.

## Real media gallery

Place real program screenshots/videos in `assets/media/`, e.g. `compute-demo-2026.webp`. Edit `assets/media/manifest.json`:

```json
[
  {"file":"compute-demo-2026.webp","title":{"pt":"Demonstração real do Compute Node","en":"Actual Compute Node demo"}}
]
```

Update title translations in other languages as desired; English is the fallback caption. Avoid personal data and secrets in screenshots; only use recordings that accurately demonstrate the system.

## Legal / privacy review

The legal pages describe the current static site and are informational, not final legal advice. Before user accounts, collecting sensor data, investment offerings, wallet integration, presales, or public compute, publish accurate legal documentation and independently verify regulatory obligations. The email `official@eurekanexus.pt` should be confirmed as working before public rollout.

## Design

Own futuristic design direction; inspired by cinematic neural interfaces but not a copy of other brands or films.
