// ─────────────────────────────────────────────────────────────────────────────
// EVERY string on the site lives here. Edit copy without touching components.
//
// HOUSE STYLE (hard rules, see PLAN.md V4/V5):
//   · No em dashes. Separators are "·" or "/". Arrows (→) are glyphs, allowed.
//   · No AI-tell vocabulary. No balanced rule-of-three sentences.
//   · Specific nouns and real numbers over adjectives and intensifiers.
//   · CASE IS CARRIED HERE, not by CSS. Chapter titles and the hero are caps;
//     prose, the pattern lines and the pull quote are sentence case.
// ─────────────────────────────────────────────────────────────────────────────

export const identity = {
  first: 'TEJ',
  last: 'PRAKASH',
  logo: 'TEJ PRAKASH®',
  statement: [
    'I build the internal systems companies run on.',
    'The ones that replace the spreadsheet, the manual follow-up,',
    'and the "let me check and get back to you."',
  ],
  credential: 'Founding Engineer at Arrivio. Previously GlobalLogic, a Hitachi Group company.',
  location: 'Hyderabad, India.',
  locationShort: 'HYDERABAD, IN',
  email: 'parvathamtej@gmail.com',
}

export const preloader = {
  tagline: 'LOADING · INTERNAL SYSTEMS',
}

// Bottom HUD bar and chapter rail. Order must match the sections in App.jsx.
// These stay company-specific (unlike the section kickers, which mark the three
// experience chapters as one run) because the HUD and rail are navigation: a
// reader needs to know WHICH chapter they are in, not just its category.
// `n` is the counter position shown in the HUD. INTRO and SAY HI have none:
// the page never numbers them, and a HUD reading "03 / 09" while the section
// kicker on the same screen reads "02 / EXPERIENCE" is the confusion to avoid.
// The progress ticks navigate to all nine; only these seven are counted.
export const chapters = [
  { name: 'INTRO', target: '#top' },
  { name: 'HOW I WORK', n: 1, target: '#pattern' },
  { name: 'ARRIVIO', n: 2, target: '#arrivio' },
  { name: 'GLOBALLOGIC', n: 3, target: '#globallogic' },
  { name: 'HANSI', n: 4, target: '#hansi' },
  { name: 'SKILLS', n: 5, target: '#stack' },
  { name: 'PROJECTS', n: 6, target: '#work' },
  { name: 'BACKGROUND', n: 7, target: '#receipts' },
  { name: 'SAY HI', target: 'bottom' },
]

export const CHAPTER_TOTAL = 7

// (The V7 "THE WORK" divider is deleted. The HUD and chapter rail already tell
// the reader they have moved into a new chapter, and the dossier's own rail
// carries the company name. A separate announcement screen was the same
// information a third time.)

export const availability = 'OPEN TO OPPORTUNITIES'

// ── 01 / THE PATTERN ─────────────────────────────────────────────────────────
// The argument the whole page exists to prove. Problem line lands first, the
// solution line lands a beat later. `accent` renders acid + italic.
export const pattern = {
  index: '01',
  category: 'HOW I WORK',
  // Sentence case: caps strip the ascender and descender shapes readers use to
  // recognise words, and the penalty grows with size. Caps are kept only for
  // one and two word headings, kickers, labels, the HUD, chips and tags.
  heading: ['Three companies. The same problem.'],
  // The one deck that survives: it explains a heading that cannot stand alone.
  deck: 'Every one of them had somebody doing by hand what a system should have been doing.',
  // Badges are deliberately NOT parallel. Each states the strongest fact its
  // own copy supports: GlobalLogic was demoed to stakeholders every sprint and
  // the copy never claims production, so it does not get a "shipped" badge.
  pairs: [
    {
      company: 'HANSI KITCHENS · 2023',
      badge: 'STILL IN USE',
      problem: 'Hansi could not show a client the room they were paying for.',
      solution: [
        { text: 'So I ' },
        { text: 'built the thing', accent: true },
        { text: ' that shows them.' },
      ],
    },
    {
      company: 'GLOBALLOGIC · 2026',
      badge: '3 SPRINTS',
      problem: 'GlobalLogic had advisors filling forty fields to book one car.',
      solution: [
        { text: 'So I ' },
        { text: 'built the thing', accent: true },
        { text: ' that takes a sentence.' },
      ],
    },
    {
      company: 'ARRIVIO · 2026',
      badge: 'IN PRODUCTION',
      problem: 'Arrivio could not see which market to enter next.',
      solution: [
        { text: 'So I ' },
        { text: 'built the thing', accent: true },
        { text: ' that maps it.' },
      ],
    },
  ],
  // The payoff keeps the frame the three beats established: same label slot,
  // same badge slot. Dropping them would change the right column's shape at
  // the exact moment the argument concludes.
  payoff: {
    company: 'THE PATTERN · 2023 TO 2026',
    badge: 'THREE FOR THREE',
    lead: 'Same move, three times.',
    line: 'Somebody was carrying an operational problem by hand. I replaced the hand with a system.',
  },
}

