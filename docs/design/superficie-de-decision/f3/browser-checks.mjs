// F3 behavior checks + screenshots through CDP (Edge headless).
// Usage: node check.mjs <baseUrl> <outDir> [port]
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const [base, outDir, portArg] = process.argv.slice(2)
const port = Number(portArg || 9444)
fs.mkdirSync(outDir, { recursive: true })
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'edge-f3-'))
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
  await cdp.send('Page.enable'); await cdp.send('Runtime.enable'); await cdp.send('Network.enable')
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true })

  const ev = async (expression) => { const r = await cdp.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }); if (r.exceptionDetails) throw new Error(r.exceptionDetails.text + ' ' + (r.exceptionDetails.exception?.description || '')); return r.result.value }
  const metrics = (width, height, mobile) => cdp.send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile })
  const go = async (hash, width, height = 844) => {
    await metrics(width, height, width < 800)
    await cdp.send('Page.navigate', { url: 'about:blank' }); await sleep(120)
    await cdp.send('Page.navigate', { url: `${base}/${hash}` })
    await sleep(2200)
  }
  const key = async (k, code, vk, modifiers = 0) => {
    await cdp.send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: k, code, windowsVirtualKeyCode: vk, modifiers })
    await cdp.send('Input.dispatchKeyEvent', { type: 'keyUp', key: k, code, windowsVirtualKeyCode: vk, modifiers })
    await sleep(80)
  }
  const click = async (selector) => {
    const box = await ev(`(() => { const r = document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2] })()`)
    for (const type of ['mousePressed', 'mouseReleased']) await cdp.send('Input.dispatchMouseEvent', { type, x: box[0], y: box[1], button: 'left', clickCount: 1 })
    await sleep(350)
  }
  const shot = async (name) => { const s = await cdp.send('Page.captureScreenshot', { format: 'png', fromSurface: true }); fs.writeFileSync(path.join(outDir, name + '.png'), Buffer.from(s.data, 'base64')) }
  const active = () => ev(`(() => { const a = document.activeElement; return a ? (a.id ? '#' + a.id : a.tagName.toLowerCase() + '.' + String(a.className).split(' ')[0] + ':' + (a.getAttribute('aria-label') || a.textContent.trim().slice(0, 24))) : null })()`)
  const state = () => ev(`(() => { const n = document.getElementById('mobile-navigation'); const b = document.querySelector('.menu-btn'); return { expanded: b.getAttribute('aria-expanded'), btnLabel: b.getAttribute('aria-label'), vis: getComputedStyle(n).visibility, opacity: getComputedStyle(n).opacity, htmlOverflow: document.documentElement.style.overflow, mainInert: !!document.querySelector('.shell--site').inert, skipInert: !!document.querySelector('.skip-link').inert, hash: location.hash, scrollW: document.documentElement.scrollWidth, innerW: window.innerWidth } })()`)

  // ── Mobile 390 ────────────────────────────────────────────────────────────
  await go('#home', 390)
  let s = await state()
  check('M1 closed: panel hidden, button collapsed', s.vis === 'hidden' && s.expanded === 'false', s)
  check('M2 no horizontal scroll (closed)', s.scrollW <= s.innerW, s.scrollW + '/' + s.innerW)
  const bar = await ev(`(() => { const h = document.querySelector('.site-header'); const r = h.getBoundingClientRect(); const b = document.querySelector('.menu-btn').getBoundingClientRect(); return { h: r.height, w: r.width, btn: [b.width, b.height], cssVar: getComputedStyle(document.documentElement).getPropertyValue('--site-header-h') } })()`)
  check('M3 bar 59px incl. hairline; button 44x44; --site-header-h measured', Math.round(bar.h) === 59 && bar.btn[0] === 44 && bar.btn[1] === 44 && bar.cssVar.trim() === '59px', bar)
  await shot('home-390-closed')

  await click('.menu-btn')
  s = await state()
  check('M4 open: visible, expanded, label = close', s.vis === 'visible' && s.expanded === 'true' && /Cerrar|Close/.test(s.btnLabel), s)
  check('M5 open: scroll locked, page inert, skip link inert', s.htmlOverflow === 'hidden' && s.mainInert && s.skipInert, s)
  check('M6 open: focus moved to first menu item', (await active()).includes('Inicio'), await active())
  check('M7 no horizontal scroll (open)', s.scrollW <= s.innerW)
  await shot('menu-390-open')

  const targets = await ev(`[...document.querySelectorAll('.site-header a:not([hidden]), .site-header button')].filter(e => e.offsetParent !== null || getComputedStyle(e).position === 'fixed').filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 }).map(e => { const r = e.getBoundingClientRect(); return { t: (e.getAttribute('aria-label') || e.textContent.trim()).slice(0, 22), w: Math.round(r.width), h: Math.round(r.height) } })`)
  const small = targets.filter((x) => x.h < 44 || x.w < 44)
  check('M8 touch targets >= 44px (menu open)', small.length === 0, { count: targets.length, small })

  // Tab cycle
  const seen = []
  for (let i = 0; i < 14; i += 1) { await key('Tab', 'Tab', 9); seen.push(await active()) }
  const inside = await ev(`(() => { const a = document.activeElement; return document.querySelector('.site-header').contains(a) })()`)
  check('M9 Tab never leaves the header (14 presses)', inside && seen.every((x) => !/skip|main-content|footer/i.test(x)), seen)
  await key('Tab', 'Tab', 9, 8) // shift+Tab
  check('M10 Shift+Tab stays inside', await ev(`document.querySelector('.site-header').contains(document.activeElement)`))

  await key('Escape', 'Escape', 27)
  await sleep(350)
  s = await state()
  check('M11 Escape: closed, scroll unlocked, page not inert, focus on toggle', s.expanded === 'false' && s.vis === 'hidden' && s.htmlOverflow === '' && !s.mainInert && (await active()).includes('menu-btn'), { s, a: await active() })

  // Link click -> route change
  await click('.menu-btn')
  await ev(`[...document.querySelectorAll('#mobile-navigation a')].find(a => a.getAttribute('href') === '#contact').scrollIntoView()`)
  await click('#mobile-navigation a[href="#contact"]')
  await sleep(500)
  s = await state()
  check('M12 link: route changes, menu closes, focus lands in <main>', s.hash === '#contact' && s.expanded === 'false' && (await active()) === '#main-content', { hash: s.hash, a: await active() })

  // Same-hash link: no hashchange, focus must not be lost
  await click('.menu-btn')
  await click('#mobile-navigation a[href="#contact"]')
  await sleep(500)
  s = await state()
  const a2 = await active()
  check('M13 same-route link: menu closes and focus is not lost', s.expanded === 'false' && a2 && !/^body/.test(a2), a2)

  // hashchange from outside (back/forward) closes it
  await click('.menu-btn')
  await ev(`location.hash = '#about'`)
  await sleep(500)
  s = await state()
  check('M14 external route change closes the menu', s.expanded === 'false' && s.hash === '#about', s.hash)

  // Language from the menu
  await click('.menu-btn')
  await ev(`[...document.querySelectorAll('#mobile-navigation .lang-switch button')].find(b => b.textContent.trim() === 'EN').click()`)
  await sleep(400)
  s = await state()
  const labelsEn = await ev(`[...document.querySelectorAll('.mobile-nav-list > li > a')].map(a => a.textContent.trim())`)
  check('M15 EN from the menu: closes, focus back on toggle, labels in English', s.expanded === 'false' && (await active()).includes('menu-btn') && labelsEn.join() === 'Home,Projects,About,Contact', { a: await active(), labelsEn })
  await click('.menu-btn')
  const subEn = await ev(`[...document.querySelectorAll('.mobile-nav-sub a')].map(a => a.textContent.trim())`)
  await shot('menu-390-open-en')
  const cvEn = await ev(`document.querySelector('.mobile-nav-cv').textContent.trim() + '|' + document.querySelector('.mobile-nav-cv').getAttribute('href') + '|' + document.querySelector('.mobile-nav-cv').hasAttribute('download')`)
  check('M16 EN: project list + CV link', true, { subEn, cvEn })
  await ev(`[...document.querySelectorAll('#mobile-navigation .lang-switch button')].find(b => b.textContent.trim() === 'ES').click()`)
  await sleep(300)

  // DECERNO absent
  await click('.menu-btn')
  const dec = await ev(`(() => { const h = document.querySelector('.site-header'); return { text: /decerno/i.test(h.textContent), hrefs: [...h.querySelectorAll('a')].filter(a => /decerno/i.test(a.getAttribute('href'))).length, subHrefs: [...document.querySelectorAll('.mobile-nav-sub a')].map(a => a.getAttribute('href')) } })()`)
  check('M17 DECERNO is not in the header or the menu', !dec.text && dec.hrefs === 0, dec)
  const subEs = await ev(`[...document.querySelectorAll('.mobile-nav-sub a')].map(a => a.textContent.trim())`)
  check('M18 project list = published spotlight + complementary', JSON.stringify(subEs) === JSON.stringify(['01PROVIDENTIA', '02Paradigm', '+Soma· complementario']), subEs)

  // Resize past the breakpoint closes it
  await metrics(1000, 800, false)
  await sleep(500)
  s = await state()
  check('M19 growing past 800px closes the menu and unlocks scroll', s.expanded === 'false' && s.htmlOverflow === '' && !s.mainInert, s)

  // Reduced motion
  await metrics(390, 844, true)
  await cdp.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
  await sleep(200)
  const rm = await ev(`(() => { const cs = getComputedStyle(document.getElementById('mobile-navigation')); const sp = getComputedStyle(document.querySelector('.menu-btn span')); return { navTransition: cs.transitionDuration, lineTransition: sp.transitionDuration } })()`)
  check('M20 prefers-reduced-motion: no menu or burger transitions', /^0s(, 0s)*$/.test(rm.navTransition) && /^0s(, 0s)*$/.test(rm.lineTransition), rm)
  await cdp.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] })

  // Mobile other routes (screenshots)
  for (const [name, hash] of [['projects', '#projects'], ['about', '#about'], ['case', '#projects/providentia/demand-forecasting'], ['contact', '#contact']]) {
    await go(hash, 390)
    const sw = await ev(`document.documentElement.scrollWidth <= window.innerWidth`)
    check(`M21 ${name}@390 no horizontal scroll`, sw)
    await shot(`${name}-390`)
    if (name === 'contact') { await ev(`window.scrollTo(0, document.documentElement.scrollHeight)`); await sleep(300); await shot('footer-390') }
  }

  // ── Desktop 1440 ──────────────────────────────────────────────────────────
  await go('#home', 1440, 900)
  const d = await ev(`(() => { const h = document.querySelector('.site-header'); const nav = [...document.querySelectorAll('.nav a')]; const r = h.getBoundingClientRect(); const mb = getComputedStyle(document.querySelector('.menu-btn')).display; const mn = getComputedStyle(document.getElementById('mobile-navigation')).display; const cur = nav.filter(a => a.getAttribute('aria-current') === 'page').map(a => a.textContent.trim()); return { w: r.width, h: Math.round(r.height), labels: nav.map(a => a.textContent.trim()), cur, menuBtn: mb, mobileNav: mn, scrollW: document.documentElement.scrollWidth, innerW: innerWidth, brand: document.querySelector('.brand').getAttribute('aria-current'), lang: [...document.querySelectorAll('.lang-switch button')].map(b => b.textContent.trim() + ':' + b.getAttribute('aria-pressed')) } })()`)
  check('D1 1440: header full-bleed, 77px (76 + hairline), 4 links, Inicio current, burger hidden', Math.round(d.w) === 1440 && d.h === 77 && d.labels.join() === 'Inicio,Proyectos,Sobre mí,Contacto' && d.cur.join() === 'Inicio' && d.menuBtn === 'none' && d.mobileNav === 'none', d)
  check('D2 1440: no horizontal scroll', d.scrollW <= d.innerW)
  await shot('home-1440-top')
  await ev(`window.scrollTo(0, (document.documentElement.scrollHeight - innerHeight) * 0.5)`)
  await sleep(300)
  const prog = await ev(`document.querySelector('.site-progress__bar').style.transform`)
  check('D3 progress hairline follows the scroll (~50%)', /scaleX\(0\.(4|5)/.test(prog), prog)
  await shot('home-1440-scrolled')
  const stick = await ev(`Math.round(document.querySelector('.site-header').getBoundingClientRect().top)`)
  check('D4 header stays sticky at top while scrolling', stick === 0, stick)
  await ev(`window.scrollTo(0, 0)`)
  await sleep(200)
  // focus visible + skip link
  await ev(`document.activeElement.blur(); window.scrollTo(0,0)`)
  await key('Tab', 'Tab', 9)
  check('D5 first Tab -> skip link', (await active()).includes('skip-link'), await active())
  await key('Tab', 'Tab', 9)
  await key('Tab', 'Tab', 9)
  const fv = await ev(`(() => { const a = document.activeElement; const cs = getComputedStyle(a); return { el: a.textContent.trim().slice(0, 20), outline: cs.outlineStyle + ' ' + cs.outlineWidth + ' ' + cs.outlineColor, matches: a.matches(':focus-visible') } })()`)
  check('D6 keyboard focus is visible on header links', fv.matches && /solid 2px/.test(fv.outline), fv)
  await shot('home-1440-focus')
  const dd = await ev(`(() => { const h = document.querySelector('.site-header'); return { text: /decerno/i.test(h.textContent), cv: document.querySelector('.header-cv').getAttribute('href'), dl: document.querySelector('.header-cv').hasAttribute('download') } })()`)
  check('D7 desktop: no DECERNO, CV link present with download', !dd.text && dd.dl, dd)
  for (const [name, hash] of [['projects', '#projects'], ['about', '#about'], ['case', '#projects/providentia/demand-forecasting'], ['contact', '#contact']]) {
    await go(hash, 1440, 900)
    const cur = await ev(`[...document.querySelectorAll('.nav a[aria-current]')].map(a => a.textContent.trim()).join()`)
    check(`D8 ${name}@1440 current link`, name === 'case' ? cur === 'Proyectos' : cur.length > 0, cur)
    await shot(`${name}-1440`)
    if (name === 'contact') { await ev(`window.scrollTo(0, document.documentElement.scrollHeight)`); await sleep(300); await shot('footer-1440') }
  }
  // 800px edge (inline nav fits)
  await go('#home', 800, 900)
  const e = await ev(`(() => { const h = document.querySelector('.header'); const aside = document.querySelector('.header-aside').getBoundingClientRect(); const rail = document.querySelector('.nav-rail').getBoundingClientRect(); const brand = document.querySelector('.brand').getBoundingClientRect(); return { fits: document.documentElement.scrollWidth <= innerWidth, overlap: rail.left < brand.right || rail.right > aside.left, hh: Math.round(h.getBoundingClientRect().height) } })()`)
  check('D9 800px: inline nav fits without overlap and one row', e.fits && !e.overlap && e.hh === 76, e)
  await shot('home-800')
  await go('#home', 799, 900)
  const e2 = await ev(`getComputedStyle(document.querySelector('.menu-btn')).display`)
  check('D10 799px: burger shown', e2 === 'flex', e2)
  // EN at 800
  await go('#home', 800, 900)
  await ev(`[...document.querySelectorAll('.header-aside .lang-switch button')].find(b => b.textContent.trim() === 'EN').click()`)
  await sleep(300)
  const e3 = await ev(`(() => { const aside = document.querySelector('.header-aside').getBoundingClientRect(); const rail = document.querySelector('.nav-rail').getBoundingClientRect(); const brand = document.querySelector('.brand').getBoundingClientRect(); return { fits: document.documentElement.scrollWidth <= innerWidth, overlap: rail.left < brand.right || rail.right > aside.left, labels: [...document.querySelectorAll('.nav a')].map(a => a.textContent.trim()).join() } })()`)
  check('D11 800px EN fits', e3.fits && !e3.overlap, e3)

  fs.writeFileSync(path.join(outDir, 'report.json'), JSON.stringify(report, null, 2))
  const failed = report.filter((r) => !r.ok)
  console.log(`\n${report.length - failed.length}/${report.length} passed`)
} finally {
  edge.kill()
}
