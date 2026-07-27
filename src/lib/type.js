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
