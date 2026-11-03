// Throttled mobile cold-load measurement of the Home, through CDP (Edge headless).
// node throttle.mjs <label> <url> <out.json> <port> [frames]
//
// Emulation: 390x844 @2x mobile, Slow 4G (1.6 Mbit/s down, 750 kbit/s up, 150 ms RTT, the
// Lighthouse "mobile" profile), CPU 4x slowdown, empty cache. Records first paint, LCP,
// CLS (with sources), long tasks, every request (size on the wire, start/end, render-blocking
// status), font requests, and font load times. With `frames`, also screenshots the page
// every ~350 ms so font swaps can be seen.
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const [label, url, out, portArg, frames] = process.argv.slice(2)
const port = Number(portArg || 9600)
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'edge-t-'))
const edge = spawn('C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, '--no-first-run', '--disable-gpu', '--hide-scrollbars', '--disable-extensions', '--disk-cache-size=1', 'about:blank'], { stdio: 'ignore' })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const INIT = `
  window.__m = { paints: {}, lcp: [], cls: 0, shifts: [], longtasks: [], fonts: [], res: [] };
  new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__m.paints[e.name] = Math.round(e.startTime) }).observe({ type: 'paint', buffered: true });
  new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__m.lcp.push({ t: Math.round(e.startTime), tag: e.element ? e.element.tagName + '.' + String(e.element.className).slice(0, 28) : null, size: e.size, url: e.url ? e.url.split('/').pop() : null }) }).observe({ type: 'largest-contentful-paint', buffered: true });
  new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) { window.__m.cls += e.value; window.__m.shifts.push({ v: Math.round(e.value * 10000) / 10000, t: Math.round(e.startTime), s: (e.sources || []).map((s) => (s.node && s.node.nodeName) + '.' + String(s.node && s.node.className).slice(0, 24) + ' ' + Math.round(s.previousRect.y) + '>' + Math.round(s.currentRect.y)) }) } }).observe({ type: 'layout-shift', buffered: true });
  new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__m.longtasks.push({ t: Math.round(e.startTime), d: Math.round(e.duration) }) }).observe({ type: 'longtask', buffered: true });
  const stamp = () => { for (const f of document.fonts) if (f.status === 'loaded' && !window.__m.fonts.find((x) => x.k === f.family + f.style + f.weight)) window.__m.fonts.push({ k: f.family + f.style + f.weight, family: f.family, style: f.style, weight: f.weight, t: Math.round(performance.now()) }) };
  setInterval(stamp, 50);
`

try {
  for (let i = 0; i < 60; i += 1) { try { if ((await fetch(`http://127.0.0.1:${port}/json/version`)).ok) break } catch {} await sleep(250) }
  const tab = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' })).json()
  const ws = new WebSocket(tab.webSocketDebuggerUrl)
  let id = 0
  const pend = new Map()
  const handlers = new Map()
  await new Promise((r) => { ws.onopen = r; ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pend.has(m.id)) { pend.get(m.id)(m.result); pend.delete(m.id) } else if (m.method) (handlers.get(m.method) || []).forEach((h) => h(m.params)) } })
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })) })
  const on = (method, h) => handlers.set(method, [...(handlers.get(method) || []), h])

  await send('Page.enable'); await send('Runtime.enable'); await send('Network.enable')
  await send('Network.setCacheDisabled', { cacheDisabled: true })
  await send('Network.clearBrowserCache')
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true })
  await send('Emulation.setUserAgentOverride', { userAgent: 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36' })
  await send('Page.addScriptToEvaluateOnNewDocument', { source: INIT })

  const reqs = new Map()
  let navStart = null
  on('Network.requestWillBeSent', (p) => { if (navStart === null && p.type === 'Document') navStart = p.timestamp; reqs.set(p.requestId, { url: p.request.url, type: p.type, t0: p.timestamp, initiator: p.initiator?.type }) })
  on('Network.responseReceived', (p) => { const r = reqs.get(p.requestId); if (r) { r.status = p.response.status; r.tResp = p.timestamp; r.encoding = p.response.headers['content-encoding'] || p.response.headers['Content-Encoding'] || null; r.mime = p.response.mimeType } })
  on('Network.loadingFinished', (p) => { const r = reqs.get(p.requestId); if (r) { r.t1 = p.timestamp; r.wire = p.encodedDataLength } })

  await send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 204800, uploadThroughput: 93750 })
  await send('Emulation.setCPUThrottlingRate', { rate: 4 })

  const shots = []
  const t00 = Date.now()
  await send('Page.navigate', { url })
  const wantFrames = !!frames
  const deadline = Date.now() + 20000
  while (Date.now() < deadline) {
    if (wantFrames) {
      const s = await send('Page.captureScreenshot', { format: 'jpeg', quality: 55 })
      if (s && s.data) shots.push({ ms: Date.now() - t00, data: s.data })
    } else await sleep(350)
    const done = await send('Runtime.evaluate', { returnByValue: true, expression: `document.readyState === 'complete' && window.__m.fonts.length >= 1 && performance.now() > 9000` })
    if (done.result.value) break
    if (wantFrames) await sleep(150)
  }
  await sleep(1500)
  const m = (await send('Runtime.evaluate', { returnByValue: true, expression: `(() => { const res = performance.getEntriesByType('resource').map((e) => ({ n: e.name.split('/').slice(-1)[0].split('?')[0], type: e.initiatorType, start: Math.round(e.startTime), end: Math.round(e.responseEnd), transfer: e.transferSize, decoded: e.decodedBodySize, rb: e.renderBlockingStatus })); const nav = performance.getEntriesByType('navigation')[0]; return { m: window.__m, res, dcl: Math.round(nav.domContentLoadedEventEnd), load: Math.round(nav.loadEventEnd), fontsStatus: [...document.fonts].map((f) => f.family + ' ' + f.style + ' ' + f.weight + ' ' + f.status) } })()` })).result.value
  const tbt = m.m.longtasks.reduce((s, t) => s + Math.max(0, t.d - 50), 0)
  const network = [...reqs.values()].map((r) => ({ url: r.url.length > 90 ? r.url.slice(0, 90) + '…' : r.url, type: r.type, status: r.status, wire: r.wire, start: Math.round((r.t0 - navStart) * 1000), end: r.t1 ? Math.round((r.t1 - navStart) * 1000) : null, encoding: r.encoding }))
  const fonts = network.filter((r) => r.type === 'Font' || /fonts\.(gstatic|googleapis)/.test(r.url))
  const result = { label, url, paints: m.m.paints, lcp: m.m.lcp, cls: Math.round(m.m.cls * 10000) / 10000, shifts: m.m.shifts, longtasks: m.m.longtasks, tbtApprox: tbt, fontLoadTimes: m.m.fonts, dcl: m.dcl, load: m.load, resources: m.res, network, fontRequests: fonts, fontsStatus: m.fontsStatus }
  fs.writeFileSync(out, JSON.stringify(result, null, 1))
  if (wantFrames) {
    const dir = out.replace(/\.json$/, '-frames')
    fs.mkdirSync(dir, { recursive: true })
    shots.forEach((s, i) => fs.writeFileSync(path.join(dir, `${String(i).padStart(2, '0')}-${s.ms}ms.jpg`), Buffer.from(s.data, 'base64')))
  }
  console.log(label, 'FCP', m.m.paints['first-contentful-paint'], 'LCP', JSON.stringify(m.m.lcp.slice(-1)[0]), 'CLS', result.cls, 'TBT~', tbt, 'fonts', fonts.length)
} finally {
  edge.kill()
}
