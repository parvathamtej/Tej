import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { DUR, EASE, STAGGER } from '../lib/motion'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// Every section opens with this, full width, before any content: a numbered
// kicker (the chapter language the HUD already uses), a heading in plain words
// a stranger understands, and one sentence of context. No section may open
// with content before its heading, and no heading may live in a corner.
//
// widthAxis: the three experience headings animate Archivo's wdth axis on
// entry, 100 to 125. It is the run's signature move, and it exists only
// because the typeface has a real width axis.
export default function SectionHeading({
  index,
  category,
  heading,
  deck,
  size = 'l',
  widthAxis = false,
  className = '',
}) {
  const rootRef = useRef(null)

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
          .from('.sh-deck', { opacity: 0, y: 14, duration: 0.7, ease: EASE }, '-=0.5')
        if (widthAxis) {
          tl.fromTo(
            root.querySelector('.sh-heading'),
            { '--wdth': 100 },
            { '--wdth': 125, duration: 0.9, ease: EASE },
            '-=0.95',
          )
        }
      })
      return () => mm.revert()
    },
    { scope: rootRef },
  )

  const Size = size === 'xl' ? 'display-xl' : 'display-l'

  return (
    <header ref={rootRef} className={`w-full ${className}`}>
      <p className="sh-kicker mono-label text-[var(--accent-ui)]">
        {index} / {category}
      </p>
      <h2 className={`sh-heading ${Size} mt-5 max-w-[18ch]`}>
        {heading.map((line) => (
          <span key={line} className="sh-line block overflow-hidden pb-[0.06em] -mb-[0.06em]">
            <span className="inline-block will-change-transform">{line}</span>
          </span>
        ))}
      </h2>
      {deck ? <p className="sh-deck deck mt-6 text-bone-dim">{deck}</p> : null}
    </header>
  )
}
