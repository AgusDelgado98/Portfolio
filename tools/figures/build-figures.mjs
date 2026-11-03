// Static SVG figures for the "Superficie de decisión" Home (F4).
//
// Ported from docs/design/superficie-de-decision/source/figures.js (the approved
// sketches), with the same surfaces, seeds and palette. What changes is where they
// are drawn: here they become files, so the Home ships them as independent assets
// (public/figures) instead of JavaScript.
//
// Figures are GEOMETRY ONLY. Text is set in HTML by the components, so it uses the
// page's fonts (an SVG loaded through <img> cannot see them) and follows the
// language. Positions of those labels are written to src/components/home/figureMeta.js.
//
//   node tools/figures/build-figures.mjs          write the files
//   node tools/figures/build-figures.mjs --check   fail if the files on disk differ
//
// Output is deterministic (seeded generator, fixed precision); a test regenerates
// everything and compares it with the committed files.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const C = {
  bg: '#0A151A', lo: '#2E5C6B', hi: '#EADBBE', warm: '#D6A266', mist: '#8FB2BB',
  ivory: '#F1EBDD', sand: '#E7D2AC', petrol: '#2B5563', paper: '#F3EEE2',
}

function rng(seed) {
  let s = seed >>> 0
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296 }
}
const hex = (c) => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)]
const h2 = (n) => Math.round(n).toString(16).padStart(2, '0')
function mix(a, b, t) {
  t = Math.max(0, Math.min(1, t))
  const A = hex(a), B = hex(b)
  return '#' + h2(A[0] + (B[0] - A[0]) * t) + h2(A[1] + (B[1] - A[1]) * t) + h2(A[2] + (B[2] - A[2]) * t)
}
const num = (n) => { const s = n.toFixed(1); return s.endsWith('.0') ? s.slice(0, -2) : s.replace(/^(-?)0\./, '$1.') }
const G = (u, v, cu, cv, su, sv) => { const a = (u - cu) / su, b = (v - cv) / sv; return Math.exp(-(a * a + b * b)) }

/* surfaces: z = f(u,v) on [-1,1]^2 */
const win = (u, v) => (1 - Math.pow(Math.abs(u), 6)) * (1 - Math.pow(Math.abs(v), 6))
const F = {
  hero: (u, v) => win(u, v) * (0.95 * G(u, v, 0.18, -0.05, 0.34, 0.42) + 0.5 * G(u, v, -0.55, 0.42, 0.26, 0.32) + 0.36 * G(u, v, 0.62, 0.5, 0.28, 0.22) + 0.3 * G(u, v, -0.25, -0.62, 0.3, 0.22) + 0.05 * Math.sin(3 * u + 1) * Math.cos(2.4 * v) + 0.05),
  glyph: (u, v) => win(u, v) * (G(u, v, 0.1, 0, 0.5, 0.5) + 0.2),
}
const dens = (u, v) => Math.exp(-((u - 0.12) * (u - 0.12) + (v + 0.05) * (v + 0.05) * 1.3) / 0.85)

/** Hero preset (desktop 980 x 800) and its annotation anchors. */
export const HERO = {
  f: 'hero', W: 980, H: 800, N: 48, th: 38, ph: 50, S: 246, Z: 360, cx: 0.5, cy: 0.56, t: 0.5, zmax: 1, bars: true, pts: 46, seed: 7,
  anch: { obs: [-0.12, 0.34], surf: [0.18, -0.05], unc: [0.42, -0.5], thr: [0.02, -0.35, 0.6] },
  lab: { obs: [318, 128, 's'], surf: [600, 40, 's'], unc: [905, 560, 'e'], thr: [262, 664, 's'] },
  order: ['obs', 'surf', 'unc', 'thr'],
}
/** Phone/tablet preset (390 x 300, the whole mesh inside the box): same surface, drawn smaller, anchors shown as badges. */
export const PHONE = { ...HERO, W: 390, H: 300, N: 34, th: 38, ph: 52, S: 126, Z: 168, cx: 0.5, cy: 0.5, t: 0.44, pts: 36, seed: 9, lab: null }
const GLYPH = { f: 'glyph', W: 44, H: 44, N: 7, th: 38, ph: 52, S: 20, Z: 22, cx: 0.5, cy: 0.62, t: 9, zmax: 1, bars: false, pts: 0, seed: 1, sw: 0.8 }

