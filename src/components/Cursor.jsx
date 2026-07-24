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

    const tick = () => {
      pos.x += (target.x - pos.x) * 0.18
      pos.y += (target.y - pos.y) * 0.18
      gsap.set(dot, { x: pos.x, y: pos.y })
      gsap.set(tag, { x: pos.x + 20, y: pos.y + 20 })

      const el = target.x >= 0 ? document.elementFromPoint(target.x, target.y) : null
      const hit = el ? el.closest('[data-cursor]') : null
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
    gsap.ticker.add(tick)
    return () => {
      window.removeEventListener('mousemove', onMove)
      gsap.ticker.remove(tick)
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
