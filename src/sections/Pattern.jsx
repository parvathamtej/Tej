import { useMemo, useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'
import SectionHeading from '../components/SectionHeading'
import { pattern, patternVisuals } from '../data/content'
import { EASE, MM, SCRAMBLE_CHARS, mulberry32 } from '../lib/motion'

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrambleTextPlugin)

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
export default function Pattern() {
  const rootRef = useRef(null)
  const deskRef = useRef(null)
  const pinRef = useRef(null)
  const payoffRef = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(MM.desk, () => {
        // Scope to the desktop grid: the mobile layout renders its own copies
        // of these classes, and a document-wide selector would mix them.
        if (!deskRef.current || !pinRef.current) return
        const q = gsap.utils.selector(deskRef.current)
        const pairs = q('.pt-pair')
        const visuals = q('.pt-visual')
        const n = pairs.length

        // Visibility is discrete and derived from progress every frame, never
        // from tweens inside the scrubbed timeline. Exactly one beat can be
        // visible, at any scroll position, in either direction.
        gsap.set(pairs, { autoAlpha: 0, y: 28 })
        gsap.set(visuals, { autoAlpha: 0 })
        gsap.set([pairs[0], visuals[0]], { autoAlpha: 1, y: 0 })

        let current = 0
        const show = (idx) => {
          if (idx === current) return
          pairs.forEach((el, i) => {
            gsap.to(el, {
              autoAlpha: i === idx ? 1 : 0,
              y: i === idx ? 0 : i < idx ? -28 : 28,
              duration: 0.4,
              ease: EASE,
              overwrite: 'auto',
            })
          })
          visuals.forEach((el, i) => {
            gsap.to(el, {
              autoAlpha: i === idx ? 1 : 0,
              duration: 0.4,
              ease: EASE,
              overwrite: 'auto',
            })
          })
          current = idx
        }

        // The scrubbed timeline carries ONLY the visual animations.
        const tl = gsap.timeline({
          scrollTrigger: {
            // The pinned stage is the trigger, not the section: the heading
            // block above must scroll away before the pin engages.
            trigger: pinRef.current,
            start: 'top top',
            end: '+=300%',
            scrub: 1,
            pin: pinRef.current,
            pinSpacing: true,
            invalidateOnRefresh: true,
            onUpdate: (self) =>
              show(gsap.utils.clamp(0, n - 1, Math.floor(self.progress * n))),
          },
        })
        tl.set({}, {}, n) // hold the full duration
        for (let i = 0; i < n; i++) addBeatVisual(tl, visuals[i], i, i + 0.08, 0.84)
      })

      mm.add(MM.mob, () => {
        gsap.utils.toArray(rootRef.current.querySelectorAll('.pt-beat')).forEach((block, i) => {
          const tl = gsap.timeline({
            scrollTrigger: { trigger: block, start: 'top 75%', end: 'bottom 45%', scrub: 1 },
          })
          addBeatVisual(tl, block.querySelector('.pt-visual'), i, 0, 1)
        })
      })

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        if (!payoffRef.current) return
        gsap
          .timeline({ scrollTrigger: { trigger: payoffRef.current, start: 'top 65%', once: true } })
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
        // A plain vertical document: every beat visible, nothing pinned.
        if (!rootRef.current) return
        const q = gsap.utils.selector(rootRef.current)
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

  const Pair = ({ pair }) => (
    <>
      <p className="display-m">{pair.problem}</p>
      <p className="display-m mt-4">
        {pair.solution.map((seg, s) => (
          <span key={s} className={seg.accent ? 'text-acid' : undefined}>
            {seg.text}
          </span>
        ))}
      </p>
      <p className="mono-label mt-8 opacity-60">{pair.id}</p>
    </>
  )

  return (
    <section id="pattern" ref={rootRef} className="relative z-[5] bg-ink">
      {/* Heading in normal document flow: a reader sees what this section is
          before the beats start. It scrolls away before the pin engages. */}
      <div className="px-5 pb-16 pt-28 md:px-8 md:pb-24 md:pt-32">
        <SectionHeading
          index={pattern.index}
          category={pattern.category}
          heading={pattern.heading}
          deck={pattern.deck}
          size="xl"
        />
      </div>

      {/* Desktop: pinned split screen. Top padding clears the fixed navbar and
          both columns clip, so outgoing lines can never render through it. */}
      <div ref={pinRef} className="hidden h-dvh md:block">
        <div ref={deskRef} className="grid h-full grid-cols-[42%_58%] gap-10 px-8 pb-12 pt-[7.5rem]">
          <div className="relative overflow-hidden">
            {pattern.pairs.map((pair) => (
              <div
                key={pair.id}
                className="pt-pair absolute inset-0 flex flex-col items-start justify-center will-change-transform"
              >
                <Pair pair={pair} />
              </div>
            ))}
          </div>
          <div className="relative overflow-hidden">
            {VISUALS.map((V, i) => (
              <div key={i} className="pt-visual absolute inset-0">
                <V />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile: stacked beats, no pin */}
      <div className="px-5 md:hidden">
        {pattern.pairs.map((pair, i) => {
          const V = VISUALS[i]
          return (
            <div key={pair.id} className="pt-beat py-12">
              <div className="pt-pair">
                <Pair pair={pair} />
              </div>
              <div className="pt-visual relative mt-8 h-[46vh] overflow-hidden border border-[var(--hair)]">
                <V />
              </div>
            </div>
          )
        })}
      </div>

      {/* Payoff: its own screen */}
      <div
        ref={payoffRef}
        className="flex min-h-dvh flex-col items-center justify-center px-5 text-center md:px-8"
      >
        <p className="pt-lead display-l text-acid">{pattern.payoff.lead}</p>
        <p className="pt-payoff-line display-m mt-6 block max-w-[26ch] overflow-hidden pb-[0.1em] -mb-[0.1em]">
          <span className="inline-block will-change-transform">{pattern.payoff.line}</span>
        </p>
      </div>
    </section>
  )
}
