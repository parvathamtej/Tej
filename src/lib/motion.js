// One motion rhythm for the whole site — never introduce other eases/durations ad hoc.
export const EASE = 'power4.out' // enters
export const EASE_IN = 'power3.in' // exits
export const EASE_INOUT = 'power4.inOut' // wipes
export const DUR = 1.1 // hero-scale reveals
export const DUR_S = 0.7 // small reveals
export const STAGGER = 0.06 // char/line stagger

// gsap.matchMedia() query keys shared by every section
export const MM = {
  desk: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
  mob: '(max-width: 767.98px) and (prefers-reduced-motion: no-preference)',
  reduce: '(prefers-reduced-motion: reduce)',
}

export const reduced = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const finePointer = () =>
  window.matchMedia('(pointer: fine)').matches
