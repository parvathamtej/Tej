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
    // A hairline along the capsule's lower edge. At 2px with nine visible
    // notches it was an instrument bolted to a piece of jewellery; at 1px, with
    // the notches held at low contrast until pointed at, it reads as part of
    // the object and still carries the whole page's structure.
    <div className="group/bar pointer-events-none absolute inset-x-10 bottom-[5px] z-[2] md:inset-x-14">
      <div className="relative h-px w-full overflow-visible rounded-full bg-[color-mix(in_srgb,var(--fg-page)_14%,transparent)] transition-all duration-300 group-hover/bar:h-[2px]">
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
              {/* The notch: a gap that segments the line into chapters. Hidden
                  at rest, because permanent gaps turn the hairline into a
                  dashed rule that reads as a rendering fault rather than an
                  instrument. Pointing at the bar reveals the structure. */}
              <span className="absolute left-1/2 top-2 block h-px w-[3px] -translate-x-1/2 bg-[var(--bg-page)] opacity-0 transition-all duration-300 group-hover/bar:opacity-90 group-hover/bar:h-[2px]" />
              <span className="absolute left-1/2 top-2 block h-px w-px -translate-x-1/2 bg-[color-mix(in_srgb,var(--fg-page)_45%,transparent)] opacity-0 transition-all duration-200 group-hover/bar:opacity-100 group-hover/tick:!bg-[var(--accent-ui)] group-hover/bar:h-[2px]" />
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
