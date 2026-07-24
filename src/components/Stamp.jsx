import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrambleTextPlugin)

const GLYPHS = '01<>[]#%/█▓▒'

// Status stamp: acid chip that "decrypts" into view on scroll and re-scrambles
// when its row is hovered. Renders full text by default (reduced-motion safe).
export default function Stamp({ text, className = '' }) {
  const ref = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.to(ref.current, {
          duration: 1.1,
          ease: 'none',
          scrambleText: { text, chars: GLYPHS, speed: 0.5 },
          scrollTrigger: { trigger: ref.current, start: 'top 88%', once: true },
        })
        const row = ref.current.closest('li')
        if (!row) return
        const rescramble = () =>
          gsap.to(ref.current, {
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

  return (
    <span
      ref={ref}
      className={`mono-label inline-block border border-[var(--accent-ui)] px-2.5 py-1.5 !text-[0.8rem] font-bold text-[var(--accent-ui)] group-hover:border-[var(--bg-page)] group-hover:text-[var(--bg-page)] ${className}`}
    >
      {text}
    </span>
  )
}
