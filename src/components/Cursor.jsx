import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { finePointer } from '../lib/motion'

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

    const onMove = (e) => {
      target.x = e.clientX
      target.y = e.clientY
    }

    const tick = () => {
      pos.x += (target.x - pos.x) * 0.18
      pos.y += (target.y - pos.y) * 0.18
      gsap.set(dot, { x: pos.x, y: pos.y })
      gsap.set(tag, { x: pos.x + 20, y: pos.y + 20 })
    }

    const onOver = (e) => {
      const hit = e.target.closest('[data-cursor]')
      if (!hit) return
      gsap.to(dot, { scale: 4, duration: 0.35, ease: 'power4.out' })
      const text = hit.getAttribute('data-cursor')
      if (text) {
        tag.textContent = text
        gsap.to(tag, { autoAlpha: 1, duration: 0.25, ease: 'power4.out' })
      }
    }

    const onOut = (e) => {
      const hit = e.target.closest('[data-cursor]')
      if (!hit) return
      gsap.to(dot, { scale: 1, duration: 0.35, ease: 'power4.out' })
      gsap.to(tag, { autoAlpha: 0, duration: 0.2, ease: 'power2.out' })
    }

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)
    gsap.ticker.add(tick)
    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
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
