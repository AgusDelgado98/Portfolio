import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

import { homeEs, homeEn } from './i18n/messages/home.js'
import { translations } from './i18n/translations.js'
import { resolvePath } from './i18n/config.js'
import {
  getHomeFeaturedIds,
  getProjectEntry,
  getPipelineAnchor,
  getProjectsForStage,
  PROJECT_STAGES,
  PIPELINE_ANCHORS,
} from './projects/registry.js'
import { STAGE_LABELS } from './visual/stages.js'

/**
 * Home (F3) — docs/redesign/F3A-preflight.md. The frozen copy, the guarantees
 * about what must NOT be on Home, the SVG budgets and the contrast of the new
 * tokens.
 */

const srcDir = path.dirname(fileURLToPath(import.meta.url))
const read = (rel) => fs.readFileSync(path.join(srcDir, rel), 'utf8')
const strip = (source) => source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:\\'"`])\/\/.*$/gm, '$1')

function allStrings(value, out = []) {
  if (typeof value === 'string') out.push(value)
  else if (value && typeof value === 'object') Object.values(value).forEach((child) => allStrings(child, out))
  return out
}

function keyPaths(value, prefix = '', out = []) {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    for (const [key, child] of Object.entries(value)) keyPaths(child, `${prefix}${key}.`, out)
  } else out.push(prefix.slice(0, -1))
  return out
}

// ── Frozen copy ─────────────────────────────────────────────────────────────

test('hero copy (ES): exactly the frozen text', () => {
  const hero = homeEs.hero
  assert.equal(hero.kicker, 'Agustín Delgado')
  assert.equal(hero.title, 'Data Analyst')
  assert.equal(hero.subtitle, 'Uso datos para entender problemas, construir modelos y mejorar decisiones.')
  assert.equal(
    hero.description,
    'SQL, Python y Power BI aplicados a forecasting, analytics engineering y machine learning, con resultados verificables.',
  )
  assert.equal(hero.ctaPrimary, 'Ver proyectos')
  assert.equal(hero.ctaSecondary, 'Contacto')
})

test('hero copy (EN): exactly the frozen text', () => {
  const hero = homeEn.hero
  assert.equal(hero.kicker, 'Agustín Delgado')
  assert.equal(hero.title, 'Data Analyst')
  assert.equal(hero.subtitle, 'I use data to understand problems, build models, and make better decisions.')
  assert.equal(
    hero.description,
    'SQL, Python and Power BI applied to forecasting, analytics engineering, and machine learning, with verifiable results.',
  )
  assert.equal(hero.ctaPrimary, 'View projects')
  assert.equal(hero.ctaSecondary, 'Contact')
})

test('the h1 is "Data Analyst" in both languages (identity does not change)', () => {
  assert.equal(translations.es.home.hero.title, 'Data Analyst')
  assert.equal(translations.en.home.hero.title, 'Data Analyst')
  const hero = strip(read('components/home/HomeHero.jsx'))
  assert.ok(/<h1[^>]*>\s*\{t\('home\.hero\.title'\)\}\s*<\/h1>/.test(hero))
})

test('Home carries no seniority line, no "first formal role", no Applied AI claim — anywhere, in either language', () => {
  const forbidden = /junior|trainee|entry[- ]level|internship|aspiring|primera incorporaci|first formal|applied ai|buscando|busco\b|seeking/i
  for (const [name, copy] of [['es', homeEs], ['en', homeEn]]) {
    for (const text of allStrings(copy)) assert.ok(!forbidden.test(text), `home.${name} contains "${text}"`)
  }
})

test('Home leaves no trace of Atlas / Guide / Casework wording in its copy or markup', () => {
  const forbidden = /atlas|territor|coordenad|guide|recruiter|casework|lámina|plate/i
  for (const copy of [homeEs, homeEn]) for (const text of allStrings(copy)) assert.ok(!forbidden.test(text), text)
  const files = ['components/Home.jsx', ...fs.readdirSync(path.join(srcDir, 'components/home')).map((f) => `components/home/${f}`)]
  for (const file of files) {
    const source = strip(read(file))
    assert.ok(!/hero-atlas|hero-territor|home-atlas|home-hub|atlas-access|casework\/registry|guide/i.test(source), `${file} still references the old Home`)
  }
})

