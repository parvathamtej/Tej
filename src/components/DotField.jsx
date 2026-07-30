import { useEffect, useRef } from 'react'
import { mulberry32 } from '../lib/motion'

/**
 * DotField — flat, perfectly regular dot grid with a slow luminance field
 * moving through it, plus a cursor bloom and displacement.
 *
 * NOT a 3D lattice and not a particle system. Every dot sits exactly where the
 * grid says it should; only its brightness, radius and a small cursor-driven
 * offset change. That rigidity is what makes it read as clean rather than busy.
 *
 * Rendering is batched into BUCKETS alpha bands, two colours each, so a 6000
 * dot field costs ~16 fill calls per frame instead of 6000.
 *
 * Mounts as a negative-z-index child so it paints above its parent's own
 * background but below all in-flow content. That matters here: .site-main is
 * opaque on purpose (it is the curtain that hides the fixed Contact footer),
 * so the field cannot live behind it.
 */

const BUCKETS = 8

// value noise, 3 octaves. Cheap and smooth enough for a luminance mask.
// Seeded (project rule since the hex bloom): generated visuals must render
// identically on every load.
const perm = new Uint8Array(512)
{
  const rand = mulberry32(97)
  const p = []
  for (let i = 0; i < 256; i++) p[i] = i
  for (let i = 255; i > 0; i--) {
    const j = (rand() * (i + 1)) | 0
    const t = p[i]
    p[i] = p[j]
    p[j] = t
  }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255]
}
const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10)
function grad(h, x, y) {
  switch (h & 3) {
    case 0: return x + y
    case 1: return -x + y
    case 2: return x - y
    default: return -x - y
  }
}
function noise2(x, y) {
  const X = Math.floor(x) & 255
  const Y = Math.floor(y) & 255
  x -= Math.floor(x)
  y -= Math.floor(y)
  const u = fade(x)
  const v = fade(y)
  const A = perm[X] + Y
  const B = perm[X + 1] + Y
  return (
    (1 - v) * ((1 - u) * grad(perm[A], x, y) + u * grad(perm[B], x - 1, y)) +
    v * ((1 - u) * grad(perm[A + 1], x, y - 1) + u * grad(perm[B + 1], x - 1, y - 1))
  )
}
function fbm(x, y) {
  let s = 0, a = 0.5, f = 1
  for (let i = 0; i < 3; i++) { s += a * noise2(x * f, y * f); f *= 2; a *= 0.5 }
  return s
}

function toRgb(hex) {
  const h = hex.replace('#', '')
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ]
}

