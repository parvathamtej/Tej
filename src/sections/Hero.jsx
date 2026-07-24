import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { identity } from '../data/content'
import { DUR, EASE, STAGGER, reduced } from '../lib/motion'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const Line = ({ text, className = '' }) => (
  <span className={`block overflow-hidden pb-[0.06em] -mb-[0.06em] ${className}`}>
    {text.split('').map((c, i) => (
      <span key={i} className="hero-char inline-block will-change-transform">
        {c}
      </span>
    ))}
  </span>
)

// Easter egg: the ✦ toggles turbo mode — the whole site scrolls faster.
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

  // Initial hidden states (preloader covers the screen while these hold)
  useGSAP(
    () => {
      if (reduced()) return
      gsap.set('.hero-char', { yPercent: 112, rotate: 4 })
      gsap.set('.hero-soft', { opacity: 0, y: 18 })
    },
    { scope: sectionRef },
  )

  // Entrance — fired when the preloader finishes
  useGSAP(
    () => {
      if (!started || reduced()) return
      gsap
        .timeline()
        .to('.hero-char', { yPercent: 0, rotate: 0, duration: DUR, ease: EASE, stagger: STAGGER / 1.5 }, 0)
        .to('.hero-soft', { opacity: 1, y: 0, duration: 0.8, ease: EASE, stagger: 0.12 }, 0.45)
    },
    { scope: sectionRef, dependencies: [started] },
  )

  // Exit — hero sinks and dims while the manifesto slides over it (curtain)
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
      <div ref={innerRef} className="flex flex-1 flex-col px-5 pt-24 md:px-8">
        <p className="hero-soft mono-label opacity-60">{identity.eyebrow}</p>

        <h1
          className="display-type mt-auto pt-10 text-[clamp(4rem,16.5vw,15rem)]"
          aria-label={`${identity.first} ${identity.last}`}
        >
          <Line text={identity.first} />
          <Line text={identity.last} className="text-right md:text-left md:pl-[18vw]" />
        </h1>

        <div className="mt-8 flex flex-wrap items-end justify-between gap-6 pb-16 md:mt-10">
          <p className="hero-soft mono-label opacity-60">SCROLL ↓</p>
          <div className="hero-soft max-w-md text-right">
            <p className="mono-label text-acid">{identity.role}</p>
            <p className="serif-accent mt-2 text-[clamp(1.25rem,2vw,1.7rem)] text-bone-dim">
              {identity.roleSub}
            </p>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={toggleTurbo}
        aria-label="Toggle turbo scroll mode"
        data-cursor="TURBO?"
        className="hero-spin hero-soft absolute right-[8vw] top-[30%] hidden cursor-pointer border-0 bg-transparent p-2 text-[clamp(2rem,4vw,3.5rem)] text-acid md:block"
      >
        ✦
      </button>
    </section>
  )
}
