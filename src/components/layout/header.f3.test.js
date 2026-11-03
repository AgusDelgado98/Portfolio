import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { translations } from '../../i18n/translations.js'
import { resolvePath } from '../../i18n/config.js'
import { getComplementaryProjectIds, getSpotlightProjectIds, isPublished } from '../../projects/registry.js'

/**
 * F3 — header, brand and navigation ("Superficie de decisión").
 *
 * Source-inspection tests (there is no DOM here) for the contract of the new
 * header and the full-screen menu. Behavior in a real browser — open/close,
 * Tab cycle, Escape, focus return, route change, reduced motion, touch
 * targets, no horizontal scroll — was checked separately and is recorded in
 * docs/design/superficie-de-decision/f3-report.md.
 */

const layoutDir = path.dirname(fileURLToPath(import.meta.url))
const srcDir = path.resolve(layoutDir, '..', '..')
const read = (rel) => fs.readFileSync(path.join(srcDir, rel), 'utf8')

/** Drops block and line comments — approximate but safe for this codebase. */
const strip = (source) => source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1')

const header = strip(read('components/layout/SiteHeader.jsx'))
const mobileNav = strip(read('components/layout/MobileNav.jsx'))
const hook = strip(read('hooks/useModalMenu.js'))
const progress = strip(read('components/layout/ScrollProgress.jsx'))
const css = read('styles/shell.css')

test('header: brand is the monogram plus the wordmark, and links to Home', () => {
  assert.match(header, /<BrandMark \/>/)
  assert.match(header, /className="brand-word"/)
  assert.ok(!/brand-logo|brand-role|brand-spotlight/.test(header), 'the old AD tile and role line are gone')
  assert.match(header, /className="brand"\s+href=\{HOME_HASH\}/)
})

test('header: it is full-bleed with its content on the page column, and carries the progress hairline', () => {
  assert.match(header, /className="shell site-header__inner"/)
  assert.match(header, /<ScrollProgress \/>/)
  const app = strip(read('App.jsx'))
  assert.ok(app.indexOf('<SiteHeader') < app.indexOf('className="shell shell--site"'), 'SiteHeader sits outside .shell so it can span the viewport')
})