// Right-panel visuals for the pinned Pattern split screen. Everything here is
// schematic or generated: no real tools, no real data, no NDA exposure.
export const patternVisuals = {
  hansi: {
    // Real photography pending image rights. null → crafted placeholder panels.
    // To swap: set these to '/hansi-before.jpg' and '/hansi-after.jpg'.
    beforeSrc: null,
    afterSrc: null,
    beforeLabel: 'BEFORE STATE',
    afterLabel: 'AFTER DESIGN',
  },
  globallogic: {
    sentence: 'book the white Fortuner for Ramesh, pickup tomorrow 10am',
    fieldCount: 40,
    screens: 5,
  },
  arrivio: {
    label: 'ILLUSTRATIVE',
  },
}

// ── 02 / 03 / 04 · THE CASE STUDIES ──────────────────────────────────────────
// The demand model is internal. It is described, never linked, and its URL
// appears nowhere in this file or the markup. Do not add one.
export const caseStudies = [
  {
    id: 'arrivio',
    index: '02',
    label: 'ARRIVIO',
    category: 'EXPERIENCE',
    heading: 'ARRIVIO',
    title: 'Founding Engineer',
    // Company name removed: the rail heading directly above already carries it
    meta: 'January 2026 to present · Remote, Berlin',
    stamp: 'STATUS: CURRENT',
    intro: [
      'I am the first engineer at Arrivio and I built the engineering function. I hired the team of six that runs it, set the architecture everything is built on, and own the technical direction of the product.',
      'Arrivio is building move-in-ready housing for people relocating internationally. Most of what that requires did not exist when I joined. It exists now.',
      'Eleven production modules across four surfaces: the consumer platform, the B2B portal, the admin console and the community product.',
    ],
    blocks: [
      {
        heading: 'THE PROPERTY ASSISTANT',
        body: [
          'A language model that takes a renter’s requirements in plain conversation and returns real matching inventory. GPT-4o-mini against a FastAPI service, a Leaflet map, and conversation state held across the session, so it behaves like something that was listening rather than a search box wearing a chat skin.',
        ],
      },
      {
        heading: 'CONTRACT EXECUTION WITH NO HUMAN IN IT',
        body: [
          'Payment clears, the contract issues for signature, the signed document files itself. The old loop was two days of generating, emailing, waiting, chasing and filing. It is under five minutes now and nobody touches it.',
        ],
      },
      {
        heading: 'THE DEMAND MODEL',
        body: [
          'A geospatial system that decides where the company expands before it commits capital. It maps immigrant inflow against existing supply, scores acquisition targets by walk, bike and transit reachability, and computes addressable market live across roughly 185 client positions.',
          'Sizing a market by hand took days and was stale on arrival. It takes under an hour now. That changed the question the founders ask, from whether we can afford to study a market to which one we take next.',
          'I was not handed a spec for that one. I was in the room while the decision was being argued, and the tool exists because the argument needed better inputs.',
        ],
      },
    ],
    stats: ['11 MODULES', '4 SURFACES', 'TEAM OF 6', '2 DAYS → 5 MIN', 'DAYS → 1 HOUR'],
    tech: [
      'React', 'Vite', 'Python', 'FastAPI', 'Node.js', 'Supabase', 'PostgreSQL',
      'GPT-4o-mini', 'Leaflet', 'Stripe', 'Cashfree', 'DocuSign', 'GCP', 'Vercel',
    ],
    links: [
      { label: 'B2C PLATFORM', host: 'arrivio-b2c.vercel.app', href: 'https://arrivio-b2c.vercel.app' },
      { label: 'B2B PORTAL', host: 'arrivio-b2b.vercel.app', href: 'https://arrivio-b2b.vercel.app' },
      { label: 'COMMUNITY', host: 'arrivio-community.vercel.app', href: 'https://arrivio-community.vercel.app' },
    ],
  },
  {
    id: 'globallogic',
    index: '03',
    label: 'GLOBALLOGIC',
    category: 'EXPERIENCE',
    heading: 'GLOBALLOGIC',
    title: 'Engineering Intern',
    meta: 'A Hitachi Group company · November 2025 to June 2026 · Hyderabad',
    intro: [
      'Two engineers, three sprints, a dealer management system for vehicle rental operators, demoed to business stakeholders at the end of every sprint.',
      'I owned fleet inventory, the availability engine, quotation pricing, the booking flow, pre-trip inspection and return settlement. Nine tables, six analytics surfaces, two user roles.',
    ],
    blocks: [
      {
        heading: 'I FOUND THE SYSTEM RUNNING TWO OF EVERYTHING',
        body: [
          'Two pricing engines. Two availability systems. Two booking flows. All live at once, producing availability bugs nobody could reliably reproduce.',
          'I mapped what actually existed, named a single source of truth for each concern, and rebuilt it against that. Pricing became one deterministic function. Availability became pure booking overlap logic in the database instead of a hybrid of real queries and UI flags. Quotations got a real state machine.',
          'Generating a quote used to be an insert, then a six-attempt polling loop, then a frontend fallback for when the database never answered. It is now a calculation and one write.',
        ],
        // The site's best sentence. It closes the card it belongs to, in
        // context, rather than costing a whole screen on its own.
        closer: 'Double booking stopped being a bug we fixed and became something the system cannot do.',
      },
      {
        heading: 'THEN I DESIGNED THE AGENT',
        body: [
          'An assistant that lets an advisor book a car by typing one sentence instead of working through five screens and more than forty fields. That is about eighty percent of their data entry, on every booking.',
          'The design is the interesting part. The model has no database access at all. It requests tools by name and the orchestrator executes them using the advisor’s own token, so the assistant inherits exactly the permissions that advisor already has and can never exceed them.',
          'Every write sits behind an explicit confirmation. Booking creation is one atomic transaction with an idempotency key, so a double-tap or a timeout retry cannot produce two bookings. Pricing is computed server-side and re-verified before the write, because a model that can be talked into a number will eventually be talked into the wrong one.',
          'I wrote all of that down before writing any code, including why fine-tuning is the wrong tool here. Fine-tuning teaches style, not facts, and rental data changes hourly.',
        ],
      },
    ],
    stats: ['9 TABLES', '6 ANALYTICS SURFACES', '3 SPRINTS', '2 ENGINEERS', '80% LESS DATA ENTRY'],
    tech: [
      'Angular', 'TypeScript', 'Supabase', 'PostgreSQL', 'RLS', 'SCSS',
      'Cashfree', 'Vercel', 'LLM tool calling', 'Agent design',
    ],
  },
  {
    id: 'hansi',
    index: '04',
    label: 'HANSI',
    category: 'EXPERIENCE',
    heading: 'HANSI KITCHENS',
    title: 'Systems Developer',
    meta: '2023 · Hyderabad',
    stamp: 'NDA · NO SCREENSHOTS',
    intro: [
      'Interior fit-out has an expensive communication problem. A client approves a drawing, pictures something slightly different in their head, and finds the gap when the work is half built. By then the change costs real money and real weeks.',
      'I built the software that closes it. It renders a client’s complete interior before any work starts, so the conversation about what they actually want happens while changes are still free.',
      'Revisions moved from the middle of a build to before it begins. Approval got faster. And the sales team stopped describing what a room would look like and started showing it, which turned out to matter more than anything else the tool did.',
      'I was nineteen. It is still in use, and it is under NDA, so there are no screenshots on this page. Happy to walk through the architecture in person.',
    ],
    blocks: [],
  },
]

