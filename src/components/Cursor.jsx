import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { finePointer } from '../lib/motion'

// Custom cursor dot + label pill. STATELESS: every frame it hit-tests what is
// actually under the pointer, so scale/label can never stick after scrolling
// moves the page beneath a stationary cursor.
export default function Cursor() {
  const [enabled, setEnabled] = useState(false)
  const dotRef = useRef(null)
  const tagRef = useRef(null)

  useEffect(() => {
    setEnabled(finePointer())
  }, [])

  useEffect(() => {
    if (!enabled) return
    const dot = dotRef.current
    const tag = tagRef.current
    const pos = { x: -100, y: -100 }
    const target = { x: -100, y: -100 }
    let scaled = false
    let curLabel = null

    const onMove = (e) => {
      target.x = e.clientX
      target.y = e.clientY
    }

    // elementFromPoint forces a synchronous layout, so this is split in two.
    //
    // READ runs FIRST in the frame (prioritised ticker callback), before Lenis
    // and ScrollTrigger have written anything, so layout is still clean from the
    // last commit and the hit-test costs nothing. Running it after those writes
    // — which is what a single combined tick did — forced a fresh layout on
    // every frame of every scroll, page-wide.
    //
    // It must still run without a mouse event (the page scrolls under a still
    // cursor, so mouseleave never fires: the V4 rule), but only when the answer
    // could have changed: the pointer moved, or the document scrolled beneath
    // it. Lenis's scroll is a plain number, so that test is free, and an idle
    // page does no layout work at all.
    let seenX = -2
    let seenY = -2
    let seenScroll = -2
    let hit = null
    const read = () => {
      const scroll = window.__lenis?.scroll ?? window.scrollY
      if (target.x === seenX && target.y === seenY && scroll === seenScroll) return
      seenX = target.x
      seenY = target.y
      seenScroll = scroll
      const el = target.x >= 0 ? document.elementFromPoint(target.x, target.y) : null
      hit = el ? el.closest('[data-cursor]') : null
    }

    const write = () => {
      const dx = target.x - pos.x
      const dy = target.y - pos.y
      if (Math.abs(dx) > 0.01 || Math.abs(dy) > 0.01) {
        pos.x += dx * 0.18
        pos.y += dy * 0.18
        gsap.set(dot, { x: pos.x, y: pos.y })
        gsap.set(tag, { x: pos.x + 20, y: pos.y + 20 })
      }
      const label = hit ? hit.getAttribute('data-cursor') || null : null
      if (!!hit !== scaled) {
        scaled = !!hit
        gsap.to(dot, { scale: scaled ? 4 : 1, duration: 0.35, ease: 'power4.out', overwrite: 'auto' })
      }
      if (label !== curLabel) {
        curLabel = label
        if (label) {
          tag.textContent = label
          gsap.to(tag, { autoAlpha: 1, duration: 0.25, ease: 'power4.out', overwrite: 'auto' })
        } else {
          gsap.to(tag, { autoAlpha: 0, duration: 0.2, ease: 'power2.out', overwrite: 'auto' })
        }
      }
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    gsap.ticker.add(read, false, true) // true = run before everything else
    gsap.ticker.add(write)
    return () => {
      window.removeEventListener('mousemove', onMove)
      gsap.ticker.remove(read)
      gsap.ticker.remove(write)
    }
  }, [enabled])

  if (!enabled) return null
  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[200] -ml-1.5 -mt-1.5 h-3 w-3 rounded-full bg-acid mix-blend-difference"
      />
      <div
        ref={tagRef}
        aria-hidden="true"
        className="mono-label pointer-events-none fixed left-0 top-0 z-[200] rounded-full bg-acid px-2.5 py-1 text-ink opacity-0"
      />
    </>
  )
}
