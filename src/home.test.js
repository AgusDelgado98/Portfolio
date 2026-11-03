import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import zlib from 'node:zlib'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

import { homeEs, homeEn } from './i18n/messages/home.js'
import { translations } from './i18n/translations.js'
import { resolvePath } from './i18n/config.js'
import {
  getHomeWorkIds,
  getHomePersonalIds,
  getProjectsByGroup,
  getProjectEntry,
  getSpotlightProjectIds,
  getComplementaryProjectIds,
  isPublished,
  JOURNEY_STEPS,
} from './projects/registry.js'
import { buildAll } from '../tools/figures/build-figures.mjs'
import { FIGURE_META } from './components/home/figureMeta.js'

/**
 * Home — "Superficie de decisión" (F4). The approved copy, the guarantees about
 * what must NOT be on Home (withheld projects, legacy stage ids, certificates),
 * the static figures (generated, deterministic, budgeted), the layout rules and
 * the contrast of the tokens. The cards and card visuals that the Projects page
 * still uses keep their guards here until F5 moves them.
 */

const srcDir = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(srcDir, '..')
const read = (rel) => fs.readFileSync(path.join(srcDir, rel), 'utf8')
const strip = (source) => source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:\\'"`])\/\/.*$/gm, '$1')
const homeFiles = () => [
  'components/Home.jsx',
  ...fs.readdirSync(path.join(srcDir, 'components/home')).filter((f) => /\.jsx?$/.test(f)).map((f) => `components/home/${f}`),
]

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

// ── Approved copy ───────────────────────────────────────────────────────────

test('hero copy (ES): the approved headline, subtitle and actions', () => {
  const hero = homeEs.hero
  assert.equal(`${hero.titleLead} ${hero.titleAnd} ${hero.titleEm}.`, 'Datos, evidencia y decisiones.')
  assert.equal(hero.subtitle, 'Uso datos para entender, predecir y decidir, y explico cuánta evidencia respalda cada conclusión.')
  assert.equal(hero.eyebrow, 'Data Science · Machine Learning · IA aplicada')
  assert.equal(hero.ctaPrimary, 'Ver proyectos')
  assert.equal(hero.ctaSecondary, 'Sobre mí')
})

test('hero copy (EN): the same structure, written for review', () => {
  const hero = homeEn.hero
  assert.equal(`${hero.titleLead} ${hero.titleAnd} ${hero.titleEm}.`, 'Data, evidence and decisions.')
  assert.equal(hero.ctaPrimary, 'View projects')
  assert.equal(hero.ctaSecondary, 'About me')
  assert.match(hero.eyebrow, /Data Science · Machine Learning · Applied AI/)
})

test('the h1 is the headline, split so only "decisiones" is italic; it is not a job title', () => {
  const hero = strip(read('components/home/HomeHero.jsx'))
  assert.match(hero, /<h1 id="home-hero-title"[^>]*>[\s\S]*home\.hero\.titleLead[\s\S]*home\.hero\.titleAnd[\s\S]*<em>\{t\('home\.hero\.titleEm'\)\}<\/em>/)
  assert.ok(!/Data Analyst/.test(hero))
})

test('Home positioning: no seniority line, no "Data Scientist" as a title, no certificate wording — in either language', () => {
  const forbidden = /junior|trainee|entry[- ]level|internship|aspiring|primera incorporaci|first formal|buscando|busco\b|seeking|data scientist|certificad|certified|certificate/i
  for (const [name, copy] of [['es', homeEs], ['en', homeEn]]) {
    for (const key of ['hero', 'journey', 'profile', 'selected']) {
      for (const text of allStrings(copy[key])) assert.ok(!forbidden.test(text), `home.${name}.${key} contains "${text}"`)
    }
  }
})

test('profile: current work, training and direction are the confirmed facts, and nothing in progress is presented as completed', () => {
  const [base, training, direction] = homeEs.profile.rows
  assert.match(base.text, /dedicación parcial/)
  assert.match(training.text, /Tecnicatura en Ciencia de Datos \(en curso\)/)
  assert.match(training.text, /DataCamp/)
  assert.match(direction.text, /machine learning aplicado/)
  const [baseEn, trainingEn] = homeEn.profile.rows
  assert.match(baseEn.text, /Part-time/)
  assert.match(trainingEn.text, /in progress/)
  assert.match(trainingEn.text, /DataCamp/)
  assert.equal(homeEs.profile.rows.length, 3)
  assert.equal(homeEn.profile.rows.length, 3)
})

