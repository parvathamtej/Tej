import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Stamp from '../components/Stamp'
import { DUR_S, EASE, MM, STAGGER, reduced } from '../lib/motion'

// Shipped stage treatment, chosen in the effect lab and then inlined: the lab
// and its store were tuning scaffolding and are deleted (they also added a
// subscription re-render to this component, which is the exact class of churn
// that caused the frozen-dots bug). The other geometries and skins remain
// defined below and in global.css as documented one-word swaps.
const CARD_GEO_MODE = 'coverflow'
const CARD_SKIN = 'lumen'

// ─── Stage card geometry ─────────────────────────────────────────────────────
// Every mode is a pure function of a card's signed offset from the active
// index. The track still translates by a whole card width per step, so the
// layout box and the pin arithmetic never change; these transforms ride on top
// of that. `flat` reproduces the original behaviour exactly.
const CARD_GEO = {
  flat: (o) => ({ rotY: 0, z: 0, x: 0, y: 0, scale: 1, opacity: Math.abs(o) < 0.5 ? 1 : 0.2 }),
  coverflow: (o) => {
    const a = Math.min(Math.abs(o), 2)
    return {
      rotY: -o * 34,
      z: -a * 190,
      x: o * 3,
      y: 0,
      scale: 1 - a * 0.05,
      opacity: Math.max(0.12, 1 - a * 0.5),
    }
  },
  arc: (o) => {
    const a = Math.min(Math.abs(o), 2)
    return {
      rotY: -o * 14,
      z: -a * 120,
      x: 0,
      y: a * 5.5,
      scale: 1 - a * 0.06,
      opacity: Math.max(0.12, 1 - a * 0.48),
    }
  },
  deck: (o) => {
    const a = Math.min(Math.abs(o), 2)
    return {
      rotY: 0,
      z: o < 0 ? 180 * -o : -a * 150,
      x: o < 0 ? o * 2.5 : 0,
      y: o < 0 ? o * 3 : a * 3,
      scale: o < 0 ? 1 + -o * 0.04 : 1 - a * 0.05,
      opacity: o < 0 ? Math.max(0, 1 + o * 1.2) : Math.max(0.12, 1 - a * 0.42),
    }
  },
}

gsap.registerPlugin(useGSAP, ScrollTrigger)

// Preview = the first paragraph, or the first two when the opener is a single
// sentence. Cuts land on paragraph boundaries so no sentence is ever split.
// data-lenis-prevent hands the wheel to a container's native scrolling. That is
// required when the container really can scroll (V11: an expanded card's
// overflow is otherwise unreachable), and actively BREAKS the page when it
// cannot — Lenis steps aside, the container has nothing to consume, and the
// wheel does nothing at all. A pinned dossier is mostly rail and card, so a
// permanently-marked rail froze scrolling across most of the section. The
// attribute is therefore only ever present while the element actually overflows.
const OVERFLOW_SLOP = 4
function syncLenisPrevent(el) {
  if (!el) return
  if (el.scrollHeight - el.clientHeight > OVERFLOW_SLOP) el.setAttribute('data-lenis-prevent', '')
  else el.removeAttribute('data-lenis-prevent')
}

const sentenceCount = (p) => (p.match(/[.!?](\s|$)/g) || []).length
function splitPreview(paras) {
  if (paras.length <= 1) return [paras, []]
  const take = sentenceCount(paras[0]) >= 2 ? 1 : 2
  return [paras.slice(0, take), paras.slice(take)]
}

