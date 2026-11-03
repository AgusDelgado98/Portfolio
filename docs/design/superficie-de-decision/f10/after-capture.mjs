// Post-F10 case/detail captures. Usage: node after-capture.mjs <baseUrl> <outDir> [port]
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const [base, outDir, portArg] = process.argv.slice(2)
const port = Number(portArg || 9531)
fs.mkdirSync(outDir, { recursive: true })
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'edge-f10a-'))
const edge = spawn(EDGE, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, '--no-first-run', '--disable-gpu', '--hide-scrollbars', '--disable-extensions', 'about:blank'], { stdio: 'ignore' })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

class Cdp {
  constructor(url) { this.id = 0; this.pending = new Map(); this.ws = new WebSocket(url) }
  open() { return new Promise((res, rej) => { this.ws.onopen = res; this.ws.onerror = rej; this.ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && this.pending.has(m.id)) { const { res, rej } = this.pending.get(m.id); this.pending.delete(m.id); m.error ? rej(new Error(m.error.message)) : res(m.result) } } }) }
  send(method, params = {}) { const id = ++this.id; this.ws.send(JSON.stringify({ id, method, params })); return new Promise((res, rej) => this.pending.set(id, { res, rej })) }
}

const cases = [
  '#projects/paradigm/no-show',
  '#projects/paradigm/operational-risk',
  '#projects/providentia/demand-forecasting',
  '#projects/providentia/capacity-decision',
  '#projects/providentia/policy-decision',
  '#projects/aletheia/evidence-case',
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
    await sleep(3000)
  }
  const fullShot = async (name, width) => {
    const m = await cdp.send('Page.getLayoutMetrics')
    const h = Math.min(Math.ceil(m.cssContentSize.height), 6000)
    await metrics(width, h, width < 800)
    await sleep(350)
    const s = await cdp.send('Page.captureScreenshot', { format: 'png', fromSurface: true })
    fs.writeFileSync(path.join(outDir, `${name}-${width}.png`), Buffer.from(s.data, 'base64'))
    await metrics(width, 900, width < 800)
  }

  for (const width of [1440, 390]) {
    for (const hash of cases) {
      await go(hash, width)
      const probe = await ev(`(() => {
        const stage = document.querySelector('.ds-case-stage')
        const chrome = document.querySelector('.ds-case-chrome')
        const bg = stage ? getComputedStyle(stage).backgroundColor : null
        const chromeBorder = chrome ? getComputedStyle(chrome).borderTopWidth : null
        return {
          shell: !!document.querySelector('.ds-case-shell'),
          stage: !!stage,
          h1: document.querySelector('h1')?.textContent.replace(/\\s+/g,' ').trim()?.slice(0, 90),
          bg,
          chromeBorder,
          scrollW: document.documentElement.scrollWidth,
          decerno: /decerno/i.test(document.body.innerText),
        }
      })()`)
      const name = hash.replace('#projects/', '').replace(/\//g, '-')
      check(`${name}@${width}: shell`, probe.shell && probe.stage)
      check(`${name}@${width}: h1`, !!probe.h1, probe.h1)
      check(`${name}@${width}: paper-ish bg`, /243,\s*238,\s*226|f3eee2/i.test(probe.bg || '') || probe.bg === 'rgb(243, 238, 226)', probe.bg)
      check(`${name}@${width}: no DECERNO`, !probe.decerno)
      check(`${name}@${width}: page width`, probe.scrollW <= width + 2, probe.scrollW)
      if (hash.includes('demand-forecasting') || hash.includes('providentia') && !hash.includes('/')) {
        /* screenshots for representative pages only */
      }
      if (hash.endsWith('demand-forecasting') || hash.endsWith('no-show') || hash.endsWith('evidence-case')) {
        await fullShot(name, width)
      }
    }
    await go('#projects/providentia', width)
    const detail = await ev(`({
      detail: !!document.querySelector('.ds-detail'),
      h1: document.querySelector('h1')?.textContent.trim(),
      decerno: /decerno/i.test(document.body.innerText),
      scrollW: document.documentElement.scrollWidth,
    })`)
    check(`detail@${width}`, detail.detail && /PROVIDENTIA/i.test(detail.h1 || '') && !detail.decerno && detail.scrollW <= width + 2, detail)
    await fullShot('detail-providentia', width)
  }

  fs.writeFileSync(path.join(outDir, 'after-checks.json'), JSON.stringify(report, null, 2))
  const failed = report.filter((r) => !r.ok)
  console.log(`\n${report.length - failed.length}/${report.length} checks passed`)
  if (failed.length) process.exitCode = 1
} finally {
  edge.kill()
}
