import { useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionHeading from '../components/SectionHeading'
import Stamp from '../components/Stamp'
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
function Card({ card }) {
  const [open, setOpen] = useState(card.defaultOpen || reduced())
  const [preview, rest] = splitPreview(card.paras)
  const bodyId = `cs-body-${card.key}`
  return (
    <article className="cs-card flex flex-col border border-[var(--hair)] p-6 md:h-full md:w-full md:flex-none md:overflow-y-auto md:p-9">
      {card.heading ? (
        <h3 className="display-m text-[var(--accent-ui)]" style={{ '--wdth': 108 }}>
          {card.heading}
        </h3>
      ) : null}
      <div className={`body-copy flex flex-col gap-4 ${card.heading ? 'mt-5' : ''}`}>
        {preview.map((p) => (
          <p key={p.slice(0, 24)}>{p}</p>
        ))}
      </div>
      {rest.length > 0 ? (
        <>
          <div className={`disclose ${open ? 'open' : ''}`}>
            <div>
              <div id={bodyId} className="body-copy flex flex-col gap-4 pt-4">
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
            className="mono-label mt-5 cursor-pointer self-start border-0 bg-transparent p-0 text-[var(--accent-ui)] transition-opacity duration-200 hover:opacity-70"
          >
            {open ? 'COLLAPSE ↑' : 'EXPAND ↓'}
          </button>
        </>
      ) : null}
      {/* The card's conclusion. Stays visible whether the card is open or not:
          it is the argument, and it should never sit behind an interaction. */}
      {card.closer ? (
        <p className="display-m mt-8 max-w-[24ch] text-acid" style={{ '--wdth': 106 }}>
          {card.closer}
        </p>
      ) : null}
    </article>
  )
}

// ─── The dossier ─────────────────────────────────────────────────────────────
// Section heading in normal flow, then the chapter pins: fixed left rail (the
// reader always knows whose work this is) and a horizontal card stage.
// Hansi has no sub-cards: one composed screen, no pin.
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
      closer: b.closer,
      defaultOpen: b.heading === 'THEN I DESIGNED THE AGENT',
    })),
  ]
  const single = study.blocks.length === 0

  useGSAP(
    () => {
      if (!rootRef.current || !pinRef.current) return
      const q = gsap.utils.selector(rootRef.current)
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from(q('.cs-rail > *'), {
          opacity: 0,
          y: 18,
          duration: DUR_S,
          ease: EASE,
          stagger: STAGGER,
          scrollTrigger: { trigger: pinRef.current, start: 'top 70%', once: true },
        })
      })

      if (!single) {
        mm.add(MM.desk, () => {
          const track = trackRef.current
          if (!track || !dotsRef.current) return
          const cardEls = q('.cs-card')
          const dots = dotsRef.current.children
          const n = cardEls.length
          gsap.set(cardEls, { opacity: (i) => (i === 0 ? 1 : 0.2) })

          const GAP = 20
          const step = () => track.parentElement.clientWidth + GAP
          const tl = gsap.timeline({
            scrollTrigger: {
              // The pinned stage is the trigger: the heading scrolls away first
              trigger: pinRef.current,
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
      <div className="px-5 pb-14 pt-24 md:px-8 md:pb-20 md:pt-28">
        <SectionHeading
          index={study.index}
          category={study.category}
          heading={study.heading}
          deck={study.deck}
          size="xl"
          widthAxis
        />
      </div>

      <div
        ref={pinRef}
        className={`grid grid-cols-1 gap-8 px-5 pb-10 pt-4 md:grid-cols-[32%_1fr] md:px-8 motion-reduce:!h-auto ${
          single ? 'min-h-[70dvh] content-center' : 'md:h-dvh md:pt-24'
        }`}
      >
        {/* Left rail: the persistent reference while the stage moves */}
        <aside className="cs-rail flex flex-col gap-4 md:overflow-y-auto md:pr-4">
          <h3 className="display-m" style={{ '--wdth': 106 }}>
            {study.title}
          </h3>
          <p className="mono-label !normal-case opacity-70">{study.meta}</p>
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
            <p className="mono-label !normal-case mt-2 max-w-[36ch] leading-relaxed opacity-70">
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
          <div className="body-copy flex flex-col justify-center gap-5">
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
                {cards.map((card) => (
                  <Card key={card.key} card={card} />
                ))}
              </div>
            </div>
            <p
              ref={dotsRef}
              aria-hidden="true"
              className="mono-label hidden gap-2 md:flex motion-reduce:!hidden"
            >
              {cards.map((c, i) => (
                <span key={c.key} className={i === 0 ? 'text-acid' : ''}>
                  {i === 0 ? '●' : '○'}
                </span>
              ))}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
