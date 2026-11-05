# Adopting In Intermediate DevOps

The course working tree was already modified when this theme was created.
No course files were changed. These instructions are an opt-in migration,
not a claim that all existing slides already fit the larger theme type.

## Local Installation

From the course repository, copy the theme into a dedicated directory:

```sh
mkdir -p devops-demos/slides/themes/blue
cp ../revealjs-theme/blue-theme.css ../revealjs-theme/blue-polished.css \
  devops-demos/slides/themes/blue/
cp -R ../revealjs-theme/assets devops-demos/slides/themes/blue/
cp ../revealjs-theme/logo.svg ../revealjs-theme/logo-white.svg \
  devops-demos/slides/themes/blue/
```

In `day1.html`, `day2.html`, and `day3.html`, replace the existing
`<link rel="stylesheet" href="theme.css">` with:

```html
<link rel="stylesheet" href="themes/blue/blue-theme.css">
<link rel="stylesheet" href="themes/blue/blue-polished.css">
```

To choose Polished + Gradients instead, also copy
`../revealjs-theme/blue-polished-gradients.css` into the same directory and
add this link after the two theme links:

```html
<link rel="stylesheet" href="themes/blue/blue-polished-gradients.css">
```

This adds semantic activity gradients while retaining polished content slides.
Omit the third link to keep the original Polished appearance.

For branding, add `<span class="slide-logo" role="img"
aria-label="Kavin School"></span>` inside each leaf slide. The logo switches
to white-and-teal automatically on `title-slide`, `lead`, and `divider`.
Do not put it on a parent section that holds vertical slides.

Keep Reveal's `reset.css`, `reveal.css`, JavaScript, notes plugin, and
initialization. The current `1280 x 720`, `center: false`, `margin: 0`
configuration already matches the theme.

The course's `.title-slide` / `.t-*`, `.cols`, `.cols-60-40`,
`.diagram`, `.small`, and engagement class names are supported.
Remove old `data-background-color="#0B1F3A"` from title slides to avoid
navy gutters competing with the new title background.

## Density Compatibility

The original course uses 22px body text, while the reusable theme defaults
to 28px. Start by reviewing the course at the new size. If retaining all
existing layouts is important, add this AFTER the theme links:

```html
<style>
  :root { --r-main-font-size: 22px; --slide-padding: 52px 72px 56px; }
  .reveal h2 { font-size: 36px; }
  .reveal pre, .reveal pre code { font-size: 17px; }
  .reveal table { font-size: 20px; }
  .reveal .small { font-size: 18px; }
</style>
```

This is a starting point, not an automatic overflow fix. Activity badges use
some vertical space; split crowded slides rather than shrinking every slide.
Per-day inline styles, such as compact schedule tables, still apply.

## Review Before Teaching

- Check every slide in all three days, especially tables, long commands,
  activity slides, and diagrams with hard-coded dimensions.
- Check overview, vertical navigation, notes, and PDF export.
- Verify image paths and source links remain unchanged.
- Use local Reveal.js files as well if you need the course itself offline;
  changing the theme does not remove its existing Reveal CDN dependency.
