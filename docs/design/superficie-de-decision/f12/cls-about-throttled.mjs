// Throttled About CLS (closer to Lighthouse lab conditions).
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const [base, outJson, portArg] = process.argv.slice(2)
const port = Number(portArg || 9552)
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'edge-f12t-'))
const edge = spawn(EDGE, [
  '--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`,
  '--no-first-run', '--disable-gpu', 'about:blank',
], { stdio: 'ignore' })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

class Cdp {
  constructor(url) { this.id = 0; this.pending = new Map(); this.ws = new WebSocket(url) }
  open() {
    return new Promise((res, rej) => {
      this.ws.onopen = res; this.ws.onerror = rej
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

try {
  for (let i = 0; i < 60; i += 1) {
    try { if ((await fetch(`http://127.0.0.1:${port}/json/version`)).ok) break } catch {}
    await sleep(250)
  }
  const tab = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' })).json()
  const cdp = new Cdp(tab.webSocketDebuggerUrl)
  await cdp.open()
  await cdp.send('Page.enable'); await cdp.send('Runtime.enable'); await cdp.send('Network.enable')
  await cdp.send('Network.emulateNetworkConditions', {
    offline: false, latency: 150, downloadThroughput: 1.6 * 1024 * 1024 / 8, uploadThroughput: 750 * 1024 / 8, connectionType: 'cellular3g',
  })
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true })

  const runs = []
  for (let i = 1; i <= 3; i += 1) {
    await cdp.send('Network.clearBrowserCache').catch(() => {})
    await cdp.send('Page.navigate', { url: 'about:blank' })
    await sleep(300)
    await cdp.send('Page.navigate', { url: `${base}/#about` })
    const result = await cdp.send('Runtime.evaluate', {
      returnByValue: true,
      awaitPromise: true,
      expression: `(() => new Promise((resolve) => {
        let cls = 0
        const shifts = []
        try {
          new PerformanceObserver((list) => {
            for (const e of list.getEntries()) {
              if (e.hadRecentInput) continue
              cls += e.value
              const src = (e.sources || [])[0]
              shifts.push({
                v: Number(e.value.toFixed(4)),
                t: Math.round(e.startTime),
                node: src?.node ? (src.node.nodeName + '.' + (src.node.className || '').toString().split(' ')[0]) : null,
              })
            }
          }).observe({ type: 'layout-shift', buffered: true })
        } catch {}
        const done = () => resolve({
          cls: Number(cls.toFixed(4)),
          about: !!document.querySelector('.ds-about-page'),
          fallbackSeen: !!document.querySelector('.ds-about-fallback'),
          h1: document.querySelector('h1')?.textContent?.trim()?.slice(0, 60) || null,
          shifts,
        })
        // Wait for about + settle under throttle
        const start = performance.now()
        const tick = () => {
          if (document.querySelector('.ds-about-page') && performance.now() - start > 2000) {
            setTimeout(done, 3000)
          } else if (performance.now() - start > 15000) done()
          else setTimeout(tick, 200)
        }
        tick()
      }))()`,
    })
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text || '')
    runs.push(result.result.value)
    console.log('run', i, runs[i - 1])
  }
  fs.mkdirSync(path.dirname(outJson), { recursive: true })
  fs.writeFileSync(outJson, JSON.stringify({ runs }, null, 2))
} catch (e) {
  console.error(e)
  process.exitCode = 1
} finally {
  edge.kill()
  try { fs.rmSync(profile, { recursive: true, force: true }) } catch {}
}
