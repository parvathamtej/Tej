import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'
import { pattern } from '../data/content'
import { EASE, SCRAMBLE_CHARS } from '../lib/motion'

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrambleTextPlugin)

const LINE = 'display-type block overflow-hidden pb-[0.12em] -mb-[0.12em]'

// 01 / THE PATTERN — the most important animation on the site.
// Each pair is two lines: the problem lands first, the solution lands a beat
// later (400ms), so the reader feels the gap between question and answer.
// Time-based rather than scrubbed, so the beat is identical at any scroll speed.
export default function Pattern() {
  const rootRef = useRef(null)
  const payoffRef = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.pt-meta', {
          opacity: 0,
          y: 14,
          duration: 0.7,
          ease: EASE,
          scrollTrigger: { trigger: rootRef.current, start: 'top 70%', once: true },
        })

        gsap.utils.toArray('.pt-pair').forEach((pair) => {
          gsap
            .timeline({ scrollTrigger: { trigger: pair, start: 'top 65%', once: true } })
            .from(pair.querySelector('.pt-problem span'), {
              yPercent: 110,
              duration: 1,
              ease: EASE,
            })
            .from(
              pair.querySelector('.pt-solution span'),
              { yPercent: 110, duration: 1, ease: EASE },
              '+=0.4', // the beat. Do not tighten.
            )
        })

        // The machine finishing its thought: slower than the stamps, once only.
        const lead = payoffRef.current.querySelector('.pt-lead')
        gsap
          .timeline({ scrollTrigger: { trigger: payoffRef.current, start: 'top 60%', once: true } })
          .to(lead, {
            duration: 2.4,
            ease: 'none',
            scrambleText: { text: pattern.payoff.lead, chars: SCRAMBLE_CHARS, speed: 0.35 },
          })
          .from(
            payoffRef.current.querySelector('.pt-payoff-line span'),
            { yPercent: 110, duration: 1, ease: EASE },
            '-=0.3',
          )
      })

      return () => mm.revert()
    },
    { scope: rootRef },
  )

  return (
    <section id="pattern" ref={rootRef} className="relative z-[5] bg-ink px-5 md:px-8">
      <div className="pt-meta flex items-baseline justify-between pt-28">
        <p className="mono-label">
          <span className="text-acid">[{pattern.index}]</span>
          <span className="ml-3 opacity-60">{pattern.label}</span>
        </p>
        <p className="mono-label hidden opacity-40 md:block">KEEP SCROLLING</p>
      </div>

      {pattern.pairs.map((pair, i) => (
        <div
          key={pair.problem}
          // Pair three arrives after a held empty screen. The silence is doing
          // work: it separates the two older jobs from the current one.
          className={`pt-pair flex min-h-dvh flex-col justify-center ${i === 2 ? 'mt-[70vh]' : ''}`}
        >
          <p
            className={`pt-problem ${LINE} max-w-[19ch] text-[clamp(1.8rem,4.2vw,3.6rem)]`}
          >
            <span className="inline-block will-change-transform">{pair.problem}</span>
          </p>
          <p
            className={`pt-solution ${LINE} mt-3 max-w-[19ch] text-[clamp(1.8rem,4.2vw,3.6rem)]`}
          >
            <span className="inline-block will-change-transform">
              {pair.solution.map((seg, s) => (
                <span key={s} className={seg.accent ? 'serif-accent text-acid' : undefined}>
                  {seg.text}
                </span>
              ))}
            </span>
          </p>
        </div>
      ))}

      <div
        ref={payoffRef}
        className="flex min-h-dvh flex-col justify-center pb-[clamp(4rem,10vh,8rem)]"
      >
        <p className="pt-lead display-type text-[clamp(2.2rem,5.2vw,4.6rem)] text-acid">
          {pattern.payoff.lead}
        </p>
        <p className="pt-payoff-line display-type mt-4 block max-w-[26ch] overflow-hidden pb-[0.12em] -mb-[0.12em] text-[clamp(1.5rem,3.2vw,2.8rem)]">
          <span className="inline-block will-change-transform">{pattern.payoff.line}</span>
        </p>
      </div>
    </section>
  )
}