test('ES and EN Home copy have exactly the same keys, none empty', () => {
  assert.deepEqual(keyPaths(homeEs).sort(), keyPaths(homeEn).sort())
  for (const copy of [homeEs, homeEn]) for (const text of allStrings(copy)) assert.ok(text.trim().length > 0)
})

test('the three approved ALETHEIA lines: sentence, metric labels and CTA (ES and EN)', () => {
  const es = homeEs.featured.cards.aletheia
  const en = homeEn.featured.cards.aletheia
  assert.equal(es.line, 'Qué datos públicos argentinos pueden compararse de verdad: fuentes, cambios metodológicos y límites de la evidencia.')
  assert.equal(en.line, 'Which Argentine public datasets can truly be compared: sources, methodological breaks, and the limits of the evidence.')
  assert.equal(es.cta, 'Explorar investigación')
  assert.equal(en.cta, 'Explore research')
  assert.equal(homeEs.featured.cards.providentia.caption, 'Datos: policy_tradeoff.csv · lockbox final')
  assert.equal(homeEn.featured.cards.providentia.caption, 'Data: policy_tradeoff.csv · final lockbox')
})

test('AboutBrief and ContactStrip copy: frozen text, no extra job-search paragraph', () => {
  assert.equal(homeEs.about.title, 'Sobre mí')
  assert.equal(homeEn.about.title, 'About')
  assert.equal(homeEs.about.cta, 'Conocer mi trayectoria')
  assert.equal(homeEn.about.cta, 'Explore my background')
  assert.equal(homeEs.contact.location, 'Buenos Aires · Remoto')
  assert.equal(homeEn.contact.location, 'Buenos Aires · Remote')
  assert.equal(homeEs.contact.availability, 'Disponibilidad estimada: ~2 semanas')
  assert.equal(homeEn.contact.availability, 'Estimated availability: ~2 weeks')
  assert.deepEqual(Object.keys(homeEs.contact).sort(), ['actionsAria', 'aria', 'availability', 'contact', 'cv', 'location'].sort())
})

test('the wiring reaches the i18n tables: every home.* key used by the components resolves in both languages', () => {
  const used = new Set()
  for (const file of fs.readdirSync(path.join(srcDir, 'components/home'))) {
    for (const match of read(`components/home/${file}`).matchAll(/t\('(home\.[\w.]+)'\)/g)) used.add(match[1])
  }
  assert.ok(used.size > 20)
  for (const key of used) for (const language of ['es', 'en']) assert.ok(typeof resolvePath(translations[language], key) === 'string', `${language}:${key}`)
})

// ── Registry-driven sections ────────────────────────────────────────────────

