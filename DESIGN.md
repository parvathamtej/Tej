# DESIGN.md

Current as of V12. Where this file and `../PLAN.md` disagree, PLAN.md wins —
it carries the full version history and the reasoning behind every rule.

## Identity
Ink-dark, one acid accent, terminal-precise chrome. Clarity through mass, not
refinement: heavy plain sans at size, real numbers over adjectives, every claim
traceable to something real. No marquees, no em dashes, no AI-tell vocabulary.

## Tokens (`src/styles/global.css`)
- `--color-ink #0E0E0C` page · `--color-ink-soft #161613` surfaces
- `--color-bone #EDEAE3` text · `--color-bone-dim` 70%
- `--color-acid #C8F04B` the accent · `--color-acid-deep` hover
- Runtime chapter vars on `:root`: `--bg-page`, `--fg-page`, `--hair`,
  `--accent-ui`. All constant since V8: the Skills chapter changes MATERIAL
  (dot-matrix texture fades in), never hue. Flood colour history: acid ❌ bone ❌
  moss ❌ slate ❌ texture-only ✅.

## Type (V7 final, V8 discipline)
- Display: **Archivo** (variable; `wdth` LOCKED at 100, weight 700/800)
- Body: **Satoshi** (self-hosted, `public/fonts`)
- Data/labels: **IBM Plex Mono** 400/500 (never bold)
- SIZE FOLLOWS LENGTH, not importance: steps assigned by character count via
  `src/lib/type.js` (xl ≤12 chars · l ≤28 · m ≤55 · s over 55). No heading
  over 2 lines. Sentence case above two words; caps only for wordmarks,
  kickers, labels, chips.
- MEASURE IS CALIBRATED: `ch` is the "0" glyph; Satoshi prose needs `40ch`
  (~66 chars/line) and `deck` `38ch`. Re-measure if the body face changes.
- Spacing: 8px scale only. One left edge: 32px desktop, 20px mobile.

## Page structure (9 chapters, ~16 screens at 1440×900)
```
00 INTRO        Hero: name + ✦ (turbo egg), statement, credential. DotField
                atmosphere behind content, hero-scoped, fades on geometry.
01 HOW I WORK   Pinned single-frame: frozen left column (heading, deck, beat
                dots), right column is ONE bordered card swapping four states
                (3 company beats + payoff) with counter chip. Visuals: wipe /
                forty-fields collapse / hex bloom. All generated, deterministic.
02–04 EXPERIENCE Dossiers: left rail IS the chapter heading; horizontal card
                stage painted from scroll progress (coverflow geometry, rounded
                skin), progressive disclosure, agent card open by default.
                Hansi: one composed screen, no pin.
05 SKILLS       Ink + dot-matrix texture. Rows, hover focuses via :has().
06 PROJECTS     Rows with stateless hover preview (per-frame elementFromPoint).
07 BACKGROUND   Three columns: DEGREE / CREDENTIALS / LANGUAGES.
08 SAY HI       Fixed footer revealed by the page lifting off it.
```
Chrome: segmented top progress bar (3px track, acid fill, ink notches at true
chapter shares, hover thickens + label pills), bottom HUD (`03 / 07` counter +
chapter name + availability + IST clock), custom cursor, grain.

## Motion (V6 spec, unchanged)
One ease: `CustomEase '0.22,1,0.36,1'`. Entrances 700–900ms, chapters
1000–1200ms, micro 200–300ms. Forbidden: bounce/elastic/overshoot, rotation on
entry, scale beyond 1.02, autonomous motion (exceptions: HUD clock, pulse dot,
carets, turbo star). Scroll-driven state is PAINTED (`gsap.set` from progress),
never tweened per-item against a scrub. `prefers-reduced-motion` collapses
pins/stages to a plain vertical, fully-expanded document.

## Hard architecture rules (each one is a shipped bug)
1. Cursor-anchored UI hit-tests per frame (`elementFromPoint`); never event
   bookkeeping — Lenis moves the page under a stationary cursor.
2. Never define components inline in a render function when animations attach
   to their DOM; hoist to module scope and read refs live at call time.
3. GSAP and CSS transitions never own the same property on the same element.
4. Grids must keep an `fr` column (`[38%_62%]` + gap overflows by the gap).
5. `overflow-y-auto` needs `.no-scrollbar` + `data-lenis-prevent` inside pins.
6. Chapter enumeration: `'.site-main > section, .site-main > .pin-spacer >
   section'`; nested blocks must never be `<section>`.
7. Dev guards run on every load: invisibility audit + pin assertion
   (`src/lib/invisibilityAudit.js`), stripped from production.

## Copy
All strings in `src/data/content.js`, verbatim from Tej. House style: no em
dashes (`·` and `/` as separators), banned-vocabulary list enforced by grep,
badges state only what their copy supports. Only three live links (the Arrivio
Vercel surfaces); the demand model is described, never linked.
