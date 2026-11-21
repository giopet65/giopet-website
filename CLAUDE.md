# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Static single-page "site under construction" for giopet.eu (personal site of an IT consultant / Solution Architect), hosted on GitHub Pages (custom domain via `CNAME`). Plain HTML/CSS/vanilla JS: no build step, no package manager, no tests, no linter. To preview, open `index.html` in a browser or serve the folder with any static server (e.g. `python -m http.server`). Deploying = pushing to `main` (the history has "Rilancio deploy" commits, i.e. empty/re-trigger commits to re-run Pages).

The README is a one-liner. Converse with the user in Italian; code comments and commit messages are also in Italian, so keep them that way. The site content itself is bilingual (Italian and English).

## Git rule

Never run `git commit` or `git push` without the user's explicit request. Consent applies only to that single request: when work is done, stop and propose the commit instead of making it.

## Architecture

- [index.html](index.html): static markup, SEO/OpenGraph meta, and a tiny inline script in `<head>` that adds the `js` class and applies the saved theme (`localStorage` key `giopet-theme`) before first paint to avoid flicker. The language/theme toggles live in `#topbar`, which is `hidden` until JS runs.
- [script.js](script.js): one IIFE. Holds the **IT/EN translation table `T`** (page strings, mailto subject, last-updated date, privacy text, and the boot-log lines rendered into `#term`). `applyLang()` fills elements via `data-i18n` (textContent) and `data-i18n-html` (innerHTML) attributes, updates `<html lang>`, title and the mailto link. `play()` drives the intro sequence (copper trace draws → LED pill turns on → log rows appear), by toggling classes `run` / `on` / `shown`; with `prefers-reduced-motion` everything is shown immediately. Language persists in `localStorage` key `giopet-lang`.
- [style.css](style.css): "graph paper" theme with CSS custom properties in `:root`; dark theme is applied both automatically (`prefers-color-scheme`) and explicitly via `:root[data-theme="dark"]`. The hero "circuit" is built from fixed-px SVG segments plus stretchy `.run-line` spans; the geometry comment near line 205 explains the fixed 36px box / y=18 alignment, so keep these in sync when editing the trace. Fonts are self-hosted in `fonts/` (SIL OFL licenses included).
- [404.html](404.html): standalone error page.
- Folders: `img/` holds all images (favicon, `og-image.png` referenced by absolute URL in the OpenGraph meta, so keep that path stable: social platforms cache it), `fonts/` the self-hosted fonts.

## Conventions to preserve

- **Progressive enhancement**: without JS the page must still be complete (text visible, trace drawn, LED on). CSS animation rules are scoped to the `.js` / `.run` classes for this reason; don't make content depend on JS.
- **Bilingual content**: any user-visible string change must be made in both `T.it` and `T.en` in script.js, *and* in the Italian fallback text in index.html (the default markup is Italian and is what no-JS users and crawlers see). Update the last-updated date (`T.*.date`, the `<time>` element, and "rev." in the footer) together.
- **Privacy stance**: the page claims no cookies, no analytics, no forms and no external requests beyond the GitHub privacy link; don't add trackers, CDNs or external fonts without updating the privacy text in both languages.
