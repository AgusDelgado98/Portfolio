import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { translations } from './i18n/translations.js'
import { resolvePath } from './i18n/config.js'
import * as links from './constants/links.js'
import { CASE_STUDIES } from './projects/caseStudies.js'

/**
 * Architecture guards — PLAN-FROZEN v1.1, F2.
 *
 * Source-inspection tests for the things that are easy to regress silently and
 * cannot be asserted at runtime without a DOM: the Guided Portfolio Experience
 * must be gone, the app must not propagate legacy hashes, and the new shell has
 * to carry the navigation the plan defines.
 */

const srcDir = path.dirname(fileURLToPath(import.meta.url))

function walk(dir) {
  const out = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) out.push(...walk(full))
    else out.push(full)
  }
  return out
}

const rel = (file) => path.relative(srcDir, file).split(path.sep).join('/')
const allFiles = walk(srcDir)
const codeFiles = allFiles.filter((file) => /\.(js|jsx)$/.test(file) && !/\.test\.js$/.test(file))
const read = (file) => fs.readFileSync(file, 'utf8')
const readRel = (name) => read(path.join(srcDir, name))

/** Drops block comments (incl. JSX `{/* … *\/}`) and `//` line comments — approximate but safe for this codebase. */
function stripComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:\\'"`])\/\/.*$/gm, '$1')
}

// ── Guided Portfolio Experience is gone ─────────────────────────────────────

test('guide: no guide folder, component, messages or tests remain', () => {
  const files = allFiles.map(rel)
  assert.ok(!files.some((file) => file.startsWith('guide/')), 'src/guide still exists')
  for (const name of ['components/GuideInvitation.jsx', 'i18n/messages/guide.js', 'i18n/messages/guide.test.js', 'components/Header.jsx']) {
    assert.ok(!files.includes(name), `${name} should be deleted`)
  }
})

test('guide: no code references the provider, hook, storage, intents or the Home layout recipe', () => {
  const pattern =
    /GuideProvider|useGuide|GuideContext|GuideInvitation|guideStorage|GUIDE_(INTENTS|VERSION|STORAGE_KEY)|chooseIntent|resolveIntentAfterNavigation|portfolio-guide|getHomeLayout|HOME_NUMBERED_SECTIONS|VALID_INTENTS|\/guide\//
  for (const file of codeFiles) {
    const source = stripComments(read(file))
    assert.ok(!pattern.test(source), `${rel(file)} still references the Guide`)
  }
})

test('guide: no Recruiter / Technical / Default selector or intent logic in components', () => {
  for (const file of codeFiles.filter((f) => rel(f).startsWith('components/'))) {
    const source = stripComments(read(file))
    assert.ok(!/\bintent\b/i.test(source), `${rel(file)} still branches on an intent`)
  }
})

test('guide: no guide CSS and no guide translation namespace remain', () => {
  for (const file of allFiles.filter((f) => f.endsWith('.css'))) {
    assert.ok(!/guide-view|home-guide-invitation|mobile-nav-guide/.test(read(file)), `${rel(file)} still styles the Guide`)
  }
  assert.equal(translations.es.guide, undefined)
  assert.equal(translations.en.guide, undefined)
})

test('guide: main.jsx mounts only the language provider around App', () => {
  const main = readRel('main.jsx')
  assert.match(main, /LanguageProvider/)
  assert.ok(!/Guide/.test(main))
})

// ── No legacy hashes in application code ────────────────────────────────────

const LEGACY_LITERALS = ['#casework', '#engineering-log', '#data-bi', '#stack', '#operations', '#enfoque', '#formacion', '#proyectos', '#portada', '#contacto']

// The only modules allowed to spell a legacy hash: they exist to recognize and
// translate them. Everything else must use canonical routes.
const LEGACY_ALLOWED = new Set(['router/legacyHashRoadmap.js', 'projects/caseStudies.js'])

test('legacy hashes: no application module builds or links to a legacy hash', () => {
  const offenders = []
  for (const file of codeFiles) {
    if (LEGACY_ALLOWED.has(rel(file))) continue
    const source = stripComments(read(file))
    for (const literal of LEGACY_LITERALS) {
      if (source.includes(literal)) offenders.push(`${rel(file)} -> ${literal}`)
    }
  }
  assert.deepEqual(offenders, [], 'legacy hash literals found outside the allowed compatibility modules')
})

test('legacy hashes: the allowed modules are exactly the ones that need them (no new ones sneak in)', () => {
  for (const name of LEGACY_ALLOWED) assert.ok(fs.existsSync(path.join(srcDir, name)), `${name} is allowlisted but does not exist`)
  const using = codeFiles
    .filter((file) => {
      const source = stripComments(read(file))
      return LEGACY_LITERALS.some((literal) => source.includes(literal))
    })
    .map(rel)
    .sort()
  assert.deepEqual(using, [...LEGACY_ALLOWED].sort())
})

