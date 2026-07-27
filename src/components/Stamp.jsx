import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'
import { SCRAMBLE_CHARS as GLYPHS } from '../lib/motion'

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrambleTextPlugin)

// Status stamp: decrypts into view on scroll and re-scrambles when its row is
// hovered. Renders full text by default (reduced-motion safe).
//   variant="chip" (default) — bordered accent chip, for statuses and stats
//   variant="bare"           — mono accent text, no border, for list labels
export default function Stamp({ text, className = '', variant = 'chip' }) {
  const ref = useRef(null)

  useGSAP(
    () => {
      // Capture and guard: matchMedia callbacks can re-run on viewport change
      // after the ref has detached, and dereferencing it then crashes the tree.
      const el = ref.current
      if (!el) return
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.to(el, {
          duration: 1.1,
          ease: 'none',
          scrambleText: { text, chars: GLYPHS, speed: 0.5 },
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        })
        const row = el.closest('li')
        if (!row) return
        const rescramble = () =>
          gsap.to(el, {
            duration: 0.6,
            ease: 'none',
            scrambleText: { text, chars: GLYPHS, speed: 0.6 },
            overwrite: 'auto',
          })
        row.addEventListener('mouseenter', rescramble)
        return () => row.removeEventListener('mouseenter', rescramble)
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  const chip =
    variant === 'bare'
      ? 'text-[var(--accent-ui)] group-hover:text-[var(--bg-page)]'
      : 'border border-[var(--accent-ui)] px-2.5 py-1.5 text-[var(--accent-ui)] group-hover:border-[var(--bg-page)] group-hover:text-[var(--bg-page)]'

  return (
    <span
      ref={ref}
      className={`mono-label inline-block !text-[0.8rem] font-medium ${chip} ${className}`}
    >
      {text}
    </span>
  )
}
