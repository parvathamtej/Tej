import { useState } from 'react'
import Progress from './Progress'
import { identity } from '../data/content'

const LINKS = [
  { label: 'PATTERN', target: '#pattern' },
  { label: 'ARRIVIO', target: '#arrivio' },
  { label: 'GLOBALLOGIC', target: '#globallogic' },
  { label: 'HANSI', target: '#hansi' },
  { label: 'STACK', target: '#stack' },
  { label: 'WORK', target: '#work' },
  { label: 'CONTACT', target: 'bottom' },
]

// Full chapter links on large screens; below that a single INDEX toggle opens
// a full-screen chapter list. Colors ride the chapter variables.
export default function Navbar() {
  const [open, setOpen] = useState(false)

  const go = (e, target) => {
    e.preventDefault()
    setOpen(false)
    window.__lenis?.start()
    const lenis = window.__lenis
    if (!lenis) return
    if (target === 'bottom') {
      lenis.scrollTo(document.body.scrollHeight, { duration: 1.6 })
    } else {
      lenis.scrollTo(target, { duration: 1.4 })
    }
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
      {/* A floating glass pill rather than a full-width strip with a gradient
          bleeding out of it, and the scroll progress lives along its lower edge
          instead of as a second bar pinned to the very top of the screen: one
          object that says both where you are and where you can go. */}
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 text-[var(--fg-page)] md:px-6 md:pt-4">
        <nav className="nav-glass group/bar pointer-events-auto relative mx-auto flex max-w-[1500px] items-center justify-between gap-6 rounded-full py-3 pl-5 pr-4 md:pl-7 md:pr-6">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault()
              setOpen(false)
              window.__lenis?.start()
              window.__lenis?.scrollTo(0, { duration: 1.4 })
            }}
            data-cursor=""
            className="mono-label font-medium"
          >
            {identity.logo}
          </a>
          <div className="hidden items-center gap-6 lg:flex">
            {LINKS.map((l) => (
              <a
                key={l.label}
                href={l.target === 'bottom' ? '#contact' : l.target}
                onClick={(e) => go(e, l.target)}
                data-cursor=""
                className="mono-label transition-opacity duration-200 hover:opacity-60"
              >
                {l.label}
              </a>
            ))}
          </div>
          <button
            type="button"
            onClick={toggleIndex}
            aria-expanded={open}
            aria-controls="chapter-index"
            data-cursor=""
            className="mono-label cursor-pointer border-0 bg-transparent p-0 lg:hidden"
          >
            {open ? 'CLOSE ✕' : 'INDEX ☰'}
          </button>
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
