import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ChapterHead from '../components/ChapterHead'
import { stack } from '../data/content'
import { DUR_S, EASE, reduced } from '../lib/motion'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// Lives on the acid-flooded chapter (App tweens the page variables).
export default function Stack() {
  const sectionRef = useRef(null)
  const tickerRef = useRef(null)

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

        // Terminal type-on ticker, loops forever
        const el = tickerRef.current
        const text = stack.ticker
        const state = { n: 0 }
        gsap
          .timeline({ repeat: -1, repeatDelay: 1.6, scrollTrigger: { trigger: el, start: 'top 95%' } })
          .to(state, {
            n: text.length,
            duration: text.length * 0.045,
            ease: 'none',
            snap: { n: 1 },
            onUpdate: () => {
              el.textContent = text.slice(0, state.n)
            },
          })
          .to({}, { duration: 2.2 })
          .to(state, {
            n: 0,
            duration: 0.3,
            ease: 'none',
            snap: { n: 1 },
            onUpdate: () => {
              el.textContent = text.slice(0, state.n)
            },
          })
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
            className="stack-row hairline-t -mx-3 grid grid-cols-1 items-baseline gap-1 px-3 py-6 transition-colors duration-200 hover:bg-[var(--fg-page)] hover:text-[var(--bg-page)] md:grid-cols-[11rem_1fr] md:gap-4 md:py-7"
          >
            <p className="mono-label opacity-60">{row.label}</p>
            <p className="display-type text-[clamp(1.25rem,2.5vw,2.1rem)]">{row.items}</p>
          </li>
        ))}
      </ul>
      <p className="mono-label mt-14 opacity-80">
        <span ref={tickerRef}>{reduced() ? stack.ticker : ''}</span>
        <span className="ticker-caret">▌</span>
      </p>
    </section>
  )
}
