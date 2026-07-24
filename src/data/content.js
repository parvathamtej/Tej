// ─────────────────────────────────────────────────────────────────────────────
// EVERY string on the site lives here. Edit copy without touching components.
// House style: NO em dashes anywhere. Separators are "·" or "/". Keep copy
// human: short sentences, plain punctuation.
// ⚠ VERIFY flags: email (old site had a typo "gmial"), GitHub URL, timeline years.
// ─────────────────────────────────────────────────────────────────────────────

export const identity = {
  first: 'TEJ',
  last: 'PRAKASH',
  logo: 'TEJ PRAKASH®',
  role: 'SOFTWARE DEVELOPER · AI & ML',
  roleSub: 'building data-driven systems at Arrivio',
  eyebrow: 'PORTFOLIO © 2026 · HYDERABAD, IN',
  email: 'parvathamtej@gmail.com',
  location: 'HYDERABAD, IN',
}

export const preloader = {
  tagline: 'LOADING · FAST LEARNER DETECTED',
}

// Bottom HUD bar. Chapter names must match section order in App.jsx
export const chapters = [
  '00 / INTRO',
  '01 / THE PITCH',
  '02 / THE PROOF',
  '03 / THE STACK',
  '04 / SELECTED WORK',
  '05 / THE RECEIPTS',
  '06 / SAY HI',
]

export const availability = 'OPEN TO OPPORTUNITIES'

// Manifesto segments; accent:true renders acid + Gambetta italic
export const manifesto = {
  index: '01',
  label: 'THE PITCH',
  segments: [
    { text: 'Most developers pick a lane. I ', accent: false },
    { text: 'pick things up', accent: true },
    { text: '. New stack, new domain, new language: give me a week and I’m dangerous. Give me a month and I’m ', accent: false },
    { text: 'shipping', accent: true },
    { text: '. From CAD blueprints to neural networks, everything I touch gets ', accent: false },
    { text: 'absorbed', accent: true },
    { text: '. ', accent: false },
    { text: 'Fast.', accent: true },
  ],
}

export const velocity = {
  index: '02',
  label: 'THE PROOF',
  title: 'Absorption speed, documented.',
  cards: [
    {
      year: '2021',
      tag: 'DESIGN',
      title: 'The blueprint years',
      body: 'AutoCAD, learned properly. Certified during an internship at Hansi Kitchens. First lesson in precision.',
      footnote: '@hansi-kitchens',
    },
    {
      year: '2022',
      tag: 'CODE',
      title: 'Hello, world',
      body: 'C for the fundamentals, Python for everything else. Zero syntax to daily programs in one semester.',
      footnote: '@self-taught',
    },
    {
      year: '2023',
      tag: 'WEB',
      title: 'The web, absorbed',
      body: 'HTML, CSS, JavaScript. First portfolio live on the internet within weeks of starting.',
      footnote: '@v1-shipped',
    },
    {
      year: '2024',
      tag: 'AI/ML',
      title: 'Machine learning clicks',
      body: 'B.Tech CSE with an AI & ML focus. Built an AI-assisted telemedicine kiosk concept for rural India.',
      footnote: '@for-real-impact',
    },
    {
      year: '2025',
      tag: 'SYSTEMS',
      title: 'Production patterns',
      body: 'Pipelines, deployment, monitoring. Learning how data systems behave outside the notebook.',
      footnote: '@scaling-up',
    },
    {
      year: '2026',
      tag: 'NOW',
      title: 'Production mode',
      body: 'Software Developer at Arrivio. Data systems shipped to real users.',
      footnote: '@arrivio',
    },
  ],
}

export const stack = {
  index: '03',
  label: 'THE STACK',
  title: 'Currently loaded.',
  rows: [
    { label: 'LANGUAGES', items: 'Python · C · JavaScript · SQL' },
    { label: 'AI / ML', items: 'scikit-learn · TensorFlow · Pandas · NumPy · Data Pipelines' },
    { label: 'WEB', items: 'React · Node.js · Tailwind · Firebase' },
    { label: 'TOOLS', items: 'Git · Linux · AutoCAD · Figma' },
  ],
  ticker: '> absorbing_now: LLM tooling / GSAP / cloud infra',
}

export const work = {
  index: '04',
  label: 'SELECTED WORK',
  title: 'Some things I’ve built.',
  projects: [
    {
      index: '01',
      name: 'AI Telemedicine Kiosk',
      desc: 'AI-assisted healthcare access for rural India. Triage intelligence where doctors are scarce.',
      tags: 'AI/ML · PYTHON · HEALTHCARE',
      status: 'IN DEVELOPMENT',
      art: 'kiosk',
    },
    {
      index: '02',
      name: 'This Website',
      desc: 'You’re scrolling the case study. A scroll-driven narrative engineered with GSAP, Lenis and React.',
      tags: 'REACT · GSAP · MOTION',
      status: 'LIVE',
      art: 'site',
    },
    {
      index: '03',
      name: 'Data Systems @ Arrivio',
      desc: 'Pipelines and internal intelligence for a global team. Details under NDA. The outcomes aren’t.',
      tags: 'DATA · PYTHON · PROD',
      status: 'SHIPPING',
      art: 'data',
    },
  ],
}

export const receipts = {
  index: '05',
  label: 'THE RECEIPTS',
  title: 'Experience & education.',
  rows: [
    { left: 'ARRIVIO', mid: 'Software Developer, AI & ML', right: '2025 → NOW' },
    { left: 'HANSI KITCHENS', mid: 'Design Intern, AutoCAD certified', right: 'INTERNSHIP' },
    { left: 'B.TECH / CSE', mid: 'Artificial Intelligence & Machine Learning', right: 'IN PROGRESS' },
  ],
}

export const contact = {
  index: '06',
  label: 'SAY HI',
  kicker: 'AVAILABLE FOR WORK, COLLABS & WILD IDEAS',
  lineA: "LET'S",
  lineB: 'TALK',
  links: [
    { label: 'LINKEDIN', href: 'https://www.linkedin.com/in/tej--prakash/' },
    { label: 'GITHUB', href: 'https://github.com/tej-prakash' },
    { label: 'MORE ABOUT ME', href: 'https://tej--portfolio.web.app/' },
  ],
  credit: 'DESIGNED & BUILT BY TEJ PRAKASH',
}
