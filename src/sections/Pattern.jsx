import { useMemo, useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { pattern, patternVisuals } from '../data/content'
import { DUR, EASE, MM, mulberry32 } from '../lib/motion'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// ─── Beat 1 · Hansi: before/after wipe ───────────────────────────────────────
// The software he built at Hansi shows a client the finished room before it is
// built, so this interaction performs the sentence it accompanies.
function VisualHansi() {
  const v = patternVisuals.hansi
  const layer = (src, cls) =>
    src ? (
      <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover" />
    ) : (
      <div className={`absolute inset-0 ${cls}`} />
    )
  return (
    <div className="relative h-full w-full overflow-hidden">
      {layer(v.beforeSrc, 'ph-before')}
      <div className="pv-wipe absolute inset-0" style={{ clipPath: 'inset(0 100% 0 0)' }}>
        {layer(v.afterSrc, 'ph-after')}
      </div>
      <div className="pv-divider absolute inset-y-0 left-0 w-px bg-acid" />
      <p className="mono-label absolute bottom-4 left-4 opacity-70">{v.beforeLabel}</p>
      <p className="mono-label absolute bottom-4 right-4 text-acid">{v.afterLabel}</p>
    </div>
  )
}

// ─── Beat 2 · GlobalLogic: forty fields collapsing into one line ─────────────
function VisualGlobalLogic() {
  const v = patternVisuals.globallogic
  const drift = useMemo(() => {
    const r = mulberry32(41)
    return Array.from({ length: v.fieldCount }, () => Math.round(r() * 40 - 20))
  }, [v.fieldCount])
  return (
    <div className="relative flex h-full w-full flex-col justify-center gap-8 p-6 md:p-8">
      <div className="grid grid-cols-5 gap-x-4 gap-y-0">
        {Array.from({ length: v.screens }, (_, s) => (
          <div key={s} className="flex flex-col gap-2">
            <p className="mono-label mb-1 opacity-70">0{s + 1}</p>
            {Array.from({ length: v.fieldCount / v.screens }, (_, f) => (
              <div
                key={f}
                className="pv-field field-cell h-5 w-full"
                data-drift={drift[s * (v.fieldCount / v.screens) + f]}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="pv-input hairline-t relative pt-4" style={{ opacity: 0 }}>
        <p className="mono-label !normal-case flex items-baseline !text-[0.8rem]">
          <span className="mr-2 text-acid">&gt;</span>
          <span
            className="pv-sentence inline-block whitespace-nowrap"
            style={{ clipPath: 'inset(0 100% 0 0)' }}
          >
            {v.sentence}
          </span>
          <span className="caret ml-0.5 text-acid">▌</span>
        </p>
      </div>
    </div>
  )
}

// ─── Beat 3 · Arrivio: a demand field blooming ───────────────────────────────
// Generated, deterministic, no real data and no client positions.
const HEX_COLS = 13
const HEX_ROWS = 8
const FOCUS = { x: 0.62, y: 0.42 }

function buildHexes() {
  const r = mulberry32(7)
  const cells = []
  for (let row = 0; row < HEX_ROWS; row++) {
    for (let col = 0; col < HEX_COLS; col++) {
      const x = (col + (row % 2 ? 0.5 : 0)) / HEX_COLS
      const y = row / HEX_ROWS
      const dist = Math.hypot(x - FOCUS.x, y - FOCUS.y)
      const weight = Math.max(0.06, Math.min(0.92, 1.15 - dist * 2.1 - r() * 0.35))
      cells.push({ x, y, dist, weight })
    }
  }
  return cells
}

const hexPoints = (cx, cy, r) =>
  Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i + Math.PI / 6
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`
  }).join(' ')

function VisualArrivio() {
  const cells = useMemo(buildHexes, [])
  const dots = useMemo(() => {
    const r = mulberry32(19)
    return Array.from({ length: 56 }, () => ({ x: r(), y: r() }))
  }, [])
  const W = 640
  const H = 420
  return (
    <div className="relative h-full w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" aria-hidden="true">
        {dots.map((d, i) => (
          <circle
            key={i}
            className="pv-dot"
            cx={40 + d.x * (W - 80)}
            cy={30 + d.y * (H - 60)}
            r="1.6"
            fill="#EDEAE3"
            opacity="0.5"
          />
        ))}
        <circle
          className="pv-radius"
          cx={40 + FOCUS.x * (W - 80)}
          cy={30 + FOCUS.y * (H - 60)}
          r="10"
          fill="none"
          stroke="#C8F04B"
          strokeOpacity="0.35"
          opacity="0"
        />
        {cells.map((c, i) => (
          <polygon
            key={i}
            className="pv-hex"
            data-weight={c.weight.toFixed(2)}
            data-dist={c.dist.toFixed(3)}
            points={hexPoints(40 + c.x * (W - 80), 30 + c.y * (H - 60), 16)}
            fill="#C8F04B"
            stroke="#C8F04B"
            strokeOpacity="0.25"
            opacity="0"
          />
        ))}
      </svg>
      <p className="mono-label absolute bottom-4 right-4 opacity-70">
        {patternVisuals.arrivio.label}
      </p>
    </div>
  )
}

const VISUALS = [VisualHansi, VisualGlobalLogic, VisualArrivio]

// Scrubbed visual choreography, shared by the pinned desktop split and the
// stacked mobile blocks so the two layouts cannot drift apart.
function addBeatVisual(tl, root, beat, at, len) {
  const q = gsap.utils.selector(root)
  if (beat === 0) {
    tl.to(q('.pv-wipe'), { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', duration: len }, at)
    tl.fromTo(q('.pv-divider'), { left: '0%' }, { left: '100%', ease: 'none', duration: len }, at)
  }
  if (beat === 1) {
    tl.to(
      q('.pv-field'),
      {
        y: (i, el) => 260 + Number(el.dataset.drift),
        opacity: 0,
        scale: 0.5,
        ease: EASE,
        duration: len * 0.55,
        stagger: { each: (len * 0.4) / 40, from: 'random' },
      },
      at,
    )
    tl.to(q('.pv-input'), { opacity: 1, duration: len * 0.1 }, at + len * 0.45)
    tl.to(
      q('.pv-sentence'),
      { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', duration: len * 0.4 },
      at + len * 0.55,
    )
  }
  if (beat === 2) {
    tl.to(q('.pv-dot'), { opacity: 0, duration: len * 0.3, stagger: (len * 0.2) / 56 }, at)
    q('.pv-hex').forEach((hex) => {
      tl.to(
        hex,
        { opacity: Number(hex.dataset.weight), duration: len * 0.25, ease: EASE },
        at + len * 0.15 + Number(hex.dataset.dist) * len * 0.62,
      )
    })
    tl.fromTo(
      q('.pv-radius'),
      { opacity: 1, attr: { r: 10 } },
      { attr: { r: 190 }, opacity: 0, ease: 'none', duration: len * 0.7 },
      at + len * 0.25,
    )
  }
}

// ─── 01 / HOW I WORK ─────────────────────────────────────────────────────────
// The heading NEVER MOVES. It is frozen in the left column for the whole
// section, so the reader always knows which argument they are inside, and the
// counter and dots say how much of it is left. Only the right column advances:
// company, badge, the sentence pair and the visual swap together as one unit.
// State 4 resolves the right column to the payoff, so the conclusion lands in
// the same place the evidence did instead of on a screen of its own.
export default function Pattern() {
  const rootRef = useRef(null)
  const deskRef = useRef(null)
  const pinRef = useRef(null)
  const dotsRef = useRef(null)
  const counterRef = useRef(null)
  const payoffMobRef = useRef(null)

  const STATES = pattern.pairs.length + 1 // three beats plus the payoff

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(MM.desk, () => {
        if (!deskRef.current || !pinRef.current) return
        const q = gsap.utils.selector(deskRef.current)
        const panels = q('.pt-panel') // 3 beats + payoff
        const visuals = q('.pt-visual')
        const dots = dotsRef.current ? [...dotsRef.current.children] : []
        const counter = counterRef.current

        gsap.set(panels, { autoAlpha: 0, y: 24 })
        gsap.set(visuals, { autoAlpha: 0 })
        gsap.set([panels[0], visuals[0]], { autoAlpha: 1, y: 0 })

        let current = 0
        const show = (idx) => {
          if (idx === current) return
          panels.forEach((el, i) =>
            gsap.to(el, {
              autoAlpha: i === idx ? 1 : 0,
              y: i === idx ? 0 : i < idx ? -24 : 24,
              duration: 0.4,
              ease: EASE,
              overwrite: 'auto',
            }),
          )
          // The payoff state keeps the last visual on screen behind it
          const vIdx = Math.min(idx, visuals.length - 1)
          visuals.forEach((el, i) =>
            gsap.to(el, {
              autoAlpha: i === vIdx ? 1 : 0,
              duration: 0.4,
              ease: EASE,
              overwrite: 'auto',
            }),
          )
          dots.forEach((d, i) => {
            d.textContent = i <= idx ? '●' : '○'
            d.classList.toggle('text-acid', i <= idx)
          })
          if (counter) {
            const isPayoff = idx >= pattern.pairs.length
            counter.textContent = isPayoff
              ? ''
              : `0${idx + 1} / 0${pattern.pairs.length}`
          }
          current = idx
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pinRef.current,
            start: 'top top',
            end: `+=${STATES * 90}%`,
            scrub: 1,
            pin: pinRef.current,
            pinSpacing: true,
            invalidateOnRefresh: true,
            onUpdate: (self) =>
              show(gsap.utils.clamp(0, STATES - 1, Math.floor(self.progress * STATES))),
          },
        })
        tl.set({}, {}, STATES)
        for (let i = 0; i < pattern.pairs.length; i++) {
          addBeatVisual(tl, visuals[i], i, i + 0.08, 0.84)
        }
      })

      mm.add(MM.mob, () => {
        gsap.utils.toArray(rootRef.current.querySelectorAll('.pt-beat')).forEach((block, i) => {
          const tl = gsap.timeline({
            scrollTrigger: { trigger: block, start: 'top 75%', end: 'bottom 45%', scrub: 1 },
          })
          addBeatVisual(tl, block.querySelector('.pt-visual'), i, 0, 1)
        })
        if (payoffMobRef.current) {
          gsap.from(payoffMobRef.current, {
            autoAlpha: 0,
            y: 20,
            duration: DUR,
            ease: EASE,
            scrollTrigger: { trigger: payoffMobRef.current, start: 'top 85%', once: true },
          })
        }
      })

      mm.add(MM.reduce, () => {
        if (!rootRef.current) return
        const q = gsap.utils.selector(rootRef.current)
        gsap.set(q('.pt-panel, .pt-visual, .pv-input'), { autoAlpha: 1, y: 0 })
        gsap.set(q('.pv-wipe, .pv-sentence'), { clipPath: 'inset(0% 0% 0% 0%)' })
        gsap.set(q('.pv-divider'), { left: '50%' })
        q('.pv-hex').forEach((h) => gsap.set(h, { opacity: Number(h.dataset.weight) }))
        gsap.set(q('.pv-dot'), { opacity: 0 })
      })

      return () => mm.revert()
    },
    { scope: rootRef },
  )

  // The frozen column. Rendered once for desktop, once for the mobile header.
  const Frozen = ({ withDots }) => (
    <>
      <p className="mono-label text-[var(--accent-ui)]">
        {pattern.index} / {pattern.category}
      </p>
      <h2 className="display-m mt-6 max-w-[22ch]">{pattern.heading[0]}</h2>
      <p className="deck mt-6 text-bone-dim">{pattern.deck}</p>
      {withDots ? (
        <p ref={dotsRef} aria-hidden="true" className="mono-label mt-12 flex gap-3">
          {pattern.pairs.map((p, i) => (
            <span key={p.company} className={i === 0 ? 'text-acid' : ''}>
              {i === 0 ? '●' : '○'}
            </span>
          ))}
        </p>
      ) : null}
    </>
  )

  const BeatText = ({ pair }) => (
    <>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <p className="mono-label opacity-70">{pair.company}</p>
        <span className="mono-label !text-[0.7rem] border border-[var(--accent-ui)] px-2 py-1 font-medium text-[var(--accent-ui)]">
          {pair.badge}
        </span>
      </div>
      <p className="display-s mt-6 max-w-[30ch]">{pair.problem}</p>
      <p className="display-s mt-4 max-w-[30ch]">
        {pair.solution.map((seg, s) => (
          <span key={s} className={seg.accent ? 'text-acid' : undefined}>
            {seg.text}
          </span>
        ))}
      </p>
    </>
  )

  const Payoff = () => (
    <>
      <p className="display-m max-w-[22ch] text-acid">{pattern.payoff.lead}</p>
      <p className="deck mt-6 text-bone-dim">{pattern.payoff.line}</p>
    </>
  )

  return (
    <section id="pattern" ref={rootRef} className="relative z-[5] bg-ink">
      {/* Desktop: the whole section pins. Nothing scrolls away. */}
      <div ref={pinRef} className="hidden h-dvh md:block">
        <div
          ref={deskRef}
          className="grid h-full grid-cols-[38%_62%] gap-12 px-8 pb-12 pt-[7.5rem]"
        >
          {/* Frozen for the entire section */}
          <div className="flex flex-col justify-center">
            <Frozen withDots />
          </div>

          {/* Advances: one unit of company, badge, sentences and visual */}
          <div className="flex min-h-0 flex-col">
            <p
              ref={counterRef}
              aria-hidden="true"
              className="mono-label shrink-0 self-end text-[var(--accent-ui)]"
            >
              01 / 0{pattern.pairs.length}
            </p>

            {/* Text is capped and scrolls internally; the visual never compresses */}
            <div className="relative mt-4 min-h-0 flex-1 overflow-y-auto">
              {pattern.pairs.map((pair) => (
                <div key={pair.company} className="pt-panel absolute inset-x-0 top-0">
                  <BeatText pair={pair} />
                </div>
              ))}
              <div className="pt-panel absolute inset-x-0 top-0">
                <Payoff />
              </div>
            </div>

            <div className="relative mt-8 min-h-[480px] shrink-0 overflow-hidden border border-[var(--hair)]">
              {VISUALS.map((V, i) => (
                <div key={i} className="pt-visual absolute inset-0">
                  <V />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: no pin, the frozen column becomes a static header */}
      <div className="px-5 pb-16 pt-16 md:hidden">
        <Frozen />
        {pattern.pairs.map((pair, i) => {
          const V = VISUALS[i]
          return (
            <div key={pair.company} className="pt-beat py-12">
              <div className="pt-panel">
                <BeatText pair={pair} />
              </div>
              <div className="pt-visual relative mt-8 h-[46vh] overflow-hidden border border-[var(--hair)]">
                <V />
              </div>
            </div>
          )
        })}
        <div ref={payoffMobRef} className="pt-panel pt-4">
          <Payoff />
        </div>
      </div>
    </section>
  )
}
