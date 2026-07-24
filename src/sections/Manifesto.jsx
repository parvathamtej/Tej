import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { manifesto } from '../data/content'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// Pinned word-illumination: the statement sits at 16% opacity and lights up
// word-by-word as you scroll through ~1.6 extra viewports.
export default function Manifesto() {
  const sectionRef = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.ch-meta-m', {
          opacity: 0,
          y: 14,
          duration: 0.7,
          ease: 'power4.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', once: true },
        })
        gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '+=160%',
            scrub: 1,
            pin: true,
          },
        }).to('.m-word', { opacity: 1, stagger: 0.06, ease: 'none' })
      })
      return () => mm.revert()
    },
    { scope: sectionRef },
  )

  let wordIndex = 0
  return (
    <section
      ref={sectionRef}
      className="relative z-[5] flex min-h-dvh flex-col justify-center bg-ink px-5 py-24 md:px-8"
    >
      <div className="ch-meta-m mb-10 flex items-baseline justify-between">
        <p className="mono-label">
          <span className="text-acid">[{manifesto.index}]</span>
          <span className="ml-3 opacity-60">{manifesto.label}</span>
        </p>
        <p className="mono-label hidden opacity-40 md:block">KEEP SCROLLING</p>
      </div>
      <p
        className="max-w-[24ch] font-display text-[clamp(1.9rem,4.6vw,4.1rem)] font-semibold leading-[1.06] tracking-[-0.01em]"
        style={{ textWrap: 'pretty' }}
      >
        {manifesto.segments.map((seg, s) =>
          seg.text.split(' ').map((w, i, arr) => {
            if (w === '') return null
            wordIndex += 1
            return (
              <span
                key={`${s}-${i}`}
                className={`m-word inline ${seg.accent ? 'serif-accent text-acid' : ''}`}
              >
                {w}
                {i < arr.length - 1 || seg.text.endsWith(' ') ? ' ' : ''}
              </span>
            )
          }),
        )}
      </p>
    </section>
  )
}