// featured.jsx cannot be imported by Node's test runner (JSX): its keys are read from the source.
const FEATURED_VISUAL_KEYS = [...strip(read('visual/featured.jsx')).matchAll(/^ {2}(?:'([\w-]+)'|(\w+)): \{/gm)].map(
  (match) => match[1] ?? match[2],
)

test('featured: PROVIDENTIA · Caelum · ALETHEIA, from the registry; every card has copy and a visual renderer', () => {
  assert.deepEqual(getHomeFeaturedIds(), ['providentia', 'caelum', 'aletheia'])
  for (const id of getHomeFeaturedIds()) {
    assert.ok(FEATURED_VISUAL_KEYS.includes(getProjectEntry(id).visual), `${id}: no renderer for visual "${getProjectEntry(id).visual}"`)
    for (const copy of [homeEs, homeEn]) {
      const card = copy.featured.cards[id]
      assert.ok(card && card.line && card.metricLabel && card.caption, `${id}: incomplete card copy`)
    }
  }
})

test('featured cards and pipeline name no project: they read the registry (so DECERNO joins by data)', () => {
  for (const file of ['components/home/FeaturedProjects.jsx', 'components/home/PipelineSection.jsx', 'visual/featured.jsx']) {
    const source = strip(read(file))
    for (const name of ['providentia', 'caelum', 'aletheia', 'paradigm', 'decerno', 'tekmerion', 'clarusflow', 'lumenvox']) {
      assert.ok(!new RegExp(`['"\`]${name}['"\`]`, 'i').test(source), `${file} hard-codes "${name}"`)
    }
  }
})

test('featured: ALETHEIA has no invented stack or GitHub — the card shows its tags instead', () => {
  const aletheia = getProjectEntry('aletheia')
  assert.deepEqual([...aletheia.stack], [])
  assert.equal(aletheia.homeStack, undefined)
  assert.equal(aletheia.githubUrl, undefined)
  assert.deepEqual([...aletheia.tags], ['Evidence', 'Research', 'Data Analysis'])
  for (const id of ['providentia', 'caelum']) assert.ok(getProjectEntry(id).homeStack.length <= 4)
})

test('pipeline: approved anchors and secondaries, all derived from the registry', () => {
  const view = (stage) => ({
    anchor: getPipelineAnchor(stage),
    also: getProjectsForStage(stage)
      .map((project) => project.id)
      .filter((id) => id !== getPipelineAnchor(stage)),
  })
  assert.deepEqual(view('data'), { anchor: 'caelum', also: ['clarusflow'] })
  assert.deepEqual(view('evidence'), { anchor: 'aletheia', also: ['tekmerion'] })
  assert.deepEqual(view('prediction'), { anchor: 'providentia', also: ['paradigm', 'lumenvox'] })
  assert.deepEqual(view('decision'), { anchor: 'providentia', also: [] })
  assert.deepEqual(Object.keys(PIPELINE_ANCHORS), [...PROJECT_STAGES])
  assert.deepEqual(Object.keys(STAGE_LABELS), [...PROJECT_STAGES])
})

test('pipeline: selection is local state — no hash, no routing, no timers', () => {
  const source = strip(read('components/home/PipelineSection.jsx'))
  assert.ok(/useState/.test(source))
  assert.ok(!/location|history|hashchange|setInterval|setTimeout/.test(source))
  assert.ok(/role="tablist"/.test(source) && /role="tab"/.test(source) && /role="tabpanel"/.test(source))
})

// ── Performance and motion ──────────────────────────────────────────────────

test('Home adds no dependency, no canvas/webgl, no animation library', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(srcDir, '..', 'package.json'), 'utf8'))
  assert.deepEqual(Object.keys(pkg.dependencies).sort(), ['react', 'react-dom'])
  const files = [...fs.readdirSync(path.join(srcDir, 'visual')).filter((f) => /\.jsx?$/.test(f)).map((f) => `visual/${f}`), ...fs.readdirSync(path.join(srcDir, 'components/home')).map((f) => `components/home/${f}`)]
  for (const file of files) {
    if (file.endsWith('.test.js')) continue
    assert.ok(!/canvas|webgl|three|framer-motion|gsap|requestAnimationFrame/i.test(strip(read(file))), `${file}`)
  }
})

test('exactly ONE ambient loop: a single @keyframes, applied only to the hero signal, travelling both ways; reduced motion removes it', () => {
  const css = read('styles/home.css')
  assert.equal((css.match(/@keyframes/g) || []).length, 1)
  assert.equal((css.match(/animation:/g) || []).length, 1)
  assert.ok(/\.v-pulse,\s*\.v-pulse-glow\s*\{[^}]*animation:\s*ds-pulse[^}]*infinite alternate/.test(css), 'the signal goes there and back')
  const reduced = css.slice(css.indexOf('@media (prefers-reduced-motion: reduce)'))
  assert.ok(/\.v-pulse,\s*\.v-pulse-glow\s*\{\s*display:\s*none/.test(reduced), 'the signal must disappear under reduced motion')
  assert.ok(/transition:\s*none/.test(reduced))
  // paused unless the hero is on screen and no stage is held; a held stage fades it out
  assert.ok(/animation-play-state:\s*paused/.test(css) && /data-playing='true'/.test(css))
  assert.ok(/\.v-flow\[data-focus\] \.v-pulse/.test(css))
  const hero = strip(read('visual/HeroFlowVisual.jsx'))
  assert.ok(!/setTimeout|setInterval|CYCLE/.test(hero), 'no JS timer drives the hero')
  assert.ok(/SPINE_D/.test(hero) && /className="v-pulse"/.test(hero))
})