test('Home leaves no trace of Atlas / Guide / Casework wording in its copy or markup', () => {
  const forbidden = /atlas|territor|coordenad|guide|recruiter|casework|lámina/i
  for (const copy of [homeEs, homeEn]) {
    for (const key of ['hero', 'journey', 'profile', 'selected']) for (const text of allStrings(copy[key])) assert.ok(!forbidden.test(text), text)
  }
  for (const file of homeFiles()) {
    assert.ok(!/hero-atlas|hero-territor|home-atlas|home-hub|atlas-access|casework\/registry|guide|HeroFlowVisual|StageDetail/i.test(strip(read(file))), `${file} still references the old Home`)
  }
})

test('ES and EN Home copy have exactly the same keys, none empty', () => {
  assert.deepEqual(keyPaths(homeEs).sort(), keyPaths(homeEn).sort())
  for (const copy of [homeEs, homeEn]) for (const text of allStrings(copy)) assert.ok(text.trim().length > 0)
})

test('ContactStrip copy: frozen text, no extra job-search paragraph', () => {
  assert.equal(homeEs.contact.location, 'Buenos Aires · Remoto')
  assert.equal(homeEn.contact.location, 'Buenos Aires · Remote')
  assert.equal(homeEs.contact.availability, 'Disponibilidad estimada: ~2 semanas')
  assert.equal(homeEn.contact.availability, 'Estimated availability: ~2 weeks')
  assert.deepEqual(Object.keys(homeEs.contact).sort(), ['actionsAria', 'aria', 'availability', 'contact', 'cv', 'location'].sort())
})

