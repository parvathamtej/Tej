import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CHAPTER_TOTAL, availability, chapters, identity } from '../data/content'
import { useIST } from '../lib/useIST'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// A page this long needs to tell the reader how big it is. The counter reads
// `03 / 07` and counts ONLY the seven numbered content chapters, matching the
// section kickers exactly. INTRO and SAY HI carry no number, because the page
// never numbers them and a counter with a different denominator than the
// kicker on the same screen is worse than no counter at all.
const label = (i) => {
  const c = chapters[i]
  if (!c) return ''
  return c.n ? `${String(c.n).padStart(2, '0')} / ${String(CHAPTER_TOTAL).padStart(2, '0')}` : ''
}

export default function Hud() {
  const rootRef = useRef(null)
  const chapRef = useRef(null)
  const countRef = useRef(null)
  const turboRef = useRef(null)
  const time = useIST()

  useGSAP(
    () => {
      const chapEl = chapRef.current
      const countEl = countRef.current
      const instant = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      let current = 0

      const write = (i) => {
        chapEl.textContent = chapters[i]?.name ?? ''
        if (countEl) countEl.textContent = label(i)
      }

      const setChapter = (i) => {
        if (i === current) return
        current = i
        if (instant) {
          write(i)
          return
        }
        gsap
          .timeline({ overwrite: true })
          .to(chapEl, { yPercent: -130, duration: 0.22, ease: 'power3.in' })
          .add(() => write(i))
          .fromTo(chapEl, { yPercent: 130 }, { yPercent: 0, duration: 0.32, ease: 'power4.out' })
      }

      // All chapters (00–06) arrive as events from App, which owns the sections.
      // At the footer chapter the HUD hands off and fades away.
      const onChapter = (e) => {
        setChapter(e.detail)
        gsap.to(rootRef.current, {
          // Hands off at the final chapter: the footer carries its own contact info
          autoAlpha: e.detail === chapters.length - 1 ? 0 : 1,
          duration: 0.4,
          ease: 'power2.out',
        })
      }
      window.addEventListener('tej:chapter', onChapter)

      // Turbo easter egg indicator
      const onTurbo = (e) => {
        gsap.to(turboRef.current, {
          autoAlpha: e.detail ? 1 : 0,
          duration: 0.3,
          ease: 'power2.out',
        })
      }
      window.addEventListener('tej:turbo', onTurbo)
      return () => {
        window.removeEventListener('tej:turbo', onTurbo)
        window.removeEventListener('tej:chapter', onChapter)
      }
    },
    { scope: rootRef },
  )

  return (
    <div
      ref={rootRef}
      className="hairline-t fixed inset-x-0 bottom-0 z-40 backdrop-blur-sm"
      style={{ background: 'color-mix(in srgb, var(--bg-page) 86%, transparent)' }}
    >
      <div className="mono-label flex items-center justify-between gap-4 px-5 py-2.5 md:px-8">
        <span className="flex items-center gap-4">
          <span ref={countRef} className="text-[var(--accent-ui)]">
            {label(0)}
          </span>
          <span className="inline-flex overflow-hidden">
            <span ref={chapRef} className="inline-block will-change-transform">
              {chapters[0].name}
            </span>
          </span>
          <span
            ref={turboRef}
            data-audit-ignore
            className="text-[var(--accent-ui)] opacity-0"
            aria-live="polite"
          >
            TURBO ✦
          </span>
        </span>
        <a
          href={`mailto:${identity.email}`}
          data-cursor="SAY HI"
          className="hidden items-center gap-2.5 transition-colors duration-200 hover:text-[var(--accent-ui)] md:flex"
        >
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full bg-[var(--accent-ui)] animate-pulse motion-reduce:animate-none"
          />
          {availability} · {identity.email}
        </a>
        <span className="opacity-60">HYD {time} IST</span>
      </div>
    </div>
  )
}
