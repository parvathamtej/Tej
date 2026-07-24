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
import Hero from './sections/Hero'
import Manifesto from './sections/Manifesto'
import Velocity from './sections/Velocity'
import Stack from './sections/Stack'
import Work from './sections/Work'
import Receipts from './sections/Receipts'
import Contact from './sections/Contact'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// Chapter color system: the page floods acid for THE STACK, back to ink for work
const ACID = { '--bg-page': '#c8f04b', '--fg-page': '#0e0e0c', '--hair': 'rgba(14,14,12,0.18)' }
const INK = { '--bg-page': '#0e0e0c', '--fg-page': '#edeae3', '--hair': 'rgba(237,234,227,0.14)' }

export default function App() {
  const [started, setStarted] = useState(false)

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const flood = (vars) =>
        gsap.to('html', { ...vars, duration: 0.7, ease: 'power2.out', overwrite: 'auto' })
      ScrollTrigger.create({
        trigger: '#stack',
        start: 'top 62%',
        onEnter: () => flood(ACID),
        onLeaveBack: () => flood(INK),
      })
      ScrollTrigger.create({
        trigger: '#work',
        start: 'top 55%',
        onEnter: () => flood(INK),
        onLeaveBack: () => flood(ACID),
      })
    })
    mm.add('(prefers-reduced-motion: reduce)', () => {
      ScrollTrigger.create({
        trigger: '#stack',
        start: 'top 62%',
        onEnter: () => gsap.set('html', ACID),
        onLeaveBack: () => gsap.set('html', INK),
      })
      ScrollTrigger.create({
        trigger: '#work',
        start: 'top 55%',
        onEnter: () => gsap.set('html', INK),
        onLeaveBack: () => gsap.set('html', ACID),
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
