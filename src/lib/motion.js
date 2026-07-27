import gsap from 'gsap'
import { CustomEase } from 'gsap/CustomEase'

gsap.registerPlugin(CustomEase)

// V6 motion spec. One easing curve for the whole site; anything that wobbles
// reads as a template, so no bounce, no elastic, no overshoot anywhere.
export const EASE = CustomEase.create('brand', '0.22,1,0.36,1') // standard curve
export const EASE_IN = 'power3.in' // exits
export const EASE_INOUT = 'power4.inOut' // wipes
export const DUR = 0.85 // entrances: 700-900ms
export const DUR_S = 0.7
export const DUR_CHAPTER = 1.1 // chapter transitions: 1000-1200ms
export const STAGGER = 0.07 // line reveals: 60-90ms

// gsap.matchMedia() query keys shared by every section
export const MM = {
  desk: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
  mob: '(max-width: 767.98px) and (prefers-reduced-motion: no-preference)',
  reduce: '(prefers-reduced-motion: reduce)',
}

// Glyph set for every ScrambleText decrypt on the site (stamps + the payoff).
export const SCRAMBLE_CHARS = '01<>[]#%/█▓▒'

export const reduced = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const finePointer = () =>
  window.matchMedia('(pointer: fine)').matches

// Deterministic PRNG for generated visuals (no Math.random: renders must be
// identical on every load).
export const mulberry32 = (seed) => () => {
  seed |= 0
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}