test('legacy hashes: constants/links.js no longer exports any legacy-hash helper', () => {
  for (const name of ['CASEWORK_HASH', 'ENGINEERING_LOG_HASH', 'isEngineeringLogHash', 'parseCaseworkHash']) {
    assert.equal(name in links, false, `links.js still exports ${name}`)
  }
})

test('legacy hashes: the CASEWORK_*_HASH constants the case components import are canonical', () => {
  const canonicalByConstant = {
    CASEWORK_NO_SHOW_HASH: 'no-show',
    CASEWORK_OPERATIONAL_RISK_HASH: 'operational-risk',
    CASEWORK_DEMAND_FORECASTING_HASH: 'demand-forecasting',
    CASEWORK_CAPACITY_DECISION_HASH: 'capacity-decision',
    CASEWORK_POLICY_DECISION_HASH: 'policy-decision',
    CASEWORK_ALETHEIA_HASH: 'aletheia',
  }
  for (const [constant, legacySlug] of Object.entries(canonicalByConstant)) {
    const study = CASE_STUDIES.find((s) => s.legacySlug === legacySlug)
    assert.ok(study, legacySlug)
    assert.equal(links[constant], study.canonicalHash, constant)
  }
  const research = CASE_STUDIES.find((s) => s.sections.includes('research'))
  assert.equal(links.CASEWORK_ALETHEIA_RESEARCH_HASH, research.canonicalSectionHashes.research)
})

// ── Router / App wiring ─────────────────────────────────────────────────────

test('router: it depends on no JSX registry and takes no injected case lookup', () => {
  for (const name of ['router/resolveAppRoute.js', 'router/documentTitle.js', 'router/legacyHashRoadmap.js', 'router/normalizeHash.js', 'router/syncRoute.js']) {
    const source = stripComments(readRel(name))
    assert.ok(!/casework\/registry/.test(source), `${name} imports the JSX casework registry`)
    assert.ok(!/hasCaseworkCase|getCaseworkSystem/.test(source), `${name} still uses the old injection`)
  }
})

