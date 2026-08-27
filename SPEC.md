# Portfolio — SPEC

A plain HTML/CSS/JS portfolio. No frameworks, no bundler, no build step. Open
any `.html` file directly in a browser (or serve the `portfolio/` folder with a
static server) and it runs.

This document is the contract for how the site is built. Read it before adding
or changing anything.

---

## File structure

```
portfolio/
├── SPEC.md                     # this file
├── index.html                 # home / landing + selected work
├── about.html                 # about / bio page
├── projects/
│   └── project-template.html  # case-study template — copy per project
├── assets/
│   ├── images/                # real imagery (replaces grey placeholders)
│   └── icons/                 # icons / svg
├── css/
│   ├── tokens.css             # design tokens (ONLY place raw values live)
│   ├── global.css             # reset, base type, grid, layout, animations
│   └── components.css         # named, reusable UI components
└── js/
    └── main.js                # scroll-reveal IntersectionObserver only
```

---

## Design tokens (`css/tokens.css`)

`tokens.css` is the single source of truth. **Never hardcode a color, size,
space, radius, or duration anywhere else — always reference a `var(--token)`.**
All values are pulled from the Figma file.

### Color

| Token                 | Value     | Used for                                   |
| --------------------- | --------- | ------------------------------------------ |
| `--color-bg`          | `#ffffff` | Page background (home)                     |
| `--color-surface`     | `#faf9f7` | Warm off-white: hero band, project page bg |
| `--color-surface-alt` | `#edeae5` | Image placeholders, project hero band      |
| `--color-ink`         | `#1a1a18` | Primary text, dark button fill             |
| `--color-ink-inverse` | `#faf9f7` | Text on dark surfaces (button label)       |
| `--color-muted`       | `#8c8a86` | Secondary text, tags, field labels         |

### Typography

Families: `--font-sans` = **Inter** (400/600), `--font-serif` = **Source Serif 4**
(400, plus italic). Loaded from Google Fonts in each page `<head>`.

Each size token pairs with a matching line-height token:

| Size token       | Size / line | Used for                          |
| ---------------- | ----------- | --------------------------------- |
| `--text-label-*` | 14 / 20     | Uppercase field labels (semibold) |
| `--text-base-*`  | 16 / 24     | Body, nav, metadata, buttons      |
| `--text-lg-*`    | 20 / 30     | Project copy, card titles, leads  |
| `--text-2xl-*`   | 24 / 32     | Serif section subtitles           |
| `--text-3xl-*`   | 32 / 32     | Serif project title               |
| `--text-4xl-*`   | 49 / 61     | Serif hero headline               |

Weights: `--weight-regular` (400), `--weight-semibold` (600).

Type utility classes live in `global.css`: `.t-label`, `.t-base`, `.t-lg`,
`.t-serif-2xl`, `.t-serif-3xl`, `.t-serif-4xl`, plus `.t-muted`, `.t-semibold`,
`.t-italic`.

### Spacing

`--space-1: 4px`, `--space-2: 10px`, `--space-3: 12px`, `--space-4: 24px`,
`--space-5: 40px`, `--space-6: 80px`. (24px is also the grid gutter.)

### Radius & motion

- `--radius-image: 0px`, `--radius-pill: 99px`
- Durations `--duration-fast/base/slow` (150/300/600ms), easings
  `--ease-standard`, `--ease-out`, and `--stagger-step` (90ms).
- All motion tokens collapse to `0ms` under
  `@media (prefers-reduced-motion: reduce)`.

---

## Grid system & breakpoints (`css/global.css`)

A **12-column grid**, matching Figma exactly:

- Frame max width `--grid-max-width` = **1440px**
- Page margins `--grid-margin` = **100px** → content width **1240px**
- **12 columns**, gutter `--grid-gutter` = **24px**

Use the primitives:

- `.container` — centers content, applies max width + page margins.
- `.grid` — the 12-col grid. Add `.col-4 / .col-6 / .col-8 / .col-12` for spans,
  and `.start-5 / .start-7 / .start-9` for explicit column starts (used by the
  asymmetric hero and project layouts).

### Breakpoints (the grid collapses)

| Range            | Grid   | Margin | Notes                          |
| ---------------- | ------ | ------ | ------------------------------ |
| Desktop > 1024px | 12-col | 100px  | Full Figma layout              |
| Tablet ≤ 1024px  | 2-col  | 48px   | Spans collapse to 2; type down |
| Mobile ≤ 640px   | 1-col  | 24px   | Single column stacks           |

