import { useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Stamp from '../components/Stamp'
import PullQuote from '../components/PullQuote'
import { DUR_S, EASE, MM, STAGGER, reduced } from '../lib/motion'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// Preview = the first paragraph, or the first two when the opener is a single
// sentence. Cuts land on paragraph boundaries so no sentence is ever split.
const sentenceCount = (p) => (p.match(/[.!?](\s|$)/g) || []).length
function splitPreview(paras) {
  if (paras.length <= 1) return [paras, []]
  const take = sentenceCount(paras[0]) >= 2 ? 1 : 2
  return [paras.slice(0, take), paras.slice(take)]
}

// One card on the dossier stage. Collapsed by default: heading + opening
// sentences, the rest behind a real <button> with aria-expanded. The
// GlobalLogic agent card opens expanded (strongest writing on the site).
function Card({ card, active }) {
  const [open, setOpen] = useState(card.defaultOpen || reduced())
  const [preview, rest] = splitPreview(card.paras)
  const bodyId = `cs-body-${card.key}`
  return (
    <article
      className="cs-card flex flex-col border border-[var(--hair)] p-6 md:h-full md:w-full md:flex-none md:overflow-y-auto md:p-9"
      data-active={active ? '1' : '0'}
    >
      {card.heading ? (
        <h3 className="display-type display-caps max-w-[24ch] text-[clamp(1.3rem,2vw,1.9rem)] font-medium text-[var(--accent-ui)]">
          {card.heading}
        </h3>
      ) : null}
      <div className={`prose-measure flex flex-col gap-4 text-[clamp(0.98rem,1.1vw,1.1rem)] ${card.heading ? 'mt-5' : ''}`}>
        {preview.map((p) => (
          <p key={p.slice(0, 24)}>{p}</p>
        ))}
      </div>
      {rest.length > 0 ? (
        <>
          <div className={`disclose ${open ? 'open' : ''}`}>
            <div>
              <div id={bodyId} className="prose-measure flex flex-col gap-4 pt-4 text-[clamp(0.98rem,1.1vw,1.1rem)]">
                {rest.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
              </div>
            </div>
          </div>
          <button
            type="button"
            aria-expanded={open}
            aria-controls={bodyId}
            onClick={() => setOpen((v) => !v)}
            data-cursor=""
            className="mono-label mt-5 self-start cursor-pointer border-0 bg-transparent p-0 text-[var(--accent-ui)] transition-opacity duration-200 hover:opacity-70"
          >
            {open ? 'COLLAPSE ↑' : 'EXPAND ↓'}
          </button>
        </>
      ) : null}
    </article>
  )
}

// ─── The dossier ─────────────────────────────────────────────────────────────
// Chapter pins. Fixed left rail (the reader always knows whose work this is),
// horizontal card stage on the right, one card at a time, previous dims to 20%.
// Hansi has no sub-cards: one composed screen, no pin. Mobile and
// reduced-motion collapse to a vertical document.
export default function CaseStudy({ study }) {
  const rootRef = useRef(null)
  const pinRef = useRef(null)
  const trackRef = useRef(null)
  const dotsRef = useRef(null)

  const cards = [
    { key: `${study.id}-intro`, heading: null, paras: study.intro },
    ...study.blocks.map((b, i) => ({
      key: `${study.id}-${i}`,
      heading: b.heading,
      paras: b.body,
      defaultOpen: b.heading === 'THEN I DESIGNED THE AGENT',
    })),
  ]
  const single = study.blocks.length === 0

  useGSAP(
    () => {
      const q = gsap.utils.selector(rootRef.current)
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from(q('.cs-rail > *'), {
          opacity: 0,
          y: 18,
          duration: DUR_S,
          ease: EASE,
          stagger: STAGGER,
          scrollTrigger: { trigger: rootRef.current, start: 'top 70%', once: true },
        })
      })

      if (!single) {
        mm.add(MM.desk, () => {
          const track = trackRef.current
          const cardEls = q('.cs-card')
          const dots = dotsRef.current.children
          const n = cardEls.length
          gsap.set(cardEls, { opacity: (i) => (i === 0 ? 1 : 0.2) })

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: rootRef.current,
              start: 'top top',
              end: `+=${(n - 1) * 90}%`,
              scrub: 1,
              pin: pinRef.current,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                const active = Math.round(self.progress * (n - 1))
                for (let i = 0; i < n; i++) {
                  dots[i].textContent = i === active ? '●' : '○'
                  dots[i].classList.toggle('text-acid', i === active)
                }
              },
            },
          })
          const GAP = 20 // matches the md gap on the track
          const step = () => track.parentElement.clientWidth + GAP
          for (let i = 1; i < n; i++) {
            const at = i - 1
            tl.to(track, { x: () => -(i * step()), duration: 1, ease: EASE }, at)
            tl.to(cardEls[i - 1], { opacity: 0.2, duration: 0.5, ease: EASE }, at + 0.1)
            tl.to(cardEls[i], { opacity: 1, duration: 0.5, ease: EASE }, at + 0.3)
          }
        })

        mm.add(MM.mob, () => {
          gsap.utils.toArray(q('.cs-card')).forEach((card) => {
            gsap.from(card, {
              opacity: 0,
              y: 32,
              duration: DUR_S,
              ease: EASE,
              scrollTrigger: { trigger: card, start: 'top 85%', once: true },
            })
          })
        })
      }

      return () => mm.revert()
    },
    { scope: rootRef },
  )

  return (
    <section id={study.id} ref={rootRef} className="relative">
      <div
        ref={pinRef}
        className={`grid grid-cols-1 gap-8 px-5 pb-10 pt-24 md:grid-cols-[32%_1fr] md:px-8 motion-reduce:!h-auto ${
          single ? 'min-h-dvh content-center' : 'md:h-dvh'
        }`}
      >
        {/* Left rail */}
        <aside className="cs-rail flex flex-col gap-4 md:overflow-y-auto md:pr-4">
          <p className="mono-label">
            <span className="text-[var(--accent-ui)]">[{study.index}]</span>
            <span className="ml-3 opacity-60">{study.label}</span>
          </p>
          <h2 className="display-type display-caps text-[clamp(1.8rem,2.6vw,2.5rem)] font-medium">
            {study.title}
          </h2>
          <p className="mono-label !normal-case opacity-60">{study.meta}</p>
          {study.stamp ? (
            <div>
              <Stamp text={study.stamp} />
            </div>
          ) : null}
          {study.stats ? (
            <ul className="mt-2 flex flex-wrap gap-2">
              {study.stats.map((s) => (
                <li key={s}>
                  <Stamp text={s} />
                </li>
              ))}
            </ul>
          ) : null}
          {study.tech ? (
            <p className="mono-label !normal-case mt-2 max-w-[36ch] leading-relaxed opacity-60">
              {study.tech.join(' · ')}
            </p>
          ) : null}
          {study.links ? (
            <ul className="mt-2 flex flex-col gap-1.5">
              {study.links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="OPEN"
                    className="mono-label transition-colors duration-200 hover:text-[var(--accent-ui)]"
                  >
                    {l.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </aside>

        {/* Stage */}
        {single ? (
          <div className="prose-measure flex flex-col justify-center gap-5 text-[clamp(0.98rem,1.1vw,1.1rem)]">
            {study.intro.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
        ) : (
          <div className="flex min-h-0 flex-col gap-4">
            <div className="cs-stage min-h-0 flex-1 md:overflow-hidden">
              <div
                ref={trackRef}
                className="flex flex-col gap-5 md:h-full md:flex-row motion-reduce:!flex-col"
              >
                {cards.map((card, i) => (
                  <Card key={card.key} card={card} active={i === 0} />
                ))}
              </div>
            </div>
            <p ref={dotsRef} aria-hidden="true" className="mono-label hidden gap-2 md:flex motion-reduce:!hidden">
              {cards.map((c, i) => (
                <span key={c.key} className={i === 0 ? 'text-acid' : ''}>
                  {i === 0 ? '●' : '○'}
                </span>
              ))}
            </p>
          </div>
        )}
      </div>

      {study.quote ? <PullQuote text={study.quote} /> : null}
    </section>
  )
}