// ── 05 / THE STACK (moss flood) ──────────────────────────────────────────────
// No ratings, no percentages, no proficiency bars. Ever.
export const stack = {
  index: '05',
  category: 'SKILLS',
  heading: ['What I reach for.'],
  rows: [
    { label: 'LANGUAGES', items: 'Python · TypeScript · JavaScript · Java · SQL' },
    {
      label: 'AI SYSTEMS',
      items: 'LLM tool calling and agent design · RAG · LangChain · Whisper · Stable Diffusion · Hugging Face · prompt design',
    },
    { label: 'FRONTEND', items: 'React · Angular · Vite · Tailwind · SCSS' },
    { label: 'BACKEND', items: 'FastAPI · Node.js · Supabase · PostgreSQL · RLS' },
    { label: 'PLATFORM', items: 'Vercel · GCP · Firebase · Render · Docker' },
    { label: 'PRODUCT', items: 'Stripe · Cashfree · DocuSign · Leaflet · OpenRouteService' },
  ],
  closer: {
    heading: 'WHAT I ACTUALLY DO WITH IT',
    line: 'Find the manual loop that is costing somebody their week. Delete it.',
  },
}

// ── 06 / SELECTED WORK ───────────────────────────────────────────────────────
// Honest labels. Inflated ones next to the Arrivio chapter would poison it.
export const work = {
  index: '06',
  category: 'PROJECTS',
  heading: ['Other things I’ve built.'],
  projects: [
    {
      index: '01',
      name: 'RAG Document Intelligence',
      desc: 'Upload a document, ask questions, get answers grounded in the text rather than invented around it. LangChain, Chroma, Google text-embedding-004, Gemini 2.5 Flash, Streamlit, containerised and deployed.',
      year: '2025',
      status: 'LIVE',
      href: 'https://github.com/parvathamtej/Rag-Chat-App',
      hrefLabel: 'github.com/parvathamtej/Rag-Chat-App',
      art: 'rag',
    },
    {
      index: '02',
      name: 'Speech to Image',
      desc: 'Speak, and the system draws what you said. Whisper transcribes, sentiment analysis shapes the prompt, Stable Diffusion renders it. Built with a team during the Infosys Springboard programme.',
      year: '2024',
      status: 'TEAM · INFOSYS',
      art: 'speech',
    },
    {
      index: '03',
      name: 'Telemedicine Kiosk',
      desc: 'Rural healthcare access, built as team Sahay for Smart India Hackathon. Concept and working front end for a kiosk that puts a consultation within reach of a village.',
      year: '2023',
      status: 'SMART INDIA HACKATHON',
      art: 'kiosk',
    },
    {
      index: '04',
      name: 'AI Career Advisor',
      desc: 'A conversational guide for students who do not know what roles exist, let alone which one fits them.',
      year: '2024',
      status: 'PROTOTYPE',
      art: 'advisor',
    },
  ],
}

