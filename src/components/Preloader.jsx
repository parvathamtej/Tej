import { useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { identity, preloader } from '../data/content'
import { DUR, EASE, EASE_INOUT, STAGGER, reduced } from '../lib/motion'

gsap.registerPlugin(useGSAP)

const NAME = `${identity.first} ${identity.last}`

export default function Preloader({ onDone }) {
  const [gone, setGone] = useState(false)
  const rootRef = useRef(null)
  const counterRef = useRef(null)

  useGSAP(
    () => {
      // Lock scroll for the duration (rAF so SmoothScroll's effect has run)
      requestAnimationFrame(() => window.__lenis?.stop())

      const finish = () => {
        window.__lenis?.start()
        onDone()
        setGone(true)
      }

      if (reduced()) {
        gsap.to(rootRef.current, { opacity: 0, duration: 0.4, delay: 0.3, onComplete: finish })
        return
      }

      const counter = { v: 0 }
      const tl = gsap.timeline({ onComplete: finish })
      tl.to(counter, {
        v: 100,
        duration: 2,
        ease: 'power2.inOut',
        onUpdate: () => {
          if (counterRef.current)
            counterRef.current.textContent = String(Math.round(counter.v)).padStart(3, '0')
        },
      })
        .from(
          '.pre-char',
          { yPercent: 110, duration: DUR, ease: EASE, stagger: STAGGER / 1.2 },
          0.1,
        )
        .from('.pre-meta', { opacity: 0, y: 12, duration: 0.6, ease: EASE }, 0.5)
        .to(
          rootRef.current,
          { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.9, ease: EASE_INOUT },
          '+=0.15',
        )
    },
    { scope: rootRef },
  )

  if (gone) return null
  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[300] flex items-center justify-center bg-ink text-bone"
      style={{ clipPath: 'inset(0% 0% 0% 0%)' }}
    >
      <h2 className="display-l flex flex-wrap justify-center gap-x-[0.28em] px-4" aria-label={NAME}>
        {NAME.split(' ').map((word, w) => (
          <span key={w} className="inline-flex overflow-hidden">
            {word.split('').map((c, i) => (
              <span key={i} className="pre-char inline-block will-change-transform" aria-hidden="true">
                {c}
              </span>
            ))}
          </span>
        ))}
      </h2>
      <p className="pre-meta mono-label absolute bottom-6 left-5 opacity-60 md:left-8">
        {preloader.tagline}
      </p>
      <p
        ref={counterRef}
        className="pre-meta display-m absolute bottom-5 right-5 text-acid md:right-8"
      >
        000
      </p>
    </div>
  )
}
