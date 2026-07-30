import { useEffect, useState } from 'react'
import Progress from './Progress'
import { identity } from '../data/content'

// Four destinations, not seven. The old bar listed every chapter by company
// name, which made the navigation a table of contents competing with the page.
// These are the four things a visitor actually arrives looking for, and the
// individual chapters remain reachable from the progress notches beneath.
//
// `covers` maps each link to the chapter indices it stands for, so the bar can
// show where the reader currently is without a second mechanism.
const LINKS = [
  { label: 'MY WORK', target: '#work', covers: [6] },
  { label: 'EXPERIENCE', target: '#arrivio', covers: [2, 3, 4] },
  { label: 'SKILLS', target: '#stack', covers: [5] },
  { label: 'CONTACT', target: 'bottom', covers: [8] },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [chapter, setChapter] = useState(0)

  // The bar already knows which chapter is on screen (App broadcasts it); using
  // it costs nothing and turns the links into a position indicator.
  useEffect(() => {
    const onChapter = (e) => setChapter(e.detail)
    window.addEventListener('tej:chapter', onChapter)
    return () => window.removeEventListener('tej:chapter', onChapter)
  }, [])

  const go = (e, target) => {
    e.preventDefault()
    setOpen(false)
    window.__lenis?.start()
    const lenis = window.__lenis
    if (!lenis) return
    if (target === 'bottom') lenis.scrollTo(document.body.scrollHeight, { duration: 1.6 })
    else lenis.scrollTo(target, { duration: 1.4 })
  }

  const home = (e) => {
    e.preventDefault()
    setOpen(false)
    window.__lenis?.start()
    window.__lenis?.scrollTo(0, { duration: 1.4 })
  }

  const toggleIndex = () => {
    setOpen((v) => {
      const next = !v
      if (next) window.__lenis?.stop()
      else window.__lenis?.start()
      return next
    })
  }

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 text-[var(--fg-page)] md:pt-5">
        {/* A capsule sized to its contents rather than the viewport. Stretched
            edge to edge it read as a bar with rounded ends; held to its natural
            width it reads as one object floating over the page. */}
        <nav className="nav-glass group/bar pointer-events-auto relative flex w-full max-w-[min(100%,52rem)] items-center justify-between gap-4 rounded-full py-2.5 pl-2.5 pr-3 md:gap-8 md:py-3 md:pl-3 md:pr-4">
          <div className="hidden items-center gap-1 md:flex">
            {LINKS.map((l) => {
              const here = l.covers.includes(chapter)
              return (
                <a
                  key={l.label}
                  href={l.target === 'bottom' ? '#contact' : l.target}
                  onClick={(e) => go(e, l.target)}
                  aria-current={here ? 'true' : undefined}
                  data-cursor=""
                  className={`nav-link mono-label rounded-full px-3.5 py-2 transition-colors duration-200 ${
                    here ? 'is-here' : ''
                  }`}
                >
                  {l.label}
                </a>
              )
            })}
          </div>

          {/* Small screens: the index toggle takes the left, the mark holds the
              right, so the bar keeps the same shape at every width. */}
          <button
            type="button"
            onClick={toggleIndex}
            aria-expanded={open}
            aria-controls="chapter-index"
            data-cursor=""
            className="nav-link mono-label cursor-pointer rounded-full border-0 bg-transparent px-3.5 py-2 md:hidden"
          >
            {open ? 'CLOSE ✕' : 'MENU ☰'}
          </button>

          <a
            href="#top"
            onClick={home}
            data-cursor=""
            className="mono-label shrink-0 pl-3 pr-1.5 font-medium tracking-[0.14em] transition-opacity duration-200 hover:opacity-70 md:border-l md:border-[color-mix(in_srgb,var(--fg-page)_14%,transparent)] md:pl-6"
          >
            {identity.logo}
          </a>

          <Progress />
        </nav>
      </header>

      {open ? (
        <div
          id="chapter-index"
          className="fixed inset-0 z-[45] flex flex-col justify-center gap-1 bg-ink px-6 text-bone"
        >
          {LINKS.map((l, i) => (
            <a
              key={l.label}
              href={l.target === 'bottom' ? '#contact' : l.target}
              onClick={(e) => go(e, l.target)}
              className="display-l py-2 transition-colors duration-200 hover:text-acid"
            >
              <span className="mono-label mr-4 text-acid">0{i + 1}</span>
              {l.label}
            </a>
          ))}
        </div>
      ) : null}
    </>
  )
}
