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

Copy the CSS files and `assets/fonts/` into a theme directory, preserving their
relative paths. No Sass compilation or theme plugin is required.

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
The original Classic and Polished stylesheets are unchanged.

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
| `concept`, `demo`, `lab`, `kahoot` | Instruction, demonstrations, practice, retrieval |
| `discussion`, `discussion-answer` | Discussion and resolution |
| `chat-check`, `chat-check-answer` | Quick poll and answer |
| `chat-waterfall`, `chat-waterfall-answer` | Simultaneous chat and key points |
| `title-slide`, `t-main`, `t-sub`, `t-meta`, `t-band` | Existing DevOps deck title markup |
| `columns2`, `cols`, `cols-60-40` | Equal or asymmetric columns |
| `capability-grid`, `capability-card`, `boundary` | Comparisons with an optional caveat |
| `term-grid`, `term-card`, `tag` | Vocabulary recaps |
| `gfm-alert`, `gfm-note/tip/important/warning/caution` | Explicit HTML callouts |
| `industry-badge`, `skip-badge`, `reference-badge` | Delivery signals |
| `eyebrow`, `small`, `muted`, `accent` | Text helpers |

Callouts need explicit HTML; this CSS does not parse GitHub alert Markdown.
Use the showcase as the markup reference. Semantic headings, meaningful image
alt text, table headers, and sensible reading order remain the author's job.

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

See [DevOps adoption](docs/intermediate-devops.md) for a non-destructive
integration recipe and [research notes](docs/research.md) for upstream guidance.

Fonts are redistributed under their included SIL Open Font License files.
This repository does not grant rights to third-party course content or logos.
