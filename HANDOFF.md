# Portfolio v2 Handoff Briefing

## Goal
Continue the portfolio v2 redesign. Immediate tasks:
1. Update Google Maps (`googlemaps.html`) and Hemi (`hemi.html`) case study pages to match the Yammii page layout (gradient background + white card containing content)
2. Add a placeholder 4th project card on the homepage for a "Fiat Designathon" project
3. Continue refining any remaining issues

## Current State

### What's Done
- **Homepage** (`index.html`): Complete redesign with blue-to-orchid-pink gradient hero, tulip cutout with sway animation, floating bokeh petals, twinkling sparkles, shooting stars, click-to-sparkle interaction, cursor pixie dust trail, wind speed toggle, petal burst on tulip click, view-project pill cursor on cards, Pinyon Script cursive initials on "Ruby Qian" name
- **Fun page** (`fun.html`): Gradient background + white card layout, no lightbox (removed), gallery items not clickable, doodles layout with tall left image spanning 2 rows
- **Yammii page** (`yammii.html`): Already updated with gradient bg + white card layout (USE THIS AS THE TEMPLATE for googlemaps and hemi)
- **Nav**: All pages have logo icon only (no name text), pill with Home/Projects/Fun/About me, liquid glass style on gradient pages
- **Footer**: Minimal single line inside gradient — "Home · Projects · Fun · About me" on left, "© 2026 Ruby Qian" on right, white text
- **Projects link**: Points to `/#projects` (no separate projects page)
- **reveal.js**: Has `no-reveal` class support to skip scroll animations, `restorePage()` runs on every load, fadeInUp animation disabled in style.css (was causing blank pages)

### Key Design Decisions
- **Gradient**: `linear-gradient(160deg, #B8D4EC 0%, #B0CCE8 25%, #A8C4E4 50%, #BED0E8 75%, #D4A0BC 100%)` — blue to orchid pink
- **Typography**: Libre Caslon Display for name, Pinyon Script cursive for R and Q initials, Manrope for body, Cormorant Garamond italic for tagline emphasis
- **Nav on gradient pages**: Liquid glass style B — `background: linear-gradient(135deg, rgba(255,255,255,0.25)...); backdrop-filter: blur(20px) saturate(1.5);` with white text. Applied via `body.page-home` class in style.css
- **Footer on gradient pages**: White text with text-shadows, inside the gradient wrapper div
- **Card pages (fun, case studies)**: `body.page-home no-reveal` classes, body background set to gradient, content in `.page-card` white card with `border-radius: 24px; padding: 60px 80px 80px;`
- **No lightbox on fun page**: Removed entirely
- **Sparkle colors**: Mix of white + very light pink, full opacity
- **Petal style**: Style A (soft bokeh ovals, not SVGs)

### What's NOT Working / Gotchas
- `fadeInUp` animation in style.css was causing blank pages — DISABLED (line ~95 of style.css, replaced with comment)
- Page transitions can cause blank pages if `page-exit` class isn't removed — `restorePage()` in reveal.js handles this
- `style.css` `.gallery-item { height: 240px; cursor: pointer; }` overrides card-specific heights — use `!important` or more specific selectors
- Fun page uses `body.page-home` class to get liquid glass nav — same approach needed for case study pages on gradient
- `projects.html` renamed to `projects-old.html` — all project links point to `/#projects`
- Server: `python3 serve.py 8081` with clean URL support (no .html needed)

## Relevant Files
- `/Users/rubyqian/Documents/GitHub/portfolio-v2/index.html` — homepage (all inline styles + JS)
- `/Users/rubyqian/Documents/GitHub/portfolio-v2/style.css` — shared styles
- `/Users/rubyqian/Documents/GitHub/portfolio-v2/reveal.js` — scroll reveals, page transitions, nav behavior
- `/Users/rubyqian/Documents/GitHub/portfolio-v2/fun.html` — fun page (RECENTLY UPDATED, good reference for card layout)
- `/Users/rubyqian/Documents/GitHub/portfolio-v2/yammii.html` — USE AS TEMPLATE for googlemaps/hemi updates
- `/Users/rubyqian/Documents/GitHub/portfolio-v2/serve.py` — dev server
- `/Users/rubyqian/.claude/projects/-Users-rubyqian-Documents-GitHub-portfolio/memory/` — memory files with full context

## What's Next
1. Look at `yammii.html` to understand the gradient bg + white card layout
2. Apply the same treatment to `googlemaps.html` and `hemi.html`
3. Add `body.page-home no-reveal` classes, gradient body background, wrap content in `.page-card`, update nav to match (logo only, Home link), update footer to minimal white-text style
4. Add a 4th project card placeholder on homepage `index.html` for "Fiat Designathon"
5. Ensure all interactions (sparkle trail, click sparkles, petals) work on new pages

## User Preferences (Critical)
- Very detail-oriented — notices 1px differences
- Prefers gentle/soft over dramatic animations
- Dislikes lavender, likes orchid pink (#D4A0BC)
- Wants to see mockups before implementing major changes
- Prefers direct recommendations when tired of choosing
- Uses "Hallo~" voice — playful, approachable
- Everything should feel whimsical, warm, spring/floral