// ── 07 / BACKGROUND ──────────────────────────────────────────────────────────
// Three clearly separated blocks under one heading. Nothing below 14px here:
// this section failed on legibility before it failed on anything else.
export const credentials = {
  index: '07',
  category: 'BACKGROUND',
  heading: ['Education and certifications.'],
  education: {
    label: 'EDUCATION',
    degree: 'B.Tech, Computer Science Engineering',
    focus: 'Artificial Intelligence and Machine Learning',
    school: 'Malla Reddy College of Engineering and Technology · 2026',
  },
  // "CREDENTIALS", not "CERTIFICATIONS": a section heading and its first sub
  // heading may never share a word, and this column holds certificates from
  // four different issuers, so it is the more accurate label anyway.
  certifications: {
    label: 'CREDENTIALS',
    rows: [
      { issuer: 'AWS Academy Graduate', name: 'Machine Learning Foundations' },
      { issuer: 'DeepLearning.AI', name: 'AI For Everyone' },
      { issuer: 'Infosys', name: 'Principles of Generative AI' },
      { issuer: 'Infosys', name: 'Deep Learning for Developers' },
      { issuer: 'Infosys', name: 'Artificial Intelligence Primer' },
    ],
  },
  languages: {
    label: 'LANGUAGES',
    rows: [
      { issuer: 'Telugu', name: 'Native' },
      { issuer: 'Hindi', name: 'Native' },
      { issuer: 'English', name: 'Professional' },
      { issuer: 'Japanese', name: 'Limited working' },
    ],
  },
}

// ── 08 / SAY HI ──────────────────────────────────────────────────────────────
export const contact = {
  index: '08',
  label: 'SAY HI',
  kicker: 'AVAILABLE FOR WORK, COLLABS & WILD IDEAS',
  lineA: "LET'S",
  lineB: 'TALK',
  links: [
    { label: 'LINKEDIN', href: 'https://www.linkedin.com/in/tej--prakash/' },
    { label: 'GITHUB', href: 'https://github.com/parvathamtej' },
    // Drop the PDF at public/tej-prakash-resume.pdf, then uncomment:
    // { label: 'RÉSUMÉ', href: '/tej-prakash-resume.pdf', download: true },
    { label: 'MORE ABOUT ME', href: 'https://tej--portfolio.web.app/' },
  ],
  credit: 'DESIGNED & BUILT BY TEJ PRAKASH',
}