/** Surface drawing. Returns { body, anchors } where body is SVG markup and anchors are in viewBox units. */
function surface(p, { leaders }) {
  const { W, H, N } = p
  const th = (p.th * Math.PI) / 180, ph = (p.ph * Math.PI) / 180, S = p.S, Z = p.Z, cx = p.cx * W, cy = p.cy * H
  const ct = Math.cos(th), st = Math.sin(th), sp = Math.sin(ph), cp = Math.cos(ph), f = F[p.f], t = p.t
  const P = (u, v, z) => { const x = u * ct - v * st, d = u * st + v * ct; return [cx + x * S, cy - d * S * sp - z * Z * cp, d] }
  const zs = [], ps = []
  for (let i = 0; i <= N; i += 1) {
    zs[i] = []; ps[i] = []
    for (let j = 0; j <= N; j += 1) { const u = -1 + (2 * i) / N, v = -1 + (2 * j) / N, z = f(u, v); zs[i][j] = z; ps[i][j] = P(u, v, z) }
  }
  const items = []
  const dk = (2 / N) * 0.8
  const LV = 8, HV = 4
  const rel = (pts) => 'M' + num(pts[0][0]) + ' ' + num(pts[0][1]) + pts.slice(1).map((q, k) => 'l' + num(q[0] - pts[k][0]) + ' ' + num(q[1] - pts[k][1])).join('') + 'z'
  for (let i = 0; i < N; i += 1) {
    for (let j = 0; j < N; j += 1) {
      const a = ps[i][j], b = ps[i + 1][j], c = ps[i + 1][j + 1], d = ps[i][j + 1]
      const za = zs[i][j], zb = zs[i + 1][j], zc = zs[i + 1][j + 1], zd = zs[i][j + 1], zm = (za + zb + zc + zd) / 4
      const h = Math.min(1, zm / p.zmax), hot = zm >= t
      const cls = hot ? 'h' + Math.round(h * HV) : 'c' + Math.round(h * LV)
      items.push({ k: (a[2] + b[2] + c[2] + d[2]) / 4, type: 'poly', cls, d: rel([a, b, c, d]) })
      const u0 = -1 + (2 * i) / N, u1 = -1 + (2 * (i + 1)) / N, v0 = -1 + (2 * j) / N, v1 = -1 + (2 * (j + 1)) / N, cr = []
      const ed = (z1, z2, ua, va, ub, vb) => { if ((z1 - t) * (z2 - t) < 0) { const s = (t - z1) / (z2 - z1); cr.push([ua + (ub - ua) * s, va + (vb - va) * s]) } }
      ed(za, zb, u0, v0, u1, v0); ed(zb, zc, u1, v0, u1, v1); ed(zd, zc, u0, v1, u1, v1); ed(za, zd, u0, v0, u0, v1)
      if (cr.length === 2) {
        const A = P(cr[0][0], cr[0][1], t), B = P(cr[1][0], cr[1][1], t)
        items.push({ k: (a[2] + b[2] + c[2] + d[2]) / 4, type: 'thr', d: 'M' + num(A[0]) + ' ' + num(A[1]) + 'L' + num(B[0]) + ' ' + num(B[1]) })
      }
    }
  }
  if (p.bars) {
    for (let i = 4; i < N; i += 8) {
      for (let j = 4; j < N; j += 8) {
        const u = -1 + (2 * i) / N, v = -1 + (2 * j) / N, z = zs[i][j]
        if (z < 0.04) continue
        const sg = 0.04 + 0.15 * (1 - dens(u, v)), a = P(u, v, z + sg), b = P(u, v, z - sg), m = ps[i][j]
        const d = 'M' + num(a[0]) + ' ' + num(a[1]) + 'L' + num(b[0]) + ' ' + num(b[1]) + 'M' + num(a[0] - 3) + ' ' + num(a[1]) + 'h6M' + num(b[0] - 3) + ' ' + num(b[1]) + 'h6'
        items.push({ k: m[2] - dk, type: 'bar', d, cx: m[0], cy: m[1] })
      }
    }
  }
  const rnd = rng(p.seed)
  const pl = []
  if (p.anch && p.anch.obs) pl.push(p.anch.obs)
  let tries = 0
  while (pl.length < p.pts && tries++ < 4000) { const uu = rnd() * 2 - 1, vv = rnd() * 2 - 1; if (rnd() < dens(uu, vv) * 0.9 + 0.05) pl.push([uu, vv]) }
  for (const q of pl) {
    const z = f(q[0], q[1]) + (rnd() - 0.5) * 0.22 + 0.03, m = P(q[0], q[1], Math.max(z, 0.02))
    items.push({ k: m[2] - dk * 1.3, type: 'pt', cx: m[0], cy: m[1] })
  }
  items.sort((x, y) => y.k - x.k)

  // Merge consecutive polygons (and threshold segments) of the same class into one <path>.
  const out = []
  let run = null
  const flush = () => { if (run) { out.push(`<path class="${run.cls}" d="${run.d}"/>`); run = null } }
  for (const it of items) {
    if (it.type === 'poly' || it.type === 'thr') {
      const cls = it.type === 'thr' ? 't' : it.cls
      if (run && run.cls === cls) run.d += it.d
      else { flush(); run = { cls, d: it.d } }
    } else {
      flush()
      if (it.type === 'bar') out.push(`<path class="b" d="${it.d}"/><circle cx="${num(it.cx)}" cy="${num(it.cy)}" r="1.7" fill="${C.sand}"/>`)
      else out.push(`<circle cx="${num(it.cx)}" cy="${num(it.cy)}" r="1.9" fill="${C.ivory}" fill-opacity=".92"/>`)
    }
  }
  flush()

  // Annotation anchors (viewBox units).
  const anchors = {}
  if (p.anch) {
    for (const k of Object.keys(p.anch)) {
      const a = p.anch[k]
      let u, v
      if (k === 'thr') {
        v = a[0]
        let prev = null
        for (u = a[1]; u <= a[2]; u += 0.004) { const d = f(u, v) - t; if (prev !== null && prev * d < 0) break; prev = d }
      } else { u = a[0]; v = a[1] }
      let z = f(u, v)
      if (k === 'obs') z += 0.03
      anchors[k] = P(u, v, z)
    }
  }
  let extra = ''
  if (leaders && p.lab) {
    for (const k of p.order) {
      const a = anchors[k], lb = p.lab[k], end = lb[2] === 'e', lx = lb[0], ly = lb[1], ex = lx + (end ? 10 : -10)
      extra += `<circle cx="${num(a[0])}" cy="${num(a[1])}" r="5" fill="none" stroke="${C.sand}" stroke-width="1"/>` +
        `<path d="M${num(a[0])} ${num(a[1])}L${num(ex)} ${num(ly)}L${num(lx)} ${num(ly)}" fill="none" stroke="${C.mist}" stroke-opacity=".7" stroke-width=".9"/>`
    }
  }

  const css = [
    `.c0,.c1,.c2,.c3,.c4,.c5,.c6,.c7,.c8,.h0,.h1,.h2,.h3,.h4{stroke-width:${p.sw || 0.6};stroke-linejoin:round}`,
    ...Array.from({ length: LV + 1 }, (_, l) => { const h = l / LV; return `.c${l}{fill:${mix(C.bg, C.hi, h * 0.2)};stroke:${mix(C.lo, C.hi, Math.pow(h, 0.75))};stroke-opacity:${(0.42 + 0.45 * h).toFixed(2).replace(/^0/, '')}}` }),
    ...Array.from({ length: HV + 1 }, (_, l) => { const h = l / HV; return `.h${l}{fill:${mix(C.bg, C.warm, 0.07 + h * 0.2)};stroke:${C.warm};stroke-opacity:${(0.5 + 0.35 * h).toFixed(2).replace(/^0/, '')}}` }),
    `.t{fill:none;stroke:#F6E3BF;stroke-width:1.7;stroke-linecap:round}`,
    `.b{fill:none;stroke:#C9DDE1;stroke-opacity:.85;stroke-width:1}`,
  ].join('')
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity
  for (const row of ps) for (const q of row) { x0 = Math.min(x0, q[0]); x1 = Math.max(x1, q[0]); y0 = Math.min(y0, q[1]); y1 = Math.max(y1, q[1]) }
  return { body: `<style>${css}</style>${out.join('')}${extra}`, anchors, bounds: { x0, x1, y0, y1 } }
}

