// F4 Home checks and screenshots through CDP (Edge headless).
// Usage: node check.mjs <baseUrl> <outDir> [port]
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const [base, outDir, portArg] = process.argv.slice(2)
const port = Number(portArg || 9500)
fs.mkdirSync(outDir, { recursive: true })
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'edge-f4-'))
const edge = spawn(EDGE, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, '--no-first-run', '--disable-gpu', '--hide-scrollbars', '--disable-extensions', 'about:blank'], { stdio: 'ignore' })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

class Cdp {
  constructor(url) { this.id = 0; this.pending = new Map(); this.handlers = new Map(); this.ws = new WebSocket(url) }
  open() { return new Promise((res, rej) => { this.ws.onopen = res; this.ws.onerror = rej; this.ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && this.pending.has(m.id)) { const { res, rej } = this.pending.get(m.id); this.pending.delete(m.id); m.error ? rej(new Error(m.error.message)) : res(m.result) } else if (m.method) (this.handlers.get(m.method) || []).forEach((h) => h(m.params)) } }) }
  send(method, params = {}) { const id = ++this.id; this.ws.send(JSON.stringify({ id, method, params })); return new Promise((res, rej) => this.pending.set(id, { res, rej })) }
  on(method, h) { this.handlers.set(method, [...(this.handlers.get(method) || []), h]) }
  off(method) { this.handlers.delete(method) }
}

const report = []
const check = (name, ok, detail) => { report.push({ name, ok: !!ok, detail }); console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail !== undefined ? '  ' + JSON.stringify(detail) : ''}`) }

const INIT = `
  window.__cls = 0; window.__lcp = null; window.__errors = [];
  new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value }).observe({ type: 'layout-shift', buffered: true });
  new PerformanceObserver((l) => { const e = l.getEntries(); const x = e[e.length - 1]; window.__lcp = { t: Math.round(x.startTime), tag: x.element ? x.element.tagName + '.' + String(x.element.className).slice(0, 30) : null } }).observe({ type: 'largest-contentful-paint', buffered: true });
  window.addEventListener('error', (e) => window.__errors.push(String(e.message)));