test('the wiring reaches the i18n tables: every home.* key the components use resolves in both languages', () => {
  const used = new Set()
  for (const file of homeFiles()) {
    for (const match of read(file).matchAll(/t\('(home\.[\w.]+)'\)/g)) used.add(match[1])
    for (const match of read(file).matchAll(/t\(`(home\.[\w.]+)\$\{/g)) used.add(match[1].replace(/\.$/, ''))
  }
  assert.ok(used.size >= 15, `only ${used.size} keys found`)
  for (const key of used) for (const language of ['es', 'en']) assert.ok(resolvePath(translations[language], key) !== undefined, `${language}:${key}`)
})

// ── Journey ─────────────────────────────────────────────────────────────────

test('journey: the four steps are the registry journey ids, in order, with a glyph each — never the legacy stage ids', () => {
  assert.deepEqual([...JOURNEY_STEPS], ['explore', 'model', 'evaluate', 'decide'])
  for (const copy of [homeEs, homeEn]) assert.deepEqual(Object.keys(copy.journey.steps), [...JOURNEY_STEPS])
  const hero = strip(read('components/home/HomeHero.jsx'))
  assert.match(hero, /JOURNEY_STEPS\.map/)
  assert.ok(!/'(data|evidence|prediction|decision)'/.test(hero), 'the hero must not reuse the legacy stage ids')
  const sprite = fs.readFileSync(path.join(rootDir, 'public/figures/journey-glyphs.svg'), 'utf8')
  assert.deepEqual([...sprite.matchAll(/<symbol id="(\w+)"/g)].map((m) => m[1]), [...JOURNEY_STEPS])
})

// ── Selected projects and the publication contract ──────────────────────────

test('selected projects: copy exists for exactly the published projects that Home shows, and for no withheld one', () => {
  const shown = [...getSpotlightProjectIds(), ...getComplementaryProjectIds()]
  for (const copy of [homeEs, homeEn]) {
    assert.deepEqual(Object.keys(copy.selected.projects).sort(), [...shown].sort())
    for (const id of shown) assert.ok(isPublished(id), `${id} is shown but not published`)
  }
  assert.ok(!('decerno' in homeEs.selected.projects) && !('decerno' in homeEn.selected.projects))
})

test('selected projects: the order is the registry presentation order; the first is the principal slot', () => {
  assert.deepEqual(getSpotlightProjectIds(), ['providentia', 'paradigm'])
  assert.deepEqual(getComplementaryProjectIds(), ['soma'])
  const source = strip(read('components/home/FeaturedProjects.jsx'))
  assert.match(source, /getSpotlightProjectIds\(\)/)
  assert.match(source, /getComplementaryProjectIds\(\)/)
  assert.match(source, /index === 0 \?/)
  assert.ok(!/PROJECT_REGISTRY|getRegisteredProjects|getWithheldProjects|SPOTLIGHT_PROJECT_IDS/.test(source), 'it cannot read the unpublished side of the registry')
})

test('selected projects: no component, copy or asset on Home names a withheld project', () => {
  for (const file of homeFiles()) assert.ok(!/decerno/i.test(read(file)), `${file} names a withheld project`)
  for (const copy of [homeEs, homeEn]) for (const key of ['hero', 'journey', 'profile', 'selected']) for (const text of allStrings(copy[key])) assert.ok(!/decerno/i.test(text), text)
  for (const file of fs.readdirSync(path.join(rootDir, 'public/figures'))) assert.ok(!/decerno/i.test(fs.readFileSync(path.join(rootDir, 'public/figures', file), 'utf8')), file)
})

test('selected projects: every figure is labelled as conceptual and declares what it shows', () => {
  for (const copy of [homeEs, homeEn]) {
    for (const [id, project] of Object.entries(copy.selected.projects)) {
      if (!project.figure) continue
      assert.match(project.figure.note, /concept/i, `${id}: its figure is not labelled as conceptual`)
      assert.ok(project.figure.alt.length > 20, `${id}: figure without a description`)
    }
  }
  assert.match(homeEs.hero.figure.caption, /figura conceptual, datos simulados/)
  assert.match(homeEn.hero.figure.caption, /conceptual figure, simulated data/)
})

// ── Figures: static SVG assets ──────────────────────────────────────────────

test('figures: the files on disk are exactly what the generator produces (deterministic, no drift)', () => {
  for (const [rel, content] of Object.entries(buildAll())) {
    assert.equal(fs.readFileSync(path.join(rootDir, rel), 'utf8'), content, `${rel} differs from the generator output: run node tools/figures/build-figures.mjs`)
  }
})

test('figures: geometry only — no text, scripts, images, filters or external references', () => {
  for (const file of fs.readdirSync(path.join(rootDir, 'public/figures')).filter((f) => f.endsWith('.svg'))) {
    const svg = fs.readFileSync(path.join(rootDir, 'public/figures', file), 'utf8')
    assert.ok(!/<(text|script|image|filter|foreignObject|animate|animateTransform|animateMotion|set)\b/.test(svg), `${file}: forbidden element`)
    assert.ok(!/https?:\/\/(?!www\.w3\.org)|href=|url\(/.test(svg.replace(/xmlns="[^"]+"/, '')), `${file}: external reference`)
    assert.ok(!/on\w+=/.test(svg), `${file}: event handler`)
  }
})

test('figures: weight budget (the hero surface is the heaviest and is the largest contentful element)', () => {
  const sizes = Object.fromEntries(
    fs.readdirSync(path.join(rootDir, 'public/figures')).filter((f) => f.endsWith('.svg')).map((file) => {
      const buf = fs.readFileSync(path.join(rootDir, 'public/figures', file))
      return [file, { raw: buf.length, gzip: zlib.gzipSync(buf, { level: 9 }).length }]
    }),
  )
  assert.ok(sizes['surface-hero.svg'].gzip <= 36_000, `hero surface ${sizes['surface-hero.svg'].gzip} B gzip`)
  assert.ok(sizes['surface-compact.svg'].gzip <= 20_000, `compact surface ${sizes['surface-compact.svg'].gzip} B gzip`)
  for (const file of ['forecast-fan.svg', 'quality-mosaic.svg', 'seam.svg', 'journey-glyphs.svg']) assert.ok(sizes[file].gzip <= 9_000, `${file} ${sizes[file].gzip} B gzip`)
  assert.ok(sizes['contour-map.svg'].gzip <= 14_000, `contour map ${sizes['contour-map.svg'].gzip} B gzip`)
  const total = Object.values(sizes).reduce((sum, s) => sum + s.gzip, 0)
  assert.ok(total <= 80_000, `all figures ${total} B gzip`)
})

test('figures: label positions are inside the figure box', () => {
  const percents = []
  for (const label of FIGURE_META.hero.labels) percents.push(label.x, label.y)
  for (const value of percents) assert.ok(value >= 0 && value <= 100, `label at ${value}%`)
  assert.deepEqual(FIGURE_META.hero.labels.map((l) => l.id), ['obs', 'surf', 'unc', 'thr'])
  for (const key of Object.keys(FIGURE_META.contour.labels)) {
    const label = FIGURE_META.contour.labels[key]
    assert.ok(label.x >= 0 && label.x <= 100, `contour ${key}.x`)
    assert.ok(label.y >= 0 && label.y <= 100, `contour ${key}.y`)
  }
})

test('hero figure on a phone: nothing sits over the drawing; the legend carries a key per item instead of numbers', () => {
  assert.deepEqual(Object.keys(FIGURE_META.phone).sort(), ['H', 'W'], 'the compact figure has no marker positions')
  const hero = strip(read('components/home/HeroFigure.jsx'))
  assert.ok(!/badge/.test(hero), 'no markers over the surface')
  assert.match(hero, /data-id=\{label\.id\}/)
  const css = read('styles/home.css')
  for (const id of FIGURE_META.hero.labels.map((l) => l.id)) assert.ok(css.includes(`li[data-id='${id}'] .home-figure__n::before`), `no key for ${id}`)
  assert.ok(!/home-figure__badge/.test(css))
})

test('hero on a phone: the short eyebrow and caption exist in both languages and keep the figure identified as conceptual and simulated', () => {
  for (const copy of [homeEs, homeEn]) {
    assert.ok(copy.hero.eyebrowShort.length < copy.hero.eyebrow.length)
    assert.ok(copy.hero.figure.captionShort.length < copy.hero.figure.caption.length)
  }
  assert.match(homeEs.hero.figure.captionShort, /figura conceptual, datos simulados/)
  assert.match(homeEn.hero.figure.captionShort, /conceptual figure, simulated data/)
  const figure = strip(read('components/home/HeroFigure.jsx'))
  assert.match(figure, /home-figure__caption-long/)
  assert.match(figure, /home-figure__caption-short/)
})

test('hero on a phone: the primary action stays in the first screen — tight vertical rhythm and a 48px button', () => {
  const css = read('styles/home.css')
  const rule = (selector) => css.match(new RegExp(`${selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} \\{([^}]*)\\}`))?.[1] ?? ''
  const px = (selector, prop) => Number(rule(selector).match(new RegExp(`${prop}:\\s*(\\d+)px`))?.[1] ?? 999)
  assert.ok(px('.home-hero', 'padding-top') <= 16)
  assert.match(rule('.home-figure'), /margin: 8px 0 0/)
  assert.ok(px('.home-hero__actions', 'margin-top') <= 16)
  assert.match(rule('.home-btn,\n.home-open'), /min-height: 48px/)
})

test('hero figure: the visible image is never lazy, has its size and a description; below-the-fold figures are lazy', () => {
  const hero = strip(read('components/home/HeroFigure.jsx'))
  assert.match(hero, /fetchpriority="high"/)
  assert.ok(!/loading="lazy"/.test(hero))
  assert.match(hero, /width=\{PHONE\.W\}\s+height=\{PHONE\.H\}/)
  assert.match(hero, /alt=\{t\(`\$\{figure\}\.alt`\)\}/)
  assert.match(hero, /media="\(min-width: 1180px\)"/)
  const fan = strip(read('components/figures/ForecastFan.jsx'))
  const mosaic = strip(read('components/figures/QualityMosaic.jsx'))
  assert.match(fan, /loading=\{lazy \? 'lazy' : 'eager'\}/)
  assert.match(mosaic, /loading=\{lazy \? 'lazy' : 'eager'\}/)
  assert.match(fan, /alt=\{copy\.alt\}/)
  assert.match(mosaic, /alt=\{copy\.alt\}/)
})

test('figures are assets, not code: Home imports no figure data, no canvas, no animation library, no dependency', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'))
  assert.deepEqual(Object.keys(pkg.dependencies).sort(), ['react', 'react-dom'])
  for (const file of homeFiles()) {
    const source = strip(read(file))
    assert.ok(!/canvas|webgl|three|framer-motion|gsap|requestAnimationFrame|d3/i.test(source), file)
    assert.ok(!/<svg[^>]*>\s*<(path|polygon|circle)/.test(source), `${file} draws inline figures`)
  }
})

// ── Layout, motion and touch targets ────────────────────────────────────────

test('layout: bands run edge to edge with their content on the page column; the phone gutter is 22px and grows', () => {
  const css = read('styles/home.css')
  assert.match(css, /\.home-band \{[^}]*margin-inline: calc\(50% - 50vw\)/)
  assert.match(css, /--home-gutter: clamp\(22px, 5vw, 40px\)/)
  assert.match(css, /\.home-band \{[^}]*padding-inline: var\(--home-gutter\)/)
  assert.match(css, /padding-inline: calc\(50vw - 50%\)/)
  assert.match(read('styles.css'), /\.page \{[^}]*overflow-x: clip/)
  assert.match(css, /\.home-seam \{[^}]*url\('\/figures\/seam\.svg'\)/)
})

test('layout: the hero reorders the figure between headline and text on a phone, keeping DOM order head, body, figure', () => {
  const hero = strip(read('components/home/HomeHero.jsx'))
  const order = ['home-hero__head', 'home-hero__body', '<HeroFigure']
  const positions = order.map((token) => hero.indexOf(token))
  assert.ok(positions.every((p) => p > -1))
  assert.deepEqual([...positions].sort((a, b) => a - b), positions)
  const css = read('styles/home.css')
  assert.match(css, /\.home-figure \{[^}]*order: 2/)
  assert.match(css, /\.home-hero__body \{[^}]*order: 3/)
})

test('motion: Home animates nothing — no keyframes, no animation, no transitions', () => {
  const css = strip(read('styles/home.css'))
  assert.ok(!/@keyframes|animation\s*:/.test(css))
  for (const match of css.matchAll(/transition\s*:\s*([^;}]+)/g)) assert.equal(match[1].trim(), 'none', 'only `transition: none` (reduced motion for .ds-btn) is allowed')
  assert.ok(!/scroll-behavior\s*:\s*smooth/.test(css))
})

test('nothing hides or reveals content on :hover alone (visual tweaks only)', () => {
  const css = [read('styles/home.css'), read('styles/base.css')].join('\n').replace(/\/\*[\s\S]*?\*\//g, '')
  for (const rule of css.matchAll(/([^{}]+:hover[^{}]*)\{([^}]*)\}/g)) {
    assert.ok(!/display\s*:|visibility\s*:|opacity\s*:\s*0\b|height\s*:\s*0/.test(rule[2]), `:hover rule changes visibility: ${rule[1].trim()}`)
  }
})

test('touch targets: links and buttons are 44px or taller', () => {
  const css = read('styles/home.css')
  const block = (selector) => css.match(new RegExp(`${selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} \\{([^}]*)\\}`))?.[1] ?? ''
  const minHeight = (selector) => Number(block(selector).match(/min-height:\s*(\d+)px/)?.[1] ?? 0)
  assert.ok(minHeight('.home-link') >= 44)
  // The legend is a list of terms, not controls: it needs to read well, not to be tapped.
  assert.ok(!/<(a|button)\b/.test(strip(read('components/home/HeroFigure.jsx'))))
  assert.ok(minHeight('.home-figure__legend li') >= 36)
  assert.match(block('.home-btn,\n.home-open'), /min-height: 48px/)
  assert.ok(minHeight('.home-row .home-open') >= 44)
})

test('focus: links show a ring on dark and a dark ring on paper', () => {
  const css = read('styles/home.css')
  assert.match(css, /\.ds-home a:focus-visible \{[^}]*outline: 2px solid var\(--ds-focus\)/)
  assert.match(css, /\.ds-home \.home-paper a:focus-visible \{[^}]*outline-color: var\(--ds-paper-text\)/)
  assert.match(css, /\.ds-home \.home-plate a:focus-visible \{[^}]*outline-color: var\(--ds-focus\)/)
})

test('paper surface: the text colors used on paper meet WCAG contrast (4.5:1)', () => {
  const tokens = read('styles/tokens.css')
  const token = (name) => tokens.match(new RegExp(`--ds-${name}:\\s*(#[0-9a-fA-F]{6})`))[1]
  for (const name of ['paper-text', 'paper-text-2']) assert.ok(contrast(token(name), token('paper')) >= 4.5, `${name} on paper: ${contrast(token(name), token('paper')).toFixed(2)}`)
})

// ── Cards and visuals still used by the Projects page (until F5) ────────────

// featured.jsx cannot be imported by Node's test runner (JSX): its keys are read from the source.
const FEATURED_VISUAL_KEYS = [...strip(read('visual/featured.jsx')).matchAll(/^ {2}(?:'([\w-]+)'|(\w+)): \{/gm)].map(
  (match) => match[1] ?? match[2],
)

test('the ALETHEIA card lines: sentence (latest framing from main), metric labels and CTA (ES and EN)', () => {
  const es = homeEs.featured.cards.aletheia
  const en = homeEn.featured.cards.aletheia
  assert.equal(es.line, 'Investigación guiada por evidencia sobre el trabajo en Argentina: 18 preguntas con fuentes públicas, resultados auditables y límites explícitos.')
  assert.equal(en.line, 'Evidence-driven research on labor in Argentina: 18 questions with public sources, auditable findings and explicit limits.')
  assert.equal(es.cta, 'Explorar investigación')
  assert.equal(en.cta, 'Explore research')
  assert.equal(homeEs.featured.cards.providentia.caption, 'Caso público · policy_tradeoff.csv · período final de evaluación')
  assert.equal(homeEn.featured.cards.providentia.caption, 'Public case · policy_tradeoff.csv · final evaluation period')
})

test('work-linked projects: PARADIGM · PROVIDENTIA · SOMA, in that order, from the registry; every card has copy and a visual renderer', () => {
  assert.deepEqual(getHomeWorkIds(), ['paradigm', 'providentia', 'soma'])
  assert.deepEqual(getProjectsByGroup('work').map((project) => project.id), ['paradigm', 'providentia', 'soma'])
  for (const id of getHomeWorkIds()) {
    assert.ok(FEATURED_VISUAL_KEYS.includes(getProjectEntry(id).visual), `${id}: no renderer for visual "${getProjectEntry(id).visual}"`)
    for (const copy of [homeEs, homeEn]) {
      const card = copy.featured.cards[id]
      assert.ok(card && card.line && card.caption && card.provenance, `${id}: incomplete card copy`)
    }
  }
})

test('personal projects: Caelum · ALETHEIA, from the registry; they are not work-linked', () => {
  assert.deepEqual(getHomePersonalIds(), ['caelum', 'aletheia'])
  for (const id of getHomePersonalIds()) {
    assert.equal(getProjectEntry(id).group, 'personal')
    assert.equal(getProjectEntry(id).usage, null)
    assert.ok(FEATURED_VISUAL_KEYS.includes(getProjectEntry(id).visual), `${id}: no renderer for visual "${getProjectEntry(id).visual}"`)
    for (const copy of [homeEs, homeEn]) {
      const card = copy.featured.cards[id]
      assert.ok(card && card.line && card.metricLabel && card.caption, `${id}: incomplete card copy`)
    }
  }
})

test('work-linked copy: professional use is declared, the demonstration is labelled, nothing claims production, deployment or workplace results', () => {
  const forbidden = /producci[oó]n|production|en uso por|in use by|deployed|desplegad|dashboard|impacto|impact|ahorro|saving|lockbox|220/i
  for (const [name, copy] of [['es', homeEs], ['en', homeEn]]) {
    assert.ok(copy.projectGroups.work.usage && copy.projectGroups.work.provenanceLabel)
    for (const id of getHomeWorkIds()) {
      for (const text of allStrings(copy.featured.cards[id])) assert.ok(!forbidden.test(text), `${name}.${id}: "${text}"`)
    }
    for (const text of allStrings(copy.projectGroups)) assert.ok(!forbidden.test(text), `${name}.projectGroups: "${text}"`)
    for (const id of Object.keys(copy.selected.projects)) {
      for (const text of allStrings(copy.selected.projects[id])) assert.ok(!forbidden.test(text), `${name}.selected.${id}: "${text}"`)
    }
  }
  assert.equal(homeEs.projectGroups.work.usage, 'Uso profesional')
  assert.equal(homeEn.projectGroups.work.usage, 'Professional use')
  assert.equal(homeEs.selected.professionalUse, homeEs.projectGroups.work.usage)
  assert.equal(homeEn.selected.professionalUse, homeEn.projectGroups.work.usage)
  assert.equal(homeEs.projectGroups.work.title, 'Proyectos vinculados a mi trabajo')
  assert.equal(homeEn.projectGroups.work.title, 'Work-related projects')
  assert.equal(homeEs.projectGroups.personal.title, 'Proyectos personales')
  assert.equal(homeEn.projectGroups.personal.title, 'Personal projects')
})

test('provenance of the public demonstrations: PARADIGM synthetic, PROVIDENTIA public StatsWales, SOMA fictitious (ES and EN)', () => {
  assert.match(homeEs.featured.cards.paradigm.provenance, /sintéticos/)
  assert.match(homeEn.featured.cards.paradigm.provenance, /synthetic/)
  assert.match(homeEs.featured.cards.providentia.provenance, /StatsWales/)
  assert.match(homeEn.featured.cards.providentia.provenance, /StatsWales/)
  assert.match(homeEs.featured.cards.soma.provenance, /exclusivamente ficticios/)
  assert.match(homeEn.featured.cards.soma.provenance, /exclusively fictitious/)
  // The Home rows say the same things in their own words.
  assert.match(homeEs.selected.projects.providentia.data, /StatsWales/)
  assert.match(homeEs.selected.projects.paradigm.data, /sintéticos/)
  assert.match(homeEs.selected.projects.soma.note, /ficticios/)
  assert.match(homeEn.selected.projects.paradigm.data, /synthetic/)
  assert.match(homeEn.selected.projects.soma.note, /fictitious/)
})

test('PROVIDENTIA wording: referrals are not appointments, and its figure is tied to the final evaluation period', () => {
  assert.match(homeEs.featured.cards.providentia.provenance, /derivación.*no es una cita atendida/)
  assert.match(homeEn.featured.cards.providentia.provenance, /referral is not an attended appointment/)
  assert.match(homeEs.featured.cards.providentia.metricLabel, /período final de evaluación/)
  assert.match(homeEn.featured.cards.providentia.metricLabel, /final evaluation period/)
})

test('featured visuals name no project: they read the registry (so a published project joins by data)', () => {
  const source = strip(read('visual/featured.jsx'))
  for (const name of ['providentia', 'caelum', 'aletheia', 'paradigm', 'decerno', 'tekmerion', 'clarusflow', 'lumenvox']) {
    assert.ok(!new RegExp(`['"\`]${name}['"\`]`, 'i').test(source), `visual/featured.jsx hard-codes "${name}"`)
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

test('card visuals keep their readouts (ES and EN)', () => {
  for (const copy of [homeEs, homeEn]) {
    assert.ok(copy.featured.hint.length > 0)
    assert.deepEqual(Object.keys(copy.featured.cards.paradigm.readout).sort(), ['decision', 'score', 'threshold'])
    assert.deepEqual(Object.keys(copy.featured.cards.soma.readout).sort(), ['agenda', 'record', 'stats', 'timeline'])
  }
})

// ── Rendered SVG budgets of the card visuals (server-render the real components) ──

const require = createRequire(import.meta.url)
let rendered = null

async function renderAll() {
  if (rendered) return rendered
  const { buildSync } = require('esbuild')
  const entry = `
    import React from 'react'
    import { renderToStaticMarkup } from 'react-dom/server'
    import ForecastVisual from './ForecastVisual.jsx'
    import LayersVisual from './LayersVisual.jsx'
    import EvidenceGraphVisual from './EvidenceGraphVisual.jsx'
    export const out = (es) => ({
      forecast: renderToStaticMarkup(<ForecastVisual language="es" labels={es.featured.cards.providentia} />),
      layers: renderToStaticMarkup(<LayersVisual labels={es.featured.cards.caelum} />),
      evidence: renderToStaticMarkup(<EvidenceGraphVisual labels={es.featured.cards.aletheia} />),
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
  rendered = mod.out(homeEs)
  return rendered
}

const countElements = (markup) => (markup.match(/<(svg|g|path|circle|rect|text|line|polyline|polygon|ellipse)\b/g) || []).length
const svgOf = (markup) => markup.match(/<svg[\s\S]*<\/svg>/)[0]

test('card visuals <= 45 elements each; no filters or images; each carries an accessible name', async () => {
  const out = await renderAll()
  for (const name of ['forecast', 'layers', 'evidence']) {
    const svg = svgOf(out[name])
    assert.ok(countElements(svg) <= 45, `${name}: ${countElements(svg)} elements`)
    assert.ok(!/<(filter|image|foreignObject|animate)\b/.test(svg))
    assert.ok(/role="img"/.test(svg) && /aria-label="[^"]+"/.test(svg), `${name} must carry an accessible name (it conveys data)`)
  }
})

test('PROVIDENTIA card: draws the 3 real policy points and highlights PI90 as the reference; no time series', async () => {
  const { forecast } = await renderAll()
  for (const label of ['PI80 · 10,9', 'PI90 · 6,1', 'PI95 · 3,6', 'referencia']) assert.ok(forecast.includes(label), label)
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
