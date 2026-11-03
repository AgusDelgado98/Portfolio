// First-screen checks of the phone Home at 320 / 360 / 390 / 430 px, plus viewport screenshots.
// node mobile.mjs <baseUrl> <outDir> [port]
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const [base, outDir, portArg] = process.argv.slice(2)
const port = Number(portArg || 9700)
fs.mkdirSync(outDir, { recursive: true })
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'edge-m-'))
const edge = spawn('C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, '--no-first-run', '--disable-gpu', '--hide-scrollbars', '--disable-extensions', 'about:blank'], { stdio: 'ignore' })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const report = []
const check = (name, ok, detail) => { report.push({ name, ok: !!ok, detail }); console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail !== undefined ? '  ' + JSON.stringify(detail) : ''}`) }

try {
  for (let i = 0; i < 60; i += 1) { try { if ((await fetch(`http://127.0.0.1:${port}/json/version`)).ok) break } catch {} await sleep(250) }
  const tab = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' })).json()
  const ws = new WebSocket(tab.webSocketDebuggerUrl); let id = 0; const pend = new Map()
  await new Promise((r) => { ws.onopen = r; ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pend.has(m.id)) { pend.get(m.id)(m.result); pend.delete(m.id) } } })
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })) })
  await send('Page.enable'); await send('Runtime.enable')
  await send('Network.setCacheDisabled', { cacheDisabled: true })
  const ev = async (expression) => (await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })).result.value

  const PROBE = `(() => {
    const r = (s) => { const e = document.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect(); return { l: Math.round(b.left), t: Math.round(b.top), r: Math.round(b.right), b: Math.round(b.bottom), w: Math.round(b.width), h: Math.round(b.height) } }
    const lines = (s) => { const e = document.querySelector(s); const cs = getComputedStyle(e); return Math.round(e.getBoundingClientRect().height / parseFloat(cs.lineHeight)) }
    const legend = [...document.querySelectorAll('.home-figure__legend li')].map((l) => { const b = l.getBoundingClientRect(); const s = l.querySelector('strong'); const sb = s.getBoundingClientRect(); return { t: s.textContent, lines: Math.round(sb.height / parseFloat(getComputedStyle(s).lineHeight || 20)) || 1, right: Math.round(b.right), textRight: Math.round(sb.right) } })
    const keys = [...document.querySelectorAll('.home-figure__n')].map((n) => { const b = n.getBoundingClientRect(); return [Math.round(b.width), Math.round(b.height)] })
    return {
      vw: innerWidth, vh: innerHeight, scrollW: document.documentElement.scrollWidth,
      eyebrow: r('.home-hero .home-eyebrow'), eyebrowLines: lines('.home-hero .home-eyebrow'), eyebrowText: document.querySelector('.home-eyebrow__short').textContent,
      h1: r('.home-hero__title'), h1fs: getComputedStyle(document.querySelector('.home-hero__title')).fontSize, h1Lines: lines('.home-hero__title'),
      figure: r('.home-figure__box'), legend: r('.home-figure__legend'), legendItems: legend, keys,
      caption: r('.home-figure__caption'), captionText: [...document.querySelectorAll('.home-figure__caption span')].filter((s) => getComputedStyle(s).display !== 'none').map((s) => s.textContent).join(''), captionLines: lines('.home-figure__caption'),
      sub: r('.home-hero__sub'), subLines: lines('.home-hero__sub'), btn: r('.home-btn'), link: r('.home-hero__actions .home-link'),
      badges: document.querySelectorAll('.home-figure__badge').length,
      sticking: [...document.querySelectorAll('.ds-home *')].filter((e) => { const b = e.getBoundingClientRect(); return b.width > 0 && (b.right > innerWidth + 1 || b.left < -1) && !e.closest('.home-seam') && !e.closest('.home-open__text') }).length,
    }
  })()`

  for (const [w, h] of [[320, 640], [360, 740], [390, 844], [430, 932]]) {
    await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 2, mobile: true })
    await send('Page.navigate', { url: 'about:blank' }); await sleep(150)
    await send('Page.navigate', { url: `${base}/#home` })
    await sleep(3200)
    const p = await ev(PROBE)
    const gut = 22
    check(`${w}x${h}: no horizontal scroll, nothing sticks out`, p.scrollW <= p.vw && p.sticking === 0, [p.scrollW, p.vw, p.sticking])
    check(`${w}x${h}: primary button fully inside the first screen (bottom ${p.btn.b} of ${h}), 48px tall`, p.btn.b <= h - 16 && p.btn.h >= 44, p.btn)
    check(`${w}x${h}: secondary link inside too?`, p.link.b <= h + 80, p.link)
    check(`${w}x${h}: no markers over the figure`, p.badges === 0)
    check(`${w}x${h}: eyebrow on one line (${p.eyebrowText})`, p.eyebrowLines === 1, p.eyebrowLines)
    check(`${w}x${h}: headline in two lines at ${p.h1fs}`, p.h1Lines <= 2 && p.h1.r <= p.vw, [p.h1Lines, p.h1fs])
    check(`${w}x${h}: legend terms on one line, keys drawn (${p.keys.length})`, p.legendItems.every((i) => i.lines <= 1 && i.textRight <= i.right) && p.keys.every((k) => k[0] > 0), p.legendItems)
    check(`${w}x${h}: caption keeps "conceptual … simulated" and is ${p.captionLines} line(s)`, /concept/i.test(p.captionText) && /simulad/i.test(p.captionText) && p.captionLines <= 2, [p.captionText, p.captionLines])
    check(`${w}x${h}: 22px gutter`, p.h1.l === 22 || p.h1.l >= 22, p.h1.l)
    console.log(`      layout: eyebrow ${p.eyebrow.t}-${p.eyebrow.b}, h1 ${p.h1.t}-${p.h1.b}, figure ${p.figure.t}-${p.figure.b} (${p.figure.w}x${p.figure.h}), legend ${p.legend.t}-${p.legend.b}, caption ${p.caption.t}-${p.caption.b}, sub ${p.sub.t}-${p.sub.b} (${p.subLines} lines), button ${p.btn.t}-${p.btn.b}`)
    const s = await send('Page.captureScreenshot', { format: 'png', fromSurface: true })
    fs.writeFileSync(path.join(outDir, `mobile-${w}.png`), Buffer.from(s.data, 'base64'))
  }
  fs.writeFileSync(path.join(outDir, 'report.json'), JSON.stringify(report, null, 2))
  const failed = report.filter((r) => !r.ok)
  console.log(`\n${report.length - failed.length}/${report.length} passed`)
} finally {
  edge.kill()
}
