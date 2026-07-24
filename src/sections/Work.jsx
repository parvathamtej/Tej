import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ChapterHead from '../components/ChapterHead'
import { work } from '../data/content'
import { DUR_S, EASE, MM } from '../lib/motion'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// Numbered project rows; on desktop a preview card chases the cursor.
export default function Work() {
  const sectionRef = useRef(null)
  const previewRef = useRef(null)
  const artRef = useRef(null)
  const nameRef = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.work-row', {
          opacity: 0,
          y: 48,
          duration: DUR_S,
          ease: EASE,
          stagger: 0.1,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 74%', once: true },
        })
      })

      mm.add(`${MM.desk} and (pointer: fine)`, () => {
        const preview = previewRef.current
        const pos = { x: 0, y: 0 }
        const target = { x: 0, y: 0 }
        let vx = 0

        const onMove = (e) => {
          target.x = e.clientX
          target.y = e.clientY
        }
        const tick = () => {
          const dx = target.x - pos.x
          pos.x += dx * 0.12
          pos.y += (target.y - pos.y) * 0.12
          vx += (dx * 0.06 - vx) * 0.1
          gsap.set(preview, {
            x: pos.x + 28,
            y: pos.y - 110,
            rotate: gsap.utils.clamp(-7, 7, vx),
          })
        }
        let isOpen = false
        const open = (project) => {
          isOpen = true
          artRef.current.className = `art-${project.art} absolute inset-0`
          nameRef.current.textContent = project.name
          gsap.to(preview, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.45, ease: EASE })
        }
        const close = () => {
          if (!isOpen) return
          isOpen = false
          gsap.to(preview, { clipPath: 'inset(50% 0% 50% 0%)', duration: 0.35, ease: 'power3.in' })
        }
        // Scrolling never fires mouseleave (the page moves, not the cursor) —
        // close on scroll or the preview sticks around over other sections.
        // Lenis's emitter fires inside the rAF loop; native scroll is a fallback.
        const onScroll = () => close()
        const lenisSub = gsap.delayedCall(0, () => window.__lenis?.on('scroll', onScroll))

        const section = sectionRef.current
        section.addEventListener('mousemove', onMove)
        window.addEventListener('scroll', onScroll, { passive: true })
        gsap.ticker.add(tick)

        const rows = gsap.utils.toArray('.work-row')
        const handlers = rows.map((row, i) => {
          const enter = () => open(work.projects[i])
          row.addEventListener('mouseenter', enter)
          row.addEventListener('mouseleave', close)
          return { row, enter }
        })

        return () => {
          section.removeEventListener('mousemove', onMove)
          window.removeEventListener('scroll', onScroll)
          lenisSub.kill()
          window.__lenis?.off('scroll', onScroll)
          gsap.ticker.remove(tick)
          handlers.forEach(({ row, enter }) => {
            row.removeEventListener('mouseenter', enter)
            row.removeEventListener('mouseleave', close)
          })
        }
      })

      return () => mm.revert()
    },
    { scope: sectionRef },
  )

  return (
    <section id="work" ref={sectionRef} className="px-5 py-[clamp(6rem,14vh,10rem)] md:px-8">
      <ChapterHead index={work.index} label={work.label} title={work.title} />
      <ul>
        {work.projects.map((p) => (
          <li
            key={p.index}
            data-cursor="VIEW"
            className="work-row hairline-t -mx-3 grid grid-cols-[2.5rem_1fr] items-baseline gap-x-4 gap-y-2 px-3 py-8 transition-colors duration-200 hover:bg-[var(--fg-page)] hover:text-[var(--bg-page)] md:grid-cols-[3.5rem_1fr_auto] md:py-10"
          >
            <p className="mono-label text-acid">{p.index}</p>
            <div>
              <h3 className="display-type text-[clamp(1.5rem,3.4vw,2.9rem)]">{p.name}</h3>
              <p className="mt-3 max-w-[52ch] text-bone-dim">{p.desc}</p>
              <p className="mono-label mt-4 opacity-50">{p.tags}</p>
            </div>
            <p className="mono-label col-start-2 opacity-70 md:col-start-3 md:self-start md:border md:border-[var(--hair)] md:px-2.5 md:py-1">
              {p.status}
            </p>
          </li>
        ))}
      </ul>

      <div
        ref={previewRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-40 hidden h-[200px] w-[300px] overflow-hidden bg-ink md:block"
        style={{ clipPath: 'inset(50% 0% 50% 0%)' }}
      >
        <div ref={artRef} className="art-kiosk absolute inset-0" />
        <p ref={nameRef} className="mono-label absolute bottom-3 left-3 text-bone" />
        <span className="mono-label absolute right-3 top-3 text-acid">✦</span>
      </div>
    </section>
  )
}
