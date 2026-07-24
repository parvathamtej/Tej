# TEJ PRAKASH — Portfolio

> Learns fast. Builds faster.

Scroll-driven single-page portfolio for Tej Prakash (Software Developer — AI & ML, Arrivio, Hyderabad). Dark ink + acid lime, kinetic typography, chapter-based narrative with pinned scroll stories.

**Stack:** Vite · React 19 · Tailwind CSS v4 · GSAP (ScrollTrigger) · Lenis smooth scroll
**Fonts:** Clash Display · General Sans · Gambetta italic (Fontshare) · JetBrains Mono (Google)

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production → dist/
npm run preview  # serve the build
```

## Where things live

| What | Where |
|---|---|
| All copy/content | `src/data/content.js` — edit text here, never in components |
| Design tokens | `src/styles/global.css` (`@theme` + chapter vars) |
| Motion constants | `src/lib/motion.js` — one rhythm for everything |
| Sections (chapters) | `src/sections/` — Hero, Manifesto, Velocity, Stack, Work, Receipts, Contact |
| Core systems | `src/components/` — SmoothScroll, Preloader, Cursor, Grain, Marquee, … |
| Full design + rebuild spec | `../PLAN.md` — model-portable; any AI agent can rebuild this site 1:1 from it |
| Design system notes | `DESIGN.md`, `PRODUCT.md` |

## Before shipping — verify with Tej

- [ ] Email: built with `parvathamtej@gmail.com` (old site had a `gmial` typo)
- [ ] GitHub URL (`content.js` → contact.links) is a placeholder
- [ ] Timeline years (2021–2026) in the Velocity chapter are reconstructed estimates
- [ ] University name in "The Receipts"

## Deploy

Static output in `dist/`. Firebase Hosting (matches the old site), Vercel, or Netlify all work as-is.
