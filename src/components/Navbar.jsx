import { identity } from '../data/content'

const LINKS = [
  { label: 'ABOUT', target: '#about' },
  { label: 'WORK', target: '#work' },
  { label: 'STACK', target: '#stack' },
  { label: 'CONTACT', target: 'bottom' },
]

// Color rides the chapter variables, so the bar stays legible on every flood.
export default function Navbar() {
  const go = (e, target) => {
    e.preventDefault()
    const lenis = window.__lenis
    if (!lenis) return
    if (target === 'bottom') {
      lenis.scrollTo(document.body.scrollHeight, { duration: 1.6 })
    } else {
      lenis.scrollTo(target, { duration: 1.4 })
    }
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 text-[var(--fg-page)]">
      <nav
        className="flex items-center justify-between px-5 py-4 md:px-8"
        style={{
          background:
            'linear-gradient(to bottom, color-mix(in srgb, var(--bg-page) 72%, transparent), transparent)',
        }}
      >
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault()
            window.__lenis?.scrollTo(0, { duration: 1.4 })
          }}
          data-cursor=""
          className="mono-label font-bold"
        >
          {identity.logo}
        </a>
        <div className="flex items-center gap-5 md:gap-8">
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
      </nav>
    </header>
  )
}
