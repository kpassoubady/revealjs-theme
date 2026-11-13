# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.3.0] - 2026-11-13

### Added
- **Source Citations**: Added `.source` footer line and `ul.refs.two-col` two-column list for the per-day References slide used by the citation skills.

## [1.2.0] - 2026-11-12

### Added
- **Recap Activity**: Added `section.recap` activity badge across Classic, Polished, and Polished + Gradients themes for session and day recaps.
- **Connect Slide**: Added closing instructor contact / LinkedIn slide layout (`section.connect`, `.connect-card`, `.connect-btn`, `.connect-subtitle`, `.connect-hint`) with responsive centering and polished radial background.
- **Interactive Agenda**: Added two-column interactive course agenda grid (`.agenda-grid`, `.agenda-col`, `.agenda-col-header`, `.agenda-session-tag`, `.agenda-list`, `.agenda-item`, `.agenda-num`, `.agenda-badge`, `.agenda-text`) supporting lecture, lab, and milestone badges.
- **Personal Icebreaker**: Added 3-card personal icebreaker prompt grid (`.personal-grid`, `.personal-card`, `.personal-number`) aligned with onboarding guidelines.
- **Summary Pillars & Course Journey**: Added summary module pillar cards and course journey capstone layouts (`.summary-pillars-grid`, `.summary-pillar-card`, `.pillar-badge`, `.course-journey-grid`, `.course-journey-card`, `.course-journey-badge`).
- **Milestone & Next-Day Banners**: Added banner callouts for previews and milestones (`.summary-next-banner`, `.course-capstone-banner`, `.next-day-pill`, `.capstone-pill`).
- **Table Utilities**: Added `.compact`, `.dense`, `.full`, and `.footer-clear` table modifier classes for high-density tabular schedules and technical comparisons.
- **References List**: Added `ul.refs` styling for clean, compact literature and academic citations.
- **Wide Code Column**: Added `.code-wide .cols-60-40` for wider 70/30 asymmetric column layouts accommodating long code samples.
- **Multi-Line Title Support**: Added `.title-slide .t-sub.low` for vertical clearance when presentation titles span three lines.

### Fixed
- **PDF Print Slide Numbers**: Fixed slide number legibility on printed PDF pages by matching `.pdf-page:has(:is(.lead, .divider, .title-slide)) .slide-number-pdf` to keep pale numbers on dark title slides and dark numbers on light content pages.

### Changed
- **CDN Guidelines**: Updated CDN linkage examples in `README.md` to use floating `reveal.js@5` core stylesheets instead of pinned `5.2.1` and bumped theme release tag pin to `@v1.2`.

## [1.1.0] - 2026-11-09

### Added
- **Hands-on Lab Divider**: Added `.lab-divider` / `.divider-lab` teal-to-green gradient variant for hands-on activity section dividers across Classic and Polished themes.
- **CDN Tag Guidelines**: Documented jsDelivr immutable tag pin usage (`@v1`, `@v1.1`) to ensure reliable CDN delivery and caching.

## [1.0.0] - 2026-11-08

### Added
- **Three Theme Expressions**: Standalone Classic theme (`blue-theme.css`), editorial Polished override (`blue-polished.css`), and semantic activity gradients (`blue-polished-gradients.css`).
- **Kavin School Branding**: Responsive SVG branding helper (`.slide-logo`) automatically switching between dark and light logos (`logo.svg`, `logo-white.svg`).
- **Typography**: Locally hosted variable fonts (Manrope and Space Grotesk) with SIL OFL licenses.
- **Slide Vocabulary**: Semantic layouts for `lead`, `divider`, `concept`, `demo`, `discussion`, `discussion-answer`, `chat-check`, `chat-check-answer`, `chat-waterfall`, `chat-waterfall-answer`, `lab`, `kahoot`, and `title-slide`.
- **Card and Grid Layouts**: Added `.capability-grid`, `.capability-card`, `.boundary`, `.term-grid`, `.term-card`, and GitHub-flavored alert callouts (`.gfm-alert`).
- **Offline Showcase & Test Suite**: Self-contained Reveal.js presentation in `examples/index.html` with interactive theme switcher, speaker notes, and Node test suite.
