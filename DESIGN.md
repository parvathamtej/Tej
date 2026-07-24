# DESIGN.md

## Identity
Dark "ink" base flooded by one acid accent for a full chapter — Committed→Drenched color strategy. Reference lane: heynesh.com / ricardochance.com scroll-story portfolios, NOT editorial-magazine.

## Tokens (`src/styles/global.css`)
- `--color-ink #0E0E0C` page/dark · `--color-ink-soft #161613` surfaces
- `--color-bone #EDEAE3` text-on-dark · `--color-bone-dim` 55% secondary
- `--color-acid #C8F04B` THE accent (indexes, highlights, chapter flood) · `--color-acid-deep` hover
- Runtime chapter vars tweened by GSAP on `<html>`: `--bg-page`, `--fg-page`, `--hair`

## Type
- Display: **Clash Display 600**, uppercase, tracking -0.02em, leading 0.92 (`.display-type`)
- Body: **General Sans 400/500**
- Labels/data: **JetBrains Mono** (`.mono-label` — 0.72rem, +0.14em tracking)
- Accent words: **Gambetta 400 italic** (`.serif-accent`), inline inside display lines
- Deliberate deviation: masthead name + LET'S TALK exceed the usual 6rem display ceiling (clamp max 15rem) — viewport-filling wordmark is the reference lane's core move.

## Motion system (`src/lib/motion.js`)
One rhythm: enters `power4.out`, exits `power3.in`, wipes `power4.inOut`; DUR 1.1 / DUR_S 0.7 / stagger 0.06. Scrubbed timelines always `scrub: 1`. All pins/scrubs live inside `gsap.matchMedia` `no-preference` contexts; reduced-motion gets static/instant states. Lenis (1.15s) drives ScrollTrigger via `gsap.ticker`.

## Signature moves (keep consistent)
- Chapter index system `[01] — LABEL` (mono, acid index) + word-mask title rise — this IS the site's navigation grammar; it's a deliberate sequence (a chronology), not decorative eyebrows.
- ✦ glyph as recurring brand mark (favicon, hero spinner, marquee separators, preview badge).
- Hairlines use `var(--hair)` so they survive chapter inversion.
- Hover inversions: rows flip `bg var(--fg-page)` / `text var(--bg-page)` (works in both chapters).
- Custom cursor: acid dot (difference blend) + pill label from `data-cursor` attr (DRAG / VIEW / SAY HI).
- Grain overlay (SVG turbulence, 7%, overlay blend) on everything.

## Choreography map
Preloader wipe → Hero (char rise, marquee) → sinks under Manifesto (pin + word illumination, 160%) → Velocity (pin + horizontal track, mobile stacks) → acid flood → Stack (row stagger, type-on ticker) → ink flood → Work (hover preview chases cursor) → Receipts → fixed-footer curtain reveal (main has `mb-[100dvh]`).
