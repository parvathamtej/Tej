import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { DUR, EASE, STAGGER } from '../lib/motion'
import { MEASURE, stepForLength } from '../lib/type'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// Kicker, heading, and (by exception only) a deck. The step is assigned from
// the heading's character count, never chosen by hand.
//
// A deck earns its place only when the heading cannot stand alone. If it can be
// deleted without losing information, it is deleted: decorative decks that
// restate the heading are padding.
//
// Spacing follows the 8px scale: kicker to heading 24, heading to deck 24,
// heading or deck to first content 64 (applied by the caller).
export default function SectionHeading({ index, category, heading, deck, className = '' }) {
  const rootRef = useRef(null)
  const lines = Array.isArray(heading) ? heading : [heading]
  const step = stepForLength(lines)

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root) return
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: root, start: 'top 82%', once: true },
        })
        tl.from('.sh-kicker', { opacity: 0, y: 12, duration: 0.6, ease: EASE })
          .from(
            '.sh-line span',
            { yPercent: 108, duration: DUR, ease: EASE, stagger: STAGGER },
            '-=0.35',
          )
        if (deck) {
          tl.from('.sh-deck', { opacity: 0, y: 14, duration: 0.7, ease: EASE }, '-=0.5')
        }
      })
      return () => mm.revert()
    },
    { scope: rootRef },
  )

  return (
    <header ref={rootRef} className={`w-full ${className}`}>
      <p className="sh-kicker mono-label text-[var(--accent-ui)]">
        {index} / {category}
      </p>
      <h2 className={`sh-heading ${step} ${MEASURE[step]} mt-6`}>
        {lines.map((line) => (
          <span key={line} className="sh-line block overflow-hidden pb-[0.06em] -mb-[0.06em]">
            <span className="inline-block will-change-transform">{line}</span>
          </span>
        ))}
      </h2>
      {deck ? <p className="sh-deck deck mt-6 text-bone-dim">{deck}</p> : null}
    </header>
  )
}
