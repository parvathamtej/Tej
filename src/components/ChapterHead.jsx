import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { DUR_S, EASE, STAGGER } from '../lib/motion'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// The site's chapter index system: hairline row with [index] + label,
// then a big title that rises word-by-word out of line masks.
export default function ChapterHead({ index, label, title, hint }) {
  const rootRef = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(`(prefers-reduced-motion: no-preference)`, () => {
        gsap.from('.ch-meta', {
          opacity: 0,
          y: 14,
          duration: DUR_S,
          ease: EASE,
          scrollTrigger: { trigger: rootRef.current, start: 'top 85%', once: true },
        })
        gsap.from('.ch-word', {
          yPercent: 115,
          duration: DUR_S + 0.2,
          ease: EASE,
          stagger: STAGGER,
          scrollTrigger: { trigger: rootRef.current, start: 'top 82%', once: true },
        })
      })
      return () => mm.revert()
    },
    { scope: rootRef },
  )

  return (
    <div ref={rootRef} className="mb-[clamp(2.5rem,6vh,4.5rem)]">
      <div className="ch-meta hairline-t flex items-baseline justify-between pt-4">
        <p className="mono-label">
          <span className="text-[var(--accent-ui)]">[{index}]</span>
          <span className="ml-3 opacity-60">{label}</span>
        </p>
        {hint ? <p className="mono-label opacity-40">{hint}</p> : null}
      </div>
      <h2
        className="display-type display-caps mt-6 max-w-[16ch] text-[clamp(2.2rem,5.2vw,4.6rem)]"
        style={{ textWrap: 'balance' }}
      >
        {title.split(' ').map((w, i) => (
          <span key={i} className="inline-flex overflow-hidden pb-[0.08em] -mb-[0.08em]">
            <span className="ch-word inline-block will-change-transform">{w}</span>
            {i < title.split(' ').length - 1 ? ' ' : ''}
          </span>
        ))}
      </h2>
    </div>
  )
}
