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
      // The star is hidden by its OWN properties, never by the letter mask.
      // yPercent is relative to an element's own height, and at 0.42em the star
      // is a third the height of the capitals, so yPercent: 112 moved it far too
      // little to clear a mask cut for full-height letters. It stayed on screen
      // through the entire hidden beat, which is why a freshly loaded page
      // showed an empty hero with one floating star.
      gsap.set('.hero-star', { opacity: 0, y: -34, scale: 0.6 })
    },
    { scope: sectionRef },
  )

  useGSAP(
    () => {
      if (!started || reduced()) return
      gsap
        .timeline()
        .to('.hero-char', { yPercent: 0, duration: DUR, ease: EASE, stagger: STAGGER / 1.5 }, 0)
        // The star falls in after the name has landed and takes its place at the
        // end of it. No overshoot on the landing (house rule); the character
        // comes from the drop itself.
        .to('.hero-star', { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: EASE }, 0.5)
        .to('.hero-soft', { opacity: 1, y: 0, duration: 0.8, ease: EASE, stagger: 0.12 }, 0.45)
        // Then it breathes, quietly and forever, because it is the only thing on
        // the page you can click without being told to. This is an idle loop and
        // not an entrance, which is why it is the one place a sine ease is right.
        .to(
          '.hero-star',
          { opacity: 0.55, duration: 1.7, ease: 'sine.inOut', repeat: -1, yoyo: true },
          '>',
        )
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
    <section ref={sectionRef} id="top" className="relative min-h-dvh">
      {/* Optical centre at ~42% of the viewport: weighting the group slightly
          above true centre is what actually reads as centred. */}
      <div
        ref={innerRef}
        className="absolute inset-x-0 top-[42%] -translate-y-1/2 px-5 md:px-8"
      >
        <h1 className="display-xl" aria-label={name}>
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
              className="hero-spin hero-star ml-[0.12em] inline-block cursor-pointer border-0 bg-transparent align-baseline text-[0.42em] text-acid"
            >
              ✦
            </button>
          </span>
        </h1>

        {/* One tight group: 32px between name, statement and role line. The
            statement gets its own measure, wide enough that the three lines
            break where they were written to break, without touching the
            global deck step. */}
        <div className="hero-soft deck mt-8 !max-w-[46ch]">
          {identity.statement.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </div>
        {/* Quiet mono below the statement; only the company names carry acid */}
        <p className="hero-soft mono-label !normal-case mt-8 opacity-60">
          {identity.credential.split(/(Arrivio|GlobalLogic)/).map((part, i) =>
            part === 'Arrivio' || part === 'GlobalLogic' ? (
              <span key={i} className="text-acid">
                {part}
              </span>
            ) : (
              <span key={i}>{part}</span>
            ),
          )}
          <span className="ml-2 opacity-70">{identity.location}</span>
        </p>
      </div>

      {/* Outside the group, pinned to the bottom-left of the viewport */}
      <p className="hero-soft mono-label absolute bottom-16 left-5 opacity-60 md:left-8">
        SCROLL ↓
      </p>
    </section>
  )
}
