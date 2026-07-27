import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Stamp from '../components/Stamp'
import { receipts } from '../data/content'
import { DUR_S, EASE } from '../lib/motion'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// Compact and dry by design. A footnote, not a trophy case: chapter label only,
// no display title.
export default function Receipts() {
  const sectionRef = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.receipt-row', {
          opacity: 0,
          y: 32,
          duration: DUR_S,
          ease: EASE,
          stagger: 0.07,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
        })
      })
      return () => mm.revert()
    },
    { scope: sectionRef },
  )

  return (
    <section
      id="receipts"
      ref={sectionRef}
      className="px-5 pb-[clamp(8rem,18vh,13rem)] pt-[clamp(3rem,7vh,5rem)] md:px-8"
    >
      <div className="hairline-t flex items-baseline justify-between pt-4">
        <p className="mono-label">
          <span className="text-[var(--accent-ui)]">[{receipts.index}]</span>
          <span className="ml-3 opacity-60">{receipts.label}</span>
        </p>
      </div>

      <ul className="mt-10">
        {receipts.rows.map((row) => (
          <li
            key={row.label}
            className="receipt-row group hairline-t -mx-3 grid grid-cols-1 items-baseline gap-x-6 gap-y-1 px-3 py-5 transition-colors duration-200 hover:bg-[var(--fg-page)] hover:text-[var(--bg-page)] md:grid-cols-[18rem_1fr]"
          >
            <Stamp text={row.label} variant="bare" />
            <p className="text-[clamp(0.95rem,1.1vw,1.1rem)] opacity-75 group-hover:opacity-100">
              {row.detail}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}
