import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { chapters } from '../data/content'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// Scroll progress and chapter navigation as one instrument at the top edge.
//
// Design: a visible 3px track (bone at 12%) so the remaining path reads, an
// acid fill, and ink notches at each chapter position so the bar reads as
// SEGMENTED — the same chunked progress language the reference sites use,
// sized to each chapter's real share of the page rather than equal ninths.
// The whole strip has a 20px hover zone: the bar thickens to 6px and the
// nearest tick shows its chapter name in a pill. Ticks are real links.
export default function Progress() {
  const barRef = useRef(null)
  const navRef = useRef(null)

  useGSAP(() => {
    if (!barRef.current) return
    gsap.fromTo(
      barRef.current,
      { scaleX: 0 },
      { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.5 } },
    )
  })

  // Place each notch at its chapter's true share of the page
  useEffect(() => {
    const place = () => {
      const nav = navRef.current
      if (!nav) return
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (max <= 0) return
      ;[...nav.children].forEach((tick) => {
        const sel = tick.dataset.target
        let y = 0
        if (sel === 'bottom') y = max
        else {
          const el = document.querySelector(sel)
          if (el) y = el.getBoundingClientRect().top + window.scrollY
        }
        tick.style.left = `${Math.min(99.6, Math.max(0.4, (y / max) * 100))}%`
      })
    }
    place()
    ScrollTrigger.addEventListener('refresh', place)
    window.addEventListener('resize', place)
    const id = setTimeout(place, 600)
    return () => {
      ScrollTrigger.removeEventListener('refresh', place)
      window.removeEventListener('resize', place)
      clearTimeout(id)
    }
  }, [])

  const go = (e, target) => {
    e.preventDefault()
    const lenis = window.__lenis
    if (!lenis) return
    if (target === 'bottom') lenis.scrollTo(document.body.scrollHeight, { duration: 1.6 })
    else lenis.scrollTo(target, { duration: 1.4 })
  }

  return (
    // Lives INSIDE the navigation pill now, along its lower edge, so progress
    // and navigation are one object instead of two strips competing at the top
    // of the screen. Inset to clear the pill's corner radius, and rounded so it
    // reads as part of the same shape.
    <div className="group/bar pointer-events-none absolute inset-x-6 bottom-[3px] z-[2] md:inset-x-8">
      <div className="relative h-[2px] w-full overflow-visible rounded-full bg-[rgba(237,234,227,0.16)] transition-all duration-300 group-hover/bar:h-[4px]">
        <div
          ref={barRef}
          aria-hidden="true"
          className="absolute inset-0 origin-left rounded-full bg-acid"
        />
        <nav ref={navRef} aria-label="Chapters" className="absolute inset-0">
          {chapters.map((c) => (
            <a
              key={c.name}
              href={c.target === 'bottom' ? '#contact' : c.target}
              data-target={c.target}
              onClick={(e) => go(e, c.target)}
              aria-label={c.name}
              data-cursor=""
              className="group/tick pointer-events-auto absolute -top-2 block h-6 w-5 -translate-x-1/2"
              style={{ left: '0%' }}
            >
              {/* The notch: a gap that segments the bar into chapters */}
              <span className="absolute left-1/2 top-2 block h-[2px] w-[3px] -translate-x-1/2 bg-[var(--bg-page)] transition-all duration-300 group-hover/bar:h-[4px]" />
              <span className="absolute left-1/2 top-2 block h-[2px] w-px -translate-x-1/2 bg-[rgba(237,234,227,0.5)] transition-all duration-200 group-hover/tick:bg-acid group-hover/bar:h-[4px]" />
              {/* Label pill on tick hover, below the bar and clear of the pill */}
              <span
                data-audit-ignore
                className="nav-glass mono-label pointer-events-none absolute left-1/2 top-7 -translate-x-1/2 whitespace-nowrap rounded-full px-2.5 py-1 opacity-0 transition-opacity duration-200 group-hover/tick:opacity-100"
              >
                {c.name}
              </span>
            </a>
          ))}
        </nav>
      </div>
    </div>
  )
}
