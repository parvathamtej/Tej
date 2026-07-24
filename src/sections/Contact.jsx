import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Marquee from '../components/Marquee'
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
          rotate: 4,
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

  return (
    <footer ref={rootRef} className="fixed inset-x-0 bottom-0 z-[1] flex h-dvh flex-col bg-ink text-bone">
      <div ref={innerRef} className="flex flex-1 flex-col px-5 pt-24 md:px-8">
        <div className="ct-soft flex items-baseline justify-between">
          <p className="mono-label">
            <span className="text-acid">[{contact.index}]</span>
            <span className="ml-3 opacity-60">{contact.label}</span>
          </p>
          <p className="mono-label hidden opacity-40 md:block">{contact.kicker}</p>
        </div>

        <h2
          className="display-type mt-auto text-[clamp(4rem,15vw,13.5rem)]"
          aria-label={`${contact.lineA} ${contact.lineB}`}
        >
          <Line text={contact.lineA} />
          <Line text={contact.lineB} className="text-acid md:pl-[14vw]" />
        </h2>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-8 pb-10">
          <MagneticButton data-cursor="SAY HI">
            <a
              href={`mailto:${identity.email}`}
              className="mono-label inline-block border border-[rgba(237,234,227,0.3)] px-7 py-4 transition-colors duration-200 hover:bg-acid hover:text-ink"
            >
              {identity.email}
            </a>
          </MagneticButton>
          <nav className="ct-soft flex gap-7" aria-label="Social links">
            {contact.links.map((l) => (
              <a key={l.label} href={l.href} target="_blank" rel="noreferrer" data-cursor="" className="roll mono-label">
                <span>{l.label} ↗</span>
                <span aria-hidden="true" className="text-acid">
                  {l.label} ↗
                </span>
              </a>
            ))}
          </nav>
        </div>

        <div className="ct-soft hairline-t flex flex-wrap items-center justify-between gap-3 py-4">
          <p className="mono-label opacity-50">
            {identity.location} — {time} IST
          </p>
          <p className="mono-label opacity-50">© 2026 TEJ PRAKASH</p>
          <p className="mono-label hidden opacity-50 lg:block">{contact.credit}</p>
        </div>
      </div>
      <Marquee
        text={contact.marquee}
        reverse
        speed={20}
        className="display-type hairline-t py-4 text-[clamp(1.4rem,3vw,2.4rem)] opacity-90"
      />
    </footer>
  )
}
