import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionHeading from '../components/SectionHeading'
import { stack } from '../data/content'
import { DUR_S, EASE, STAGGER } from '../lib/motion'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// Lives on the slate-flooded chapter (App tweens the page variables) with a
// fine dot matrix so the flood is a material change as well as a colour one.
// No ratings, no percentages, no proficiency bars.
export default function Stack() {
  const sectionRef = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.stack-row', {
          opacity: 0,
          y: 40,
          duration: DUR_S,
          ease: EASE,
          stagger: STAGGER,
          scrollTrigger: { trigger: '.stack-list', start: 'top 80%', once: true },
        })
      })
      return () => mm.revert()
    },
    { scope: sectionRef },
  )

  return (
    <section
      id="stack"
      ref={sectionRef}
      className="relative px-5 py-16 md:px-8 md:py-32"
    >
      {/* The chapter's material change. App fades this in with the same timing
          the colour flood used; the background hue never changes. */}
      <div
        className="chapter-texture dot-matrix pointer-events-none absolute inset-0 opacity-0"
        aria-hidden="true"
      />
      <div className="relative">
        <SectionHeading
          index={stack.index}
          category={stack.category}
          heading={stack.heading}
          className="mb-16"
        />
        <ul className="stack-list">
          {stack.rows.map((row) => (
            <li
              key={row.label}
              tabIndex={0}
              className="stack-row hairline-t grid grid-cols-1 items-baseline gap-1 py-6 md:grid-cols-[11rem_1fr] md:gap-6 md:py-7"
            >
              <p className="mono-label opacity-70">{row.label}</p>
              <p className="text-[clamp(1.05rem,1.5vw,1.35rem)] leading-relaxed">{row.items}</p>
            </li>
          ))}
          {/* The payoff line of the list, not an orphan screen after it */}
          <li
            tabIndex={0}
            className="stack-row hairline-t grid grid-cols-1 items-baseline gap-2 py-8 md:grid-cols-[11rem_1fr] md:gap-6 md:py-10"
          >
            <p className="mono-label text-[var(--accent-ui)]">{stack.closer.heading}</p>
            <p className="display-s max-w-[30ch] text-acid">
              {stack.closer.line}
            </p>
          </li>
        </ul>
      </div>
    </section>
  )
}
