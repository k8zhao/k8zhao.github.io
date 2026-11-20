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
    ├── main.js                # scroll-reveal IntersectionObserver only
    └── project-previews.js    # thumbnail typing + decorative carousel setup
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
| `--text-base-*`  | 16 / 24     | Project copy, body, nav, metadata |
| `--text-lg-*`    | 20 / 30     | Card titles and prominent copy    |
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
- **`main.js`** — owns ONLY the scroll-reveal IntersectionObserver.
- **`project-previews.js`** — owns character-by-character preview text updates
  and expansion of decorative carousel card templates.
  Starts on the icon's CSS `animationstart` event and cancels pending frames on
  `animationcancel`. Reads typing duration from the CSS token, not a JS constant.
  CSS owns all geometry and visual motion; neither script contains styling values.
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
4. **Body** (`.project-body__content`, full 12-column grid): an intro paragraph
   followed by `.project-section` blocks. Each section places its title in cols
   1–4 and `.project-section__text` (`__lead` + `__body`) in cols 5–10,
   equivalent to three paired layout columns. Sections can optionally include
   `.project-images` (`--3` for a 3-up row, `--1` for full width).

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
| Project thumbnail zoom  | card hover / keyboard focus | Image or `.project-card__visual` scales using `--project-hover-scale` |
| Contextual Copilot preview | card hover / keyboard focus | Icon bounces while a new prompt types over the original ghost text |
| Edge Settings preview | card hover / keyboard focus | First-row switch turns charcoal with a white thumb that slides right; resets on exit |
| Copilot in Edge preview | card hover / keyboard focus | Whole thumbnail zooms while individual cards orbit beneath the composer |
| Nav link underline      | `:hover` / focus | `.nav-link::after` scaleX transform                               |
| Button lift             | `:hover`         | `.button` translateY transition                                   |
| Page-load stagger-fade  | page load        | `.stagger-item` + `@keyframes fade-up`; per-item delay via `--i`  |
| Scroll-triggered reveal | enters viewport  | `.reveal` → `.visible` toggled by the observer in `main.js`       |
| Page transitions        | navigation       | View Transitions API via `@view-transition { navigation: auto; }` |

Conventions:

- **Easing:** consult the [Microsoft AI motion easing reference](https://mai.microsoft.design/motion/easing/)
  when defining new motion tokens. Its `Elastic_01` curve, supplied in the
  reference screenshot, is `cubic-bezier(0.20, 1.50, 0.40, 1.00)` and lives in
  `--ease-elastic-01`. The reference recommends it for scaling and translation
  of drop-down/pop-up menus and Copilot composer entrances. The thumbnail icon
  uses an `Elastic_01`-derived `--ease-copilot-bounce` envelope: a cosine lift
  during the first third, followed by an Elastic_01 return with cosine-smoothed
  time. The sampled CSS `linear()` curve starts and ends at zero, so one
  transform animation lifts, overshoots slightly on landing, and returns to
  rest without an abrupt start or a mid-animation easing restart.
- **Animated project thumbnails:** use `.project-card__visual` to group artwork
  layers so the existing thumbnail zoom transforms the group once, not each
  layer independently. Contextual Copilot, Edge Settings, and Copilot in Edge
  all zoom the complete thumbnail while their local animations run.
  Keep the media link and its descriptive image alt text;
  additional layers are decorative (`aria-hidden="true"`; use `alt=""` if
  they contain images).
- **Contextual Copilot:** `.contextual-preview` contains only one full
  `cc-thumbnail.png` image. A decorative span uses the small `cc-icon.png`
  background crop over an icon-sized mask. The original ghost text remains
  visible at rest. On hover/focus, a field-colored overlay replaces it with
  "i don't get it...", typed one character at a time; the inline caret
  follows the actual text width. Layers cannot expose duplicate thumbnails if
  CSS is missing or stale. Layer positions, sizes, and caret geometry
  are percentages of the square source image, defined in `tokens.css`; the
  bounce translation is a percentage of the cropped icon layer's height.
  Update the crops and geometry together if the artwork changes. Component-specific keyframes
  live in `components.css`, with their geometry and timing in `tokens.css`.
  The icon bounce and typing start together. The icon bounces for
  `--duration-copilot-bounce` (600ms); `project-previews.js` reveals the prompt
  over `--duration-copilot-type` (500ms), without splitting or clipping glyphs.
  The text uses container-relative type sizing so it scales with the artwork.
  This is decorative, not an input or live region. Each sequence runs once per
  hover/focus entry and restores the original ghost text on exit.
  Devices without hover and users requesting reduced motion see the original
  static artwork. Without JavaScript, the full hover prompt appears immediately.
  The home page versions its token/component stylesheet URLs when the thumbnail
  markup changes incompatibly, so cached styles do not misrender new layers.
- **Edge Settings:** `.settings-preview` overlays only the first-row switch
  in `settings-thumbnail2.png`. An artwork-colored mask hides its original
  switch/shadow; CSS draws the track and thumb using percentage-based tokens.
  Its on-state matches the supplied reference: `--color-settings-switch-on`
  is charcoal (`#242424`), with a white `--color-settings-switch-thumb-on`.
  The decorative switch turns on over `--duration-base` and returns to off on
  exit. It is not an interactive control; the surrounding project link stays
  unchanged. Non-hover/reduced-motion views remain off.
- **Copilot in Edge:** on motion-enabled hover devices, `.edge-preview__stage`
  renders the same card layers at rest and during hover/focus; do not swap
  artwork, change spacing, or reveal a different layout on entry. The composer
  above the stage stays fixed relative to the hero while the complete thumbnail
  zooms using `--project-hover-scale`. The three `carousel-*.png` assets are
  straightened, transparent crops of complete original cards, including their
  photographs, rounded silhouettes, and labels. All share a 694 / 584 canvas.
  Display the complete assets with `object-fit: contain`; do not independently
  crop their photographs or recreate their typography. Geometry matches the
  source artwork's 15-degree spacing and approximately 106.5cqw circle radius.
  Decorative
  cards orbit a large circular track, recreating the curved carousel motion of
  the [Microsoft Copilot reference](https://explore.microsoft.com/en-us/edge/copilot?profile=work).
  `project-previews.js` repeats the three HTML templates around the wheel and
  marks it ready only after its images decode, before CSS reveals it.
  Failed image decoding logs an error and retains the original hero.
  All geometry/timing lives in tokens.
  Keep `--edge-carousel-count` a multiple of three; angular step and loop turn
  are derived from that count. Each zero-sized `.edge-preview__orbit` places
  the center of an equally sized card on the circular track; the card itself
  is centered with `translate(-50%, -50%)`. The circle's horizontal center is
  the exact thumbnail midpoint, and `--edge-carousel-front-center` sets the
  topmost card's center height. This keeps the visible semicircle symmetric
  rather than rotating cards about their corners. The repeated sequence makes
  each 6-second cycle seamless. The animation exists in a paused state at rest;
  hover/focus changes only `animation-play-state`. It pauses at its current
  position on exit and resumes from that exact position on re-entry, avoiding
  a jump in either direction. Missing JS/CSS,
  reduced motion, and non-hover devices retain the original static image.
- **Scroll reveal:** add class `.reveal` to any element. A single
  `IntersectionObserver` in `main.js` adds `.visible` once it scrolls in; the
  CSS transition (opacity + translateY) does the animation. The observer
  `unobserve`s after firing once.
- **Stagger on load:** add `.stagger-item` to siblings and set `style="--i: 0"`,
  `1`, `2`… to order their entrance. Used in the hero.
- **Reduced motion:** every animation is disabled under
  `prefers-reduced-motion: reduce` (tokens go to `0ms`; `main.js` reveals all
  elements immediately).