export default function DotField({
  spacing = 15,
  dotSize = 1.3,
  contrast = 1,
  drift = 0.7,
  cursorRadius = 220,
  cursorPush = 9,
  accentRatio = 0.18,
  textMask = true,
  paused = false,
  heroOnly = true,
  scopeSelector = '#top',
}) {
  const ref = useRef(null)
  // props read through a ref so the RAF loop never restarts on a slider move
  const cfg = useRef({})
  cfg.current = {
    spacing, dotSize, contrast, drift, cursorRadius, cursorPush,
    accentRatio, textMask, paused, heroOnly, scopeSelector,
  }

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = canvas.getContext('2d')

    let W = 0, H = 0, raf = 0, T = 0, last = performance.now()
    let mx = -9999, my = -9999, cx = -9999, cy = -9999
    let hidden = false

    // colours come from the live design tokens, so a palette change needs no
    // edit here
    let bone = [237, 234, 227]
    let acid = [200, 240, 75]
    const readTokens = () => {
      const s = getComputedStyle(document.documentElement)
      const fg = s.getPropertyValue('--fg-page').trim()
      const ac = s.getPropertyValue('--accent-ui').trim()
      if (fg.startsWith('#')) bone = toRgb(fg)
      if (ac.startsWith('#')) acid = toRgb(ac)
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = canvas.clientWidth
      H = canvas.clientHeight
      canvas.width = Math.floor(W * dpr)
      canvas.height = Math.floor(H * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const draw = () => {
      const c = cfg.current
      ctx.clearRect(0, 0, W, H)
      if (c.paused) return

      const sp = c.spacing
      const z = T * 0.045 * c.drift
      const scrollZ = (window.scrollY || 0) * 0.00035

      if (mx > -9000) {
        if (cx < -9000) { cx = mx; cy = my }
        cx += (mx - cx) * 0.12
        cy += (my - cy) * 0.12
      } else { cx = -9999; cy = -9999 }

      const R = c.cursorRadius
      const R2 = R * R
      const push = c.cursorPush
      const accT = c.accentRatio

      const pathsBone = []
      const pathsAcid = []
      for (let i = 0; i < BUCKETS; i++) { pathsBone.push(new Path2D()); pathsAcid.push(new Path2D()) }

      for (let y = sp * 0.5; y < H + sp; y += sp) {
        for (let x = sp * 0.5; x < W + sp; x += sp) {
          const n = fbm(x * 0.0021 + z * 0.5, y * 0.0021 - z + scrollZ)
          let f = n + 0.55
          f = Math.max(0, Math.min(1, f * c.contrast))

          let px = x, py = y, bloom = 0
          if (cx > -9000) {
            const dxp = x - cx, dyp = y - cy
            const d2 = dxp * dxp + dyp * dyp
            if (d2 < R2) {
              const d = Math.sqrt(d2) || 0.001
              const k = 1 - d / R
              const k2 = k * k
              bloom = k2
              if (push > 0) { px += (dxp / d) * k2 * push; py += (dyp / d) * k2 * push }
            }
          }

          const lum = Math.min(1, f * 0.72 + bloom * 0.85)
          if (lum <= 0.035) continue
          const r = c.dotSize * (0.55 + f * 0.75 + bloom * 0.9)
          const bi = Math.min(BUCKETS - 1, (lum * BUCKETS) | 0)
          const isAcc = accT > 0 && f > 1 - accT
          const p = isAcc ? pathsAcid[bi] : pathsBone[bi]
          p.moveTo(px + r, py)
          p.arc(px, py, r, 0, Math.PI * 2)
        }
      }

      for (let b = 0; b < BUCKETS; b++) {
        const a = (b + 1) / BUCKETS
        ctx.fillStyle = `rgba(${bone[0]},${bone[1]},${bone[2]},${(a * 0.34).toFixed(3)})`
        ctx.fill(pathsBone[b])
        ctx.fillStyle = `rgba(${acid[0]},${acid[1]},${acid[2]},${(a * 0.62).toFixed(3)})`
        ctx.fill(pathsAcid[b])
      }

      if (c.textMask) {
        ctx.globalCompositeOperation = 'destination-out'
        const g = ctx.createLinearGradient(0, 0, W * 0.66, 0)
        g.addColorStop(0, 'rgba(0,0,0,.72)')
        g.addColorStop(0.5, 'rgba(0,0,0,.34)')
        g.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = g
        ctx.fillRect(0, 0, W, H)
        const vt = ctx.createLinearGradient(0, 0, 0, 110)
        vt.addColorStop(0, 'rgba(0,0,0,.9)')
        vt.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = vt
        ctx.fillRect(0, 0, W, 110)
        const vb = ctx.createLinearGradient(0, H - 95, 0, H)
        vb.addColorStop(0, 'rgba(0,0,0,0)')
        vb.addColorStop(1, 'rgba(0,0,0,.9)')
        ctx.fillStyle = vb
        ctx.fillRect(0, H - 95, W, 95)
        ctx.globalCompositeOperation = 'source-over'
      }
    }

    // The field belongs to the hero and nowhere else. Rather than unmounting
    // (which would restart the noise field every time you scroll back up), the
    // canvas fades on the hero's own geometry and the draw call is skipped
    // entirely once it is invisible, so it costs nothing below the fold.
    let scopeEl = null
    let scopeAlpha = 1
    const scopeFade = () => {
      const c = cfg.current
      if (!c.heroOnly) return 1
      if (!scopeEl || !scopeEl.isConnected) scopeEl = document.querySelector(c.scopeSelector)
      if (!scopeEl) return 1
      const r = scopeEl.getBoundingClientRect()
      const vh = window.innerHeight || 1
      // 1 while the hero fills the screen, 0 by the time its bottom edge has
      // risen to 45% of the viewport
      const t = (r.bottom - vh * 0.45) / (vh * 0.55)
      return Math.max(0, Math.min(1, t))
    }

    const loop = (now) => {
      raf = requestAnimationFrame(loop)
      if (hidden) return
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      T += dt
      const target = scopeFade()
      scopeAlpha += (target - scopeAlpha) * 0.12
      canvas.style.opacity = scopeAlpha.toFixed(3)
      if (scopeAlpha < 0.012) {
        if (canvas.dataset.cleared !== '1') { ctx.clearRect(0, 0, W, H); canvas.dataset.cleared = '1' }
        return
      }
      canvas.dataset.cleared = '0'
      draw()
    }

    const onMove = (e) => { mx = e.clientX; my = e.clientY }
    const onLeave = () => { mx = -9999; my = -9999 }
    const onVis = () => { hidden = document.hidden; last = performance.now() }

    // Tokens are constant since the flood became texture-only, so one read
    // suffices — but chapter changes are the only thing that could ever move
    // them, so re-read after each (delayed past the 0.7s flood tween) instead
    // of polling on a timer.
    let tokenTimer = 0
    const onChapter = () => {
      clearTimeout(tokenTimer)
      tokenTimer = setTimeout(readTokens, 900)
    }

    readTokens()
    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerleave', onLeave)
    window.addEventListener('tej:chapter', onChapter)
    document.addEventListener('visibilitychange', onVis)
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(tokenTimer)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('tej:chapter', onChapter)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 h-full w-full"
      style={{ zIndex: -1 }}
    />
  )
}
