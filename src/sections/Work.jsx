import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ChapterHead from '../components/ChapterHead'
import Stamp from '../components/Stamp'
import { work } from '../data/content'
import { DUR_S, EASE, MM } from '../lib/motion'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// Numbered project rows. On desktop a preview card chases the cursor.
// The preview is STATELESS: every frame it hit-tests what's under the cursor
// (elementFromPoint) and exists only while that's a work row. Scrolling with a
// frozen mouse, teleporting, anything: the moment the cursor isn't on a row,
// it closes. No event bookkeeping to go stale.
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
        const rows = gsap.utils.toArray('.work-row')
        const pos = { x: 0, y: 0 }
        const target = { x: -1, y: -1 }
        let vx = 0
        let activeRow = null

        const onMove = (e) => {
          target.x = e.clientX
          target.y = e.clientY
        }

        const open = (project) => {
          artRef.current.className = `art-${project.art} absolute inset-0`
          nameRef.current.textContent = project.name
          gsap.to(preview, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.45, ease: EASE, overwrite: 'auto' })
        }
        const close = () => {
          gsap.to(preview, { clipPath: 'inset(50% 0% 50% 0%)', duration: 0.35, ease: 'power3.in', overwrite: 'auto' })
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
          // Stateless presence check, every frame
          const el = target.x >= 0 ? document.elementFromPoint(target.x, target.y) : null
          const row = el ? el.closest('.work-row') : null
          if (row !== activeRow) {
            activeRow = row
            if (row) open(work.projects[rows.indexOf(row)])
            else close()
          }
        }

        window.addEventListener('mousemove', onMove, { passive: true })
        gsap.ticker.add(tick)
        return () => {
          window.removeEventListener('mousemove', onMove)
          gsap.ticker.remove(tick)
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
            className="work-row group hairline-t -mx-3 grid grid-cols-[2.5rem_1fr] items-baseline gap-x-4 gap-y-2 px-3 py-8 transition-colors duration-200 hover:bg-[var(--fg-page)] hover:text-[var(--bg-page)] md:grid-cols-[3.5rem_1fr_auto] md:py-10"
          >
            <p className="mono-label text-acid group-hover:text-[var(--bg-page)]">{p.index}</p>
            <div>
              <h3 className="display-type text-[clamp(1.5rem,3.4vw,2.9rem)]">{p.name}</h3>
              <p className="prose-measure mt-3 text-bone-dim group-hover:text-[var(--bg-page)]">
                {p.desc}
              </p>
              {p.href ? (
                <a
                  href={p.href}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="OPEN"
                  className="mono-label !normal-case mt-4 inline-block opacity-60 underline-offset-4 hover:underline hover:opacity-100"
                >
                  → {p.hrefLabel}
                </a>
              ) : null}
            </div>
            <div className="col-start-2 flex items-baseline gap-3 md:col-start-3 md:self-start">
              <span className="mono-label opacity-60">{p.year}</span>
              <Stamp text={p.status} />
            </div>
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
