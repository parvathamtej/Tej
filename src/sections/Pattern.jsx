import { useMemo, useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'
import { pattern, patternVisuals } from '../data/content'
import { EASE, MM, SCRAMBLE_CHARS, mulberry32 } from '../lib/motion'

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrambleTextPlugin)

// ─── Beat 1 · Hansi: before/after wipe ───────────────────────────────────────
// The software he built at Hansi shows a client the finished room before it is
// built, so this interaction performs the sentence it accompanies. The divider
// tracks scroll progress; GSAP drives .pv-wipe (clip) and .pv-divider (x).
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
      <p className="mono-label absolute bottom-4 left-4 opacity-60">{v.beforeLabel}</p>
      <p className="mono-label absolute bottom-4 right-4 text-acid">{v.afterLabel}</p>
    </div>
  )
}

// ─── Beat 2 · GlobalLogic: forty fields collapsing into one line ─────────────
// Schematic only: outlined rectangles arranged as the five wizard screens.
// GSAP staggers .pv-field down into the input row, then reveals the sentence.
function VisualGlobalLogic() {
  const v = patternVisuals.globallogic
  const rand = useMemo(() => {
    const r = mulberry32(41)
    return Array.from({ length: v.fieldCount }, () => r())
  }, [v.fieldCount])
  return (
    <div className="relative flex h-full w-full flex-col justify-center gap-8 p-6 md:p-10">
      <div className="grid grid-cols-5 gap-x-5 gap-y-0">
        {Array.from({ length: v.screens }, (_, s) => (
          <div key={s} className="flex flex-col gap-2">
            <p className="mono-label mb-1 opacity-60">0{s + 1}</p>
            {Array.from({ length: v.fieldCount / v.screens }, (_, f) => {
              const i = s * (v.fieldCount / v.screens) + f
              return (
                <div
                  key={f}
                  className="pv-field field-cell h-5 w-full"
                  data-drift={Math.round(rand[i] * 40 - 20)}
                />
              )
            })}
          </div>
        ))}
      </div>
      <div className="pv-input hairline-t relative pt-4" style={{ opacity: 0 }}>
        <p className="mono-label !normal-case flex items-baseline text-[0.85rem]">
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
// Generated hexagonal density grid, deterministic weights, no real data and no
// client positions. Labelled ILLUSTRATIVE because the real system is internal.
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

function hexPoints(cx, cy, r) {
  return Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i + Math.PI / 6
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`
  }).join(' ')
}

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
        <g>
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
        </g>
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
        <g>
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
        </g>
      </svg>
      <p className="mono-label absolute bottom-4 right-4 opacity-60">
        {patternVisuals.arrivio.label}
      </p>
    </div>
  )
}

// ─── Shared beat choreography ────────────────────────────────────────────────
// One timeline builder used by both the pinned desktop split and the stacked
// mobile blocks, so the two layouts cannot drift apart.
function addBeatVisual(tl, root, beat, at, len) {
  const q = gsap.utils.selector(root)
  if (beat === 0) {
    tl.to(q('.pv-wipe'), { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', duration: len }, at)
    tl.fromTo(q('.pv-divider'), { left: '0%' }, { left: '100%', ease: 'none', duration: len }, at)
  }
  if (beat === 1) {
    const fields = q('.pv-field')
    tl.to(
      fields,
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
    const hexes = q('.pv-hex')
    tl.to(q('.pv-dot'), { opacity: 0, duration: len * 0.3, stagger: (len * 0.2) / 56 }, at)
    hexes.forEach((hex) => {
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

const VISUALS = [VisualHansi, VisualGlobalLogic, VisualArrivio]

// ─── 01 / THE PATTERN ────────────────────────────────────────────────────────
// Pinned split screen: left 42% advances the sentence pairs one beat at a
// time, right 58% carries a visual that proves each sentence. Scroll drives
// both. No blank viewports anywhere.
export default function Pattern() {
  const rootRef = useRef(null)
  const pinRef = useRef(null)
  const payoffRef = useRef(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(rootRef.current)

      const buildBeats = (tl) => {
        const SEG = 1 // one unit of timeline time per beat
        pattern.pairs.forEach((_, i) => {
          const at = i * SEG
          const pairEl = q('.pt-pair')[i]
          const visEl = q('.pt-visual')[i]
          if (i > 0) {
            // previous beat out, this beat in
            tl.to(q('.pt-pair')[i - 1], { autoAlpha: 0, y: -36, duration: 0.16, ease: EASE }, at - 0.08)
            tl.to(q('.pt-visual')[i - 1], { autoAlpha: 0, duration: 0.16 }, at - 0.08)
            tl.fromTo(pairEl, { autoAlpha: 0, y: 36 }, { autoAlpha: 1, y: 0, duration: 0.16, ease: EASE }, at)
            tl.fromTo(visEl, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.16 }, at)
          }
          addBeatVisual(tl, visEl, i, at + 0.1, SEG - 0.24)
        })
      }

      const mm = gsap.matchMedia()

      mm.add(MM.desk, () => {
        gsap.set(q('.pt-pair'), { autoAlpha: (i) => (i === 0 ? 1 : 0) })
        gsap.set(q('.pt-visual'), { autoAlpha: (i) => (i === 0 ? 1 : 0) })
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top top',
            end: '+=300%',
            scrub: 1,
            pin: pinRef.current,
            pinSpacing: true,
            invalidateOnRefresh: true,
          },
        })
        buildBeats(tl)
      })

      mm.add(MM.mob, () => {
        // Stacked blocks, each visual scrubbed through its own passage
        q('.pt-beat').forEach((block, i) => {
          const tl = gsap.timeline({
            scrollTrigger: { trigger: block, start: 'top 75%', end: 'bottom 45%', scrub: 1 },
          })
          addBeatVisual(tl, block.querySelector('.pt-visual'), i, 0, 1)
        })
      })

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Payoff: the machine finishing its thought. Slow, once.
        gsap
          .timeline({ scrollTrigger: { trigger: payoffRef.current, start: 'top 60%', once: true } })
          .to(payoffRef.current.querySelector('.pt-lead'), {
            duration: 2.4,
            ease: 'none',
            scrambleText: { text: pattern.payoff.lead, chars: SCRAMBLE_CHARS, speed: 0.35 },
          })
          .from(
            payoffRef.current.querySelector('.pt-payoff-line span'),
            { yPercent: 110, duration: 0.9, ease: EASE },
            '-=0.3',
          )
      })

      mm.add(MM.reduce, () => {
        // Plain vertical document: every pair and visual visible at end state
        gsap.set(q('.pt-pair, .pt-visual, .pv-input'), { autoAlpha: 1, y: 0 })
        gsap.set(q('.pv-wipe, .pv-sentence'), { clipPath: 'inset(0% 0% 0% 0%)' })
        gsap.set(q('.pv-divider'), { left: '50%' })
        q('.pv-hex').forEach((h) => gsap.set(h, { opacity: Number(h.dataset.weight) }))
        gsap.set(q('.pv-dot'), { opacity: 0 })
      })

      return () => mm.revert()
    },
    { scope: rootRef },
  )

  const Pair = ({ pair, className = '' }) => (
    <div className={className}>
      <p className="display-type text-[clamp(1.5rem,2.4vw,2.5rem)]" style={{ textWrap: 'pretty' }}>
        {pair.problem}
      </p>
      <p className="display-type mt-4 text-[clamp(1.5rem,2.4vw,2.5rem)]" style={{ textWrap: 'pretty' }}>
        {pair.solution.map((seg, s) => (
          <span key={s} className={seg.accent ? 'serif-accent text-acid' : undefined}>
            {seg.text}
          </span>
        ))}
      </p>
    </div>
  )

  return (
    <section id="pattern" ref={rootRef} className="relative z-[5] bg-ink">
      {/* Desktop: pinned split screen */}
      <div ref={pinRef} className="hidden h-dvh md:block">
        <div className="flex items-baseline justify-between px-8 pt-24">
          <p className="mono-label">
            <span className="text-acid">[{pattern.index}]</span>
            <span className="ml-3 opacity-60">{pattern.label}</span>
          </p>
          <p className="mono-label opacity-60">KEEP SCROLLING</p>
        </div>
        <div className="grid h-[calc(100dvh-8.5rem)] grid-cols-[42%_58%] gap-8 px-8 pb-8 pt-6">
          <div className="relative">
            {pattern.pairs.map((pair, i) => (
              <Pair key={i} pair={pair} className="pt-pair absolute inset-x-0 top-1/2 -translate-y-1/2" />
            ))}
          </div>
          <div className="relative">
            {VISUALS.map((V, i) => (
              <div key={i} className="pt-visual absolute inset-0">
                <V />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile: stacked beats, no pin */}
      <div className="px-5 pt-24 md:hidden">
        <p className="mono-label">
          <span className="text-acid">[{pattern.index}]</span>
          <span className="ml-3 opacity-60">{pattern.label}</span>
        </p>
        {pattern.pairs.map((pair, i) => {
          const V = VISUALS[i]
          return (
            <div key={i} className="pt-beat py-14">
              <Pair pair={pair} className="pt-pair" />
              <div className="pt-visual relative mt-8 h-[46vh] overflow-hidden border border-[var(--hair)]">
                <V />
              </div>
            </div>
          )
        })}
      </div>

      {/* Payoff: own screen, centred */}
      <div ref={payoffRef} className="flex min-h-dvh flex-col items-center justify-center px-5 text-center md:px-8">
        <p className="pt-lead display-type text-[clamp(2.4rem,6vw,5.4rem)] text-acid">
          {pattern.payoff.lead}
        </p>
        <p className="pt-payoff-line display-type mt-6 block max-w-[30ch] overflow-hidden pb-[0.12em] -mb-[0.12em] text-[clamp(1.4rem,2.6vw,2.4rem)]">
          <span className="inline-block will-change-transform">{pattern.payoff.line}</span>
        </p>
      </div>
    </section>
  )
}