test('App: resolves cases through the router data and the explicit projectId + caseSlug link, and normalizes legacy URLs', () => {
  const app = stripComments(readRel('App.jsx'))
  assert.match(app, /syncRouteFromLocation/)
  assert.match(app, /getCaseworkComponentForCase\(/)
  assert.ok(!/getCaseworkComponent\(|getCaseworkEntry\(|listCaseworkEntries\(/.test(app), 'App still resolves routes through the old slug-based wiring')
  assert.ok(!/onExit/.test(app))
  assert.match(app, /skip-link/, 'the skip-link must stay')
  assert.match(app, /getRenderKey/)
  assert.match(app, /IntersectionObserver/)
  assert.match(app, /mainRef\.current\?\.focus/)
})

test('App: the case components no longer take or call `onExit`', () => {
  for (const file of codeFiles) {
    if (rel(file) === 'components/CaseworkIndex.jsx') continue // unrouted since F2, deleted in F6
    assert.ok(!/\bonExit\b/.test(stripComments(read(file))), `${rel(file)} still uses onExit`)
  }
})

test('App: every route a case page links back to is canonical (back links come from the router, not hard-coded Casework)', () => {
  for (const name of [
    'casework/capacity-decision/CapacityDecision.jsx',
    'casework/demand-forecasting/DemandForecasting.jsx',
    'casework/operational-risk/OperationalRisk.jsx',
    'casework/policy-decision/PolicyDecision.jsx',
    'casework/aletheia/Aletheia.jsx',
  ]) {
    const source = stripComments(readRel(name))
    assert.match(source, /backHref/, `${name} has no backHref`)
    assert.ok(!/CASEWORK_HASH/.test(source), `${name} still links to the Casework index`)
  }
})

// ── The new shell ───────────────────────────────────────────────────────────

const t = (language, key) => resolvePath(translations[language], key)

test('shell: SiteHeader carries Projects · About · Contact, the CV download, the language switch, and a menu toggle', () => {
  const source = stripComments(readRel('components/layout/SiteHeader.jsx'))
  for (const hash of ['PROJECTS_HASH', 'ABOUT_HASH', 'CONTACT_HASH', 'HOME_HASH']) assert.match(source, new RegExp(hash))
  assert.match(source, /CV_HREF/)
  assert.match(source, /download/)
  assert.match(source, /LanguageSwitch/)
  assert.match(source, /aria-current/)
  assert.match(source, /aria-expanded/)
  assert.match(source, /aria-controls="mobile-navigation"/)
  assert.match(source, /Escape/)
  const entries = source.match(/href:\s*\w+_HASH/g) || []
  assert.equal(entries.length, 3, 'the header has exactly three inline links')
})

test('shell: the logo/name links to Home', () => {
  const source = stripComments(readRel('components/layout/SiteHeader.jsx'))
  assert.match(source, /className="brand"\s+href=\{HOME_HASH\}/)
})

test('shell: MobileNav repeats all five items — Projects, About, Contact, CV and ES/EN — and nothing needs hover', () => {
  const nav = stripComments(readRel('components/layout/MobileNav.jsx'))
  assert.match(nav, /links\.map/)
  assert.match(nav, /CV_HREF/)
  assert.match(nav, /LanguageSwitch/)
  assert.match(nav, /id="mobile-navigation"/)
  const css = readRel('styles/shell.css')
  assert.ok(!/:hover\s*\{[^}]*display\s*:\s*(block|flex)/.test(css), 'the menu must not open on hover')
})

test('shell: shell.css shows the inline nav explicitly (older rules hide .nav-rail/.header-aside up to 900px) and hides it only at the menu breakpoint', () => {
  const css = readRel('styles/shell.css')
  const rule = (selector) => {
    const match = css.match(new RegExp(`\\.site-header--shell ${selector}\\s*\\{([^}]*)\\}`))
    assert.ok(match, `shell.css has no base rule for ${selector}`)
    return match[1]
  }
  assert.match(rule('\\.nav-rail'), /display:\s*flex/)
  assert.match(rule('\\.header-aside'), /display:\s*flex/)
  assert.match(rule('\\.menu-btn'), /display:\s*none/)
  // The menu breakpoint is the only place the inline nav is hidden and the toggle shown.
  const menuBlock = css.match(/@media \(max-width: 720px\)\s*\{([\s\S]*?)\n\}\n/)
  assert.ok(menuBlock, 'missing the <=720px menu media query')
  assert.match(menuBlock[1], /\.nav-rail,[\s\S]*?\.header-aside\s*\{\s*display:\s*none/)
  assert.match(menuBlock[1], /\.menu-btn\s*\{[^}]*display:\s*flex/)
  // 721–859px keeps the links but hides the name text; the mobile panel never shows above 720px.
  assert.match(css, /@media \(min-width: 721px\) and \(max-width: 859px\)\s*\{\s*\.site-header--shell \.brand-text\s*\{\s*display:\s*none/)
  assert.match(css, /@media \(min-width: 721px\)\s*\{\s*\.site-header--shell \.mobile-nav\s*\{\s*display:\s*none/)
})

test('shell: the header link order and CV match the plan (desktop: Projects · About · Contact | CV | ES/EN)', () => {
  const source = readRel('components/layout/SiteHeader.jsx')
  const order = ['PROJECTS_HASH', 'ABOUT_HASH', 'CONTACT_HASH'].map((name) => source.indexOf(`href: ${name}`))
  assert.ok(order.every((i) => i > -1))
  assert.deepEqual([...order].sort((a, b) => a - b), order)
  assert.ok(source.indexOf('header-cv') > source.indexOf('</nav>'), 'CV comes after the nav links')
  assert.ok(source.indexOf('<LanguageSwitch />') > source.indexOf('header-cv'), 'ES/EN comes after CV')
})

test('shell: every translation key the new header and mobile menu use exists in ES and EN', () => {
  const keys = new Set()
  for (const name of ['components/layout/SiteHeader.jsx', 'components/layout/MobileNav.jsx', 'components/layout/LanguageSwitch.jsx', 'components/Footer.jsx']) {
    for (const match of readRel(name).matchAll(/\bt\('([\w.]+)'\)/g)) keys.add(match[1])
  }
  for (const required of ['nav.projects', 'nav.about', 'nav.contact', 'nav.cv', 'nav.openMenu', 'nav.closeMenu', 'footer.cv']) {
    assert.ok(keys.has(required), `expected the shell to use ${required}`)
  }
  for (const key of keys) {
    for (const language of ['es', 'en']) {
      const value = t(language, key)
      assert.ok(typeof value === 'string' && value.length > 0, `${language}: missing translation "${key}"`)
    }
  }
})

test('shell: the retired destinations are not in the header (no Data & BI, Operations, Casework, Home link)', () => {
  const source = stripComments(readRel('components/layout/SiteHeader.jsx'))
  assert.ok(!/nav\.(dataBi|operations|engineeringLog)/.test(source))
  assert.ok(!/available/.test(source), 'the availability chip left the header')
})

test('footer: links to the canonical routes, with no Casework entry', () => {
  const footer = stripComments(readRel('components/Footer.jsx'))
  for (const hash of ['PROJECTS_HASH', 'ABOUT_HASH', 'CONTACT_HASH']) assert.match(footer, new RegExp(hash))
  assert.ok(!/engineeringLog|CASEWORK/.test(footer))
})

// ── About: one page, four canonical sections ────────────────────────────────

test('About: each section is a focusable block, and a plain click does not invent a route', () => {
  const about = stripComments(readRel('components/About.jsx'))
  for (const id of ['about-profile', 'about-skills', 'about-experience', 'about-education', 'about-method']) {
    assert.ok(about.includes(`id="${id}"`), `About.jsx is missing #${id}`)
  }
  assert.equal(about.split('tabIndex={-1}').length - 1, 5)
  assert.ok(about.includes('scrollIntoView('))
  assert.ok(about.includes('.focus({ preventScroll: true })'))
  assert.ok(about.includes('preventDefault()'))
  assert.ok(about.includes('aboutSectionHash'))
  assert.ok(!about.includes('pushState') && !about.includes('replaceState'))
  assert.ok(!about.includes('location.hash'))
  assert.ok(!about.includes('DataBI') && !about.includes('Operations'))
})

test('About: the header cannot cover a section, including on a phone', () => {
  const css = readRel('styles/about.css')
  assert.match(css, /\.ds-about-page \.ds-section-nav\s*\{[^}]*top:\s*112px/)
  assert.match(css, /\.ds-about-page section\s*\{[^}]*scroll-margin-top:\s*200px/)
  assert.match(css, /max-width:\s*720px[\s\S]*scroll-margin-top:\s*260px/)
  assert.match(css, /\.ds-about-page section:focus\s*\{[^}]*outline:\s*2px solid var\(--ds-focus\)/)
  const about = readRel('components/About.jsx')
  assert.ok(about.includes('ds-about-page'))
})

test('About: App passes the section down and does not undo the scroll with its own scroll-to-top / focus-main', () => {
  const app = stripComments(readRel('App.jsx'))
  assert.ok(app.includes('isAboutScrollSection'))
  assert.ok(app.includes('<AboutView section={params.section}'))
  const guard = app.indexOf('if (opensAboutSection) return')
  assert.ok(guard > -1, 'missing the exception for about sections')
  assert.ok(guard < app.indexOf('window.scrollTo'), 'the exception must come before the scroll-to-top')
  assert.ok(guard < app.indexOf('mainRef.current?.focus'), 'the exception must come before the focus-main')
  assert.ok(!app.includes('DataBI') && !app.includes('Operations'))
})

test('About: every canonical section scrolls inside the page', async () => {
  const hashes = await import('./router/hashes.js')
  assert.deepEqual([...hashes.ABOUT_SCROLL_SECTIONS], ['skills', 'experience', 'education', 'method'])
  for (const section of hashes.ABOUT_SECTIONS) assert.equal(hashes.isAboutScrollSection(section), true)
  assert.equal(hashes.isAboutScrollSection(null), false)
  assert.equal(hashes.isAboutScrollSection('profile'), false)
})

test('About: legacy aliases normalize to the section that scrolls', async () => {
  const { resolveAppRoute } = await import('./router/resolveAppRoute.js')
  const expected = {
    '#data-bi': ['#about/skills', 'skills'],
    '#stack': ['#about/skills', 'skills'],
    '#operations': ['#about/experience', 'experience'],
    '#formacion': ['#about/education', 'education'],
    '#enfoque': ['#about/method', 'method'],
  }
  for (const [hash, [canonical, section]] of Object.entries(expected)) {
    const route = resolveAppRoute(hash)
    assert.equal(route.canonicalHash, canonical, hash)
    assert.equal(route.params.section, section, hash)
    assert.equal(route.view, 'about', hash)
  }
})

test('Home (F3): a plain composition of the five sections, in the frozen order, with no intent branching', () => {
  const home = stripComments(readRel('components/Home.jsx'))
  assert.ok(!/layout\.|intent/.test(home))
  const order = ['<HomeHero', '<FeaturedProjects', '<PipelineSection', '<AboutBrief', '<ContactStrip']
  const positions = order.map((tag) => home.indexOf(tag))
  assert.ok(positions.every((position) => position > -1), 'a Home section is missing')
  assert.deepEqual([...positions].sort((a, b) => a - b), positions, 'Home sections are out of order')
})

test('Projects index (F4): one catalog, no Atlas or Cards view', () => {
  const source = stripComments(readRel('components/ProjectsIndex.jsx'))
  assert.ok(!/ProjectsAtlas|ProjectsCards|productionAside|TERRITORIES|viewToggle/.test(source))
  assert.match(source, /FilterBar/)
  assert.match(source, /ProjectGrid/)
  assert.match(source, /getVisibleCategoryFilters/)
})

test('Project detail: case studies come from caseStudies.js (canonical hashes), not from the JSX registry', () => {
  const source = stripComments(readRel('components/ProjectDetail.jsx'))
  assert.match(source, /getPublicCaseStudiesForProject/)
  assert.match(source, /canonicalHash/)
  assert.ok(!/casework\/registry/.test(source))
})