---

## File responsibilities

- **`tokens.css`** — owns every raw value. Owns nothing structural.
- **`global.css`** — owns reset, base element + body typography, type utility
  classes, the grid system, layout primitives, scroll-reveal/stagger keyframes,
  and the `@view-transition` rule. Must NOT define named components.
- **`components.css`** — owns named components (nav, hero, button, project card +
  gallery, project-page sections, image placeholder, footer). Must NOT define
  the grid or base typography.
- **`main.js`** — owns ONLY the scroll-reveal IntersectionObserver. No styling
  values; CSS does all animation.
- **HTML pages** — structure + placeholder content only. Every placeholder is
  marked with an `<!-- FILL IN: ... -->` comment.

---

## Component patterns

### Project card (`.project-card`)

```html
<article class="project-card reveal">
  <a class="project-card__media" href="projects/project-template.html">
    <div class="placeholder-img" style="--ratio: 608 / 434"></div>
  </a>
  <div class="project-card__meta t-lg">
    <a class="project-card__title" href="...">Project Title</a>
    <span class="project-card__tag">Short descriptor</span>
  </div>
</article>
```

- The grey box is `.placeholder-img`; set its aspect ratio with `--ratio`.
- Add `.project-card--wide` to make a card span the full gallery row.
- Cards live in `.gallery`; two-up cards go inside a `.gallery__row`.

### Image placeholder (`.placeholder-img`)

A grey box standing in for real imagery. Always set the ratio inline:
`style="--ratio: 3 / 4"`. Replace by swapping the `<div>` for an `<img>` from
`assets/images/` (keep the ratio to avoid layout shift).

### Project page (`projects/project-template.html`)

1. **Nav** (`.site-nav`)
2. **Header** (`.project-header` grid): serif title in cols 1–4,
   `.project-details` (timeline / role / scope / impact) in cols 5–12.
3. **Full-bleed hero image** (`.project-hero-img`).
4. **Body** (`.project-body__content`, cols 5–12): an intro paragraph followed
   by `.project-section` blocks. Each section = `.project-section__text`
   (subtitle + `__lead` + `__body`) optionally followed by `.project-images`
   (`--3` for a 3-up row, `--1` for full width).

---

## How to add a new project

1. **Duplicate the template:**
   `cp projects/project-template.html projects/my-project.html`
2. **Fill in the copy:** replace each `<!-- FILL IN: ... -->` placeholder
   (title, timeline, role, scope, impact, section text).
3. **Add real images:** drop files in `assets/images/`, then swap each
   `<div class="placeholder-img" style="--ratio: ...">` for
   `<img src="../assets/images/your-file.jpg" alt="..." />` (keep the ratio).
4. **Link it from the home page:** in `index.html`, point a `.project-card`'s
   `href` (both the media link and title link) at `projects/my-project.html`,
   and update its title + tag.
5. **Done.** No build step — just open the file or refresh the static server.

> Note: paths in `projects/*.html` step up one level (`../css/`, `../js/`,
> `../assets/`, `../index.html`) because the file lives in `projects/`.

---

## Animation conventions

| Interaction             | Trigger          | Mechanism                                                         |
| ----------------------- | ---------------- | ----------------------------------------------------------------- |
| Project card lift       | `:hover`         | `.project-card__media` transform + `box-shadow` transition        |
| Nav link underline      | `:hover` / focus | `.nav-link::after` scaleX transform                               |
| Button lift             | `:hover`         | `.button` translateY transition                                   |
| Page-load stagger-fade  | page load        | `.stagger-item` + `@keyframes fade-up`; per-item delay via `--i`  |
| Scroll-triggered reveal | enters viewport  | `.reveal` → `.visible` toggled by the observer in `main.js`       |
| Page transitions        | navigation       | View Transitions API via `@view-transition { navigation: auto; }` |

Conventions:

- **Scroll reveal:** add class `.reveal` to any element. A single
  `IntersectionObserver` in `main.js` adds `.visible` once it scrolls in; the
  CSS transition (opacity + translateY) does the animation. The observer
  `unobserve`s after firing once.
- **Stagger on load:** add `.stagger-item` to siblings and set `style="--i: 0"`,
  `1`, `2`… to order their entrance. Used in the hero.
- **Reduced motion:** every animation is disabled under
  `prefers-reduced-motion: reduce` (tokens go to `0ms`; `main.js` reveals all
  elements immediately).
