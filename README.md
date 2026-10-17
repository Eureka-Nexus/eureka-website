# Eureka Nexus 2.1 — AI & Compute Network

Responsive bilingual (Portuguese / English), dependency-free static website for GitHub Pages. Pages: home, Eureka AI, Digital World, Compute Node, Development & real media gallery, Investors, Future Token, Contact, Privacy, Terms.

**Status:** proposed product and future token under development; no active sales, guaranteed payouts or live public compute releases.

## Build

`python3 scripts/build.py` recreates all static HTML files (Python 3.9+ only).

## Preview

`python3 -m http.server 8765` then visit `http://localhost:8765/` and `/en/`.

## Media

See `assets/media/README.md`. `assets/media/manifest.json` starts empty; add vetted real program screenshots and demo videos when available.

## Production procedure

1. Preserve a complete backup of the old repository.
2. Create a new review branch from the current website `main`.
3. Replace working tree files with the contents of this package, **excluding `.git`**; preserve any `.github` settings you need after review, but do not reinstate historical workflows.
4. Run `python3 scripts/build.py` and `python3 scripts/validate.py`.
5. Preview `/` and `/en/` locally. Verify legal/privacy text, links, phone layout and brand graphics.
6. Commit and push the review branch. Merge via PR after checks; GitHub Pages publishes `main`.

`deployment/install-into-website.sh` assists with branch setup but intentionally does **not** merge, force-push or deploy production automatically.

Official project contact: official@eurekanexus.pt
