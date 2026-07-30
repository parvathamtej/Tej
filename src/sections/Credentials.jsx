import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionHeading from '../components/SectionHeading'
import { credentials } from '../data/content'
import { DUR_S, EASE, STAGGER } from '../lib/motion'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// Three columns under one heading, no sub-heading that repeats it. The degree
// carries the most visual weight because it is the thing that matters;
// everything else is a list. Nothing below 14px in this section.
const COL_LABEL = 'mono-label !text-[0.875rem] text-[var(--accent-ui)]'

export default function Credentials() {
  const sectionRef = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.cr-col', {
          opacity: 0,
          y: 28,
          duration: DUR_S,
          ease: EASE,
          stagger: STAGGER * 2,
          scrollTrigger: { trigger: '.cr-cols', start: 'top 82%', once: true },
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

      <div className="cr-cols grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
        <div className="cr-col">
          <p className={COL_LABEL}>DEGREE</p>
          <div className="mt-6 border-t border-[var(--hair)] pt-6">
            {/* The degree is the anchor of ITS column, not a second section
                heading. The two columns beside it list items at 16px, so a
                31px display step made this one column shout across the row.
                At the deck step it is still visibly the most important line in
                the row (1.5x its siblings) and clearly below the heading. */}
            <p className="deck max-w-[26ch] font-medium">{education.degree}</p>
            <p className="body-copy mt-3 text-bone-dim">{education.focus}</p>
            <p className="mono-label !text-[0.875rem] !normal-case mt-4 opacity-70">
              {education.school}
            </p>
          </div>
        </div>

        <div className="cr-col">
          <p className={COL_LABEL}>{certifications.label}</p>
          <ul className="mt-6 flex flex-col gap-5 border-t border-[var(--hair)] pt-6">
            {certifications.rows.map((r) => (
              <li key={`${r.issuer}-${r.name}`}>
                <p className="mono-label !text-[0.875rem] !normal-case opacity-70">{r.issuer}</p>
                <p className="mt-1 text-[1rem] leading-snug">{r.name}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="cr-col">
          <p className={COL_LABEL}>{languages.label}</p>
          <ul className="mt-6 flex flex-col gap-3 border-t border-[var(--hair)] pt-6">
            {languages.rows.map((r) => (
              <li key={r.issuer} className="flex items-baseline justify-between gap-4">
                <span className="text-[1rem]">{r.issuer}</span>
                <span className="mono-label !text-[0.875rem] !normal-case opacity-70">
                  {r.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