const svgOpen = (W, H, extra = '') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}"${extra}>`

/** Forecast fan (conceptual): observed series, a median forecast and 50 % / 90 % bands. Geometry only. */
export function fan() {
  const W = 540, H = 214, r = rng(5), padL = 8, padR = 8, top = 18, bot = H - 24, n = 140, t0 = 0.5
  const x = (t) => padL + t * (W - padL - padR)
  const seas = (t) => 0.52 + 0.17 * Math.sin(2 * Math.PI * t * 6.2) + 0.12 * t
  const y = (v) => top + (1 - v) * (bot - top)
  const obs = []
  for (let i = 0; i <= n; i += 1) { const t = (i / n) * t0; obs.push(seas(t) + (r() - 0.5) * 0.07) }
  const med = [], sg = [], m = 60
  for (let i = 0; i <= m; i += 1) { const t = t0 + (1 - t0) * (i / m); med.push(seas(t)); sg.push(0.012 + 0.17 * Math.sqrt(i / m)) }
  const bandPath = (z) => {
    const up = [], lo = []
    for (let i = 0; i <= m; i += 1) { const t = t0 + (1 - t0) * (i / m); up.push(num(x(t)) + ' ' + num(y(med[i] + z * sg[i]))); lo.push(num(x(t)) + ' ' + num(y(med[i] - z * sg[i]))) }
    return 'M' + up.join('L') + 'L' + lo.reverse().join('L') + 'Z'
  }
  let s = svgOpen(W, H)
  let axis = `M${padL} ${bot}H${W - padR}`
  for (let i = 0; i <= 20; i += 1) axis += `M${num(x(i / 20))} ${bot}v${i % 5 ? 3 : 6}`
  s += `<path d="${axis}" fill="none" stroke="${C.mist}" stroke-opacity=".38"/>`
  s += `<path d="${bandPath(1.64)}" fill="${C.petrol}" fill-opacity=".42"/><path d="${bandPath(0.67)}" fill="${C.mist}" fill-opacity=".26"/>`
  let paths = ''
  for (let k = 0; k < 26; k += 1) {
    const ph1 = r() * 6.28, ph2 = r() * 6.28, a1 = 0.5 + r() * 0.6, a2 = 0.3 + r() * 0.5, d = []
    for (let i = 0; i <= m; i += 1) { const q = i / m, t = t0 + (1 - t0) * q, off = sg[i] * 1.3 * (a1 * Math.sin(ph1 + q * 5) + a2 * Math.sin(ph2 + q * 11)); d.push(num(x(t)) + ' ' + num(y(med[i] + off))) }
    paths += 'M' + d.join('L')
  }
  s += `<path d="${paths}" fill="none" stroke="${C.mist}" stroke-opacity=".28" stroke-width=".7"/>`
  s += `<path d="M${med.map((v, i) => num(x(t0 + (1 - t0) * (i / m))) + ' ' + num(y(v))).join('L')}" fill="none" stroke="${C.sand}" stroke-width="1.7"/>`
  s += `<path d="M${obs.map((v, i) => num(x((i / n) * t0)) + ' ' + num(y(v))).join('L')}" fill="none" stroke="${C.ivory}" stroke-width="1.3" stroke-linejoin="round"/>`
  s += `<path d="M${num(x(t0))} ${top - 6}V${bot}" stroke="${C.warm}" stroke-dasharray="3 3" stroke-opacity=".9"/>`
  return { svg: s + '</svg>', meta: { W, H, split: x(t0) / W, top: (top + 4) / H } }
}

