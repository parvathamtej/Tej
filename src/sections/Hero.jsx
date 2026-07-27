import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { identity } from '../data/content'
import { DUR, EASE, STAGGER, reduced } from '../lib/motion'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// Easter egg: the ✦ toggles turbo mode, and the whole site scrolls faster.
const toggleTurbo = (e) => {
  const on = !window.__turbo
  window.__turbo = on
  if (window.__lenis) window.__lenis.options.duration = on ? 0.45 : 1.15
  e.currentTarget.classList.toggle('turbo', on)
  gsap.fromTo(
    e.currentTarget,
    { scale: 0.8 },
    { scale: on ? 1.2 : 1, duration: 0.5, ease: 'power4.out' },
  )
  window.dispatchEvent(new CustomEvent('tej:turbo', { detail: on }))
}

export default function Hero({ started }) {
  const sectionRef = useRef(null)
  const innerRef = useRef(null)

  const name = `${identity.first} ${identity.last}`

  useGSAP(
    () => {
      if (reduced()) return
      gsap.set('.hero-char', { yPercent: 112 })
      gsap.set('.hero-soft', { opacity: 0, y: 18 })
    },
    { scope: sectionRef },
  )

  useGSAP(
    () => {
      if (!started || reduced()) return
      gsap
        .timeline()
        .to('.hero-char', { yPercent: 0, duration: DUR, ease: EASE, stagger: STAGGER / 1.5 }, 0)
        .to('.hero-soft', { opacity: 1, y: 0, duration: 0.8, ease: EASE, stagger: 0.12 }, 0.45)
    },
    { scope: sectionRef, dependencies: [started] },
  )

  // Hero sinks and dims while the pattern slides over it
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.to(innerRef.current, {
          yPercent: -16,
          opacity: 0.25,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          },
        })
      })
      return () => mm.revert()
    },
    { scope: sectionRef },
  )

  return (
    <section ref={sectionRef} id="top" className="relative flex min-h-dvh flex-col">
      <div ref={innerRef} className="flex flex-1 flex-col px-5 pt-28 md:px-8">
        <h1
          className="display-type display-caps mt-auto text-[clamp(3.5rem,13vw,11rem)]"
          aria-label={name}
        >
          <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
            {name.split('').map((c, i) => (
              <span key={i} className="hero-char inline-block will-change-transform" aria-hidden="true">
                {c === ' ' ? ' ' : c}
              </span>
            ))}
            <button
              type="button"
              onClick={toggleTurbo}
              aria-label="Toggle turbo scroll mode"
              data-cursor="TURBO?"
              className="hero-spin hero-char ml-[0.12em] inline-block cursor-pointer border-0 bg-transparent align-baseline text-[0.42em] text-acid"
            >
              ✦
            </button>
          </span>
        </h1>

        <div className="mt-10 flex flex-wrap items-end justify-between gap-x-10 gap-y-8 pb-16">
          <div className="hero-soft prose-measure text-[clamp(1.15rem,1.7vw,1.6rem)]">
            {identity.statement.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </div>
          <div className="hero-soft">
            <p className="mono-label !normal-case text-[var(--accent-ui)]">{identity.credential}</p>
            <p className="mono-label !normal-case mt-1.5 opacity-55">{identity.location}</p>
          </div>
        </div>

        <p className="hero-soft mono-label pb-10 opacity-50">SCROLL ↓</p>
      </div>
    </section>
  )
}
