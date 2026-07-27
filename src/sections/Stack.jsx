import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ChapterHead from '../components/ChapterHead'
import { stack } from '../data/content'
import { DUR_S, EASE } from '../lib/motion'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// Lives on the moss-flooded chapter (App tweens the page variables).
// No ratings, no percentages, no proficiency bars.
export default function Stack() {
  const sectionRef = useRef(null)
  const closerRef = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.stack-row', {
          opacity: 0,
          y: 48,
          duration: DUR_S,
          ease: EASE,
          stagger: 0.08,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 74%', once: true },
        })
        gsap
          .timeline({ scrollTrigger: { trigger: closerRef.current, start: 'top 75%', once: true } })
          .from('.stack-closer-heading', { opacity: 0, y: 16, duration: DUR_S, ease: EASE })
          .from('.stack-closer-line span', { yPercent: 115, duration: 1, ease: EASE }, '-=0.35')
      })
      return () => mm.revert()
    },
    { scope: sectionRef },
  )

  return (
    <section id="stack" ref={sectionRef} className="px-5 py-[clamp(6rem,14vh,10rem)] md:px-8">
      <ChapterHead index={stack.index} label={stack.label} title={stack.title} />
      <ul>
        {stack.rows.map((row) => (
          <li
            key={row.label}
            className="stack-row group hairline-t -mx-3 grid grid-cols-1 items-baseline gap-1 px-3 py-6 transition-colors duration-200 hover:bg-[var(--fg-page)] hover:text-[var(--bg-page)] md:grid-cols-[11rem_1fr] md:gap-4 md:py-7"
          >
            <p className="mono-label opacity-60">{row.label}</p>
            <p className="text-[clamp(1.05rem,1.5vw,1.35rem)] leading-relaxed">{row.items}</p>
          </li>
        ))}
      </ul>

      <div ref={closerRef} className="hairline-t mt-[clamp(4rem,10vh,7rem)] pt-8">
        <p className="stack-closer-heading mono-label text-[var(--accent-ui)]">
          {stack.closer.heading}
        </p>
        <p className="stack-closer-line display-type mt-5 block max-w-[20ch] overflow-hidden pb-[0.1em] -mb-[0.1em] text-[clamp(1.8rem,4.2vw,3.4rem)]">
          <span className="inline-block will-change-transform">{stack.closer.line}</span>
        </p>
      </div>
    </section>
  )
}