/** Data-quality mosaic (conceptual): raw, cleaned, reliable. Geometry only. */
export function mosaic() {
  const W = 540, H = 170, r = rng(11), rows = 9, pad = 10, lab = 22
  const s0 = (H - 2 * pad - lab) / rows, cols = Math.floor((W - 2 * pad) / s0), gap = 2.2
  const tones = ['#2B5563', '#3A6B7A', '#4D8392', '#35606E', '#5E8792']
  const ox = (W - cols * s0) / 2, oy = pad, b1 = Math.round(cols / 3), b2 = Math.round((cols * 2) / 3)
  const rects = []
  const sz = num(s0 - gap)
  const holl = []
  for (let c = 0; c < cols; c += 1) {
    const z = c < b1 ? 0 : c < b2 ? 1 : 2, base = tones[c % 5]
    for (let q = 0; q < rows; q += 1) {
      const p = r(), x = ox + c * s0, y = oy + q * s0, jit = z === 0 ? (r() - 0.5) * 1.6 : 0
      const hollow = z === 0 ? p < 0.17 : z === 1 ? p < 0.05 : false
      const flag = z === 0 ? p > 0.94 : z === 1 ? p > 0.985 : false
      if (hollow) holl.push(`M${num(x + jit + 0.6)} ${num(y + 0.6)}h${num(s0 - gap - 0.6)}v${num(s0 - gap - 0.6)}h-${num(s0 - gap - 0.6)}z`)
      else {
        const fill = flag ? C.warm : z === 2 ? '#5E8792' : base
        const op = flag ? 0.95 : z === 2 ? 0.72 : 0.3 + r() * 0.5
        rects.push(`<rect x="${num(x + jit)}" y="${num(y)}" width="${sz}" height="${sz}" fill="${fill}" fill-opacity="${op.toFixed(2).replace(/^0/, '')}"/>`)
      }
    }
  }
  const s = svgOpen(W, H) + rects.join('') + `<path d="${holl.join('')}" fill="none" stroke="${C.mist}" stroke-opacity=".45" stroke-width=".8" stroke-dasharray="2 2"/></svg>`
  return { svg: s, meta: { W, H, cols: [0, b1 * s0 + ox, b2 * s0 + ox].map((v) => v / W), bottom: (H - 6) / H } }
}

