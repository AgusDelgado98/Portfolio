// F9 Contact / Home / Footer positioning checks (Edge headless).
// Usage: node capture.mjs <baseUrl> <outDir> [port]
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const [base, outDir, portArg] = process.argv.slice(2)
const port = Number(portArg || 9523)
fs.mkdirSync(outDir, { recursive: true })
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'edge-f9-'))
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
    await sleep(2800)
  }
  const fullShot = async (name, width) => {
    const m = await cdp.send('Page.getLayoutMetrics')
    const h = Math.min(Math.ceil(m.cssContentSize.height), 5000)
    await metrics(width, h, width < 800)
    await sleep(400)
    const s = await cdp.send('Page.captureScreenshot', { format: 'png', fromSurface: true })
    fs.writeFileSync(path.join(outDir, name + '.png'), Buffer.from(s.data, 'base64'))
    await metrics(width, 900, width < 800)
  }

  await go('#contact', 1440)
  const contact = await ev(`(() => {
    const h1 = document.querySelector('.ds-contact-page h1')?.textContent.trim()
    const lede = document.querySelector('.ds-contact-lede')?.textContent.trim()
    const roles = [...document.querySelectorAll('.ds-contact-roles li')].map((li) => li.textContent.trim())
    const tag = document.querySelector('.footer-tagline')?.textContent.trim()
    const ogTitle = document.querySelector('meta[property="og:title"]')?.content
    const desc = document.querySelector('meta[name="description"]')?.content
    const body = document.body.innerText
    return { h1, lede, roles, tag, ogTitle, desc, decerno: /decerno/i.test(body), scientistJob: /data scientist/i.test(body) && !/junior data science/i.test(body) }
  })()`)
  check('contact: headline', /hablemos|let's talk/i.test(contact.h1 || ''), contact.h1)
  check('contact: lede + partial', /dedicaci[oó]n parcial|partial dedication/i.test(contact.lede || ''), contact.lede)
  check('contact: four roles', contact.roles?.length === 4, contact.roles)
  check('contact: DS junior path', contact.roles?.some((r) => /junior|trainee/i.test(r)), contact.roles)
  check('footer tagline', /Data Science · Machine Learning/i.test(contact.tag || ''), contact.tag)
  check('og:title SEO', /Data Science/i.test(contact.ogTitle || ''), contact.ogTitle)
  check('meta description updated', /ciencia de datos|data science|machine learning/i.test(contact.desc || ''), contact.desc)
  check('no DECERNO', !contact.decerno)
  check('no Data Scientist job claim', !contact.scientistJob)
  await fullShot('contact-1440', 1440)

  await go('#home', 1440)
  const home = await ev(`(() => {
    const eye = document.querySelector('.home-eyebrow')?.textContent.replace(/\\s+/g,' ').trim()
    const tag = document.querySelector('.footer-tagline')?.textContent.trim()
    return { eye, tag, decerno: /decerno/i.test(document.body.innerText) }
  })()`)
  check('home eyebrow', /Analítica aplicada|Applied Analytics/i.test(home.eye || ''), home.eye)
  check('home footer tagline', /Data Science · Machine Learning/i.test(home.tag || ''), home.tag)
  check('home no DECERNO', !home.decerno)
  await fullShot('home-1440', 1440)

  await go('#contact', 390)
  await fullShot('contact-390', 390)

  await go('#contact', 1440)
  await ev(`localStorage.setItem('portfolio-lang','en'); location.hash='#contact'; location.reload()`)
  await sleep(3200)
  const en = await ev(`({
    lede: document.querySelector('.ds-contact-lede')?.textContent.trim(),
    roles: [...document.querySelectorAll('.ds-contact-roles li')].map((li) => li.textContent.trim()),
    tag: document.querySelector('.footer-tagline')?.textContent.trim(),
    ogTitle: document.querySelector('meta[property="og:title"]')?.content,
  })`)
  check('EN lede', /partial dedication/i.test(en?.lede || ''), en?.lede)
  check('EN roles', (en?.roles || []).some((r) => /Junior Data Science|Trainee/i.test(r)), en?.roles)
  check('EN footer', /Applied Analytics/i.test(en?.tag || ''), en?.tag)
  check('EN og:title', /Applied Analytics/i.test(en?.ogTitle || ''), en?.ogTitle)
  await fullShot('contact-1440-en', 1440)

  fs.writeFileSync(path.join(outDir, 'browser-checks.json'), JSON.stringify(report, null, 2))
  const failed = report.filter((r) => !r.ok)
  console.log(`\n${report.length - failed.length}/${report.length} checks passed`)
  if (failed.length) process.exitCode = 1
} finally {
  edge.kill()
}