// One card on the dossier stage. Collapsed by default: heading + opening
// sentences, the rest behind a real <button> with aria-expanded. The
// GlobalLogic agent card opens expanded (strongest writing on the site).
function Card({ card, n }) {
  const [open, setOpen] = useState(card.defaultOpen || reduced())
  const [preview, rest] = splitPreview(card.paras)
  const bodyId = `cs-body-${card.key}`
  const ref = useRef(null)
  // Expanding is exactly when a card starts (or stops) overflowing, so the
  // wheel handoff has to be re-decided on every toggle, after the disclosure
  // grid has settled to its new height.
  useEffect(() => {
    const el = ref.current
    const id = setTimeout(() => syncLenisPrevent(el), 420)
    return () => clearTimeout(id)
  }, [open])
  return (
    <article
      ref={ref}
      className="cs-card no-scrollbar flex flex-col border border-[var(--hair)] p-6 md:h-full md:w-full md:flex-none md:overflow-y-auto md:p-9">
      <span aria-hidden="true" className="card-ghost">
        0{n}
      </span>
      {card.heading ? (
        <h3 className="display-m max-w-[33ch] text-[var(--accent-ui)]">
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
        <p className="display-s mt-8 max-w-[30ch] text-acid">
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
  const railRef = useRef(null)

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

      // Which card the coverflow paint currently fronts. The spotlight driver
      // reads it every frame. (Single dossiers render prose, no cards at all,
      // so their spotlight context exits immediately.)
      const live = { pos: 0 }

      // Whether the rail and cards can scroll depends on viewport height and on
      // font metrics, so it is re-decided on every refresh rather than assumed.
      const syncScrollables = () => {
        syncLenisPrevent(railRef.current)
        q('.cs-card').forEach(syncLenisPrevent)
      }
      syncScrollables()
      ScrollTrigger.addEventListener('refresh', syncScrollables)
      // Timing-based re-measurement is not reliable here: every scheduled pass
      // (fonts.ready, a delayed call, the initial refresh) can land while the
      // preloader still owns the layout, and a stale "yes it overflows" leaves
      // the wheel handed to a container with nothing to scroll. The answer is
      // therefore recomputed on pointerenter — the last possible moment before
      // a wheel event can arrive, and always against the settled layout.
      const targets = [railRef.current, ...q('.cs-card')].filter(Boolean)
      const onEnter = (e) => syncLenisPrevent(e.currentTarget)
      targets.forEach((el) => el.addEventListener('pointerenter', onEnter))

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
          const n = cardEls.length

          const GAP = 20
          // Cached, not read per frame: reading clientWidth inside the tween's
          // value function forces a layout on every refresh-invalidated frame.
          let stepPx = track.parentElement.clientWidth + GAP
          const measureStep = () => {
            stepPx = track.parentElement.clientWidth + GAP
          }
          const geo = CARD_GEO[CARD_GEO_MODE] || CARD_GEO.flat

          // Cards are transformed directly from scroll progress rather than by
          // tweens on the timeline. A tween per card per transition fought the
          // geometry function for ownership of opacity, and lost on scrub-back.
          //
          // These are RAW STYLE WRITES, not gsap.set, and that is deliberate:
          // gsap.set builds a zero-duration tween per call, and initialising it
          // re-reads computed style, so painting 4 cards × 9 properties every
          // frame put 297ms of forced reflow into a Chrome trace (second only to
          // DotField). Nothing else animates these cards' transform or opacity
          // (the mobile entrance lives in a mutually exclusive matchMedia
          // context), so no GSAP cache can go stale here — but the context
          // cleanup below must clear these inline styles by hand, since GSAP is
          // no longer the one that set them.
          const zPrev = new Array(n).fill(null)
          const pePrev = new Array(n).fill(null)
          const paint = (pos) => {
            live.pos = pos
            for (let i = 0; i < n; i++) {
              const o = i - pos
              const g = geo(o)
              const s = cardEls[i].style
              s.transform = `translate3d(${g.x}%, ${g.y}%, ${g.z}px) rotateY(${g.rotY}deg) scale(${g.scale})`
              s.opacity = g.opacity
              // Discrete properties change a handful of times across a whole
              // scrub; writing them every frame invalidates style for nothing.
              const a = Math.abs(o)
              const z = 50 - Math.round(a * 10)
              if (z !== zPrev[i]) {
                s.zIndex = z
                zPrev[i] = z
              }
              const pe = a < 0.5 ? 'auto' : 'none'
              if (pe !== pePrev[i]) {
                s.pointerEvents = pe
                pePrev[i] = pe
              }
            }
          }
          paint(0)

          // ONE CLOCK for the geometry and the track, and it is the track's own
          // position. Painting from the ScrollTrigger's onUpdate used
          // self.progress, which is the RAW scroll-derived value: with scrub: 1
          // the track's translation lags it by up to a second, so on any quick
          // scroll the cards' rotation and opacity snapped ahead of the slide
          // they are supposed to belong to. Deriving the position from the
          // track's actual x makes the two exact by construction, at any scrub
          // smoothing, and through every ease inside the timeline.
          const tl = gsap.timeline({
            onUpdate: () => {
              const pos = -gsap.getProperty(track, 'x') / stepPx
              paint(pos)
              // Dots read LIVE at call time (V11 rule): captured nodes go
              // stale if React ever replaces this subtree.
              const dotEls = dotsRef.current?.children
              if (!dotEls) return
              const active = Math.round(pos)
              for (let i = 0; i < n && i < dotEls.length; i++) {
                dotEls[i].textContent = i === active ? '●' : '○'
                dotEls[i].classList.toggle('text-acid', i === active)
              }
            },
            scrollTrigger: {
              // The pinned stage is the trigger: the heading scrolls away first
              trigger: pinRef.current,
              start: 'top top',
              end: `+=${(n - 1) * 90}%`,
              scrub: 1,
              pin: pinRef.current,
              invalidateOnRefresh: true,
            },
          })
          // Shared with the spotlight driver so it can skip every frame in which
          // this dossier is not the section on screen.
          live.st = tl.scrollTrigger
          // ease: 'none', NOT the brand ease. In a SCRUBBED timeline the reader's
          // scroll is the clock, so an ease makes equal wheel movement produce
          // unequal card movement: each transition shot forward and then stalled
          // (30px of scroll moved the track 226px), which is precisely what reads
          // as "not smooth". Scrub: 1 is the only smoothing here. The brand ease
          // still owns every time-based entrance; Hero, Contact and the progress
          // bar already followed this rule, and the track was the exception.
          for (let i = 1; i < n; i++) {
            tl.to(track, { x: () => -(i * stepPx), duration: 1, ease: 'none' }, i - 1)
          }
          ScrollTrigger.addEventListener('refreshInit', measureStep)

          return () => {
            ScrollTrigger.removeEventListener('refreshInit', measureStep)
            // GSAP did not set these, so mm.revert() cannot take them back.
            cardEls.forEach((el) => {
              el.style.transform = ''
              el.style.opacity = ''
              el.style.zIndex = ''
              el.style.pointerEvents = ''
            })
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

      // Cursor spotlight on the lumen skin. Stateless per-frame, but GEOMETRIC
      // rather than elementFromPoint: Chrome's hit-test misses elements pushed
      // back in Z inside a preserve-3d context, so the coverflow cards are
      // invisible to it. The active card's projected rect (getBoundingClientRect
      // handles the 3D flattening correctly) is checked against the pointer
      // every frame instead — same stateless guarantee, no stale glow when
      // Lenis scrolls the page under a still cursor. Coordinates land in
      // PIXELS compensated for the card's own scrollTop so the ::after layer
      // stays aligned inside internally-scrolled cards.
      mm.add(MM.desk, () => {
        if (!window.matchMedia('(pointer: fine)').matches) return
        const cardEls = q('.cs-card')
        if (!cardEls.length) return
        const pos = { x: -1, y: -1 }
        const onMove = (e) => {
          pos.x = e.clientX
          pos.y = e.clientY
        }
        let lit = null
        // A rect read is a forced layout, so it happens only on frames where
        // something that could change the answer actually moved: the pointer,
        // or the card under it. A still cursor over a still card costs nothing.
        //
        // The cooldown is not an optimisation detail, it is correctness: the
        // card's rect keeps arriving for a frame or two after the scrubbed
        // progress stops changing, so a gate that stopped exactly when
        // live.pos settled would freeze on the last pre-settled rect and leave
        // a card the cursor is genuinely over unlit (measured, not theorised).
        let seenX = -2
        let seenY = -2
        let seenPos = -2
        let cool = 0
        const spot = () => {
          // FIRST, and cheapest: if this dossier's pin is not engaged, there is
          // no fronted card to light and nothing to do. Without this the driver
          // kept hit-testing for all three dossiers on every frame of the entire
          // page — a Chrome trace charged it 410ms of forced reflow while
          // scrolling the Pattern section, where no card is even on screen.
          if (live.st && !live.st.isActive) {
            if (lit) {
              lit.style.setProperty('--spot', '0')
              lit = null
            }
            return
          }
          if (pos.x !== seenX || pos.y !== seenY || live.pos !== seenPos) cool = 5
          else if (cool > 0) cool--
          else return
          seenX = pos.x
          seenY = pos.y
          seenPos = live.pos
          const target0 = cardEls[Math.round(live.pos)]
          let target = null
          if (target0 && pos.x >= 0) {
            const r = target0.getBoundingClientRect()
            if (pos.x >= r.left && pos.x <= r.right && pos.y >= r.top && pos.y <= r.bottom) {
              target = target0
              target.style.setProperty('--mx', `${Math.round(pos.x - r.left + target.scrollLeft)}px`)
              target.style.setProperty('--my', `${Math.round(pos.y - r.top + target.scrollTop)}px`)
              target.style.setProperty('--spot', '1')
            }
          }
          if (lit && lit !== target) lit.style.setProperty('--spot', '0')
          lit = target
        }
        window.addEventListener('pointermove', onMove, { passive: true })
        gsap.ticker.add(spot)
        return () => {
          window.removeEventListener('pointermove', onMove)
          gsap.ticker.remove(spot)
        }
      })

      return () => {
        ScrollTrigger.removeEventListener('refresh', syncScrollables)
        targets.forEach((el) => el.removeEventListener('pointerenter', onEnter))
        mm.revert()
      }
    },
    { scope: rootRef },
  )

  return (
    <section id={study.id} ref={rootRef} className={`relative skin-${CARD_SKIN}`}>
      {/* No standalone company heading and no divider screen. The rail below IS
          the chapter heading: the reader is already looking there, and the HUD
          and chapter rail have already said a new chapter began. A separate
          announcement was the same information a second time, one screen early. */}
      {/* minmax(0, 1fr), never plain 1fr: a plain fr column keeps an automatic
          min-content floor, and the stage's non-shrinking flex track pushes that
          floor past the column's share, so the card overflowed the viewport by
          164px at 1536 (and 243px at 1440) while a hidden overflow made the page
          look clean. Vertical padding is viewport-relative because a fixed
          pt-32/pb-16 pair eats 192px of a 700px-tall laptop viewport, which is
          what pushed the rail's links under the HUD. */}
      <div
        ref={pinRef}
        className={`grid grid-cols-1 gap-8 px-5 pb-16 pt-16 md:grid-cols-[32%_minmax(0,1fr)] md:gap-12 md:px-8 md:pb-[clamp(3rem,6vh,4rem)] md:pt-[clamp(4.75rem,10vh,8rem)] motion-reduce:!h-auto ${
          single ? 'min-h-[70dvh] content-center' : 'md:h-dvh'
        }`}
      >
        {/* Left rail: the chapter heading and the persistent reference. It can
            scroll when a short viewport forces it to, so the wheel handoff is
            decided by measurement (see syncLenisPrevent), never hardcoded. */}
        <aside
          ref={railRef}
          className="cs-rail no-scrollbar flex flex-col gap-3 md:gap-4 md:overflow-y-auto md:pr-4"
        >
          <p className="mono-label text-[var(--accent-ui)]">
            {study.index} / {study.category}
          </p>
          <h2 className="display-l">{study.heading}</h2>
          <h3 className="display-m max-w-[22ch]">{study.title}</h3>
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
                  <Card key={card.key} card={card} n={cards.indexOf(card) + 1} />
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

      {/* Seam: a released pin and the next arriving chapter must not share the
          screen with zero separation. */}
      {!single ? <div aria-hidden="true" className="hidden h-[18vh] md:block" /> : null}
    </section>
  )
}
