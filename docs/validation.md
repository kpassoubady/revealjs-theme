# Validation

## Automated Checks

Run `npm ci && npm test`. The Node test suite checks palette fidelity,
font assets and licenses, sample vocabulary, offline asset references,
and HTTP preview access restrictions.

## Browser Checklist

Run `npm start`, then inspect:

- Polished: `http://localhost:4173/`.
- Classic: `http://localhost:4173/?theme=classic`.
- Polished + Gradients: `http://localhost:4173/?theme=polished-gradients`.
- Use the top comparison links on a demo, discussion, or answer slide;
  the selected theme should change without losing the slide position.
- Overview: press Esc; all slides should retain their individual backgrounds.
- Vertical stack: navigate down from "Vertical stacks still work."
- Notes: press S; speaker notes should open independently.
- Small viewport: test at 390 x 844; the canvas should scale without
  document-level horizontal scrolling.
- Reduced motion: emulate the preference and reload; transitions should be off.
- Print: `http://localhost:4173/?print-pdf` and the classic equivalent.
  Confirm one page per slide, badges, code, title gradients, and padding.

For a geometry check, run this in the browser console after fonts load:

```js
await document.fonts.ready;
const failures = [];
for (const slide of Reveal.getSlides()) {
  const { h, v } = Reveal.getIndices(slide);
  Reveal.slide(h, v);
  if (slide.scrollHeight > slide.clientHeight + 1 ||
      slide.scrollWidth > slide.clientWidth + 1) {
    failures.push({ h, v, className: slide.className });
  }
}
console.table(failures);
```

Geometry is not a substitute for visual review, link contrast, keyboard
testing, or checking the final exported PDF.

## Verified On 4 November 2026

- `npm test`: four checks passed; dependency audit reported no vulnerabilities.
- Polished and classic showcase: 20 slides each, no section scroll overflow.
- Keyboard right-arrow navigation and Esc overview: passed.
- Speaker view: opened with S; current/upcoming slides and instructor notes
  appeared in the standard notes window.
- 390 x 844 viewport: canvas scale 0.3046875; document width stayed 390px.
- Reduced-motion emulation: configured transition was `none`.
- Polished PDF: generated a 20-page PDF with backgrounds; activity padding
  remained 94px. Classic print mode also generated 20 page containers.
- Temporary copies of the current Intermediate DevOps decks, using the
  documented 22px compatibility settings: day 1 had 56 slides, day 2 had
  53, day 3 had 53; no section scroll overflow was detected.

The course check was geometry-only, not a complete visual or content audit.
Linked course media were not copied into the temporary preview. No original
course file was modified. Speaker notes use the standard plugin; the PDF
check did not include notes pages.

## Third-Variant Comparison

The Polished + Gradients addition passes five Node tests. All three variants
were rechecked across the 20-slide showcase with no section scroll overflow.
Computed styles confirm that Classic retains its original short gradients,
Polished retains its radial canvas, and the third variant has wider semantic
activity gradients while keeping Space Grotesk headings.

Demo, discussion, and answer slides were visually inspected. The third
variant leaves the original activity designs intact.

## Kavin School Branding

Six Node tests pass, including SVG asset references, accessible logo markup,
and SVG HTTP content types. The original logo assets are used unchanged.

The gradient showcase has one logo on each of its 20 leaf slides and none on
vertical-stack wrappers. Section geometry checks report no scroll overflow.
Light slides resolve `logo.svg`; dark title and divider classes resolve
`logo-white.svg`. Screenshots confirm footer placement without replacing the
activity badge or title decoration. At 390 x 844, document width remains 390px.

A 20-page PDF was generated with background graphics enabled; all 20 logo
elements remain in their slide-local positions with the correct asset choice.