test('nothing hides or reveals content on :hover alone (visual tweaks only)', () => {
  const css = [read('styles/home.css'), read('styles/base.css')].join('\n').replace(/\/\*[\s\S]*?\*\//g, '')
  for (const rule of css.matchAll(/([^{}]+:hover[^{}]*)\{([^}]*)\}/g)) {
    assert.ok(!/display\s*:|visibility\s*:|opacity\s*:\s*0\b|height\s*:\s*0/.test(rule[2]), `:hover rule changes visibility: ${rule[1].trim()}`)
  }
})

test('the hero svg is aria-hidden and the stage chips are real buttons that hover, focus and pin (aria-pressed)', () => {
  const source = strip(read('visual/HeroFlowVisual.jsx'))
  assert.ok(/aria-hidden="true"/.test(source) && /<button/.test(source) && /aria-pressed/.test(source))
  assert.ok(/onClick=/.test(source), 'a chip does something on click / tap')
  assert.ok(/onPointerEnter/.test(source) && /onFocus/.test(source))
  assert.ok(!/captionDetail/.test(source))
})

// ── Rendered SVG budgets (server-render the real components) ────────────────

const require = createRequire(import.meta.url)
let rendered = null

async function renderAll() {
  if (rendered) return rendered
  const { buildSync } = require('esbuild')
  const entry = `
    import React from 'react'
    import { renderToStaticMarkup } from 'react-dom/server'
    import HeroFlowVisual from './HeroFlowVisual.jsx'
    import ForecastVisual from './ForecastVisual.jsx'
    import LayersVisual from './LayersVisual.jsx'
    import EvidenceGraphVisual from './EvidenceGraphVisual.jsx'
    import { FlowSvg } from './HeroFlowVisual.jsx'
    export const out = (es, names) => ({
      hero: renderToStaticMarkup(<HeroFlowVisual labels={es.hero.flow} stageNames={names} />),
      forecast: renderToStaticMarkup(<ForecastVisual language="es" labels={es.featured.cards.providentia} />),
      layers: renderToStaticMarkup(<LayersVisual labels={es.featured.cards.caelum} />),
      evidence: renderToStaticMarkup(<EvidenceGraphVisual labels={es.featured.cards.aletheia} />),
      glyphs: Object.fromEntries(['data', 'evidence', 'prediction', 'decision'].map((s) => [s, renderToStaticMarkup(<FlowSvg className="ds-pipeline-glyph" focus={s} />)])),
    })
  `
  const result = buildSync({
    stdin: { contents: entry, resolveDir: path.join(srcDir, 'visual'), loader: 'jsx' },
    bundle: true,
    write: false,
    format: 'cjs',
    platform: 'node',
    jsx: 'automatic',
    define: { 'process.env.NODE_ENV': '"production"' },
    logLevel: 'error',
  })
  const file = path.join(os.tmpdir(), `portfolio-home-test-${process.pid}.cjs`)
  fs.writeFileSync(file, result.outputFiles[0].text)
  const mod = require(file)
  fs.rmSync(file, { force: true })
  rendered = mod.out(homeEs, STAGE_LABELS)
  return rendered
}

const countElements = (markup) => (markup.match(/<(svg|g|path|circle|rect|text|line|polyline|polygon|ellipse)\b/g) || []).length
const svgOf = (markup) => markup.match(/<svg[\s\S]*<\/svg>/)[0]

test('hero SVG: <= 90 elements and <= 6 KB of markup', async () => {
  const { hero } = await renderAll()
  const svg = svgOf(hero)
  assert.ok(countElements(svg) <= 90, `hero svg has ${countElements(svg)} elements`)
  assert.ok(Buffer.byteLength(svg) <= 6 * 1024, `hero svg markup is ${Buffer.byteLength(svg)} bytes`)
  assert.equal((svg.match(/<svg/g) || []).length, 1)
  assert.ok(!/<(filter|image|foreignObject|animate|animateMotion|script)\b/.test(svg), 'no filters, images, SMIL or scripts')
})

