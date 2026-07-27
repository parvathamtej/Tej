import { useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SmoothScroll from './components/SmoothScroll'
import Preloader from './components/Preloader'
import Grain from './components/Grain'
import Cursor from './components/Cursor'
import Progress from './components/Progress'
import Navbar from './components/Navbar'
import Hud from './components/Hud'
import ChapterRail from './components/ChapterRail'
import Hero from './sections/Hero'
import Pattern from './sections/Pattern'
import CaseStudy from './sections/CaseStudy'
import Stack from './sections/Stack'
import Work from './sections/Work'
import Receipts from './sections/Receipts'
import Contact from './sections/Contact'
import { caseStudies, chapters } from './data/content'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// Chapter color system: for THE STACK the room shifts to deep moss — still dark,
// but unmistakably green — and the hairlines energize with an acid tint. Back to
// ink for work. (v1 full-acid and v2 bone floods both rejected by Tej.)
const MOSS = {
  '--bg-page': '#1b220a',
  '--fg-page': '#edeae3',
  '--hair': 'rgba(200,240,75,0.22)',
  '--accent-ui': '#c8f04b',
}
const INK = {
  '--bg-page': '#0e0e0c',
  '--fg-page': '#edeae3',
  '--hair': 'rgba(237,234,227,0.14)',
  '--accent-ui': '#c8f04b',
}

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
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const flood = (vars) =>
        gsap.to('html', { ...vars, duration: 0.7, ease: 'power2.out', overwrite: 'auto' })
      ScrollTrigger.create({
        trigger: '#stack',
        start: 'top 62%',
        onEnter: () => flood(MOSS),
        onLeaveBack: () => flood(INK),
      })
      ScrollTrigger.create({
        trigger: '#work',
        start: 'top 55%',
        onEnter: () => flood(INK),
        onLeaveBack: () => flood(MOSS),
      })
    })
    mm.add('(prefers-reduced-motion: reduce)', () => {
      ScrollTrigger.create({
        trigger: '#stack',
        start: 'top 62%',
        onEnter: () => gsap.set('html', MOSS),
        onLeaveBack: () => gsap.set('html', INK),
      })
      ScrollTrigger.create({
        trigger: '#work',
        start: 'top 55%',
        onEnter: () => gsap.set('html', INK),
        onLeaveBack: () => gsap.set('html', MOSS),
      })
    })
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
      <ChapterRail />
      <main
        className="site-main relative z-10 mb-[100dvh]"
        style={{ background: 'var(--bg-page)' }}
      >
        <Hero started={started} />
        <Pattern />
        {caseStudies.map((study) => (
          <CaseStudy key={study.id} study={study} />
        ))}
        <Stack />
        <Work />
        <Receipts />
      </main>
      <Contact />
    </SmoothScroll>
  )
}
