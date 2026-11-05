# Design And Upstream References

Researched 4 November 2026.

## Source Identity

The local `marp-themes/blue-theme.css` supplies the brand colors:
`#1a73e8`, `#0d47a1`, and `#00bfa5`. Classic retains its gradient lead/divider
slides, light content canvas, teal heading rules, tables, callouts, and
activity vocabulary. Darker companion colors improve small-label contrast;
teal remains the decorative accent rather than white-on-teal badge text.

Polished is an optional override, not a competing theme: it adds Space
Grotesk display type, Manrope body text, an ink-to-blue chapter gradient,
subtle circular decoration, and quieter content-slide rules.

## Reveal.js

- https://revealjs.com/ and https://revealjs.com/themes/:
  custom themes can be plain CSS; official theme variables use `--r-*`.
- https://revealjs.com/presentation-size/:
  Reveal scales a fixed canvas. Keep that engine, rather than introducing
  viewport media queries that unexpectedly rearrange slide content.
- https://revealjs.com/backgrounds/:
  `data-background-*` paints a full-viewport background outside the slide.
  This theme paints the section itself so its colors also survive overview,
  vertical stacks, and PDF. Prefer removing old background attributes during
  adoption; explicit author backgrounds remain under author control.
- https://revealjs.com/pdf-export/:
  use Chromium's `?print-pdf` mode and enable background graphics.
- https://revealjs.com/speaker-view/:
  retain the standard notes plugin and avoid styling the notes window.

## Marp

- https://marp.app/: Markdown authoring and rendering ecosystem.
- https://marpit.marp.app/theme-css:
  slides are sections, but Marpit scopes theme selectors and treats `:root`
  as each slide; those rules cannot simply be pasted into a Reveal deck.
- https://marpit.marp.app/directives:
  Marp's per-slide `class` directive becomes ordinary section classes in
  Reveal. Marp front matter, pagination, and header/footer directives are
  not interpreted by Reveal.js or this CSS.

## Deliberate Boundaries

No build pipeline, icon dependency, external font API, theme JavaScript, or
content-conversion layer. Existing inline SVG colors are not rewritten:
those diagrams are course content and should be reviewed separately.
The Kavin School SVGs were subsequently supplied by the instructor. Branding
is opt-in per slide and uses the original blue and white-and-teal assets.
