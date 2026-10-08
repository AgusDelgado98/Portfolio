import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

/**
 * Project visuals: the interaction happens INSIDE the picture, every pointer
 * path has a keyboard and a touch path, labels are translated, and nothing is
 * drawn that the data does not say. Source guards plus a server render of the
 * real components.
 */

const here = path.dirname(fileURLToPath(import.meta.url))
const srcDir = path.dirname(here)
const read = (rel) => fs.readFileSync(path.join(srcDir, rel), 'utf8')
const strip = (source) => source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')

const VISUALS = ['ForecastVisual', 'LayersVisual', 'EvidenceGraphVisual', 'RiskThresholdVisual', 'SomaProductVisual']

test('interactive visuals share one part-focus hook; no data-on dimming, no chip row under the picture', () => {
  for (const name of VISUALS) {
    const source = strip(read(`visual/${name}.jsx`))
    assert.match(source, /usePartFocus/, name)
    assert.ok(!/data-on/.test(source), `${name}: no data-on attribute`)
    assert.ok(!/ds-pick/.test(source), `${name}: no chip row`)
    assert.ok(!/useState/.test(source), `${name}: selection state lives in the hook`)
  }
  const hook = strip(read('visual/usePartFocus.js'))
  for (const needle of ['onPointerEnter', 'onFocus', 'onClick', 'onKeyDown', "role: 'button'", 'tabIndex: 0', 'aria-pressed', 'focus-visible']) {
    assert.ok(hook.includes(needle), needle)
  }
  assert.match(hook, /pointerType === 'mouse'/, 'hover is mouse only; touch settles through click')
})

