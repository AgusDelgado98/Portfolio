// F12 About CLS check — cold #about vs internal nav. Edge CDP.
// Usage: node cls-about.mjs <baseUrl> <outJson> [port]
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const [base, outJson, portArg] = process.argv.slice(2)
const port = Number(portArg || 9551)
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'edge-f12-cls-'))
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

const out = { kind: 'laboratory-observed-cls', pages: {}, note: 'Not RUM. Threshold for About cold CLS: <= 0.1' }
const THRESHOLD = 0.1

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
  const setWidth = (width) =>
    cdp.send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: width < 800 ? 2 : 1, mobile: width < 800 })

  const measureCls = async (label, width, setup) => {
    await setWidth(width)
    await cdp.send('Network.clearBrowserCache').catch(() => {})
    await cdp.send('Page.navigate', { url: 'about:blank' })
    await sleep(200)
    await setup()
    const result = await ev(`(() => new Promise((resolve) => {
      let cls = 0
      const shifts = []
      try {
        new PerformanceObserver((list) => {
          for (const e of list.getEntries()) {
            if (e.hadRecentInput) continue
            cls += e.value
            shifts.push({
              value: Number(e.value.toFixed(4)),
              sources: (e.sources || []).slice(0, 3).map((s) => ({
                tag: s.node?.nodeName || null,
                className: typeof s.node?.className === 'string' ? s.node.className.slice(0, 80) : null,
              })),
            })
          }
        }).observe({ type: 'layout-shift', buffered: true })
      } catch {}
      setTimeout(() => {
        resolve({
          cls: Number(cls.toFixed(4)),
          h1: document.querySelector('h1')?.textContent?.replace(/\\s+/g, ' ').trim()?.slice(0, 80) || null,
          about: !!document.querySelector('.ds-about-page'),
          fallback: !!document.querySelector('.ds-about-fallback'),
          shifts: shifts.slice(0, 8),
        })
      }, 4500)
    }))()`)
    console.log(`${label}@${width}`, result)
    return result
  }

  for (const width of [390, 1440]) {
    const cold = []
    for (let i = 1; i <= 3; i += 1) {
      cold.push(await measureCls(`cold-${i}`, width, async () => {
        await cdp.send('Page.navigate', { url: `${base}/#about` })
      }))
    }
    const internal = []
    for (let i = 1; i <= 3; i += 1) {
      internal.push(await measureCls(`internal-${i}`, width, async () => {
        await cdp.send('Page.navigate', { url: `${base}/#home` })
        await sleep(2000)
        await ev(`document.querySelector('a[href="#about"]')?.focus()`)
        await sleep(400)
        await cdp.send('Page.navigate', { url: `${base}/#about` })
      }))
    }
    const median = (arr) => {
      const s = [...arr].sort((a, b) => a - b)
      return s[Math.floor(s.length / 2)]
    }
    out.pages[`about@${width}`] = {
      cold: { runs: cold, medianCls: median(cold.map((r) => r.cls)) },
      internal: { runs: internal, medianCls: median(internal.map((r) => r.cls)) },
      pass:
        median(cold.map((r) => r.cls)) <= THRESHOLD &&
        median(internal.map((r) => r.cls)) <= THRESHOLD &&
        cold.every((r) => r.about) &&
        internal.every((r) => r.about),
    }
  }

  fs.mkdirSync(path.dirname(outJson), { recursive: true })
  fs.writeFileSync(outJson, JSON.stringify(out, null, 2))
  const failed = Object.entries(out.pages).filter(([, v]) => !v.pass)
  console.log(failed.length ? `FAIL ${failed.map(([k]) => k).join(', ')}` : 'PASS all About CLS checks')
  if (failed.length) process.exitCode = 1
} catch (err) {
  console.error(err)
  process.exitCode = 1
} finally {
  edge.kill()
  try { fs.rmSync(profile, { recursive: true, force: true }) } catch {}
}
