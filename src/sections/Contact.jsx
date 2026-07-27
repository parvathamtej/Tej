import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import MagneticButton from '../components/MagneticButton'
import { contact, identity } from '../data/content'
import { DUR, EASE, STAGGER } from '../lib/motion'
import { useIST } from '../lib/useIST'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const Line = ({ text, className = '' }) => (
  <span className={`block overflow-hidden pb-[0.06em] -mb-[0.06em] ${className}`}>
    {text.split('').map((c, i) => (
      <span key={i} className="ct-char inline-block will-change-transform">
        {c}
      </span>
    ))}
  </span>
)

// Fixed footer sitting UNDER the page — the content above scrolls away like a
// curtain lifting off it (main has margin-bottom: 100dvh to leave the room).
// Ends on a static outline-stroked wordmark cropped by the bottom edge.
export default function Contact() {
  const rootRef = useRef(null)
  const innerRef = useRef(null)
  const time = useIST()

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          innerRef.current,
          { yPercent: -14 },
          {
            yPercent: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: '.site-main',
              start: 'bottom bottom',
              end: 'bottom top',
              scrub: 1,
            },
          },
        )
        gsap.from('.ct-char', {
          yPercent: 112,
          duration: DUR,
          ease: EASE,
          stagger: STAGGER / 1.5,
          scrollTrigger: { trigger: '.site-main', start: 'bottom 55%', once: true },
        })
        gsap.from('.ct-soft', {
          opacity: 0,
          y: 18,
          duration: 0.8,
          ease: EASE,
          stagger: 0.08,
          scrollTrigger: { trigger: '.site-main', start: 'bottom 60%', once: true },
        })
      })
      return () => mm.revert()
    },
    { scope: rootRef },
  )

  const backToTop = (e) => {
    e.preventDefault()
    window.__lenis?.scrollTo(0, { duration: 1.8 })
  }

  return (
    <footer ref={rootRef} className="fixed inset-x-0 bottom-0 z-[1] flex h-dvh flex-col bg-ink text-bone">
      <div ref={innerRef} className="flex flex-1 flex-col px-5 pt-24 md:px-8">
        <div className="ct-soft flex items-baseline justify-between">
          <p className="mono-label">
            <span className="text-acid">[{contact.index}]</span>
            <span className="ml-3 opacity-60">{contact.label}</span>
          </p>
          <p className="mono-label hidden opacity-60 md:block">{contact.kicker}</p>
        </div>

        <h2
          className="display-type display-caps mt-auto text-[clamp(4rem,15vw,13.5rem)]"
          aria-label={`${contact.lineA} ${contact.lineB}`}
        >
          <Line text={contact.lineA} />
          <Line text={contact.lineB} className="text-acid md:pl-[14vw]" />
        </h2>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-8 pb-8">
          <MagneticButton data-cursor="SAY HI">
            <a
              href={`mailto:${identity.email}`}
              className="mono-label inline-block border border-[rgba(237,234,227,0.3)] px-7 py-4 transition-colors duration-200 hover:bg-acid hover:text-ink"
            >
              {identity.email}
            </a>
          </MagneticButton>
          <nav className="ct-soft flex gap-7" aria-label="Social links">
            {contact.links.map((l) => {
              // A download link (the résumé slot) stays same-tab and gets ↓
              const arrow = l.download ? '↓' : '↗'
              const extra = l.download
                ? { download: '' }
                : { target: '_blank', rel: 'noreferrer' }
              return (
                <a key={l.label} href={l.href} data-cursor="" className="roll mono-label" {...extra}>
                  <span>
                    {l.label} {arrow}
                  </span>
                  <span aria-hidden="true" className="text-acid">
                    {l.label} {arrow}
                  </span>
                </a>
              )
            })}
          </nav>
        </div>

        <div className="ct-soft hairline-t flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-4">
          <p className="mono-label opacity-60">
            {identity.locationShort} · {time} IST
          </p>
          <p className="mono-label opacity-60">© 2026 TEJ PRAKASH</p>
          <p className="mono-label hidden opacity-60 lg:block">{contact.credit}</p>
          <a href="#top" onClick={backToTop} data-cursor="" className="roll mono-label">
            <span>BACK TO TOP ↑</span>
            <span aria-hidden="true" className="text-acid">
              BACK TO TOP ↑
            </span>
          </a>
        </div>
      </div>
    </footer>
  )
}
