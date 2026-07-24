// ─────────────────────────────────────────────────────────────────────────────
// EVERY string on the site lives here. Edit copy without touching components.
// ⚠ VERIFY flags: email (old site had a typo "gmial"), GitHub URL, timeline years.
// ─────────────────────────────────────────────────────────────────────────────

export const identity = {
  first: 'TEJ',
  last: 'PRAKASH',
  logo: 'TEJ — PRAKASH®',
  role: 'SOFTWARE DEVELOPER — AI & ML',
  roleSub: 'building data-driven systems at Arrivio',
  eyebrow: 'PORTFOLIO © 2026 — HYDERABAD, IN',
  email: 'parvathamtej@gmail.com',
  location: 'HYDERABAD, IN',
}

export const preloader = {
  tagline: 'LOADING — FAST LEARNER DETECTED',
}

export const heroMarquee =
  'AI & MACHINE LEARNING ✦ DATA-DRIVEN SYSTEMS ✦ PYTHON ✦ REACT ✦ FAST GRASPER ✦ 日本語 OK ✦ '

// Manifesto — segments; accent:true renders acid + Gambetta italic
export const manifesto = {
  index: '01',
  label: 'THE PITCH',
  segments: [
    { text: 'Most developers pick a lane. I ', accent: false },
    { text: 'pick things up', accent: true },
    { text: '. New stack, new domain, new language — give me a week and I’m dangerous. Give me a month and I’m ', accent: false },
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
      body: 'AutoCAD, learned properly — certified during an internship at Hansi Kitchens. First lesson in precision.',
      footnote: '@hansi-kitchens',
    },
    {
      year: '2022',
      tag: 'CODE',
      title: 'Hello, world',
      body: 'C for the fundamentals, Python for everything else. From zero syntax to daily programs in one semester.',
      footnote: '@self-taught',
    },
    {
      year: '2023',
      tag: 'WEB',
      title: 'The web, absorbed',
      body: 'HTML, CSS, JavaScript — first portfolio live on the internet within weeks of starting.',
      footnote: '@v1-shipped',
    },
    {
      year: '2024',
      tag: 'AI/ML',
      title: 'Machine learning clicks',
      body: 'B.Tech CSE with AI & ML focus. Built an AI-assisted telemedicine kiosk concept for rural India.',
      footnote: '@for-real-impact',
    },
    {
      year: '2025',
      tag: 'HUMAN LANG',
      title: '日本語も。',
      body: 'Reached advanced Japanese. Grammar is just another syntax tree.',
      footnote: '@n-levels-deep',
    },
    {
      year: '2026',
      tag: 'NOW',
      title: 'Production mode',
      body: 'Software Developer at Arrivio — data-driven systems, shipped to real users.',
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
    { label: 'HUMAN', items: 'English · Telugu · Hindi · Japanese (adv.)' },
  ],
  ticker: '> absorbing_now: LLM tooling — GSAP — cloud infra',
}

export const work = {
  index: '04',
  label: 'SELECTED WORK',
  title: 'Built while learning. Learning while building.',
  projects: [
    {
      index: '01',
      name: 'AI Telemedicine Kiosk',
      desc: 'AI-assisted healthcare access for rural India — triage intelligence where doctors are scarce.',
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
      desc: 'Pipelines and internal intelligence for a global team. Details under NDA — outcomes aren’t.',
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
    { left: 'ARRIVIO', mid: 'Software Developer — AI & ML', right: '2025 → NOW' },
    { left: 'HANSI KITCHENS', mid: 'Design Intern — AutoCAD (certified)', right: 'INTERNSHIP' },
    { left: 'B.TECH — CSE', mid: 'Artificial Intelligence & Machine Learning', right: 'IN PROGRESS' },
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
    { label: 'OLD SITE', href: 'https://tej--portfolio.web.app/' },
  ],
  credit: 'DESIGNED & BUILT WITH AN AI PAIR-PROGRAMMER',
  marquee: "LET'S TALK ✦ ",
}
