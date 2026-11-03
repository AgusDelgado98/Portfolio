// F11 publication audit: a11y / responsive / DECERNO / links (Edge CDP).
 // Usage: node audit.mjs <baseUrl> <outJson> [port]
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const [base, outJson, portArg] = process.argv.slice(2)
if (!base || !outJson) {
  console.error('Usage: node audit.mjs <baseUrl> <outJson> [port]')
  process.exit(2)
}
const port = Number(portArg || 9541)
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'edge-f11-'))
const edge = spawn(EDGE, [
  '--headless=new',
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${profile}`,
  '--no-first-run',
  '--disable-gpu',
  '--hide-scrollbars',
  '--disable-extensions',
  'about:blank',
], { stdio: 'ignore' })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

class Cdp {
  constructor(url) {
    this.id = 0
    this.pending = new Map()
    this.ws = new WebSocket(url)
  }
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

const WIDTHS = [320, 390, 768, 1440]
const PAGES = [
  { id: 'home', hash: '#home' },
  { id: 'projects', hash: '#projects' },
  { id: 'about', hash: '#about' },
  { id: 'contact', hash: '#contact' },
  { id: 'detail-providentia', hash: '#projects/providentia' },
  { id: 'case-demand', hash: '#projects/providentia/demand-forecasting' },
  { id: 'case-policy', hash: '#projects/providentia/policy-decision' },
  { id: 'case-aletheia', hash: '#projects/aletheia/evidence-case' },
]

const report = { generatedAt: new Date().toISOString(), base, checks: [], notes: [] }
const check = (name, ok, detail) => {
  report.checks.push({ name, ok: !!ok, detail })
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail !== undefined ? '  ' + JSON.stringify(detail) : ''}`)
}