/** Seam between a dark section and a paper section: contour lines along an undulating edge. */
export function seam() {
  const W = 1440, H = 110, ka = H / 110
  const yy = (x, k) => H * 0.52 - k * 13 * ka + (26 * Math.sin(x / 190 + 1) + 14 * Math.sin(x / 71 + k * 0.4) + 10 * Math.sin(x / 430 + 2)) * ka
  let s = svgOpen(W, H, ' preserveAspectRatio="none"') + `<rect width="${W}" height="${H}" fill="${C.bg}"/>`
  for (let k = 5; k >= 1; k -= 1) {
    const d = []
    for (let x = 0; x <= W; x += 12) d.push(x + ' ' + num(yy(x, k)))
    s += `<path d="M${d.join('L')}" fill="none" stroke="${C.mist}" stroke-opacity="${(0.08 + 0.05 * (5 - k)).toFixed(2).replace(/^0/, '')}" stroke-width=".9" vector-effect="non-scaling-stroke"/>`
  }
  const d0 = []
  for (let x = 0; x <= W; x += 6) d0.push(x + ' ' + num(yy(x, 0)))
  s += `<path d="M${d0.join('L')}L${W} ${H}L0 ${H}Z" fill="${C.paper}"/>`
  s += `<path d="M${d0.join('L')}" fill="none" stroke="${C.sand}" stroke-opacity=".55" stroke-width="1" vector-effect="non-scaling-stroke"/>`
  return { svg: s + '</svg>' }
}

