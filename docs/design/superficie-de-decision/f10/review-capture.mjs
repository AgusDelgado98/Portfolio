// Integrated visual review captures (pre-F10). Edge headless.
// Usage: node review-capture.mjs <baseUrl> <outDir> [port]
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const [base, outDir, portArg] = process.argv.slice(2)
const port = Number(portArg || 9530)
fs.mkdirSync(outDir, { recursive: true })
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'edge-f10r-'))
const edge = spawn(EDGE, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, '--no-first-run', '--disable-gpu', '--hide-scrollbars', '--disable-extensions', 'about:blank'], { stdio: 'ignore' })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

class Cdp {
  constructor(url) { this.id = 0; this.pending = new Map(); this.ws = new WebSocket(url) }
  open() { return new Promise((res, rej) => { this.ws.onopen = res; this.ws.onerror = rej; this.ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && this.pending.has(m.id)) { const { res, rej } = this.pending.get(m.id); this.pending.delete(m.id); m.error ? rej(new Error(m.error.message)) : res(m.result) } } }) }
  send(method, params = {}) { const id = ++this.id; this.ws.send(JSON.stringify({ id, method, params })); return new Promise((res, rej) => this.pending.set(id, { res, rej })) }
}

const pages = [
  ['#home', 'home'],
  ['#projects', 'projects'],
  ['#about', 'about'],
  ['#contact', 'contact'],
  ['#projects/providentia', 'detail-providentia'],
  ['#projects/providentia/demand-forecasting', 'case-demand-forecasting'],
]

const report = []
const check = (name, ok, detail) => { report.push({ name, ok: !!ok, detail }); console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail !== undefined ? '  ' + JSON.stringify(detail) : ''}`) }

try {
  for (let i = 0; i < 60; i += 1) { try { if ((await fetch(`http://127.0.0.1:${port}/json/version`)).ok) break } catch {} await sleep(250) }
  const tab = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' })).json()
  const cdp = new Cdp(tab.webSocketDebuggerUrl)
  await cdp.open()
  await cdp.send('Page.enable'); await cdp.send('Runtime.enable')
  const ev = async (expression) => { const r = await cdp.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }); if (r.exceptionDetails) throw new Error(r.exceptionDetails.text || ''); return r.result.value }
  const metrics = (width, height, mobile) => cdp.send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile })
  const go = async (hash, width) => {
    await metrics(width, 900, width < 800)
    await cdp.send('Page.navigate', { url: `${base}/${hash}` })
    await sleep(3200)
  }
  const fullShot = async (name, width) => {
    const m = await cdp.send('Page.getLayoutMetrics')
    const h = Math.min(Math.ceil(m.cssContentSize.height), 8000)
    await metrics(width, h, width < 800)
    await sleep(400)
    const s = await cdp.send('Page.captureScreenshot', { format: 'png', fromSurface: true })
    fs.writeFileSync(path.join(outDir, `${name}-${width}.png`), Buffer.from(s.data, 'base64'))
    await metrics(width, 900, width < 800)
  }

  for (const width of [1440, 390]) {
    for (const [hash, name] of pages) {
      await go(hash, width)
      const probe = await ev(`(() => {
        const vw = innerWidth
        const wide = [...document.querySelectorAll('main *')].filter((e) => {
          const r = e.getBoundingClientRect()
          return r.width > 0 && (r.right > vw + 1 || r.left < -1) && getComputedStyle(e).position !== 'fixed' && !e.closest('.home-seam')
        }).slice(0, 4).map((e) => e.tagName + '.' + String(e.className).slice(0, 36))
        const fonts = {
          h1: getComputedStyle(document.querySelector('h1') || document.body).fontFamily,
          body: getComputedStyle(document.body).fontFamily,
        }
        const surface = document.documentElement.dataset.surface
        const caseShell = !!document.querySelector('.ds-case-shell, .ds-case-stage')
        const detail = !!document.querySelector('.ds-project-detail, .proj-detail, [class*="project-detail"]')
        return {
          scrollW: document.documentElement.scrollWidth, vw, wide, fonts, surface, caseShell, detail,
          decerno: /decerno/i.test(document.body.innerText),
          title: document.title,
          h1: document.querySelector('h1')?.textContent.replace(/\\s+/g, ' ').trim()?.slice(0, 80),
        }
      })()`)
      check(`${name}@${width}: no overflow`, probe.scrollW <= width + 1 && probe.wide.length === 0, { scrollW: probe.scrollW, wide: probe.wide })
      check(`${name}@${width}: no DECERNO`, !probe.decerno)
      check(`${name}@${width}: has h1`, !!probe.h1, probe.h1)
      await fullShot(name, width)
    }
  }

  // EN smoke on case + detail
  await go('#projects/providentia', 1440)
  await ev(`localStorage.setItem('portfolio-lang','en'); location.hash='#projects/providentia'; location.reload()`)
  await sleep(3200)
  const enDetail = await ev(`document.querySelector('h1')?.textContent.replace(/\\s+/g,' ').trim()`)
  check('EN detail h1', /providentia/i.test(enDetail || ''), enDetail)
  await fullShot('detail-providentia-en', 1440)

  await go('#projects/providentia/demand-forecasting', 1440)
  await ev(`localStorage.setItem('portfolio-lang','en'); location.hash='#projects/providentia/demand-forecasting'; location.reload()`)
  await sleep(3500)
  const enCase = await ev(`({
    h1: document.querySelector('h1')?.textContent.replace(/\\s+/g,' ').trim(),
    shell: !!document.querySelector('.ds-case-shell'),
    decerno: /decerno/i.test(document.body.innerText),
  })`)
  check('EN case shell', enCase?.shell, enCase)
  check('EN case no DECERNO', !enCase?.decerno)
  await fullShot('case-demand-forecasting-en', 1440)

  fs.writeFileSync(path.join(outDir, 'review-checks.json'), JSON.stringify(report, null, 2))
  const failed = report.filter((r) => !r.ok)
  console.log(`\n${report.length - failed.length}/${report.length} checks passed`)
  if (failed.length) process.exitCode = 1
} finally {
  edge.kill()
}
