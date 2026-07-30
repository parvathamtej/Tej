import { useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SmoothScroll from './components/SmoothScroll'
import Preloader from './components/Preloader'
import DotField from './components/DotField'
import Grain from './components/Grain'
import Cursor from './components/Cursor'
import Progress from './components/Progress'
import Navbar from './components/Navbar'
import Hud from './components/Hud'
import Hero from './sections/Hero'
import Pattern from './sections/Pattern'
import CaseStudy from './sections/CaseStudy'
import Stack from './sections/Stack'
import Work from './sections/Work'
import Credentials from './sections/Credentials'
import Contact from './sections/Contact'
import { caseStudies, chapters } from './data/content'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// The skills chapter changes MATERIAL, not hue: the background stays ink and
// only the dot matrix fades in. Every hue attempted was worse than none
// (full-acid, bone, moss and slate were all rejected in turn), and a texture
// change with no colour change is the more sophisticated version of the same
// transition. Timing and mechanic are unchanged; only the target is.
const INK = {
  '--bg-page': '#0e0e0c',
  '--fg-page': '#edeae3',
  '--hair': 'rgba(237,234,227,0.14)',
  '--accent-ui': '#c8f04b',
}
const TEXTURE_ON = 1
const TEXTURE_OFF = 0

export default function App() {
  const [started, setStarted] = useState(false)

  useGSAP(() => {
    // Chapter detection for the HUD readout — App's effect runs after every
    // section has mounted AND after pins wrapped their sections, so the query
    // is ordering-safe. Pinned sections use their pin-spacer as the trigger so
    // the chapter stays active for the whole pinned stretch.
    const say = (i) => window.dispatchEvent(new CustomEvent('tej:chapter', { detail: i }))
    // Top-level sections only (nested blocks like the pull quote must never
    // shift indices) — but pinned sections sit inside a pin-spacer by the time
    // this runs, so both shapes must match.
    gsap.utils
      .toArray('.site-main > section, .site-main > .pin-spacer > section')
      .forEach((el, i) => {
        const target = el.parentElement?.classList.contains('pin-spacer') ? el.parentElement : el
        ScrollTrigger.create({
          trigger: target,
          start: 'top 55%',
          end: 'bottom 55%',
          onToggle: (self) => self.isActive && say(i),
        })
      })
    // Last chapter is the footer reveal (fixed element, keyed off main's bottom edge)
    ScrollTrigger.create({
      trigger: '.site-main',
      start: 'bottom 60%',
      onEnter: () => say(chapters.length - 1),
      onLeaveBack: () => say(chapters.length - 2),
    })

    const mm = gsap.matchMedia()
    const texture = (on, instant) => {
      const el = document.querySelector('.chapter-texture')
      if (!el) return
      const v = on ? TEXTURE_ON : TEXTURE_OFF
      if (instant) gsap.set(el, { opacity: v })
      else gsap.to(el, { opacity: v, duration: 0.7, ease: 'power2.out', overwrite: 'auto' })
    }
    const wire = (instant) => {
      gsap.set('html', INK)
      ScrollTrigger.create({
        trigger: '#stack',
        start: 'top 62%',
        onEnter: () => texture(true, instant),
        onLeaveBack: () => texture(false, instant),
      })
      ScrollTrigger.create({
        trigger: '#work',
        start: 'top 55%',
        onEnter: () => texture(false, instant),
        onLeaveBack: () => texture(true, instant),
      })
    }
    mm.add('(prefers-reduced-motion: no-preference)', () => wire(false))
    mm.add('(prefers-reduced-motion: reduce)', () => wire(true))
    return () => mm.revert()
  })

  return (
    <SmoothScroll>
      <Preloader onDone={() => setStarted(true)} />
      <Grain />
      <Cursor />
      <Progress />
      <Navbar />
      <Hud />
      <main
        className="site-main relative z-10 mb-[100dvh]"
        style={{ background: 'var(--bg-page)' }}
      >
        {/* Hero-scoped atmosphere. A negative-z child of .site-main so it
            paints above main's opaque background (the curtain hiding the fixed
            footer) but below all content. It fades on the hero's geometry
            rather than unmounting, so the field never restarts on scroll-back. */}
        <DotField />
        <Hero started={started} />
        <Pattern />
        {caseStudies.map((study) => (
          <CaseStudy key={study.id} study={study} />
        ))}
        <Stack />
        <Work />
        <Credentials />
      </main>
      <Contact />
    </SmoothScroll>
  )
}
