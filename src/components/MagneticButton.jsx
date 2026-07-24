import { useRef } from 'react'
import gsap from 'gsap'
import { finePointer } from '../lib/motion'

// Magnet hover: element leans toward the cursor, releases on leave.
export default function MagneticButton({ children, strength = 0.35, className = '', ...rest }) {
  const ref = useRef(null)

  const onMove = (e) => {
    if (!finePointer()) return
    const el = ref.current
    const r = el.getBoundingClientRect()
    const dx = e.clientX - (r.left + r.width / 2)
    const dy = e.clientY - (r.top + r.height / 2)
    gsap.to(el, { x: dx * strength, y: dy * strength, duration: 0.4, ease: 'power3.out' })
  }

  const onLeave = () => {
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.7, ease: 'power4.out' })
  }

  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} className={`inline-block ${className}`} {...rest}>
      {children}
    </div>
  )
}