test('catalog cards: the picture reacts, the card does not move, tint or glow', () => {
  const projects = read('styles/projects.css')
  const visuals = read('styles/visuals.css')
  assert.ok(!/translateY\(-2px\)/.test(projects))
  assert.ok(!/\.ds-proj-link:(hover|focus-visible)\s*\{/.test(projects), 'no card-level hover or focus restyle')
  assert.ok(!/ds-pick|\[data-on/.test(projects + visuals))
  assert.match(visuals, /\.ds-proj-link:is\(:hover, :focus-visible\) \.v-signal/)
  assert.match(visuals, /\.ds-proj-link:is\(:hover, :focus-visible\) \.v-forecast-plot \.v-point/)
  // Motion only for people who allow it; no looping animation in the visuals.
  assert.match(visuals, /@media \(prefers-reduced-motion: no-preference\)/)
  assert.ok(!/infinite/.test(visuals), 'no continuous loop in the project visuals')
  const border = projects.match(/\.ds-proj-link\s*\{[^}]*\}/)[0]
  assert.match(border, /border:\s*1px solid var\(--ds-border\)/)
})

test('Soma: four open glyphs, no framed rectangles, no loose colour, no fragile selectors, no new stage', () => {
  const soma = strip(read('visual/SomaProductVisual.jsx'))
  const rects = soma.match(/<rect\b[^>]*>/g) || []
  assert.ok(rects.every((tag) => /v-hit/.test(tag)), 'rect is only used for invisible hit areas')
  for (const glyph of ['agenda', 'record', 'timeline', 'stats']) assert.ok(soma.includes(`'${glyph}'`) || soma.includes(`${glyph}:`), glyph)
  assert.ok(soma.includes('v-signal'), 'one signal joins the glyphs')
  const everything = ['styles/visuals.css', 'styles/projects.css', 'styles/tokens.css', 'visual/SomaProductVisual.jsx', 'visual/cardVisuals.jsx']
    .map(read)
    .join('\n')
  assert.ok(!/#b7c4d4/i.test(everything))
  assert.ok(!/\[class\*=/.test(everything))
  assert.ok(!/return 'product'/.test(read('visual/cardVisuals.jsx')))
  assert.ok(!/ds-soma/.test(everything))
})

test('ALETHEIA: only the real counts and statuses; no source-object or break-object links are invented', () => {
  const source = strip(read('visual/EvidenceGraphVisual.jsx'))
  assert.match(source, /ALETHEIA_COMPATIBILITY/)
  assert.ok(!/publication-charts/.test(source), 'the Home bundle never imports the case payloads')
  assert.ok(!/compatibilityMatrix/.test(source))
})

test('Contact: rows with an extending line, no tiles or boxes', () => {
  const css = read('styles/contact.css')
  const view = strip(read('components/ContactView.jsx'))
  assert.ok(!/ds-contact-tiles|border-radius|border:\s*1px/.test(css), 'no boxes')
  assert.match(css, /\.ds-contact-rule\s*\{[^}]*transform:\s*scaleX\(/)
  assert.match(css, /translateX\(6px\)/)
  assert.equal((view.match(/href: /g) || []).length, 4)
  assert.match(view, /contact\.headline/)
  assert.match(css, /prefers-reduced-motion: reduce/)
})

test('About: no panels or cards; nav order equals page order; evidence and capability panels are live regions', () => {
  const css = read('styles/about.css')
  const about = strip(read('components/About.jsx'))
  assert.ok(!/ds-about-panel|ds-about-jobs|ds-about-groups|ds-about-records/.test(css + about))
  assert.ok(!/grid-template-columns:\s*minmax\(0,\s*1\.05fr\)/.test(css), 'no two-column page grid')
  const nav = about.match(/const NAV = \[([^\]]+)\]/)[1].match(/'(\w+)'/g).map((item) => item.replace(/'/g, ''))
  const order = [...about.matchAll(/<section id="about-(\w+)"/g)].map((match) => match[1])
  assert.deepEqual(nav, order, 'nav order must match the real section order')
  assert.equal((about.match(/aria-live="polite"/g) || []).length, 2)
  assert.match(css, /prefers-reduced-motion: reduce/)
})

// ── Rendered markup ──────────────────────────────────────────────────────────

const require = createRequire(import.meta.url)
let rendered = null

async function renderAll() {
  if (rendered) return rendered
  const { buildSync } = require('esbuild')
  const entry = `
    import React from 'react'
    import { renderToStaticMarkup } from 'react-dom/server'
    import { renderProjectVisual, visualLabels } from './visual/cardVisuals.jsx'
    import { getProjectMeta } from './projects/registry.js'
    import { translations } from './i18n/translations.js'
    import { resolvePath } from './i18n/config.js'
    export const out = () => {
      const result = {}
      for (const language of ['es', 'en']) {
        const t = (key) => resolvePath(translations[language], key)
        for (const id of ['providentia', 'caelum', 'aletheia', 'paradigm', 'soma']) {
          const project = getProjectMeta(id)
          const labels = visualLabels(project, t)
          result[language + ':' + id] = {
            live: renderToStaticMarkup(renderProjectVisual(project, language, labels, true)),
            still: renderToStaticMarkup(renderProjectVisual(project, language, labels, false)),
          }
        }
      }
      return result
    }
  `
  const result = buildSync({
    stdin: { contents: entry, resolveDir: srcDir, loader: 'jsx' },
    bundle: true,
    write: false,
    format: 'cjs',
    platform: 'node',
    jsx: 'automatic',
    define: { 'process.env.NODE_ENV': '"production"' },
    logLevel: 'error',
  })
  const file = path.join(os.tmpdir(), `portfolio-visuals-test-${process.pid}.cjs`)
  fs.writeFileSync(file, result.outputFiles[0].text)
  const mod = require(file)
  fs.rmSync(file, { force: true })
  rendered = mod.out()
  return rendered
}

const parts = (markup) => [...markup.matchAll(/<g[^>]*class="v-part[^"]*"[^>]*>/g)].map((match) => match[0])
const labelsOf = (markup) => parts(markup).map((tag) => (tag.match(/aria-label="([^"]*)"/) || [])[1])

test('every interactive part is a named, focusable button; the static drawing has none', async () => {
  const out = await renderAll()
  const expected = { providentia: 3, caelum: 5, aletheia: 3, paradigm: 3, soma: 4 }
  for (const [key, { live, still }] of Object.entries(out)) {
    const id = key.split(':')[1]
    const tags = parts(live)
    assert.equal(tags.length, expected[id], key)
    for (const tag of tags) {
      assert.match(tag, /role="button"/, key)
      assert.match(tag, /tabindex="0"/, key)
      assert.match(tag, /aria-pressed="false"/, key)
      assert.match(tag, /aria-label="[^"]+"/, key)
    }
    assert.match(live, /role="group"/, key)
    assert.ok(!/role="button"/.test(still), `${key}: the card drawing carries no controls`)
    assert.match(still, /role="img"/, key)
  }
})

test('Caelum layer names are translated, never raw ids', async () => {
  const out = await renderAll()
  const es = labelsOf(out['es:caelum'].live)
  const en = labelsOf(out['en:caelum'].live)
  assert.deepEqual(es, ['8 staging', '5 dimensiones', '3 hechos', '2 marts', 'Power BI'])
  assert.deepEqual(en, ['8 staging', '5 dimensions', '3 facts', '2 marts', 'Power BI'])
})

test('PROVIDENTIA: PI90 stays the reference and the readout carries its published numbers', async () => {
  const out = await renderAll()
  for (const language of ['es', 'en']) {
    const live = out[`${language}:providentia`].live
    const labels = labelsOf(live)
    assert.deepEqual(labels.map((label) => label.split(' ')[0]), ['PI80', 'PI90', 'PI95'])
    assert.match(labels[1], language === 'es' ? /referencia/ : /reference/)
    const readout = live.match(/<p class="ds-visual-readout"[^>]*>([\s\S]*?)<\/p>/)[1].replace(/<[^>]+>/g, '')
    assert.match(readout, /PI90/)
    assert.match(readout, /135/)
    assert.match(readout, language === 'es' ? /6,1/ : /6\.1/)
  }
})

test('ALETHEIA: readouts state the registry counts and the compatibility statuses', async () => {
  const out = await renderAll()
  const es = labelsOf(out['es:aletheia'].live)
  assert.match(es[0], /^22 fuentes/)
  assert.match(es[1], /^16 objetos/)
  assert.match(es[1], /8 relaciones de compatibilidad/)
  assert.match(es[1], /6 prohibidas · 1 con condiciones · 1 solo descriptiva/)
  assert.match(es[2], /^8 quiebres/)
  const en = labelsOf(out['en:aletheia'].live)
  assert.match(en[1], /6 forbidden · 1 allowed with conditions · 1 descriptive only/)
})

test('Paradigm and Soma: translated names and number-free readouts', async () => {
  const out = await renderAll()
  assert.deepEqual(labelsOf(out['es:paradigm'].live), ['probabilidad', 'umbral', 'decisión'])
  assert.deepEqual(labelsOf(out['en:paradigm'].live), ['probability', 'threshold', 'decision'])
  assert.deepEqual(labelsOf(out['es:soma'].live), ['Agenda', 'Ficha', 'Timeline', 'Estadísticas'])
  assert.deepEqual(labelsOf(out['en:soma'].live), ['Schedule', 'Record', 'Timeline', 'Statistics'])
})

test('connector lines never leave their grid: explicit columns and no connector on the last node of a row', () => {
  const about = read('styles/about.css')
  const projects = read('styles/projects.css')
  assert.ok(!/repeat\(auto-fit/.test(about), 'About grids use explicit column counts')
  assert.match(about, /\.ds-about-stages li:nth-child\(2n\)::before\s*\{\s*display:\s*none/)
  assert.match(about, /\.ds-about-stages li:nth-child\(4n\)::before\s*\{\s*display:\s*none/)
  assert.match(projects, /\.ds-milestones li:nth-child\(4n\)::before\s*\{\s*display:\s*none/)
  assert.ok(!/overflow-x:\s*(hidden|clip)/.test(about + projects), 'the overflow is fixed, not clipped')
})
