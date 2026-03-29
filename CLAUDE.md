# Ruby Qian — Portfolio

## Project Overview
Personal portfolio website for Ruby Qian. A clean, minimal, static site built with pure HTML, CSS, and vanilla JavaScript — no frameworks, no build tools.

## Tech Stack
- **HTML5** — semantic markup, one file per page
- **CSS3** — single `style.css` with CSS variables, BEM naming, responsive design
- **JavaScript** — minimal; `reveal.js` for scroll animations + inline lightbox on fun.html
- **Fonts** — Google Fonts: Manrope (headings/nav/body)
- **Dev server** — `python3 -m http.server 8080`

## File Structure
```
├── index.html          # Homepage (hero + featured project + CTA)
├── projects.html       # Projects listing (Yammii + 2 placeholder cards)
├── about.html          # About page (bio + contact)
├── fun.html            # Creative gallery (logos, doodles, animations)
├── yammii.html         # Yammii case study (detailed)
├── style.css           # All styles
├── reveal.js           # Intersection Observer scroll animations
└── images/
    ├── gem-logo-2.png  # Nav logo
    ├── headshot.avif   # About page photo
    ├── fun/            # Logos, doodles, animations for fun.html
    └── yammii/         # All Yammii case study assets
```

## Design System
- **Color palette:** Powder Blue — soft, airy
  - Accent: `#5a9ec9`, Background: `#f2f4f6`, Text: `#1a1a1a`, Footer: `#1a1a1a`
- **Typography:** Manrope for everything. Fluid sizing via `clamp()`.
- **Nav logo text:** `font-weight: 400` (light), `font-size: 18px`
- **Animations:** `fadeInUp` on load; `.reveal` with Intersection Observer
- **Responsive breakpoints:** 768px (tablet), 480px (mobile)

## Conventions
- **One CSS file** — organized by section with comments
- **BEM naming** — e.g. `nav__logo`, `project-card__title`, `gallery-item--tall`
- **CSS variables** for colors, fonts, spacing, transitions
- **No build step** — edit and refresh
- **File-based routing** — each page is a standalone `.html` file

## Page-Specific Notes

### Fun Page (`fun.html`)
- **Logos section:** Flex-wrap layout with natural aspect ratios. Gallery items at 240px height. Hover captions (dark overlay at bottom). Click-to-enlarge lightbox with left/right arrow navigation (keyboard arrows + circular buttons). JPG exploration sheets get `.gallery-item--framed` (white bg). Hannah logo uses `.gallery-item--sm` (140px). `.gallery-break` forces row wraps.
- **Doodles section:** Uses `.gallery-grid--doodles` — a flex layout with May 27 tall image on the left (`doodle-d`, 260px wide) and a nested `.doodle-right` div on the right containing two `.doodle-right__row` rows. Row items are 220px wide (row 2: 230px). Collection 1-12 (`.doodle-e`) is 390px wide. All row items use `align-items: stretch` + `object-fit: cover` for equal heights per row. Images use classes `doodle-a` through `doodle-g` for sizing.
- **Animations section:** `.gallery-grid--animations` with `.animation-row` flex rows. Videos autoplay, loop, muted. Row 1 videos: 220px height, row 2: 200px.
- **Lightbox:** Click any `.gallery-item img` to open. Arrows navigate between all gallery images. Escape or clicking backdrop closes. PNGs get white background (`.lightbox-img--png`). Lightbox max: 60vw × 70vh.

### Yammii Case Study (`yammii.html`)
- White background (`.case-study-page`) contrasts with main site gray
- Orange branding: borders `#e8cbb0`, accents `#d4804a`, light bg `#fdf6f0`, sidebar `#f0cdb0`
- Sticky sidebar nav (`position: fixed`) — must stay outside animated containers (transform breaks fixed positioning). Excluded from fadeInUp via `body > *:not(.nav):not(.case-study-sidebar)`
- Hidden on screens < 1280px wide
- Outcome section: 2-column grid with video prototype + stacked mockup images
- Special image classes: `.case-study-image--scope` (wider bleed), `.case-study-image--findings` (cropped whitespace)

### CTA Section
- White background with decorative gem-shaped elements (`.cta-gem`, `.cta-gem--2`) using clip-path polygons
- Left-aligned text with dark button + outline button

## Current Status

### Done
- Homepage, about, projects, fun pages fully built
- Fun page: logos with real images, doodles grid, animations with looping videos, lightbox
- Yammii case study: complete with all images, video, sidebar nav, features cards, reflections grid
- Social links: real Instagram, LinkedIn, email URLs
- Responsive layouts across all pages

### In Progress
- 2 placeholder project cards on projects.html — awaiting case study content
- Mobile responsive tweaks may be needed for doodles grid and animations

## Important Notes
- Keep it simple: no frameworks, no build tools. This is intentional.
- Images should display at natural aspect ratios unless explicitly stated otherwise.
- All new pages should follow the same nav/footer pattern and use existing CSS variables.
- Test at mobile (480px), tablet (768px), and desktop widths.
