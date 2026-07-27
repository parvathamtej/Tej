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
import Credentials from './sections/Credentials'
import Contact from './sections/Contact'
import SectionHeading from './components/SectionHeading'
import { caseStudies, chapters, experienceDivider } from './data/content'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// Chapter color system: for the skills chapter the room shifts to a cool deep
// slate. Cool makes the acid accent pop harder than any warm colour can, and it
// stays inside the dark world so the transition still reads as a different room.
// (Flood history: full-acid, bone and moss all rejected; slate is final.)
const SLATE = {
  '--bg-page': '#131a24',
  '--fg-page': '#edeae3',
  '--hair': 'rgba(237,234,227,0.16)',
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
        onEnter: () => flood(SLATE),
        onLeaveBack: () => flood(INK),
      })
      ScrollTrigger.create({
        trigger: '#work',
        start: 'top 55%',
        onEnter: () => flood(INK),
        onLeaveBack: () => flood(SLATE),
      })
    })
    mm.add('(prefers-reduced-motion: reduce)', () => {
      ScrollTrigger.create({
        trigger: '#stack',
        start: 'top 62%',
        onEnter: () => gsap.set('html', SLATE),
        onLeaveBack: () => gsap.set('html', INK),
      })
      ScrollTrigger.create({
        trigger: '#work',
        start: 'top 55%',
        onEnter: () => gsap.set('html', INK),
        onLeaveBack: () => gsap.set('html', SLATE),
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
        {/* Mode change: a reader crossing from the Pattern into a dossier needs
            to be told the site has switched from argument to evidence. A <div>,
            not a <section>, so chapter enumeration is unaffected. */}
        <div className="flex min-h-[60dvh] items-center px-5 md:px-8">
          <SectionHeading
            index={experienceDivider.index}
            category={experienceDivider.category}
            heading={experienceDivider.heading}
            deck={experienceDivider.deck}
            size="xl"
          />
        </div>
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
