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
  const viewRef = useRef(null)
  const lensRef = useRef(null)
  const innerRef = useRef(null)
  const readoutRef = useRef(null)
  const hintRef = useRef(null)

  const layer = (src, cls, extra = '') =>
    src ? (
      <img src={src} alt="" className={`absolute inset-0 h-full w-full object-cover ${extra}`} />
    ) : (
      <div className={`absolute inset-0 ${cls} ${extra}`} />
    )

  // The lens is a window, not an overlay: the AFTER layer inside it is sized to
  // the whole viewport and pushed by the lens's own offset, so what shows
  // through is exactly the part of the finished room that sits under the
  // cursor. That is the interaction the software itself performs, which is why
  // it belongs here rather than a caption claiming it.
  useGSAP(
    () => {
      const view = viewRef.current
      const lens = lensRef.current
      if (!view || !lens) return
      const mm = gsap.matchMedia()

      mm.add(MM.desk, () => {
        if (!window.matchMedia('(pointer: fine)').matches) return
        let rect = view.getBoundingClientRect()
        const remeasure = () => {
          rect = view.getBoundingClientRect()
          // The inner layer must be the size of the WHOLE frame, not the lens,
          // or the window shows a squashed copy instead of a slice.
          const inner = innerRef.current
          if (inner) {
            inner.style.width = `${rect.width}px`
            inner.style.height = `${rect.height}px`
          }
        }
        remeasure()
        // Rect is read on pointer movement and on refresh, never per frame: the
        // pinned frame does not move while the beat is on screen, and a
        // per-frame getBoundingClientRect is a forced layout (V14 rule).
        let hovering = false
        let px = 0
        let py = 0
        const onMove = (e) => {
          rect = view.getBoundingClientRect()
          px = e.clientX - rect.left
          py = e.clientY - rect.top
          hovering = px >= 0 && py >= 0 && px <= rect.width && py <= rect.height
        }
        const onLeave = () => {
          hovering = false
        }

        let shownHint = true
        let lastX = null
        let lastY = null
        const size = lens.offsetWidth || 150
        const place = () => {
          const w = rect.width || 1
          const h = rect.height || 1
          // When the cursor is not in the frame the lens sweeps itself from the
          // beat's own progress, so the visual still performs while scrolling.
          const autoT = view.__lensAuto ?? 0
          const cxp = hovering ? px : (0.12 + autoT * 0.76) * w
          const cyp = hovering ? py : h * 0.52
          const x = Math.max(0, Math.min(w - size, cxp - size / 2))
          const y = Math.max(0, Math.min(h - size, cyp - size / 2))
          // Nothing moved, nothing to write. Without this the lens would keep
          // restyling three elements on every frame of the entire page, which
          // is the cost pattern that made the dossier spotlight expensive.
          if (x === lastX && y === lastY) return
          lastX = x
          lastY = y
          lens.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`
          innerRef.current.style.transform = `translate3d(${(-x).toFixed(1)}px, ${(-y).toFixed(1)}px, 0)`
          const ro = readoutRef.current
          if (ro) ro.textContent = `X: ${Math.round(cxp)}PX · Y: ${Math.round(cyp)}PX`
          if (hovering === shownHint) {
            shownHint = !hovering
            if (hintRef.current) hintRef.current.style.opacity = hovering ? '0' : '1'
          }
        }
        place()

        view.addEventListener('pointermove', onMove, { passive: true })
        view.addEventListener('pointerleave', onLeave)
        ScrollTrigger.addEventListener('refresh', remeasure)
        gsap.ticker.add(place)
        return () => {
          view.removeEventListener('pointermove', onMove)
          view.removeEventListener('pointerleave', onLeave)
          ScrollTrigger.removeEventListener('refresh', remeasure)
          gsap.ticker.remove(place)
        }
      })
      return () => mm.revert()
    },
    { scope: viewRef },
  )

  return (
    <div ref={viewRef} className="pv-view relative h-full w-full overflow-hidden">
      {layer(v.beforeSrc, 'ph-before')}

      {/* Reduced motion and mobile get the plain answer: the finished room, at
          rest, with both states named. No lens, nothing to chase. */}
      <div className="pv-wipe absolute inset-0" style={{ clipPath: 'inset(0 100% 0 0)' }}>
        {layer(v.afterSrc, 'ph-after')}
      </div>
      <div className="pv-divider absolute inset-y-0 left-0 w-px bg-acid" />

      <div ref={lensRef} className="pv-lens" aria-hidden="true">
        <div ref={innerRef} className="pv-lens-inner">
          {layer(v.afterSrc, 'ph-after')}
        </div>
        <span className="pv-lens-line pv-lens-line--v" style={{ left: '33.33%' }} />
        <span className="pv-lens-line pv-lens-line--v" style={{ left: '66.66%' }} />
        <span className="pv-lens-line pv-lens-line--h" style={{ top: '33.33%' }} />
        <span className="pv-lens-line pv-lens-line--h" style={{ top: '66.66%' }} />
        <span className="pv-lens-dot" style={{ top: -3, left: -3 }} />
        <span className="pv-lens-dot" style={{ top: -3, right: -3 }} />
        <span className="pv-lens-dot" style={{ bottom: -3, left: -3 }} />
        <span className="pv-lens-dot" style={{ bottom: -3, right: -3 }} />
        <span className="pv-lens-tag pv-chip mono-label">{v.afterLabel}</span>
      </div>

      <p className="pv-chip mono-label absolute bottom-4 left-4">{v.beforeLabel}</p>
      <p
        ref={hintRef}
        className="pv-hint pv-chip mono-label absolute left-1/2 top-4 -translate-x-1/2 text-acid"
      >
        {v.hint}
      </p>
      <p ref={readoutRef} className="pv-chip mono-label absolute bottom-4 right-4 opacity-80">
        X: 0PX · Y: 0PX
      </p>
    </div>
  )
}

// ─── Beat 2 · GlobalLogic: forty fields collapsing into one line ─────────────
function VisualGlobalLogic() {
  const v = patternVisuals.globallogic
  const total = v.screens.reduce((n, s) => n + s.fields.length, 0)
  const drift = useMemo(() => {
    const r = mulberry32(41)
    return Array.from({ length: total }, () => Math.round(r() * 40 - 20))
  }, [total])
  let i = -1
  return (
    <div className="relative flex h-full w-full flex-col justify-center gap-8 p-6 md:p-8">
      <div className="grid grid-cols-5 gap-x-4 gap-y-0">
        {v.screens.map((screen, s) => (
          <div key={screen.name} className="flex flex-col gap-2">
            <p className="pv-screen-label mono-label mb-1 opacity-70">
              0{s + 1} <span className="opacity-60">{screen.name}</span>
            </p>
            {screen.fields.map((label) => {
              i += 1
              return (
                <div key={label} className="pv-field field-cell h-5 w-full" data-drift={drift[i]}>
                  <span className="field-cell__label">{label}</span>
                </div>
              )
            })}
          </div>
        ))}
      </div>
      {/* ONE field, centred where the forty were. Left in normal flow below the
          grid it sat at the bottom of the frame while the vacated grid area
          stayed empty, so the moment the beat exists to make (forty inputs
          collapse into one sentence) read as a blank screen with a caption
          under it. Absolutely centred, the sentence arrives exactly where the
          fields just left, and the single bordered box makes the argument
          literal rather than described. */}
      <div
        className="pv-input absolute inset-x-6 top-1/2 -translate-y-1/2 md:inset-x-8"
        style={{ opacity: 0 }}
      >
        <p className="mono-label !normal-case flex items-baseline gap-2 overflow-hidden border border-[var(--hair)] bg-[rgba(237,234,227,0.04)] px-3 py-3 !text-[0.8rem] md:!text-[0.95rem]">
          <span className="text-acid">&gt;</span>
          <span
            className="pv-sentence inline-block whitespace-nowrap"
            style={{ clipPath: 'inset(0 100% 0 0)' }}
          >
            {v.sentence}
          </span>
          <span className="caret text-acid">▌</span>
        </p>
      </div>
    </div>
  )
}

// ─── Beat 3 · Arrivio: a demand field blooming ───────────────────────────────
// Generated, deterministic, no real data and no client positions.
// Grid and viewBox are shaped to the frame the card actually gives this visual
// (a wide, short box). A 640x420 viewBox letterboxed inside it, leaving the map
// floating in the middle with a third of the frame empty on either side.
const HEX_COLS = 19
const HEX_ROWS = 6
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
  const W = 1000
  const H = 336
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
            points={hexPoints(40 + c.x * (W - 80), 30 + c.y * (H - 60), 15)}
            fill="#C8F04B"
            stroke="#C8F04B"
            strokeOpacity="0.25"
            opacity="0"
          />
        ))}

        {/* Tags are what make this read as a MAP rather than a bloom: each one
            names the layer under it, anchored to the cell it describes with a
            short leader so the label never sits on top of the data. */}
        {patternVisuals.arrivio.tags.map((t) => {
          const x = 40 + t.at.x * (W - 80)
          const y = 30 + t.at.y * (H - 60)
          const flip = t.at.x > 0.7
          const lx = flip ? x - 26 : x + 26
          const colour = t.tone === 'acid' ? '#C8F04B' : '#EDEAE3'
          return (
            <g key={t.key} className="pv-tag" opacity="0">
              <circle cx={x} cy={y} r="3" fill={colour} />
              <line x1={x} y1={y} x2={lx} y2={y - 16} stroke={colour} strokeOpacity="0.5" strokeWidth="1" />
              <text
                x={lx}
                y={y - 22}
                fill={colour}
                textAnchor={flip ? 'end' : 'start'}
                className="pv-tag-text"
              >
                {t.text}
              </text>
            </g>
          )
        })}
      </svg>

      {/* Legend: three marks, three plain sentences. A hex map that does not say
          what its marks mean is a texture. */}
      <ul
        className="pv-legend mono-label absolute bottom-3 left-3 flex flex-col gap-1.5"
        style={{ opacity: 0 }}
      >
        {patternVisuals.arrivio.legend.map((l) => (
          <li key={l.key} className="flex items-center gap-2 !normal-case opacity-80">
            <span aria-hidden="true" className={`pv-mark pv-mark--${l.mark}`} />
            {l.text}
          </li>
        ))}
      </ul>
      <p className="mono-label absolute bottom-4 right-4 opacity-70">
        {patternVisuals.arrivio.label}
      </p>
    </div>
  )
}

const VISUALS = [VisualHansi, VisualGlobalLogic, VisualArrivio]

// Scrubbed visual choreography, shared by the pinned desktop split and the
// stacked mobile blocks so the two layouts cannot drift apart.
function addBeatVisual(tl, root, beat, at, len, lens = false) {
  const q = gsap.utils.selector(root)
  if (beat === 0) {
    if (lens) {
      // Desktop drives the inspector lens instead of wiping: a full-width wipe
      // would paint the finished room over the entire frame and leave the lens
      // nothing to reveal. The proxy carries the beat's progress to the ticker
      // that positions the lens, so it sweeps while scrolling and hands over to
      // the cursor the moment the reader points at it.
      const view = q('.pv-view')[0]
      if (view) {
        const p = { t: 0 }
        tl.to(
          p,
          {
            t: 1,
            ease: 'none',
            duration: len,
            onUpdate: () => {
              view.__lensAuto = p.t
            },
          },
          at,
        )
      }
    } else {
      tl.to(q('.pv-wipe'), { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', duration: len }, at)
      tl.fromTo(q('.pv-divider'), { left: '0%' }, { left: '100%', ease: 'none', duration: len }, at)
    }
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
    // The screen names leave with their fields. Left behind they read as five
    // orphaned headings over one sentence, when the point is that the whole
    // five-screen form is what the sentence replaces.
    tl.to(
      q('.pv-screen-label'),
      { opacity: 0, y: 40, duration: len * 0.3, ease: EASE, stagger: len * 0.03 },
      at + len * 0.1,
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
    // Tags and legend land after the bloom has taken shape: labelling an empty
    // field would explain nothing, and labelling it mid-bloom competes with it.
    tl.to(q('.pv-tag'), { opacity: 1, duration: len * 0.14, stagger: len * 0.07 }, at + len * 0.5)
    tl.to(q('.pv-legend'), { opacity: 1, duration: len * 0.12 }, at + len * 0.55)
  }
}

// ─── State content (module scope, deliberately) ─────────────────────────────
// These MUST live outside the Pattern component. Defined inline, they get a new
// function identity on every render, so React remounts their subtrees when App
// re-renders (the preloader's `started` flip does exactly that) and every DOM
// node captured by the GSAP setup goes stale. That is how the beat dots froze
// while the counter, a plain host element, kept working.

// The label slot every state shares, so the frame never changes shape
const LabelRow = ({ company, badge }) => (
  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
    <p className="mono-label opacity-70">{company}</p>
    <span className="mono-label !text-[0.7rem] border border-[var(--accent-ui)] px-2 py-1 font-medium text-[var(--accent-ui)]">
      {badge}
    </span>
  </div>
)

const BeatText = ({ pair }) => (
  <>
    <LabelRow company={pair.company} badge={pair.badge} />
    <p className="display-s mt-5 max-w-[30ch]">{pair.problem}</p>
    <p className="display-s mt-3 max-w-[30ch]">
      {pair.solution.map((seg, s) => (
        <span key={s} className={seg.accent ? 'text-acid' : undefined}>
          {seg.text}
        </span>
      ))}
    </p>
  </>
)

const PayoffText = () => (
  <>
    <LabelRow company={pattern.payoff.company} badge={pattern.payoff.badge} />
    <p className="display-m mt-5 max-w-[22ch] text-acid">{pattern.payoff.lead}</p>
    <p className="deck mt-3 text-bone-dim">{pattern.payoff.line}</p>
  </>
)

const FrozenHeading = () => (
  <>
    <p className="mono-label text-[var(--accent-ui)]">
      {pattern.index} / {pattern.category}
    </p>
    <h2 className="display-m mt-6 max-w-[22ch]">{pattern.heading[0]}</h2>
    <p className="deck mt-6 text-bone-dim">{pattern.deck}</p>
  </>
)

// ─── 01 / HOW I WORK ─────────────────────────────────────────────────────────
// The heading NEVER MOVES. It is frozen in the left column for the whole
// section, so the reader always knows which argument they are inside, and the
// counter and dots say how much of it is left. Only the right column advances:
// company, badge, the sentence pair and the visual swap together as one unit,
// inside ONE bordered card so it reads as a single object changing state (the
// QuitCrap perspective-shift frame). State 4 resolves the card to the payoff.
export default function Pattern() {
  const rootRef = useRef(null)
  const deskRef = useRef(null)
  const pinRef = useRef(null)
  const dotsRef = useRef(null)
  const counterRef = useRef(null)
  const stageRef = useRef(null)
  const payoffMobRef = useRef(null)

  const STATES = pattern.pairs.length + 1 // three beats plus the payoff

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(MM.desk, () => {
        if (!deskRef.current || !pinRef.current) return
        const q = gsap.utils.selector(deskRef.current)
        const panels = q('.pt-panel') // 3 beats + payoff. Host elements: stable.
        const visuals = q('.pt-visual')

        // The states are absolutely positioned so they share one origin, which
        // leaves the stage with no natural height. Size it to the TALLEST state
        // (visibility:hidden still lays out, so every panel measures) and never
        // clip: one beat's copy is taller than the others and was being cut.
        const sizeStage = () => {
          const stage = stageRef.current
          if (!stage) return
          stage.style.height = 'auto'
          stage.style.height = `${Math.max(...panels.map((p) => p.offsetHeight))}px`
        }
        sizeStage()
        ScrollTrigger.addEventListener('refreshInit', sizeStage)

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
          // Read dots and counter LIVE at call time, never captured: React can
          // replace these nodes on a re-render, and writes to captured stale
          // nodes vanish silently. That is the bug that froze the dots.
          const dotEls = dotsRef.current?.children ?? []
          for (let i = 0; i < dotEls.length; i++) {
            dotEls[i].textContent = i <= idx ? '●' : '○'
            dotEls[i].classList.toggle('text-acid', i <= idx)
          }
          const counter = counterRef.current
          if (counter) {
            const isPayoff = idx >= pattern.pairs.length
            counter.textContent = isPayoff ? '' : `0${idx + 1} / 0${pattern.pairs.length}`
            counter.style.visibility = isPayoff ? 'hidden' : 'visible'
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
          addBeatVisual(tl, visuals[i], i, i + 0.08, 0.84, true)
        }
        return () => ScrollTrigger.removeEventListener('refreshInit', sizeStage)
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
        gsap.set(q('.pt-panel, .pt-visual, .pv-input, .pv-tag, .pv-legend, .pv-screen-label'), {
          autoAlpha: 1,
          y: 0,
        })
        gsap.set(q('.pv-wipe, .pv-sentence'), { clipPath: 'inset(0% 0% 0% 0%)' })
        gsap.set(q('.pv-divider'), { left: '50%' })
        q('.pv-hex').forEach((h) => gsap.set(h, { opacity: Number(h.dataset.weight) }))
        gsap.set(q('.pv-dot'), { opacity: 0 })
      })

      return () => mm.revert()
    },
    { scope: rootRef },
  )

  return (
    <section id="pattern" ref={rootRef} className="relative z-[5] bg-ink">
      {/* Desktop: the whole section pins. Everything fits ONE viewport frame:
          the card flexes, the visual absorbs the remainder (no hard floor that
          can push the frame past the fold, which is how the forty-field grid
          got cut at laptop heights). */}
      <div ref={pinRef} className="hidden h-dvh md:block">
        <div
          ref={deskRef}
          className="grid h-full grid-cols-[38%_minmax(0,1fr)] gap-10 px-8 pb-8 pt-24"
        >
          {/* Frozen for the entire section */}
          <div className="flex flex-col justify-center">
            <FrozenHeading />
            <p ref={dotsRef} aria-hidden="true" className="mono-label mt-12 flex gap-3">
              {pattern.pairs.map((p, i) => (
                <span key={p.company} className={i === 0 ? 'text-acid' : ''}>
                  {i === 0 ? '●' : '○'}
                </span>
              ))}
            </p>
          </div>

          {/* One bordered card: the changing states read as a single object
              swapping content, with the counter chip inside its frame. */}
          <div className="panel-lumen relative flex min-h-0 flex-col p-6 lg:p-8">
            <p
              ref={counterRef}
              aria-hidden="true"
              className="mono-label absolute right-6 top-6 text-[var(--accent-ui)] lg:right-8 lg:top-8"
            >
              01 / 0{pattern.pairs.length}
            </p>

            {/* Text stage: exactly the height of its tallest state, never clips */}
            <div ref={stageRef} className="relative shrink-0 pr-20">
              {pattern.pairs.map((pair) => (
                <div key={pair.company} className="pt-panel absolute inset-x-0 top-0">
                  <BeatText pair={pair} />
                </div>
              ))}
              <div className="pt-panel absolute inset-x-0 top-0">
                <PayoffText />
              </div>
            </div>

            {/* Visual: takes whatever the viewport leaves, inside the card */}
            <div className="relative mt-6 min-h-[240px] flex-1 overflow-hidden border border-[var(--hair)] bg-ink">
              {VISUALS.map((V, i) => (
                <div key={i} className="pt-visual absolute inset-0">
                  <V />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Breathing room before the next chapter: without it the released frame
          and the arriving dossier share the screen with no separation. */}
      <div aria-hidden="true" className="hidden h-[28vh] md:block" />

      {/* Mobile: no pin, the frozen column becomes a static header */}
      <div className="px-5 pb-16 pt-16 md:hidden">
        <FrozenHeading />
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
          <PayoffText />
        </div>
      </div>
    </section>
  )
}
