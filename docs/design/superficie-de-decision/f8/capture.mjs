// F8 About checks and screenshots (Edge headless).
// Usage: node capture.mjs <baseUrl> <outDir> [port]
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const [base, outDir, portArg] = process.argv.slice(2)
const port = Number(portArg || 9521)
fs.mkdirSync(outDir, { recursive: true })
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'edge-f8-'))
const edge = spawn(EDGE, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, '--no-first-run', '--disable-gpu', '--hide-scrollbars', '--disable-extensions', 'about:blank'], { stdio: 'ignore' })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

class Cdp {
  constructor(url) { this.id = 0; this.pending = new Map(); this.ws = new WebSocket(url) }
  open() { return new Promise((res, rej) => { this.ws.onopen = res; this.ws.onerror = rej; this.ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && this.pending.has(m.id)) { const { res, rej } = this.pending.get(m.id); this.pending.delete(m.id); m.error ? rej(new Error(m.error.message)) : res(m.result) } } }) }
  send(method, params = {}) { const id = ++this.id; this.ws.send(JSON.stringify({ id, method, params })); return new Promise((res, rej) => this.pending.set(id, { res, rej })) }
}

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
  const go = async (hash, width, height = 900) => {
    await metrics(width, height, width < 800)
    await cdp.send('Page.navigate', { url: `${base}/${hash}` })
    await sleep(3200)
  }
  const fullShot = async (name, width) => {
    const m = await cdp.send('Page.getLayoutMetrics')
    const h = Math.min(Math.ceil(m.cssContentSize.height), 7000)
    await metrics(width, h, width < 800)
    await sleep(400)
    const s = await cdp.send('Page.captureScreenshot', { format: 'png', fromSurface: true })
    fs.writeFileSync(path.join(outDir, name + '.png'), Buffer.from(s.data, 'base64'))
    await metrics(width, 900, width < 800)
  }

  for (const [w, name] of [[1440, 'about-1440'], [390, 'about-390']]) {
    await go('#about', w)
    const probe = await ev(`(() => {
      const vw = innerWidth
      const wide = [...document.querySelectorAll('.ds-about-page *')].filter((e) => {
        const r = e.getBoundingClientRect()
        return r.width > 0 && (r.right > vw + 1 || r.left < -1) && getComputedStyle(e).position !== 'fixed' && !e.closest('.home-seam')
      }).slice(0, 5).map((e) => e.tagName + '.' + String(e.className).slice(0, 40))
      const h1 = document.querySelector('#about-title')?.textContent.replace(/\\s+/g, ' ').trim()
      const route = document.querySelector('.about-route img')?.currentSrc?.split('/').slice(-1)[0]
      const cols = [...document.querySelectorAll('.about-path__col .home-label, .about-path__heading')].map((n) => n.textContent.trim())
      const matrixRows = [...document.querySelectorAll('.about-matrix__name')].map((n) => n.textContent.trim())
      const body = document.body.innerText
      return {
        scrollW: document.documentElement.scrollWidth, vw, wide, h1, route, cols, matrixRows,
        partial: /dedicaci[oó]n parcial|partial dedication/i.test(body),
        datacamp: /DataCamp/.test(body),
        certificateNearCamp: /DataCamp[^\\n]{0,40}certific|certific[^\\n]{0,40}DataCamp/i.test(body),
        decerno: /decerno/i.test(body),
        causalRow: /inferencia causal|causal inference/i.test(document.querySelector('.about-matrix')?.innerText || ''),
        marks: document.querySelectorAll('.about-matrix__link .about-mark').length,
      }
    })()`)
    check(`${w}: no overflow`, probe.scrollW <= w + 1 && probe.wide.length === 0, { scrollW: probe.scrollW, wide: probe.wide })
    check(`${w}: title`, /ciencia de datos|data science/i.test(probe.h1 || ''), probe.h1)
    check(`${w}: EvolutionRoute asset`, probe.route === 'evolution-route.svg', probe.route)
    check(`${w}: three path areas`, probe.cols.length >= 3, probe.cols)
    check(`${w}: matrix rows`, probe.matrixRows.length === 4, probe.matrixRows)
    check(`${w}: partial dedication`, probe.partial)
    check(`${w}: DataCamp`, probe.datacamp)
    check(`${w}: no certificate next to DataCamp`, !probe.certificateNearCamp)
    check(`${w}: no DECERNO`, !probe.decerno)
    check(`${w}: no causal matrix row`, !probe.causalRow)
    check(`${w}: evidence marks`, probe.marks >= 6, probe.marks)
    await fullShot(name, w)
  }

  await go('#about', 1440)
  await ev(`localStorage.setItem('portfolio-lang','en'); location.hash='#about'; location.reload()`)
  await sleep(3500)
  const en = await ev(`({
    h1: document.querySelector('#about-title')?.textContent.replace(/\\s+/g,' ').trim(),
    partial: /partial dedication/i.test(document.body.innerText),
    datacamp: /DataCamp/.test(document.body.innerText),
    decerno: /decerno/i.test(document.body.innerText),
  })`)
  check('EN title', /data science/i.test(en?.h1 || ''), en?.h1)
  check('EN partial dedication', en?.partial)
  check('EN DataCamp', en?.datacamp)
  check('EN no DECERNO', !en?.decerno)
  await fullShot('about-1440-en', 1440)

  fs.writeFileSync(path.join(outDir, 'browser-checks.json'), JSON.stringify(report, null, 2))
  const failed = report.filter((r) => !r.ok)
  console.log(`\n${report.length - failed.length}/${report.length} checks passed`)
  if (failed.length) process.exitCode = 1
} finally {
  edge.kill()
}
