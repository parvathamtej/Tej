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
import Hero from './sections/Hero'
import Manifesto from './sections/Manifesto'
import Velocity from './sections/Velocity'
import Stack from './sections/Stack'
import Work from './sections/Work'
import Receipts from './sections/Receipts'
import Contact from './sections/Contact'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// Chapter color system: the page floods to warm bone for THE STACK, back to ink
// for work. Acid stays an accent; --accent-ui swaps to olive so it reads on bone.
const LIGHT = {
  '--bg-page': '#edeae3',
  '--fg-page': '#0e0e0c',
  '--hair': 'rgba(14,14,12,0.18)',
  '--accent-ui': '#55671a',
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
    gsap.utils.toArray('.site-main section').forEach((el, i) => {
      const target = el.parentElement?.classList.contains('pin-spacer') ? el.parentElement : el
      ScrollTrigger.create({
        trigger: target,
        start: 'top 55%',
        end: 'bottom 55%',
        onToggle: (self) => self.isActive && say(i),
      })
    })
    // Chapter 06 = the footer reveal (fixed element — keyed off main's bottom edge)
    ScrollTrigger.create({
      trigger: '.site-main',
      start: 'bottom 60%',
      onEnter: () => say(6),
      onLeaveBack: () => say(5),
    })

    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const flood = (vars) =>
        gsap.to('html', { ...vars, duration: 0.7, ease: 'power2.out', overwrite: 'auto' })
      ScrollTrigger.create({
        trigger: '#stack',
        start: 'top 62%',
        onEnter: () => flood(LIGHT),
        onLeaveBack: () => flood(INK),
      })
      ScrollTrigger.create({
        trigger: '#work',
        start: 'top 55%',
        onEnter: () => flood(INK),
        onLeaveBack: () => flood(LIGHT),
      })
    })
    mm.add('(prefers-reduced-motion: reduce)', () => {
      ScrollTrigger.create({
        trigger: '#stack',
        start: 'top 62%',
        onEnter: () => gsap.set('html', LIGHT),
        onLeaveBack: () => gsap.set('html', INK),
      })
      ScrollTrigger.create({
        trigger: '#work',
        start: 'top 55%',
        onEnter: () => gsap.set('html', INK),
        onLeaveBack: () => gsap.set('html', LIGHT),
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
      <main
        className="site-main relative z-10 mb-[100dvh]"
        style={{ background: 'var(--bg-page)' }}
      >
        <Hero started={started} />
        <Manifesto />
        <Velocity />
        <Stack />
        <Work />
        <Receipts />
      </main>
      <Contact />
    </SmoothScroll>
  )
}
