import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { reduced } from '../lib/motion'

// Infinite marquee. Two identical halves animate -50% for a seamless loop.
export default function Marquee({ text, speed = 24, reverse = false, className = '' }) {
  const innerRef = useRef(null)

  useGSAP(() => {
    if (reduced()) return
    const from = reverse ? -50 : 0
    const to = reverse ? 0 : -50
    gsap.fromTo(
      innerRef.current,
      { xPercent: from },
      { xPercent: to, duration: speed, ease: 'none', repeat: -1 },
    )
  })

  const half = (
    <div className="flex shrink-0">
      {Array.from({ length: 4 }, (_, i) => (
        <span key={i} className="whitespace-pre">
          {text}
        </span>
      ))}
    </div>
  )

  return (
    <div aria-hidden="true" className={`overflow-hidden ${className}`}>
      <div ref={innerRef} className="flex w-max will-change-transform">
        {half}
        {half}
      </div>
    </div>
  )
}