test('progress: decorative, written straight to the DOM and passive', () => {
  assert.match(progress, /aria-hidden="true"/)
  assert.ok(!/useState/.test(progress), 'a scroll event must not re-render the header')
  assert.match(progress, /scaleX\(/)
  assert.match(progress, /\{ passive: true \}/)
  assert.ok(/requestAnimationFrame/.test(progress), 'reads are batched in one frame')
})

test('brand mark: decorative, with copper only on the decision threshold', () => {
  const mark = strip(read('components/layout/BrandMark.jsx'))
  assert.match(mark, /aria-hidden="true"/)
  const rule = (name) => css.match(new RegExp(`\\.brand-mark__${name}\\s*\\{([^}]*)\\}`))?.[1] ?? ''
  assert.match(rule('threshold'), /var\(--ds-copper\)/)
  assert.match(rule('threshold'), /stroke-dasharray/)
  assert.ok(!/copper/.test(rule('ring')) && !/copper/.test(rule('wave')))
  const footer = strip(read('components/Footer.jsx'))
  assert.match(footer, /<BrandMark/)
})

test('menu: the project list comes from the published presentation lists, never from a literal id', () => {
  assert.match(mobileNav, /getSpotlightProjectIds\(\)/)
  assert.match(mobileNav, /getComplementaryProjectIds\(\)/)
  assert.ok(!/PROJECT_REGISTRY|getRegisteredProjects|getWithheldProjects|SPOTLIGHT_PROJECT_IDS|COMPLEMENTARY_PROJECT_IDS/.test(mobileNav), 'the menu cannot read the unpublished side of the registry')
  assert.ok(!/'(providentia|paradigm|soma)'|"(providentia|paradigm|soma)"/i.test(mobileNav), 'no project id is hard-coded in the menu')
  assert.match(mobileNav, /projectHash\(id\)/)
})

test('menu: every id it can list is published (a withheld project cannot appear)', () => {
  const ids = [...getSpotlightProjectIds(), ...getComplementaryProjectIds()]
  assert.ok(ids.length >= 2)
  for (const id of ids) assert.ok(isPublished(id), `${id} is listed in the menu but not published`)
  assert.ok(!ids.includes('decerno'), 'DECERNO stays out of the menu while it is withheld')
})

test('menu: header and menu never name a withheld project', () => {
  for (const [name, source] of [['SiteHeader', header], ['MobileNav', mobileNav], ['useModalMenu', hook]]) {
    assert.ok(!/decerno/i.test(source), `${name} names a withheld project`)
  }
})

test('menu: every link closes it, and the CV link keeps CV_HREF and download', () => {
  const links = mobileNav.match(/<a\b[\s\S]*?>/g) ?? []
  assert.ok(links.length >= 4)
  for (const tag of links) assert.match(tag, /onClick=\{onNavigate\}/, tag)
  assert.match(mobileNav, /href=\{CV_HREF\}\s+download/)
  assert.match(mobileNav, /<LanguageSwitch onSelect=\{onNavigate\} \/>/)
})

test('menu behavior: Escape, Tab cycle, inert page, scroll lock, route change and breakpoint', () => {
  assert.match(hook, /'Escape'/)
  assert.match(hook, /'Tab'/)
  assert.match(hook, /event\.shiftKey/)
  assert.match(hook, /\.inert\s*=\s*true/)
  assert.match(hook, /style\.overflow\s*=\s*'hidden'/)
  assert.match(hook, /'hashchange'/)
  assert.match(hook, /matchMedia\(DESKTOP_QUERY\)/)
  // The hook and the stylesheet agree on where the menu stops existing.
  assert.match(hook, /DESKTOP_QUERY = '\(min-width: 800px\)'/)
  assert.match(css, /@media \(min-width: 800px\)\s*\{\s*\.site-header--shell \.mobile-nav\s*\{\s*display:\s*none/)
  // The toggle gets focus back; every cleanup restores what it changed.
  assert.match(hook, /toggleRef\.current\?\.focus/)
  assert.match(hook, /root\.style\.overflow = previousOverflow/)
  assert.match(hook, /element\.inert = false/)
})

test('menu: opening moves focus into it, and the header uses the hook', () => {
  assert.match(mobileNav, /querySelector\('a'\)\?\.focus/)
  assert.match(header, /useModalMenu\(\{/)
  assert.match(header, /aria-expanded=\{menuOpen\}/)
  assert.match(header, /aria-controls="mobile-navigation"/)
})

test('menu styles: full screen, hidden from assistive technology when closed, 44px or larger targets', () => {
  const block = (selector) => css.match(new RegExp(`${selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\{([^}]*)\\}`))?.[1] ?? ''
  const panel = block('.site-header--shell .mobile-nav')
  assert.match(panel, /position:\s*fixed/)
  assert.match(panel, /inset:\s*0/)
  assert.match(panel, /visibility:\s*hidden/)
  assert.match(panel, /overscroll-behavior:\s*contain/)
  assert.match(block('.site-header--shell .mobile-nav.open'), /visibility:\s*visible/)
  const px = (selector, prop) => Number(block(selector).match(new RegExp(`${prop}:\\s*(\\d+)px`))?.[1] ?? 0)
  assert.ok(px('.site-header--shell .mobile-nav-list > li > a', 'min-height') >= 44)
  assert.ok(px('.site-header--shell .mobile-nav-sub a', 'min-height') >= 44)
  assert.ok(px('.site-header--shell .mobile-nav .mobile-nav-cv', 'min-height') >= 44)
  assert.ok(px('.site-header--shell .menu-btn', 'width') >= 44 && px('.site-header--shell .menu-btn', 'height') >= 44)
  assert.ok(px('.lang-switch button', 'min-width') >= 44 && px('.lang-switch button', 'min-height') >= 44)
  assert.ok(px('.site-header--shell .nav a', 'min-height') >= 44)
})

test('menu styles: prefers-reduced-motion removes every transition the header owns', () => {
  const reduced = css.match(/@media \(prefers-reduced-motion: reduce\)\s*\{([\s\S]*?)\n\}/)?.[1] ?? ''
  for (const selector of ['.mobile-nav', '.mobile-nav.open', '.menu-btn span', '.nav a', '.header-cv', '.lang-switch button']) {
    assert.ok(reduced.includes(selector), `${selector} keeps a transition under reduced motion`)
  }
  assert.match(reduced, /transition:\s*none/)
})

test('header styles: tokens only, no legacy palette and no hex literals', () => {
  const headerPart = css.slice(0, css.indexOf('/* ── Footer chrome'))
  assert.ok(!/var\(--(emerald|sky|text|bg-0|bg-1|bg-chip|border|muted|soft)\b/.test(headerPart), 'legacy Atlas variables in the header styles')
  assert.ok(!/#[0-9a-f]{3,8}\b/i.test(headerPart), 'hex literals in the header styles')
  assert.ok(!/:hover\s*\{[^}]*display\s*:\s*(block|flex)/.test(css), 'the menu must not open on hover')
})

test('header styles: the focus ring is visible on every control the header owns', () => {
  const rule = css.match(/\.site-header--shell \.brand:focus-visible,([\s\S]*?)\{([^}]*)\}/)
  assert.ok(rule, 'missing the shared focus-visible rule')
  for (const selector of ['.nav a:focus-visible', '.header-cv:focus-visible', '.lang-switch button:focus-visible', '.menu-btn:focus-visible', '.mobile-nav a:focus-visible']) {
    assert.ok(rule[0].includes(selector), selector)
  }
  assert.match(rule[2], /outline:\s*2px solid var\(--ds-focus\)/)
})

test('i18n: every key the header, menu and switch use exists in ES and EN', () => {
  const keys = new Set()
  for (const file of ['components/layout/SiteHeader.jsx', 'components/layout/MobileNav.jsx', 'components/layout/LanguageSwitch.jsx']) {
    for (const match of read(file).matchAll(/\bt\('([\w.]+)'\)/g)) keys.add(match[1])
  }
  for (const required of ['nav.projectsListAria', 'nav.complementary', 'nav.home', 'nav.projects', 'nav.about', 'nav.contact', 'nav.openMenu', 'nav.closeMenu', 'footer.cv']) {
    assert.ok(keys.has(required), `expected the header or menu to use ${required}`)
  }
  for (const key of keys) {
    for (const language of ['es', 'en']) {
      const value = resolvePath(translations[language], key)
      assert.ok(typeof value === 'string' && value.length > 0, `${language}: missing "${key}"`)
    }
  }
})