test('card visuals <= 45 elements each; the pipeline diagram (the hero drawing, no pulse) <= 90; no filters or images', async () => {
  const out = await renderAll()
  for (const name of ['forecast', 'layers', 'evidence']) {
    const svg = svgOf(out[name])
    assert.ok(countElements(svg) <= 45, `${name}: ${countElements(svg)} elements`)
    assert.ok(!/<(filter|image|foreignObject|animate)\b/.test(svg))
    assert.ok(/role="img"/.test(svg) && /aria-label="[^"]+"/.test(svg), `${name} must carry an accessible name (it conveys data)`)
  }
  for (const [stage, markup] of Object.entries(out.glyphs)) {
    assert.ok(countElements(markup) <= 90, `${stage}: ${countElements(markup)} elements`)
    assert.ok(!/v-pulse/.test(markup), 'the pipeline diagram has no animation')
    assert.ok(markup.includes(`data-focus="${stage}"`))
  }
})

test('PROVIDENTIA card: draws the 3 real policy points and highlights PI90 as the reference; no time series', async () => {
  const { forecast } = await renderAll()
  for (const label of ['PI80 · 10,9', 'PI90 · 6,1', 'PI95 · 3,6', 'referencia']) assert.ok(forecast.includes(label.replace(' ', ' ')) || forecast.includes(label), label)
  assert.ok(/aria-label="[^"]*PI90 es la política de referencia congelada/.test(forecast))
  assert.equal((forecast.match(/class="v-node"/g) || []).length, 1, 'exactly one highlighted node: the reference policy')
})

// ── Tokens: contrast ────────────────────────────────────────────────────────

function luminance(hex) {
  const channel = (index) => {
    const value = parseInt(hex.slice(1 + index * 2, 3 + index * 2), 16) / 255
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * channel(0) + 0.7152 * channel(1) + 0.0722 * channel(2)
}
const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

test('tokens: text, stage colors and focus meet WCAG contrast on every surface; strong borders reach 3:1', () => {
  const css = read('styles/tokens.css')
  const token = (name) => css.match(new RegExp(`--ds-${name}:\\s*(#[0-9a-fA-F]{6})`))[1]
  const surfaces = ['bg-0', 'bg-1', 'bg-2'].map(token)
  for (const name of ['text', 'text-2', 'text-3', 'data', 'evidence', 'prediction', 'decision', 'focus']) {
    for (const surface of surfaces) assert.ok(contrast(token(name), surface) >= 4.5, `--ds-${name} on ${surface}: ${contrast(token(name), surface).toFixed(2)}`)
  }
  assert.ok(contrast(token('bg-0'), token('text')) >= 4.5, 'primary button label')
  const strong = css.match(/--ds-border-strong:\s*rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/)
  const alpha = Number(strong[4])
  for (const surface of surfaces) {
    const blend = [1, 2, 3].map((i, index) => Math.round(Number(strong[i]) * alpha + parseInt(surface.slice(1 + index * 2, 3 + index * 2), 16) * (1 - alpha)))
    const hex = `#${blend.map((v) => v.toString(16).padStart(2, '0')).join('')}`
    assert.ok(contrast(hex, surface) >= 3, `strong border on ${surface}: ${contrast(hex, surface).toFixed(2)}`)
  }
})

test('the dark surface is scoped: only the data-surface attribute turns the legacy variables dark', () => {
  const base = read('styles/base.css')
  assert.ok(/:root\[data-surface='dark'\]\s*\{/.test(base))
  const app = strip(read('App.jsx'))
  assert.match(app, /dataset\.surface = 'dark'/)
  assert.ok(!/atlas\.css/.test(app))
  assert.ok(/data-surface/.test(read('../index.html')) === false || /dataset\.surface/.test(read('../index.html')))
})