/** The four journey glyphs as one sprite: explore, model, evaluate, decide (44 x 44 each). */
export function glyphs() {
  const r = rng(4)
  const dots = []
  for (let i = 0; i < 14; i += 1) dots.push(`<circle cx="${num(6 + r() * 32)}" cy="${num(6 + r() * 32)}" r="1.5" fill="${C.ivory}" fill-opacity=".85"/>`)
  const explore = dots.join('') + `<rect x="3" y="3" width="38" height="38" fill="none" stroke="${C.mist}" stroke-opacity=".4" stroke-dasharray="2 3"/>`
  const model = surface(GLYPH, { leaders: false }).body
  const evalu = [[10, 12, 30], [22, 8, 26], [34, 16, 34]].map((b) =>
    `<path d="M${b[0]} ${b[1]}V${b[2]}M${b[0] - 4} ${b[1]}h8M${b[0] - 4} ${b[2]}h8" stroke="${C.mist}" stroke-width="1.2" fill="none"/><circle cx="${b[0]}" cy="${(b[1] + b[2]) / 2}" r="2" fill="${C.sand}"/>`).join('')
  const decide = `<path d="M3 36C14 36 18 30 22 22S32 8 41 7" fill="none" stroke="${C.mist}" stroke-width="1.3"/><path d="M3 20H41" stroke="${C.warm}" stroke-dasharray="3 3"/><circle cx="23" cy="20" r="3.2" fill="${C.sand}"/>`
  const sym = (id, body) => `<symbol id="${id}" viewBox="0 0 44 44">${body}</symbol>`
  return { svg: `<svg xmlns="http://www.w3.org/2000/svg">${sym('explore', explore)}${sym('model', model)}${sym('evaluate', evalu)}${sym('decide', decide)}</svg>` }
}

/** Bounding box of a preset's mesh, for tuning it to its viewBox. */
export function surfaceBounds(p) {
  return surface(p, { leaders: false }).bounds
}

export function buildAll() {
  const hero = surface(HERO, { leaders: true })
  const phone = surface(PHONE, { leaders: false })
  const pct = (v, total) => Math.round((v / total) * 1000) / 10
  const meta = {
    hero: {
      W: HERO.W, H: HERO.H,
      labels: HERO.order.map((k) => {
        const [lx, ly, al] = HERO.lab[k]
        const end = al === 'e'
        return { id: k, side: end ? 'end' : 'start', x: pct(end ? lx - 8 : lx + 8, HERO.W), y: pct(ly - 30, HERO.H) }
      }),
    },
    phone: { W: PHONE.W, H: PHONE.H },
  }
  const f = fan()
  const m = mosaic()
  meta.fan = { W: f.meta.W, H: f.meta.H, split: Math.round(f.meta.split * 1000) / 1000, top: Math.round(f.meta.top * 1000) / 1000 }
  meta.mosaic = { W: m.meta.W, H: m.meta.H, cols: m.meta.cols.map((v) => Math.round(v * 1000) / 1000), bottom: Math.round(m.meta.bottom * 1000) / 1000 }
  const files = {
    'public/figures/surface-hero.svg': svgOpen(HERO.W, HERO.H) + hero.body + '</svg>',
    'public/figures/surface-compact.svg': svgOpen(PHONE.W, PHONE.H) + phone.body + '</svg>',
    'public/figures/forecast-fan.svg': f.svg,
    'public/figures/quality-mosaic.svg': m.svg,
    'public/figures/seam.svg': seam().svg,
    'public/figures/journey-glyphs.svg': glyphs().svg,
    'src/components/home/figureMeta.js':
      `// Generated by tools/figures/build-figures.mjs — do not edit.\n` +
      `// Where the HTML labels of each figure sit, in percent of the figure box.\n` +
      `export const FIGURE_META = ${JSON.stringify(meta, null, 2)}\n`,
  }
  return files
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const check = process.argv.includes('--check')
  let bad = 0
  for (const [rel, content] of Object.entries(buildAll())) {
    const file = path.join(root, rel)
    if (check) {
      if (!fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== content) { console.error('differs: ' + rel); bad += 1 }
    } else {
      fs.mkdirSync(path.dirname(file), { recursive: true })
      fs.writeFileSync(file, content)
      console.log(rel.padEnd(44), String(Buffer.byteLength(content)).padStart(8), 'B')
    }
  }
  if (bad) process.exit(1)
}