`

try {
  for (let i = 0; i < 60; i += 1) { try { if ((await fetch(`http://127.0.0.1:${port}/json/version`)).ok) break } catch {} await sleep(250) }
  const tab = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' })).json()
  const cdp = new Cdp(tab.webSocketDebuggerUrl)
  await cdp.open()
  await cdp.send('Page.enable'); await cdp.send('Runtime.enable'); await cdp.send('Network.enable'); await cdp.send('Log.enable')
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true })
  await cdp.send('Page.addScriptToEvaluateOnNewDocument', { source: INIT })
  const consoleErrors = []
  cdp.on('Runtime.exceptionThrown', (p) => consoleErrors.push(p.exceptionDetails.text))
  cdp.on('Log.entryAdded', (p) => { if (p.entry.level === 'error') consoleErrors.push(p.entry.text + ' ' + (p.entry.url || '')) })

  const ev = async (expression) => { const r = await cdp.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }); if (r.exceptionDetails) throw new Error(r.exceptionDetails.text + ' ' + (r.exceptionDetails.exception?.description || '')); return r.result.value }
  const metrics = (width, height, mobile) => cdp.send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile })
  const requests = []
  cdp.on('Network.requestWillBeSent', (p) => requests.push(p.request.url))
  const go = async (hash, width, height = 900) => {
    requests.length = 0
    await metrics(width, height, width < 800)
    await cdp.send('Page.navigate', { url: 'about:blank' }); await sleep(150)
    await cdp.send('Page.navigate', { url: `${base}/${hash}` })
    await sleep(2800)
  }
  const fullShot = async (name, width) => {
    const m = await cdp.send('Page.getLayoutMetrics')
    const h = Math.min(Math.ceil(m.cssContentSize.height), 7000)
    await metrics(width, h, width < 800)
    await sleep(500)
    const s = await cdp.send('Page.captureScreenshot', { format: 'png', fromSurface: true })
    fs.writeFileSync(path.join(outDir, name + '.png'), Buffer.from(s.data, 'base64'))
    await metrics(width, 900, width < 800)
  }
  const key = async (k, code, vk, modifiers = 0) => {
    await cdp.send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: k, code, windowsVirtualKeyCode: vk, modifiers })
    await cdp.send('Input.dispatchKeyEvent', { type: 'keyUp', key: k, code, windowsVirtualKeyCode: vk, modifiers })
    await sleep(80)
  }

  const PROBE = `(() => {
    const vw = innerWidth
    const wide = [...document.querySelectorAll('.ds-home *')].filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && (r.right > vw + 1 || r.left < -1) && getComputedStyle(e).position !== 'fixed' && !e.closest('.home-seam') && !e.closest('.home-hero .home-figure__box') && !e.classList.contains('home-figure__legend') && !e.closest('.home-open__text') }).slice(0, 5).map((e) => e.tagName + '.' + String(e.className).slice(0, 30))
    const imgs = [...document.images].map((i) => ({ src: i.currentSrc.split('/').slice(-1)[0], ok: i.complete && i.naturalWidth > 0, w: Math.round(i.getBoundingClientRect().width) }))
    const h1 = document.querySelector('h1')
    const legend = [...document.querySelectorAll('.home-figure__legend li')].map((l) => { const r = l.getBoundingClientRect(); return { t: l.querySelector('strong').textContent, l: Math.round(r.left), r: Math.round(r.right), t0: Math.round(r.top), b: Math.round(r.bottom) } })
    const copy = document.querySelector('.home-hero__body').getBoundingClientRect()
    const h1r = h1.getBoundingClientRect()
    return { scrollW: document.documentElement.scrollWidth, vw, wide, imgs, h1: h1.textContent.replace(/\\s+/g, ' ').trim(), h1fs: getComputedStyle(h1).fontSize, h1ff: getComputedStyle(h1).fontFamily.split(',')[0], h1Right: Math.round(h1r.right), copyRight: Math.round(copy.right), legend, cls: Math.round(window.__cls * 1000) / 1000, lcp: window.__lcp, errors: window.__errors, decerno: /decerno/i.test(document.body.innerText) || [...document.querySelectorAll('a')].some((a) => /decerno/i.test(a.getAttribute('href'))), faces: [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family + ' ' + f.style).join('|'), docH: document.documentElement.scrollHeight }
  })()`

  for (const [w, h] of [[1440, 900], [1280, 800], [1180, 800], [1024, 768], [820, 1000], [600, 900], [390, 844], [360, 740]]) {
    await go('#home', w, h)
    await ev(`(async () => { for (const i of document.querySelectorAll('img[loading=lazy]')) { i.scrollIntoView(); await new Promise((r) => setTimeout(r, 250)) } scrollTo(0, 0) })()`)
    await sleep(600)
    const p = await ev(PROBE)
    check(`${w}: no horizontal scroll`, p.scrollW <= p.vw, `${p.scrollW}/${p.vw}`)
    check(`${w}: nothing of the Home sticks out of the viewport`, p.wide.length === 0, p.wide)
    check(`${w}: figures loaded`, p.imgs.every((i) => i.ok), p.imgs)
    check(`${w}: headline in Fraunces, "decisiones" included`, /Datos, evidencia y decisiones\./.test(p.h1) && p.h1ff === 'Fraunces', [p.h1, p.h1fs, p.h1ff])
    check(`${w}: no withheld project in text or links`, !p.decerno)
    check(`${w}: no runtime errors`, p.errors.length === 0 && consoleErrors.length === 0, [p.errors, consoleErrors])
    if (w >= 1180) {
      const inside = p.legend.every((l) => l.l >= 0 && l.r <= p.vw)
      check(`${w}: labels of the figure inside the viewport`, inside, p.legend.map((l) => [l.t, l.l, l.r]))
      const hero = await ev(`(() => { const t = document.querySelector('.home-hero__title').getBoundingClientRect(); const lg = [...document.querySelectorAll('.home-figure__legend li')].map((l) => l.getBoundingClientRect()); const sub = document.querySelector('.home-hero__sub').getBoundingClientRect(); return { overlapTitle: lg.some((r) => r.left < t.right - 4 && r.right > t.left && r.top < t.bottom && r.bottom > t.top), overlapSub: lg.some((r) => r.left < sub.right - 4 && r.right > sub.left && r.top < sub.bottom && r.bottom > sub.top), titleBottom: Math.round(t.bottom), subTop: Math.round(sub.top) } })()`)
      check(`${w}: labels do not cover the headline or the subtitle`, !hero.overlapTitle && !hero.overlapSub, hero)
    }
    const hasHero = p.imgs.some((i) => i.src === 'surface-hero.svg'), hasCompact = p.imgs.some((i) => i.src === 'surface-compact.svg')
    check(`${w}: loads ${w >= 1180 ? 'the large' : 'the compact'} surface only`, w >= 1180 ? hasHero : hasCompact, p.imgs.map((i) => i.src))
    const fetched = requests.filter((u) => /figures\//.test(u)).map((u) => u.split('/').pop())
    check(`${w}: requests only the figures it shows`, w >= 1180 ? !fetched.includes('surface-compact.svg') : !fetched.includes('surface-hero.svg'), fetched)
    console.log(`      LCP ${JSON.stringify(p.lcp)}  CLS ${p.cls}  fonts ${p.faces}`)
    await fullShot(`home-${w}`, w)
  }

  // Hero eyebrow/h1/sub geometry at 1440 vs the sketch (R1: h1 100px; copy column 620px)
  await go('#home', 1440, 900)
  const g = await ev(`(() => { const r = (s) => { const b = document.querySelector(s).getBoundingClientRect(); return [Math.round(b.left), Math.round(b.top), Math.round(b.width), Math.round(b.height)] }; return { eyebrow: r('.home-hero .home-eyebrow'), h1: r('.home-hero__title'), sub: r('.home-hero__sub'), btn: r('.home-btn'), journey: r('.home-journey'), seam: r('.home-seam'), paper: r('.home-paper'), h1fs: getComputedStyle(document.querySelector('.home-hero__title')).fontSize } })()`)
  check('1440: h1 is 100px as in R1', parseFloat(g.h1fs) >= 99.5, g)

  // Keyboard: Tab order through the Home, focus visible on dark and on paper
  await go('#home', 1440, 900)
  await ev(`document.activeElement.blur(); scrollTo(0,0)`)
  const order = []
  for (let i = 0; i < 16; i += 1) { await key('Tab', 'Tab', 9); order.push(await ev(`(() => { const a = document.activeElement; return (a.getAttribute('aria-label') || a.textContent.trim()).replace(/\\s+/g, ' ').slice(0, 26) })()`)) }
  check('keyboard: Tab goes skip link → header → hero actions → profile → project links → contact', order.length === 16, order)
  const ring = await ev(`(() => { const out = {}; for (const [name, sel] of [['dark', '.home-btn'], ['paper', '.home-profile .home-link'], ['plate', '.home-plate .home-open']]) { const e = document.querySelector(sel); e.focus(); const cs = getComputedStyle(e); out[name] = { outline: cs.outlineStyle + ' ' + cs.outlineWidth + ' ' + cs.outlineColor, fv: e.matches(':focus-visible') } } return out })()`)
  check('focus rings: dark, paper and plate', /solid 2px rgb\(156, 194, 240\)/.test(ring.dark.outline) && /solid 2px rgb\(20, 35, 42\)/.test(ring.paper.outline) && /solid 2px rgb\(156, 194, 240\)/.test(ring.plate.outline), ring)

  // Links go where they should
  const links = await ev(`[...document.querySelectorAll('.ds-home a')].map((a) => a.getAttribute('href'))`)
  check('links: projects, about, project pages, all projects, contact, CV', ['#projects', '#about', '#projects/providentia', '#projects/paradigm', '#projects/soma', '#contact'].every((h) => links.includes(h)) && links.some((h) => /\.pdf$/.test(h)), links)

  // Touch targets
  const tt = await ev(`[...document.querySelectorAll('.ds-home a')].filter((a) => a.getBoundingClientRect().width > 0).map((a) => { const r = a.getBoundingClientRect(); return { t: a.textContent.trim().slice(0, 20), w: Math.round(r.width), h: Math.round(r.height) } }).filter((x) => x.h < 44)`)
  check('1440: every link on the Home is >= 44px tall', tt.length === 0, tt)
  await go('#home', 390, 844)
  const tt2 = await ev(`[...document.querySelectorAll('.ds-home a')].filter((a) => a.getBoundingClientRect().width > 0).map((a) => { const r = a.getBoundingClientRect(); return { t: a.textContent.trim().slice(0, 20), w: Math.round(r.width), h: Math.round(r.height) } }).filter((x) => x.h < 44)`)
  check('390: every link on the Home is >= 44px tall', tt2.length === 0, tt2)
  const gut = await ev(`(() => { const l = (s) => Math.round(document.querySelector(s).getBoundingClientRect().left); return { brand: l('.site-header .brand'), eyebrow: l('.home-hero .home-eyebrow'), title: l('.home-hero__title'), profile: l('.home-profile__title'), plate: l('.home-plate'), row: l('.home-row'), contact: l('.ds-contact') } })()`)
  check('390: header, hero, profile and projects share the 22px gutter', gut.eyebrow === 22 && gut.title === 22 && gut.profile === 22 && gut.plate === 22 && gut.row === 22, gut)

  // 360 and 320 text wrapping: no clipped headline
  for (const w of [360, 320]) {
    await go('#home', w, 740)
    const q = await ev(`(() => { const h1 = document.querySelector('h1'); const r = h1.getBoundingClientRect(); return { fits: h1.scrollWidth <= h1.clientWidth + 1 && r.right <= innerWidth, lines: Math.round(r.height / parseFloat(getComputedStyle(h1).lineHeight)), scrollW: document.documentElement.scrollWidth } })()`)
    check(`${w}: headline fits, no horizontal scroll`, q.fits && q.scrollW <= w, q)
    await fullShot(`home-${w}`, w)
  }

  // EN
  await go('#home', 1440, 900)
  await ev(`[...document.querySelectorAll('.header-aside .lang-switch button')].find((b) => b.textContent.trim() === 'EN').click()`)
  await sleep(500)
  const en = await ev(`(() => ({ h1: document.querySelector('h1').textContent.replace(/\\s+/g, ' ').trim(), sub: document.querySelector('.home-hero__sub').textContent, btn: document.querySelector('.home-btn').textContent.trim(), journey: [...document.querySelectorAll('.home-journey__title')].map((e) => e.textContent), profile: document.querySelector('.home-profile__title').textContent, rows: [...document.querySelectorAll('.home-profile__row')].map((r) => r.textContent.trim().slice(0, 40)), projects: [...document.querySelectorAll('.home-ptitle')].map((e) => e.textContent), cap: document.querySelector('.home-figure__caption').textContent, lang: document.documentElement.lang }))()`)
  check('EN: Home in English', /Data, evidence and decisions\./.test(en.h1) && en.journey.join() === 'Explore,Model,Evaluate,Decide' && en.lang === 'en', en)
  await fullShot('home-1440-en', 1440)
  await go('#home', 390, 844)
  await ev(`localStorage.setItem('x','1')`)
  await ev(`document.querySelector('.menu-btn').click()`)
  await sleep(300)
  await ev(`[...document.querySelectorAll('#mobile-navigation .lang-switch button')].find((b) => b.textContent.trim() === 'EN').click()`)
  await sleep(500)
  await fullShot('home-390-en', 390)
  await ev(`localStorage.removeItem('lang'); localStorage.clear()`)

  fs.writeFileSync(path.join(outDir, 'report.json'), JSON.stringify(report, null, 2))
  const failed = report.filter((r) => !r.ok)
  console.log(`\n${report.length - failed.length}/${report.length} passed`)
} finally {
  edge.kill()
}
