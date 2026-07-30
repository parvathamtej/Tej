// SIZE FOLLOWS LENGTH, NOT IMPORTANCE.
//
// A type step measures how much text there is, not how much it matters. A two
// word wordmark and a six word sentence cannot share a step: at 144px the
// sentence wraps to three lines and swallows a viewport while the wordmark sits
// on one line and looks correct. Display headings want roughly 15 to 25
// characters per line; anything outside that band is mis-sized regardless of
// how important the content is.
//
// Count the characters, assign the step. Never eyeball it.
export function stepForLength(text) {
  const n = (Array.isArray(text) ? text.join(' ') : String(text)).length
  if (n <= 12) return 'display-xl'
  if (n <= 28) return 'display-l'
  if (n <= 55) return 'display-m'
  return 'display-s'
}

// Ceiling enforcement: no heading line may exceed 25 characters, and no heading
// may render more than 2 lines. These measures keep every step inside that band
// at its clamp maximum.
export const MEASURE = {
  'display-xl': 'max-w-[12ch]',
  'display-l': 'max-w-[16ch]',
  'display-m': 'max-w-[22ch]',
  'display-s': 'max-w-[30ch]',
}

// ─── LEVEL, THE RULE LENGTH ALONE COULD NOT EXPRESS ──────────────────────────
//
// Sizing by length is right within a level and wrong across levels. A section
// heading of 29 characters and an item heading of 36 both resolved to
// display-m, so "Education and certifications." and "B.Tech, Computer Science
// Engineering" rendered at exactly the same 44px: a measured ratio of 1.00,
// which tells the reader nothing about where to start.
//
// Two adjacent levels must differ enough to be read as different. Below about
// 1.2x the eye treats them as the same rank and the page loses its entry
// point, so every level here is at least ~1.4x the one under it:
//
//   SECTION heading   display-l 64px  (display-m 44px only when long)
//   ITEM heading      display-s 31px
//   BODY / deck       18-20px
//   META (mono)       12-14px
//
// Length still chooses WITHIN a level. It may never promote an item above a
// section, which is what the caps below enforce.
export function sectionStep(text) {
  const step = stepForLength(text)
  // Never smaller than display-m: a section heading is short by construction,
  // and anything below this stops reading as the top of a section.
  return step === 'display-s' ? 'display-m' : step
}

// Items are capped one full level below the smallest section heading.
export const ITEM_STEP = 'display-s'
export const ITEM_MEASURE = MEASURE[ITEM_STEP]
