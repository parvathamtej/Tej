import { useEffect, useRef } from 'react'
import { chapters } from '../data/content'

// Chapter rail: nine ticks fixed to the left edge, the active one extended and
// acid. Real links with accessible names, driven by the same tej:chapter
// events as the HUD. Desktop only (the INDEX overlay covers small screens).
const TARGETS = [
  '#top',
  '#pattern',
  '#arrivio',
  '#globallogic',
  '#hansi',
  '#stack',
  '#work',
  '#receipts',
  'bottom',
]

export default function ChapterRail() {
  const rootRef = useRef(null)

  useEffect(() => {
    const onChapter = (e) => {
      const links = rootRef.current?.children
      if (!links) return
      for (let i = 0; i < links.length; i++) {
        const tick = links[i].firstElementChild
        const active = i === e.detail
        tick.style.width = active ? '24px' : '12px'
        tick.style.background = active ? 'var(--color-acid)' : 'currentColor'
        tick.style.opacity = active ? '1' : '0.35'
      }
    }
    window.addEventListener('tej:chapter', onChapter)
    return () => window.removeEventListener('tej:chapter', onChapter)
  }, [])

  const go = (e, target) => {
    e.preventDefault()
    const lenis = window.__lenis
    if (!lenis) return
    if (target === 'bottom') lenis.scrollTo(document.body.scrollHeight, { duration: 1.6 })
    else lenis.scrollTo(target, { duration: 1.4 })
  }

  return (
    <nav
      ref={rootRef}
      aria-label="Chapters"
      className="fixed left-0 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 pl-3 lg:flex"
    >
      {chapters.map((name, i) => (
        <a
          key={name}
          href={TARGETS[i] === 'bottom' ? '#contact' : TARGETS[i]}
          onClick={(e) => go(e, TARGETS[i])}
          aria-label={name}
          data-cursor=""
          className="group flex h-3 items-center"
        >
          <span
            className="block h-px transition-all duration-300"
            style={{ width: i === 0 ? '24px' : '12px', background: i === 0 ? 'var(--color-acid)' : 'currentColor', opacity: i === 0 ? 1 : 0.35 }}
          />
          <span className="mono-label ml-2 opacity-0 transition-opacity duration-200 group-hover:opacity-60">
            {name.split(' / ')[1]}
          </span>
        </a>
      ))}
    </nav>
  )
}
