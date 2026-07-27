import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Stamp from '../components/Stamp'
import PullQuote from '../components/PullQuote'
import { DUR_S, EASE, STAGGER } from '../lib/motion'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// One component, three chapters. Every slot is optional except the header, so
// Arrivio (everything), GlobalLogic (quote, no links) and Hansi (prose only)
// all render from the same data shape in content.js.
export default function CaseStudy({ study }) {
  const rootRef = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Header
        gsap
          .timeline({ scrollTrigger: { trigger: rootRef.current, start: 'top 78%', once: true } })
          .from('.cs-kicker', { opacity: 0, y: 14, duration: DUR_S, ease: EASE })
          .from('.cs-title span', { yPercent: 115, duration: 0.9, ease: EASE }, '-=0.4')
          .from('.cs-meta', { opacity: 0, y: 12, duration: DUR_S, ease: EASE }, '-=0.5')
          .from('.cs-intro p', { opacity: 0, y: 24, duration: DUR_S, ease: EASE, stagger: 0.1 }, '-=0.4')

        // Each sub-block gets its own beat, so the chapter reads as chapters
        gsap.utils.toArray('.cs-block').forEach((block) => {
          gsap
            .timeline({ scrollTrigger: { trigger: block, start: 'top 78%', once: true } })
            .from(block.querySelector('.cs-block-heading span'), {
              yPercent: 115,
              duration: 0.9,
              ease: EASE,
            })
            .from(
              block.querySelectorAll('.cs-block-body p'),
              { opacity: 0, y: 24, duration: DUR_S, ease: EASE, stagger: 0.08 },
              '-=0.45',
            )
        })

        if (rootRef.current.querySelector('.cs-tech')) {
          gsap.from('.cs-tech li', {
            opacity: 0,
            y: 16,
            duration: 0.5,
            ease: EASE,
            stagger: STAGGER / 2,
            scrollTrigger: { trigger: '.cs-tech', start: 'top 88%', once: true },
          })
        }
        if (rootRef.current.querySelector('.cs-links')) {
          gsap.from('.cs-links li', {
            opacity: 0,
            y: 20,
            duration: DUR_S,
            ease: EASE,
            stagger: 0.08,
            scrollTrigger: { trigger: '.cs-links', start: 'top 88%', once: true },
          })
        }
      })
      return () => mm.revert()
    },
    { scope: rootRef },
  )

  return (
    <section
      id={study.id}
      ref={rootRef}
      className="px-5 py-[clamp(6rem,16vh,12rem)] md:px-8"
    >
      {/* Header */}
      <div className="cs-kicker hairline-t flex items-baseline justify-between pt-4">
        <p className="mono-label">
          <span className="text-[var(--accent-ui)]">[{study.index}]</span>
          <span className="ml-3 opacity-60">{study.label}</span>
        </p>
      </div>

      <h2 className="cs-title display-type display-caps mt-6 block overflow-hidden pb-[0.08em] -mb-[0.08em] text-[clamp(2.2rem,5.2vw,4.6rem)]">
        <span className="inline-block will-change-transform">{study.title}</span>
      </h2>

      <div className="cs-meta mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
        <p className="mono-label opacity-60">{study.meta}</p>
        {study.stamp ? <Stamp text={study.stamp} /> : null}
      </div>

      <div className="cs-intro prose-measure mt-10 flex flex-col gap-5 text-[clamp(1rem,1.15vw,1.15rem)]">
        {study.intro.map((p) => (
          <p key={p.slice(0, 24)}>{p}</p>
        ))}
      </div>

      {/* Sub-blocks. These carry the most air on the page. */}
      {study.blocks.map((block) => (
        <div key={block.heading}>
          <div className="cs-block pt-[clamp(4.5rem,12vh,9rem)]">
            <h3 className="cs-block-heading display-type display-caps block max-w-[22ch] overflow-hidden pb-[0.08em] -mb-[0.08em] text-[clamp(1.5rem,2.8vw,2.4rem)] text-[var(--accent-ui)]">
              <span className="inline-block will-change-transform">{block.heading}</span>
            </h3>
            <div className="cs-block-body prose-measure mt-6 flex flex-col gap-5 text-[clamp(1rem,1.15vw,1.15rem)]">
              {block.body.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
          </div>
          {block.quoteAfter && study.quote ? <PullQuote text={study.quote} /> : null}
        </div>
      ))}

      {/* Stats */}
      {study.stats ? (
        <ul className="mt-[clamp(3.5rem,9vh,6rem)] flex flex-wrap gap-2.5">
          {study.stats.map((s) => (
            <li key={s}>
              <Stamp text={s} />
            </li>
          ))}
        </ul>
      ) : null}

      {/* Tech */}
      {study.tech ? (
        <ul className="cs-tech mt-8 flex flex-wrap gap-x-5 gap-y-2">
          {study.tech.map((t) => (
            <li key={t} className="mono-label !normal-case opacity-50">
              {t}
            </li>
          ))}
        </ul>
      ) : null}

      {/* Live links. Three only. The demand model is internal and never linked. */}
      {study.links ? (
        <ul className="cs-links hairline-t mt-10 pt-8">
          {study.links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                target="_blank"
                rel="noreferrer"
                data-cursor="OPEN"
                className="group flex flex-wrap items-baseline gap-x-4 py-3 transition-colors duration-200 hover:text-[var(--accent-ui)]"
              >
                <span className="mono-label font-bold">{l.label} ↗</span>
                <span className="mono-label !normal-case opacity-45 group-hover:opacity-80">
                  {l.host}
                </span>
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  )
}
