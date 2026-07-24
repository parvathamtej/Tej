import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ChapterHead from '../components/ChapterHead'
import { velocity } from '../data/content'
import { DUR_S, EASE, MM } from '../lib/motion'

gsap.registerPlugin(useGSAP, ScrollTrigger)

function Card({ card }) {
  return (
    <article className="v-card flex w-full shrink-0 flex-col gap-5 border border-[var(--hair)] p-6 transition-colors duration-200 hover:border-acid md:w-[clamp(320px,34vw,460px)] md:p-8">
      <div className="v-inner flex flex-1 flex-col gap-5 will-change-transform">
        <div className="flex items-baseline justify-between">
          <p className="display-type text-[clamp(1.6rem,2.4vw,2.2rem)] text-acid">{card.year}</p>
          <p className="mono-label border border-[var(--hair)] px-2.5 py-1 opacity-70">{card.tag}</p>
        </div>
        <h3 className="font-display text-[clamp(1.4rem,2vw,1.9rem)] font-semibold leading-tight">
          {card.title}
        </h3>
        <p className="max-w-[38ch] text-bone-dim">{card.body}</p>
        <p className="mono-label mt-auto pt-6 opacity-50">
          {card.footnote} <span className="ml-2">· absorbed</span>
        </p>
      </div>
    </article>
  )
}

// Pinned horizontal track (desktop) — vertical scroll drives horizontal drift.
// On mobile the cards simply stack.
export default function Velocity() {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(MM.desk, () => {
        const track = trackRef.current
        const getX = () => -(track.scrollWidth - window.innerWidth)
        const tween = gsap.to(track, {
          x: getX,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: () => `+=${-getX()}`,
            scrub: 1,
            pin: true,
            invalidateOnRefresh: true,
          },
        })
        // Micro-parallax inside each card while it crosses the viewport
        gsap.utils.toArray('.v-card').forEach((card) => {
          gsap.fromTo(
            card.querySelector('.v-inner'),
            { xPercent: 5 },
            {
              xPercent: -5,
              ease: 'none',
              scrollTrigger: {
                trigger: card,
                containerAnimation: tween,
                start: 'left right',
                end: 'right left',
                scrub: true,
              },
            },
          )
        })
      })

      mm.add(MM.mob, () => {
        gsap.utils.toArray('.v-card').forEach((card) => {
          gsap.from(card, {
            opacity: 0,
            y: 40,
            duration: DUR_S,
            ease: EASE,
            scrollTrigger: { trigger: card, start: 'top 85%', once: true },
          })
        })
      })

      return () => mm.revert()
    },
    { scope: sectionRef },
  )

  return (
    <section ref={sectionRef} data-cursor="DRAG" className="relative">
      <div className="flex flex-col justify-center gap-2 px-5 py-24 md:h-dvh md:overflow-hidden md:px-8 md:py-0">
        <ChapterHead
          index={velocity.index}
          label={velocity.label}
          title={velocity.title}
          hint="SCROLL →"
        />
        <div ref={trackRef} className="flex flex-col gap-5 md:flex-row md:gap-6 md:pr-[10vw]">
          {velocity.cards.map((card) => (
            <Card key={card.year} card={card} />
          ))}
        </div>
      </div>
    </section>
  )
}
