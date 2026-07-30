import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import MagneticButton from '../components/MagneticButton'
import { availability, contact, identity } from '../data/content'
import { DUR, EASE, STAGGER } from '../lib/motion'
import { useIST } from '../lib/useIST'

// Same column header treatment as the credentials section, deliberately: a
// reader who has already scrolled past three labelled columns recognises this
// one instantly.
const COL_LABEL = 'mono-label !text-[0.875rem] text-[var(--accent-ui)]'

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
      // The footer is revealed by the page lifting off it, so its triggers key
      // off main's bottom edge. Resolve the element once and guard: a string
      // selector warns and silently detaches if it resolves before mount.
      const main = document.querySelector('.site-main')
      if (!main || !innerRef.current) return
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          innerRef.current,
          { yPercent: -14 },
          {
            yPercent: 0,
            ease: 'none',
            scrollTrigger: { trigger: main, start: 'bottom bottom', end: 'bottom top', scrub: 1 },
          },
        )
        gsap.from('.ct-char', {
          yPercent: 112,
          duration: DUR,
          ease: EASE,
          stagger: STAGGER / 1.5,
          scrollTrigger: { trigger: main, start: 'bottom 55%', once: true },
        })
        gsap.from('.ct-soft', {
          opacity: 0,
          y: 18,
          duration: 0.8,
          ease: EASE,
          stagger: 0.08,
          scrollTrigger: { trigger: main, start: 'bottom 60%', once: true },
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
      {/* The chapter label and the availability strapline are both deleted. The
          heading says SAY HI three words later, the AVAILABILITY column below
          states the same offer in a place the reader can act on, and the footer
          is the one screen that does not need announcing. What is left starts
          higher and sits as one group instead of one line at the ceiling, a
          heading pushed to the middle by mt-auto, and content at the floor. */}
      {/* pt clears the floating nav pill, which is 60px tall and sits 16px from
          the top: any less and LET'S disappears behind the glass. */}
      <div ref={innerRef} className="flex flex-1 flex-col px-5 pt-28 md:px-8 md:pt-32">
        <h2
          className="display-xl"
          aria-label={`${contact.lineA} ${contact.lineB}`}
        >
          <Line text={contact.lineA} />
          <Line text={contact.lineB} className="text-acid md:pl-[14vw]" />
        </h2>

        {/* Three labelled columns, not four things pinned to four corners. The
            old row spread the email hard left and the links hard right with a
            void between them, so the eye had to hunt for the thing the whole
            screen exists to offer. This is the same column pattern the
            credentials section already uses, which means the reader has met it
            before: label, rule, content, read left to right.
            AVAILABILITY lives here now. It used to sit in the bottom bar, and
            deleting that bar would otherwise have deleted the one line on the
            site that says he is actually looking. */}
        <div className="ct-soft mt-14 grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-10">
          <div>
            <p className={COL_LABEL}>EMAIL</p>
            <div className="mt-4 border-t border-[var(--hair)] pt-5">
              <MagneticButton data-cursor="SAY HI">
                <a
                  href={`mailto:${identity.email}`}
                  className="mono-label inline-block border border-[rgba(237,234,227,0.3)] px-6 py-3.5 transition-colors duration-200 hover:bg-acid hover:text-ink"
                >
                  {identity.email}
                </a>
              </MagneticButton>
            </div>
          </div>

          <div>
            <p className={COL_LABEL}>ELSEWHERE</p>
            <nav
              className="mt-4 flex flex-col gap-2.5 border-t border-[var(--hair)] pt-5"
              aria-label="Social links"
            >
              {contact.links.map((l) => {
                // A download link (the résumé slot) stays same-tab and gets ↓
                const arrow = l.download ? '↓' : '↗'
                const extra = l.download
                  ? { download: '' }
                  : { target: '_blank', rel: 'noreferrer' }
                return (
                  <a
                    key={l.label}
                    href={l.href}
                    data-cursor=""
                    className="roll mono-label self-start"
                    {...extra}
                  >
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

          <div>
            <p className={COL_LABEL}>AVAILABILITY</p>
            <div className="mt-4 border-t border-[var(--hair)] pt-5">
              <p className="mono-label flex items-center gap-2.5 text-[var(--accent-ui)]">
                <span aria-hidden="true" className="inline-block h-1.5 w-1.5 rounded-full bg-acid" />
                {availability}
              </p>
              <p className="mono-label !normal-case mt-2.5 opacity-60">
                {identity.location} {time} IST
              </p>
            </div>
          </div>
        </div>

        {/* Two groups, not four evenly spaced items. Location and time moved up
            into AVAILABILITY where they mean something; what is left is the
            colophon on one side and the way back on the other. */}
        <div className="ct-soft hairline-t mt-auto flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-4">
          <p className="mono-label opacity-60">
            © 2026 TEJ PRAKASH
            <span className="ml-3 hidden lg:inline">· {contact.credit}</span>
          </p>
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
