import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// ─── INVISIBILITY AUDIT (dev only) ───────────────────────────────────────────
//
// Three separate bugs this project hit belonged to one class: text left
// invisible with nothing scheduled to bring it back. A row stuck at opacity 0
// from a `gsap.from()` whose trigger never fired; beats hidden by a tween that
// was invalidated; a whole component crashed out of the tree. None were caught
// by a test. Every one was caught by a human noticing a blank area.
//
// This walks the DOM after load and after every ScrollTrigger refresh, and
// reports any element that HOLDS TEXT but is effectively invisible while no
// pending animation would restore it. Stripped from production builds.

const INVISIBLE_OPACITY = 0.05

// Elements that are legitimately invisible at rest and must not be reported.
// Keep this list SPECIFIC. An early version listed `.group`, which is a Tailwind
// hover utility sitting on work rows, stack rows and dossier cards, so the audit
// silently ignored most of the page and reported a clean bill on a planted bug.
// Anything hover-revealed gets an explicit `data-audit-ignore` instead.
const IGNORE_SELECTOR = [
  '[aria-hidden="true"]',
  '[data-audit-ignore]',
  '.roll',      // second copy of a roll-hover link, clipped by its container
  '.disclose',  // collapsed disclosure, revealed by its own button
].join(',')

// `display: none` is a responsive/design decision (a breakpoint hiding a mobile
// control), not an animation that failed to restore. Report it separately as
// "not rendered" and exclude it: otherwise every `lg:hidden` control is noise.
const visibility = (el) => {
  // Walk the WHOLE chain before concluding anything: an early return on low
  // opacity can fire before a display:none ancestor is discovered, which made
  // the audit report elements inside the hidden mobile subtree.
  let o = 1
  let e = el
  while (e && e !== document.documentElement) {
    const cs = getComputedStyle(e)
    if (cs.display === 'none') return { skip: true }
    if (cs.visibility === 'hidden') o = 0
    else o *= parseFloat(cs.opacity)
    e = e.parentElement
  }
  return { opacity: o }
}

// Every element any incomplete ScrollTrigger-bound tween will still touch.
// If an element (or an ancestor) is in here, something is scheduled to run and
// its current invisibility is expected.
const pendingTargets = () => {
  const set = new Set()
  const walk = (a) => {
    if (a.targets) a.targets().forEach((t) => t?.nodeType && set.add(t))
    a.getChildren?.(true, true, true).forEach(walk)
  }
  // Anything a ScrollTrigger will still touch. ONLY animation targets count:
  // a trigger element is a measuring reference, not something that gets
  // restored, and adding it exempts its whole subtree. Since every section is
  // a trigger, doing that blinds the audit to the entire page.
  //
  // ONE narrow exception: a PINNED, SCRUBBED trigger with an onUpdate handler
  // manages its subtree imperatively (the Pattern frame and the dossier stages
  // paint their states from progress). Those hidden states are restored by the
  // handler, not by registered tweens, so the pin element counts as a restorer.
  ScrollTrigger.getAll().forEach((st) => {
    if (st.progress >= 1 && !st.vars.scrub) return
    if (st.animation) walk(st.animation)
    if (st.vars.pin && st.vars.scrub && st.vars.onUpdate) {
      const pinEl = st.vars.pin === true ? st.trigger : st.vars.pin
      if (pinEl?.nodeType) set.add(pinEl)
    }
  })
  // ...and anything any live tween will still touch, ScrollTrigger or not.
  // Without this, a plain timeline mid-flight (the preloader) reads as a bug.
  gsap.globalTimeline.getChildren(true, true, true).forEach((t) => {
    if (t.progress() < 1 || t.isActive()) walk(t)
  })
  return set
}

const coveredBy = (el, set) => {
  let e = el
  while (e) {
    if (set.has(e)) return true
    e = e.parentElement
  }
  return false
}

const describe = (el) => {
  const id = el.id ? `#${el.id}` : ''
  const cls = (el.className || '')
    .toString()
    .split(' ')
    .filter((c) => c && !c.includes('[') && !c.includes(':'))
    .slice(0, 3)
    .map((c) => `.${c}`)
    .join('')
  const section = el.closest('section')?.id
  return `${el.tagName.toLowerCase()}${id}${cls}${section ? ` (in #${section})` : ''}`
}

function run() {
  const pending = pendingTargets()
  const findings = []

  document.querySelectorAll('body *').forEach((el) => {
    // Only elements that hold their own text: containers are not the problem
    const ownText = [...el.childNodes]
      .filter((n) => n.nodeType === Node.TEXT_NODE)
      .map((n) => n.textContent.trim())
      .join('')
    if (!ownText) return
    if (el.closest(IGNORE_SELECTOR)) return

    const vis = visibility(el)
    if (vis.skip) return // not rendered at this breakpoint, by design

    const rect = el.getBoundingClientRect()
    const zeroSize = rect.width < 1 || rect.height < 1
    const invisible = vis.opacity < INVISIBLE_OPACITY || zeroSize
    if (!invisible) return
    if (coveredBy(el, pending)) return

    findings.push({
      element: describe(el),
      reason: zeroSize ? 'zero computed size' : `effective opacity ${vis.opacity.toFixed(3)}`,
      text: ownText.slice(0, 60),
      node: el,
    })
  })

  if (!findings.length) return
  console.warn(
    `[INVISIBILITY AUDIT] ${findings.length} element(s) hold text but are invisible with nothing scheduled to restore them`,
  )
  findings.forEach((f) => console.warn(`[INVISIBILITY AUDIT] ${f.element} · ${f.reason} · "${f.text}"`, f.node))
}

// ─── PIN ASSERTION (dev only) ────────────────────────────────────────────────
//
// A requested pin that never engages fails SILENTLY: ScrollTrigger accepts a
// null pin target without complaint, and a start/end that compute to the same
// value produce a pin with zero runway. Either way the section quietly becomes
// an ordinary column, which is exactly how a broken pin shipped once already.
// Every pin must therefore prove it has a live target and real runway.
const MIN_RUNWAY = 10

function assertPins() {
  const failures = []
  ScrollTrigger.getAll()
    .filter((st) => st.vars.pin)
    .forEach((st) => {
      const p = st.vars.pin
      const el = p === true ? st.trigger : p?.nodeType ? p : document.querySelector(p)
      const name =
        (st.trigger?.id && `#${st.trigger.id}`) ||
        (st.trigger?.className || '').toString().split(' ').slice(0, 2).join('.') ||
        'unnamed trigger'
      if (!el) failures.push(`${name}: pin target does not resolve to an element`)
      else if (!document.contains(el))
        failures.push(`${name}: pin target is detached from the document`)
      const runway = st.end - st.start
      if (runway <= MIN_RUNWAY)
        failures.push(`${name}: pin runway is ${Math.round(runway)}px (needs > ${MIN_RUNWAY}px)`)
    })

  if (!failures.length) return
  console.error(`[PIN ASSERTION] ${failures.length} pin(s) requested but not viable:`)
  failures.forEach((f) => console.error(`[PIN ASSERTION] ${f}`))
}

export function startInvisibilityAudit() {
  if (!import.meta.env.DEV) return
  let queued = null
  const schedule = () => {
    clearTimeout(queued)
    queued = setTimeout(() => {
      run()
      assertPins()
    }, 400)
  }
  gsap.delayedCall(1.5, schedule)
  ScrollTrigger.addEventListener('refresh', schedule)
  document.fonts?.ready.then(schedule)
}
