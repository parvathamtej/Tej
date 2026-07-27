import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionHeading from '../components/SectionHeading'
import { credentials } from '../data/content'
import { DUR_S, EASE, STAGGER } from '../lib/motion'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// Three clearly separated blocks under one heading. Nothing below 14px in this
// section: it failed on legibility before it failed on anything else.
const LABEL = 'mono-label !text-[0.875rem] text-[var(--accent-ui)]'
const ROW =
  'grid grid-cols-1 gap-x-8 gap-y-1 border-t border-[var(--hair)] py-4 md:grid-cols-[18rem_1fr]'

export default function Credentials() {
  const sectionRef = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.cr-block', {
          opacity: 0,
          y: 28,
          duration: DUR_S,
          ease: EASE,
          stagger: STAGGER * 2,
          scrollTrigger: { trigger: '.cr-blocks', start: 'top 82%', once: true },
        })
      })
      return () => mm.revert()
    },
    { scope: sectionRef },
  )

  const { education, certifications, languages } = credentials

  return (
    <section
      id="receipts"
      ref={sectionRef}
      className="px-5 pb-24 pt-16 md:px-8 md:pb-40 md:pt-32"
    >
      <SectionHeading
        index={credentials.index}
        category={credentials.category}
        heading={credentials.heading}
        className="mb-16"
      />

      <div className="cr-blocks flex flex-col gap-12">
        <div className="cr-block">
          <p className={LABEL}>{education.label}</p>
          <div className="mt-5 border-t border-[var(--hair)] pt-5">
            <p className="display-m max-w-[22ch]">
              {education.degree}
            </p>
            <p className="body-copy mt-2 text-bone-dim">{education.focus}</p>
            <p className="mono-label !text-[0.875rem] mt-3 opacity-70">{education.school}</p>
          </div>
        </div>

        <div className="cr-block">
          <p className={LABEL}>{certifications.label}</p>
          <ul className="mt-5">
            {certifications.rows.map((r) => (
              <li key={`${r.issuer}-${r.name}`} className={ROW}>
                <span className="mono-label !text-[0.875rem] opacity-70">{r.issuer}</span>
                <span className="text-[1rem] leading-snug">{r.name}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="cr-block">
          <p className={LABEL}>{languages.label}</p>
          <ul className="mt-5">
            {languages.rows.map((r) => (
              <li key={r.issuer} className={ROW}>
                <span className="mono-label !text-[0.875rem] opacity-70">{r.issuer}</span>
                <span className="text-[1rem] leading-snug">{r.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
