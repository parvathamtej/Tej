import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { chapters } from '../data/content'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// Scroll progress AND chapter navigation in one element, pinned to the top edge.
// The vertical rail this replaces sat over the left gutter, which is exactly
// where flush-left content lives: it intersected seven text elements in the
// skills chapter alone.
//
// The ticks are silent. Navigation and progress counting are different jobs,
// and numbering a tick while the HUD counts to a different denominator is the
// confusion this round set out to remove. The HUD counts; the ticks navigate.
export default function Progress() {
  const barRef = useRef(null)
  const rootRef = useRef(null)

  useGSAP(() => {
    if (!barRef.current) return
    gsap.fromTo(
      barRef.current,
      { scaleX: 0 },
      { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.5 } },
    )
  })

  // Position each tick at its chapter's share of the page, recomputed on refresh
  useEffect(() => {
    const place = () => {
      const root = rootRef.current
      if (!root) return
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (max <= 0) return
      ;[...root.children].forEach((tick) => {
        const sel = tick.dataset.target
        let y = 0
        if (sel === 'bottom') y = max
        else {
          const el = document.querySelector(sel)
          if (el) y = el.getBoundingClientRect().top + window.scrollY
        }
        tick.style.left = `${Math.min(100, Math.max(0, (y / max) * 100))}%`
      })
    }
    place()
    ScrollTrigger.addEventListener('refreshInit', place)
    ScrollTrigger.addEventListener('refresh', place)
    window.addEventListener('resize', place)
    const id = setTimeout(place, 600)
    return () => {
      ScrollTrigger.removeEventListener('refreshInit', place)
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
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[60]">
      <div className="relative h-0.5 w-full">
        <div
          ref={barRef}
          aria-hidden="true"
          className="absolute inset-0 origin-left bg-acid"
        />
        <nav ref={rootRef} aria-label="Chapters" className="pointer-events-auto absolute inset-0">
          {chapters.map((c) => (
            <a
              key={c.name}
              href={c.target === 'bottom' ? '#contact' : c.target}
              data-target={c.target}
              onClick={(e) => go(e, c.target)}
              aria-label={c.name}
              data-cursor=""
              className="group absolute top-0 -ml-2 block h-4 w-4 -translate-y-px"
              style={{ left: '0%' }}
            >
              <span className="absolute left-2 top-0 block h-2 w-px bg-[var(--fg-page)] opacity-40 transition-opacity duration-200 group-hover:opacity-100" />
              <span data-audit-ignore
                className="mono-label absolute left-2 top-4 hidden whitespace-nowrap opacity-0 transition-opacity duration-200 group-hover:opacity-70 lg:block">
                {c.name}
              </span>
            </a>
          ))}
        </nav>
      </div>
    </div>
  )
}
