import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { EASE } from '../lib/motion'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// A line lifted out of the prose and given its own screen. Sticky rather than
// pinned, so it holds the viewport without a spacer and without fighting Lenis.
// MUST NOT be a <section>: App.jsx enumerates `.site-main > section` for the
// HUD chapter readout, and a nested section would shift every index after it.
export default function PullQuote({ text }) {
  const rootRef = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from(rootRef.current.querySelectorAll('.pq-word'), {
          opacity: 0,
          yPercent: 60,
          duration: 0.9,
          ease: EASE,
          stagger: 0.035,
          scrollTrigger: { trigger: rootRef.current, start: 'top 55%', once: true },
        })
      })
      return () => mm.revert()
    },
    { scope: rootRef },
  )

  // A 200dvh wrapper around a 100dvh sticky child gives exactly one full screen
  // of genuine hold. Shorter wrappers release almost immediately.
  return (
    <figure ref={rootRef} className="my-[clamp(3rem,8vh,6rem)] min-h-[200dvh]">
      <div className="sticky top-0 grid h-dvh place-items-center">
        <blockquote className="display-type max-w-[18ch] text-[clamp(2.2rem,5.6vw,4.8rem)] text-acid">
          {text.split(' ').map((w, i) => (
            <span key={i} className="pq-word inline-block will-change-transform">
              {w}
              {i < text.split(' ').length - 1 ? ' ' : ''}
            </span>
          ))}
        </blockquote>
      </div>
    </figure>
  )
}
