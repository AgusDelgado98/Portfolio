// F11 observed (lab, not RUM) paint metrics via CDP PerformanceObserver.
// Distinct from Lighthouse simulated throttling. Usage:
//   node observed-metrics.mjs <baseUrl> <outJson> [port]
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const [base, outJson, portArg] = process.argv.slice(2)
const port = Number(portArg || 9542)
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'edge-f11o-'))
const edge = spawn(EDGE, [
  '--headless=new',
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${profile}`,
  '--no-first-run',
  '--disable-gpu',
  'about:blank',
], { stdio: 'ignore' })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

class Cdp {
  constructor(url) { this.id = 0; this.pending = new Map(); this.ws = new WebSocket(url) }
  open() {
    return new Promise((res, rej) => {
      this.ws.onopen = res
      this.ws.onerror = rej
      this.ws.onmessage = (e) => {
        const m = JSON.parse(e.data)
        if (m.id && this.pending.has(m.id)) {
          const { res, rej } = this.pending.get(m.id)
          this.pending.delete(m.id)
          m.error ? rej(new Error(m.error.message)) : res(m.result)
        }
      }
    })
  }
  send(method, params = {}) {
    const id = ++this.id
    this.ws.send(JSON.stringify({ id, method, params }))
    return new Promise((res, rej) => this.pending.set(id, { res, rej }))
  }
}

const pages = [
  { id: 'home', hash: '#home' },
  { id: 'projects', hash: '#projects' },
  { id: 'about', hash: '#about' },
  { id: 'case-demand', hash: '#projects/providentia/demand-forecasting' },
]

const out = { kind: 'laboratory-observed-cdp', note: 'No network/CPU throttle. Not field data.', pages: {} }

try {
  for (let i = 0; i < 60; i += 1) {
    try { if ((await fetch(`http://127.0.0.1:${port}/json/version`)).ok) break } catch {}
    await sleep(250)
  }
  const tab = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' })).json()
  const cdp = new Cdp(tab.webSocketDebuggerUrl)
  await cdp.open()
  await cdp.send('Page.enable')
  await cdp.send('Runtime.enable')
  const ev = async (expression) => {
    const r = await cdp.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.text || '')
    return r.result.value
  }

  for (const page of pages) {
    const runs = []
    for (let i = 1; i <= 3; i += 1) {
      await cdp.send('Network.clearBrowserCache').catch(() => {})
      await cdp.send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true })
      await cdp.send('Page.navigate', { url: 'about:blank' })
      await sleep(200)
      await cdp.send('Page.navigate', { url: `${base}/${page.hash}` })
      const metrics = await ev(`(() => new Promise((resolve) => {
        const done = (extra = {}) => {
          const nav = performance.getEntriesByType('navigation')[0]
          const paints = Object.fromEntries(performance.getEntriesByType('paint').map((p) => [p.name, Math.round(p.startTime)]))
          const lcpEntries = performance.getEntriesByType('largest-contentful-paint')
          const lcp = lcpEntries[lcpEntries.length - 1]
          let cls = 0
          for (const e of performance.getEntriesByType('layout-shift')) if (!e.hadRecentInput) cls += e.value
          resolve({
            fcp: paints['first-contentful-paint'] || null,
            lcp: lcp ? Math.round(lcp.startTime) : null,
            lcpTag: lcp?.element ? lcp.element.tagName + (lcp.element.className ? '.' + String(lcp.element.className).split(' ')[0] : '') : null,
            cls: Number(cls.toFixed(4)),
            load: nav ? Math.round(nav.loadEventEnd) : null,
            ...extra,
          })
        }
        try {
          let lcp = null
          new PerformanceObserver((list) => { const e = list.getEntries(); lcp = e[e.length - 1] }).observe({ type: 'largest-contentful-paint', buffered: true })
          new PerformanceObserver((list) => { /* buffered CLS */ }).observe({ type: 'layout-shift', buffered: true })
          setTimeout(() => done(), 3500)
        } catch (err) {
          setTimeout(() => done({ error: String(err) }), 3500)
        }
      }))()`)
      runs.push({ run: i, ...metrics })
      console.log(`${page.id} run ${i}`, metrics)
    }
    out.pages[page.id] = { runs }
  }

  fs.mkdirSync(path.dirname(outJson), { recursive: true })
  fs.writeFileSync(outJson, JSON.stringify(out, null, 2))
  console.log('Wrote', outJson)
} catch (err) {
  console.error(err)
  process.exitCode = 1
} finally {
  edge.kill()
  try { fs.rmSync(profile, { recursive: true, force: true }) } catch {}
}
