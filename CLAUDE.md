# revealjs-theme

Reusable plain-CSS themes for Reveal.js 5, adapted from the instructor's
`marp-themes/blue-theme.css`. Scaffolded with `repo-init`.

## Structure
- `blue-theme.css`: standalone classic theme, loaded after Reveal's core CSS.
- `blue-polished.css`: optional editorial overrides, loaded after the classic theme.
- `blue-polished-gradients.css`: optional third layer restoring stronger
  semantic gradients for activities without changing the first two variants.
- `assets/fonts/`: locally hosted variable fonts and SIL OFL licenses.
- `logo.svg`, `logo-white.svg`: supplied Kavin School logos; the shared
  `slide-logo` helper chooses the variant from the slide class.
- `examples/index.html`: offline-capable showcase, including vertical slides.
- `tests/`: Node test runner checks; `scripts/serve.mjs`: loopback preview server.
- `docs/`: adoption guidance and research references.

## Commands
- `npm ci`: install pinned Reveal.js runtime for the showcase.
- `npm start`: serve the showcase at http://localhost:4173.
- `npm test`: check brand tokens, assets, sample coverage, and preview server.

## Conventions
- No CSS build step, external font services, or required theme JavaScript.
- Target 1280 x 720, `margin: 0`, `center: false`; retain Reveal's scaling.
- Scope content rules to `.reveal`; do not style the speaker-notes window.
- Keep classic brand tokens aligned with Marp; refinements belong in polished CSS.
- Check all three variants, overview, vertical slides, small viewport, and PDF.
- Use immutable commit hashes or new release tags for CDN consumers, never `@main`.
- Do not publish tags or modify consuming course repositories without approval.
