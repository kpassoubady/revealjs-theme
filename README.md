# revealjs-theme

A reusable blue theme for Reveal.js 5, carrying the visual identity of
[marp-themes](https://github.com/kpassoubady/marp-themes) into HTML course decks.

Three expressions share one foundation:

- Classic: the original blue / deep-blue / teal palette, centered gradient
  title slides, clear heading rules, and familiar activity badges.
- Polished (recommended): expressive Space Grotesk headings, left-aligned
  chapter openers, subtle atmospheric backgrounds, and refined cards and code.
- Polished + Gradients: the polished design with distinct teal demo/lab,
  purple discussion, green answer, blue poll, and amber waterfall gradients.
  Activity heading accents and code borders follow the same semantic colors.

## Preview

Requires Node.js 20 or newer.

```sh
npm ci
npm start
```

Open http://localhost:4173 for polished,
http://localhost:4173/?theme=classic for classic, or
http://localhost:4173/?theme=polished-gradients for the third variant.
The comparison links at the top keep your current slide when switching,
so demos, discussions, and answers can be compared directly.
The demo runs without network
access after installation, including fonts and speaker notes.

Use arrow keys or swipe to navigate, Esc for overview, and S for speaker notes.
All three variants preserve Reveal's scaling, keyboard navigation, fragments, and
vertical stacks. Reduced-motion preferences disable transitions.

## Use In A Deck

### Via CDN (Recommended for multi-course consistency)

Link directly via jsDelivr pinned to an immutable release tag (`@v1.3`):

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@5/dist/reset.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@5/dist/reveal.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/kpassoubady/revealjs-theme@v1.3/blue-theme.css">
<!-- Optional, recommended refinement -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/kpassoubady/revealjs-theme@v1.3/blue-polished.css">
<!-- Optional third variant: polished design with activity gradients -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/kpassoubady/revealjs-theme@v1.3/blue-polished-gradients.css">
```

Always pin to a version tag (`@v1.3`), never to `@main`. Tagged CDN URLs are immutable, cached reliably, and serve with CORS enabled for font and logo assets.

### Local Installation

Alternatively, copy the CSS files, `logo.svg`, `logo-white.svg`, and `assets/fonts/` into a
theme directory, preserving their relative paths. No Sass compilation or
theme plugin is required.

```html
<link rel="stylesheet" href="reveal/dist/reset.css">
<link rel="stylesheet" href="reveal/dist/reveal.css">
<link rel="stylesheet" href="theme/blue-theme.css">
<!-- Optional, recommended refinement -->
<link rel="stylesheet" href="theme/blue-polished.css">
<!-- Optional third variant: polished design with activity gradients -->
<link rel="stylesheet" href="theme/blue-polished-gradients.css">
```

Classic uses only `blue-theme.css`; Polished uses the first two theme files;
Polished + Gradients uses all three, in the order shown.
The branding helper is shared by all three variants; activity designs remain
independent of the logo.

Do not load another Reveal theme (such as `black.css`) alongside this theme.

```js
Reveal.initialize({
  width: 1280, height: 720, margin: 0, center: false,
  hash: true, slideNumber: 'c/t',
  pdfSeparateFragments: false
});
```

The 1280 x 720 canvas scales to mobile displays; it does not reflow into a
scrolling article. Short slides remain the best way to preserve readability.
Decks with different aspect ratios may need spacing adjustments.

```html
<section class="lead">
  <p class="eyebrow">Day 1 / Continuous integration</p>
  <h1>Small changes. Fast feedback.</h1>
  <p>Kangeyan Passoubady</p>
</section>
<section class="demo">
  <h2>Run your first pipeline</h2>
  <p>Predict the result before you execute it.</p>
</section>
```

## Slide Vocabulary

| Classes | Purpose |
| --- | --- |
| `lead`, `divider` | Title and chapter slides |
| `concept`, `demo`, `lab`, `kahoot`, `recap` | Instruction, demonstrations, practice, retrieval, and recaps |
| `discussion`, `discussion-answer` | Discussion and resolution |
| `chat-check`, `chat-check-answer` | Quick poll and answer |
| `chat-waterfall`, `chat-waterfall-answer` | Simultaneous chat and key points |
| `connect`, `connect-card`, `connect-btn` | Instructor contact and LinkedIn connect slide |
| `personal-grid`, `personal-card`, `personal-number` | Personal icebreaker 3-card prompt |
| `agenda-grid`, `agenda-col`, `agenda-badge` | Interactive course agenda with AM/PM sessions and badges |
| `summary-pillars-grid`, `course-journey-grid` | Module summary pillars and 3-day course journey capstone |
| `summary-next-banner`, `course-capstone-banner` | Next-day preview and capstone outcome banners |
| `title-slide`, `t-main`, `t-sub`, `t-meta`, `t-band` | Existing DevOps deck title markup (`t-sub.low` for 3-line titles) |
| `columns2`, `cols`, `cols-60-40`, `code-wide` | Equal columns, 60/40 split, or 70/30 wide code column |
| `table.compact`, `table.dense`, `table.full` | High-density and full-width data and schedule tables |
| `refs`, `refs two-col` | Compact citations and references list, optionally in two columns (`ul.refs`) |
| `source` | One-line source footer under a cited claim (`p.source`) |
| `capability-grid`, `capability-card`, `boundary` | Comparisons with an optional caveat |
| `term-grid`, `term-card`, `tag` | Vocabulary recaps |
| `gfm-alert`, `gfm-note/tip/important/warning/caution` | Explicit HTML callouts |
| `industry-badge`, `skip-badge`, `reference-badge` | Delivery signals |
| `eyebrow`, `small`, `muted`, `accent` | Text helpers |
| `slide-logo` | Automatic light/dark Kavin School branding |

Callouts need explicit HTML; this CSS does not parse GitHub alert Markdown.
Use the showcase as the markup reference. Semantic headings, meaningful image
alt text, table headers, and sensible reading order remain the author's job.

## Kavin School Branding

The supplied SVGs work unchanged in Reveal.js. Add this element inside each
slide that should carry the logo (not on a vertical-stack wrapper):

```html
<span class="slide-logo" role="img" aria-label="Kavin School"></span>
```

It sits in the bottom-right footer area, away from activity badges and slide
numbers. Content and activity slides use `logo.svg`; `lead`, `divider`, and
`title-slide` automatically use the white-and-teal `logo-white.svg`.
It works with Classic, Polished, and Polished + Gradients. The sample adds the
element to every leaf slide before initializing Reveal; your template can
emit the same markup directly, with no logo JavaScript required.

The SVG paths resolve relative to `blue-theme.css`, not the deck HTML.
Keep both SVGs beside that stylesheet when copying or hosting the theme.
No font conversion or raster replacement is needed. The optional `logo.png`
is not used by the theme.

```css
/* Optional deck-level adjustments, in canvas pixels. */
.reveal {
  --slide-logo-width: 160px;
  --slide-logo-right: 64px;
  --slide-logo-bottom: 16px;
}
```

Omit the element on an unbranded slide. For a custom dark background on a
regular slide, explicitly set its logo:

```html
<span class="slide-logo" role="img" aria-label="Kavin School"
      style="background-image: url('theme/logo-white.svg')"></span>
```

That inline URL is relative to the deck HTML. The original Marp-style
`<img class="logo" src="theme/logo.svg" alt="Kavin School">` helper also
remains available if you prefer choosing the asset manually.
For PDF export, keep background graphics enabled.

## Distribution

This repository is private by default. Public jsDelivr URLs cannot serve a
private repository. Use local copies for reliable offline teaching.

If you later make the repository public, pin CDN URLs to an immutable release
tag or full commit hash:

```text
https://cdn.jsdelivr.net/gh/kpassoubady/revealjs-theme@<COMMIT-SHA>/blue-theme.css
https://cdn.jsdelivr.net/gh/kpassoubady/revealjs-theme@<COMMIT-SHA>/blue-polished.css
https://cdn.jsdelivr.net/gh/kpassoubady/revealjs-theme@<COMMIT-SHA>/blue-polished-gradients.css
```

Relative font URLs resolve next to those stylesheets. Do not use GitHub raw
URLs or `@main`, and do not reuse release tags.

## PDF And Validation

Open the demo with `?print-pdf` (or `?theme=classic&print-pdf`) in Chromium,
then print to PDF with landscape layout, no margins, and background graphics
enabled. Print padding is restored after Reveal applies its print styles.
Keep slides within the canvas rather than hiding overflowing content.

```sh
npm test
```

Tests cover palette fidelity, bundled fonts/licenses, slide vocabulary,
offline sample references, and preview server path restrictions. Browser
checks are described in [docs/validation.md](docs/validation.md).

See [Changelog](CHANGELOG.md) for version history, [DevOps adoption](docs/intermediate-devops.md) for a non-destructive
integration recipe, and [research notes](docs/research.md) for upstream guidance.

Fonts are redistributed under their included SIL Open Font License files.
This repository does not grant rights to third-party course content or logos.


## Release Process:
```bash
# 1. Automatically bump version, update README CDN URLs & CHANGELOG.md, and run tests
npm run release minor

# 2. Review CHANGELOG.md, commit, tag, and push
git commit -am "RELEASE: v1.3"
git tag v1.3
git push origin main && git push origin v1.3  
```