try {
  for (let i = 0; i < 60; i += 1) {
    try {
      if ((await fetch(`http://127.0.0.1:${port}/json/version`)).ok) break
    } catch {}
    await sleep(250)
  }
  const tab = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' })).json()
  const cdp = new Cdp(tab.webSocketDebuggerUrl)
  await cdp.open()
  await cdp.send('Page.enable')
  await cdp.send('Runtime.enable')
  const ev = async (expression) => {
    const r = await cdp.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.text || JSON.stringify(r.exceptionDetails))
    return r.result.value
  }
  const metrics = (width, height, mobile) =>
    cdp.send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile })

  const go = async (hash, width) => {
    await metrics(width, 900, width < 800)
    await cdp.send('Page.navigate', { url: `${base}/${hash}` })
    await sleep(2800)
  }

  // ── Responsive + DECERNO + landmarks ──────────────────────────────────────
  for (const width of WIDTHS) {
    for (const page of PAGES) {
      await go(page.hash, width)
      const probe = await ev(`(() => {
        const width = ${width}
        const body = document.body.innerText || ''
        const html = document.documentElement.outerHTML
        const scrollW = document.documentElement.scrollWidth
        const main = document.querySelector('main')
        const h1 = document.querySelector('h1')
        const focusables = [...document.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])')]
          .filter((el) => !el.disabled && el.offsetParent !== null)
        const tiny = focusables.filter((el) => {
          const r = el.getBoundingClientRect()
          return r.width > 0 && r.height > 0 && (r.width < 24 || r.height < 24)
        }).slice(0, 5).map((el) => ({
          tag: el.tagName,
          text: (el.textContent || '').replace(/\\s+/g, ' ').trim().slice(0, 40),
          w: Math.round(el.getBoundingClientRect().width),
          h: Math.round(el.getBoundingClientRect().height),
        }))
        const wraps = [...document.querySelectorAll('.elog-table-wrap, [class*="table-wrap"], .aletheia-compat-scroll')]
        const tables = wraps.map((wrap) => {
          const table = wrap.querySelector('table')
          const cs = getComputedStyle(wrap)
          return {
            overflowX: cs.overflowX,
            scrollW: wrap.scrollWidth,
            clientW: wrap.clientWidth,
            tableW: table ? table.scrollWidth : 0,
          }
        })
        const focusOutlineSample = (() => {
          const a = document.querySelector('a[href], button')
          if (!a) return null
          a.focus()
          const cs = getComputedStyle(a)
          return { outline: cs.outlineStyle + ' ' + cs.outlineWidth, outlineColor: cs.outlineColor }
        })()
        return {
          title: document.title,
          h1: h1 ? h1.textContent.replace(/\\s+/g, ' ').trim().slice(0, 100) : null,
          main: !!main,
          scrollW,
          overflow: scrollW > width + 2,
          decernoText: /decerno/i.test(body),
          decernoHtml: /decerno/i.test(html),
          tiny,
          tables,
          focusOutlineSample,
        }
      })()`)

      check(`${page.id}@${width}: landmark+h1`, probe.main && !!probe.h1, { h1: probe.h1 })
      check(`${page.id}@${width}: no horizontal page overflow`, !probe.overflow, { scrollW: probe.scrollW, width })
      check(`${page.id}@${width}: no DECERNO`, !probe.decernoText && !probe.decernoHtml)
      if (page.id.startsWith('case-') && width <= 390) {
        for (const [i, t] of (probe.tables || []).entries()) {
          const needsScroll = t.tableW > t.clientW + 1
          const canScroll = /auto|scroll/.test(t.overflowX)
          check(`${page.id}@${width}: table[${i}] scroll when wide`, !needsScroll || canScroll, t)
        }
      }
    }
  }

  // ── Mobile menu Escape + focus trap smoke (390) ───────────────────────────
  await go('#home', 390)
  const menu = await ev(`(() => {
    const btn = document.querySelector('button.menu-btn[aria-controls="mobile-navigation"]')
    if (!btn) return { found: false }
    btn.click()
    return { found: true }
  })()`)
  check('mobile menu: open control found', menu.found, menu)
  if (menu.found) {
    await sleep(500)
    const opened = await ev(`(() => {
      const btn = document.querySelector('button.menu-btn')
      const nav = document.getElementById('mobile-navigation')
      return {
        expanded: btn?.getAttribute('aria-expanded'),
        headerOpen: !!document.querySelector('.site-header.is-menu-open'),
        navHidden: nav ? nav.getAttribute('aria-hidden') : null,
      }
    })()`)
    check('mobile menu: opens', opened.expanded === 'true' && opened.headerOpen, opened)
    await cdp.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 })
    await cdp.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 })
    await sleep(500)
    const after = await ev(`(() => {
      const btn = document.querySelector('button.menu-btn')
      return {
        stillOpen: btn?.getAttribute('aria-expanded') === 'true',
        expanded: btn?.getAttribute('aria-expanded') || null,
        headerOpen: !!document.querySelector('.site-header.is-menu-open'),
      }
    })()`)
    check('mobile menu: Escape closes', !after.stillOpen && !after.headerOpen, after)
  }

  // ── Reduced motion: no infinite animations ────────────────────────────────
  await cdp.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
  await go('#projects/providentia', 390)
  const motion = await ev(`(() => {
    const animated = [...document.querySelectorAll('*')].filter((el) => {
      const cs = getComputedStyle(el)
      return cs.animationName && cs.animationName !== 'none' && /infinite/i.test(cs.animationIterationCount)
    }).slice(0, 5).map((el) => el.className)
    return { infinite: animated }
  })()`)
  check('prefers-reduced-motion: no infinite CSS animations', (motion.infinite || []).length === 0, motion)

  // ── Public links / SEO head smoke on Home ─────────────────────────────────
  await cdp.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] })
  await go('#home', 1440)
  const seo = await ev(`(() => {
    const meta = (sel) => document.querySelector(sel)?.getAttribute('content') || document.querySelector(sel)?.getAttribute('href') || null
    const hrefs = [...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href'))
    return {
      title: document.title,
      description: meta('meta[name="description"]'),
      ogTitle: meta('meta[property="og:title"]'),
      ogImage: meta('meta[property="og:image"]'),
      canonical: meta('link[rel="canonical"]'),
      hasCv: hrefs.some((h) => /\\/cv\\//i.test(h || '') || /download/i.test(h || '')),
      hasGithub: hrefs.some((h) => /github\\.com/i.test(h || '')),
      hasLinkedin: hrefs.some((h) => /linkedin\\.com/i.test(h || '')),
      hasContact: hrefs.some((h) => /#contact|mailto:/i.test(h || '')),
      hasDecernoRoute: hrefs.some((h) => /decerno/i.test(h || '')),
    }
  })()`)
  check('SEO: title+description', !!seo.title && !!seo.description, seo)
  check('SEO: OG title+image', !!seo.ogTitle && !!seo.ogImage, seo)
  check('SEO: canonical', !!seo.canonical, seo)
  check('links: CV', seo.hasCv, seo)
  check('links: GitHub', seo.hasGithub)
  check('links: LinkedIn', seo.hasLinkedin)
  check('links: contact', seo.hasContact)
  check('links: no DECERNO route', !seo.hasDecernoRoute)

  // Withheld route must not resolve to a public case shell
  await go('#projects/decerno', 1440)
  const withheld = await ev(`(() => ({
    text: (document.body.innerText || '').slice(0, 400),
    shell: !!document.querySelector('.ds-case-shell, .ds-detail'),
    h1: document.querySelector('h1')?.textContent?.trim()?.slice(0, 80) || null,
  }))()`)
  check('withheld #projects/decerno: no case/detail shell', !withheld.shell, withheld)
  check('withheld #projects/decerno: no DECERNO copy', !/decerno/i.test(withheld.text || ''), withheld)

  report.notes.push('Safari iOS real and screen readers were not exercised in this Edge headless session.')
  report.notes.push('Focus indicators sampled via getComputedStyle after programmatic focus; full Tab order not automated.')
  report.notes.push('Touch target "tiny" list is informational for controls under 24px; 44px guidance remains a later improvement when composition allows.')

  fs.mkdirSync(path.dirname(outJson), { recursive: true })
  fs.writeFileSync(outJson, JSON.stringify(report, null, 2))
  const failed = report.checks.filter((c) => !c.ok)
  console.log(`\n${report.checks.length - failed.length}/${report.checks.length} checks passed`)
  if (failed.length) process.exitCode = 1
} catch (err) {
  console.error(err)
  process.exitCode = 1
} finally {
  edge.kill()
  try { fs.rmSync(profile, { recursive: true, force: true }) } catch {}
}
