import { identity } from '../data/content'
import { useIST } from '../lib/useIST'

const LINKS = [
  { label: 'WORK', target: '#work' },
  { label: 'STACK', target: '#stack' },
  { label: 'CONTACT', target: 'bottom' },
]

export default function Navbar() {
  const time = useIST()

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
    <header className="fixed inset-x-0 top-0 z-50 mix-blend-difference">
      <nav className="flex items-center justify-between px-5 py-4 text-bone md:px-8">
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
          <span className="mono-label hidden opacity-60 md:inline" aria-label="Local time in Hyderabad">
            HYD {time} IST
          </span>
        </div>
      </nav>
    </header>
  )
}
