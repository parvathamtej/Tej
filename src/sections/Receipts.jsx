import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ChapterHead from '../components/ChapterHead'
import Stamp from '../components/Stamp'
import { receipts } from '../data/content'
import { DUR_S, EASE } from '../lib/motion'

gsap.registerPlugin(useGSAP, ScrollTrigger)

export default function Receipts() {
  const sectionRef = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.receipt-row', {
          opacity: 0,
          y: 40,
          duration: DUR_S,
          ease: EASE,
          stagger: 0.09,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', once: true },
        })
      })
      return () => mm.revert()
    },
    { scope: sectionRef },
  )

  return (
    <section ref={sectionRef} className="px-5 pb-[clamp(8rem,18vh,13rem)] pt-[clamp(4rem,8vh,6rem)] md:px-8">
      <ChapterHead index={receipts.index} label={receipts.label} title={receipts.title} />
      <ul>
        {receipts.rows.map((row) => (
          <li
            key={row.left}
            className="receipt-row group hairline-t -mx-3 grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 px-3 py-6 transition-colors duration-200 hover:bg-[var(--fg-page)] hover:text-[var(--bg-page)] md:grid-cols-[14rem_1fr_auto]"
          >
            <p className="display-type text-[clamp(1.1rem,1.8vw,1.5rem)]">{row.left}</p>
            <p className="col-span-2 text-bone-dim group-hover:text-[var(--bg-page)] md:col-span-1">{row.mid}</p>
            <div className="col-start-2 row-start-1 md:col-start-3">
              <Stamp text={row.right} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
