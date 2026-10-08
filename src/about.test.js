import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { translations } from './i18n/translations.js'

/**
 * F5 — About and Contact. Source-inspection guards: the interim views are
 * gone, the new pages carry the factual copy, and both sit on the dark surface.
 */

const srcDir = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.dirname(srcDir)
const es = translations.es
const en = translations.en

function walk(dir) {
  const out = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) out.push(...walk(full))
    else out.push(full)
  }
  return out
}

function read(rel) {
  return fs.readFileSync(path.join(srcDir, rel), 'utf8')
}

test('the interim Data & BI and Operations views are gone, and nothing imports them', () => {
  for (const name of ['components/DataBI.jsx', 'components/Operations.jsx']) {
    assert.equal(fs.existsSync(path.join(srcDir, name)), false, name)
  }
  for (const file of walk(srcDir)) {
    if (!/\.(js|jsx)$/.test(file) || file.endsWith('.test.js')) continue
    const source = fs.readFileSync(file, 'utf8')
    assert.ok(!/from ['"][^'"]*DataBI/.test(source), file)
    assert.ok(!/from ['"][^'"]*Operations/.test(source), file)
    assert.ok(!/AboutProfile|LearningRecord|StackGroups|ContactChannels/.test(source), file)
  }
})

test('About sections and Contact channels are present in the pages', () => {
  const about = read('components/About.jsx')
  for (const id of ['about-profile', 'about-skills', 'about-experience', 'about-education', 'about-method']) {
    assert.ok(about.includes(`id="${id}"`))
  }
  assert.ok(about.includes('contact.experienceJobs'))
  assert.ok(about.includes("status: 'in_progress'"))
  assert.ok(about.includes('stack.statusCompleted'))
  assert.ok(about.includes('stack.statusInProgress'))
  assert.ok(!about.includes('Talento Tech'))

  const contact = read('components/ContactView.jsx')
  for (const needle of ['LINKEDIN_URL', 'GITHUB_PROFILE_URL', 'CV_HREF', 'mailto:augusto.delgado00@hotmail.com', 'home.contact.location', 'home.contact.availability', 'ds-contact-page']) {
    assert.ok(contact.includes(needle), needle)
  }
  assert.ok(!/contact\.lead|tags\.remote|whatsapp|tel:|<form|híbrido|hybrid/i.test(contact))
})

test('About and Contact copy stays in parity and avoids the retired claims', () => {
  assert.equal(es.about.profile.title, 'Data Analyst')
  assert.equal(en.about.profile.title, 'Data Analyst')
  assert.deepEqual(Object.keys(es.about.sections), Object.keys(en.about.sections))
  assert.deepEqual(Object.keys(es.about.skills.groups), Object.keys(en.about.skills.groups))
  assert.deepEqual(
    Object.keys(es.about.skills.groups),
    ['analysis', 'engineering', 'modeling', 'tools'],
  )
  for (const key of Object.keys(es.about.skills.groups)) {
    assert.equal(es.about.skills.groups[key].items.length, en.about.skills.groups[key].items.length, key)
  }
  assert.equal(es.about.method.stages.length, 4)
  assert.equal(en.about.method.stages.length, 4)
  assert.equal(es.about.method.sequence, en.about.method.sequence)
  assert.ok(es.contact.pageTitle && en.contact.pageTitle)
  assert.ok(es.contact.pageLede && en.contact.pageLede)
  assert.equal(es.home.contact.location, 'Buenos Aires · Remoto')
  assert.equal(en.home.contact.location, 'Buenos Aires · Remote')
  assert.equal(es.home.contact.availability, 'Disponibilidad estimada: ~2 semanas')
  assert.equal(en.home.contact.availability, 'Estimated availability: ~2 weeks')

  const shipped = [
    es.about.profile,
    en.about.profile,
    es.about.experience,
    en.about.experience,
    es.about.method,
    en.about.method,
    es.contact.pageLede,
    en.contact.pageLede,
    es.contact.pageTitle,
    en.contact.pageTitle,
  ]
  const blob = JSON.stringify(shipped)
  for (const pattern of [
    /junior/i,
    /entry-level/i,
    /trainee/i,
    /aspiring/i,
    /data scientist/i,
    /applied ai/i,
    /primera incorporaci[oó]n/i,
    /whatsapp/i,
    /\.pbix/i,
    /PDI-?7/i,
    /colaboraci[oó]n remota/i,
    /remote collaboration/i,
    /talento tech/i,
    /immediate/i,
  ]) {
    assert.ok(!pattern.test(blob), pattern)
  }
  assert.ok(!/colaboraci[oó]n remota/i.test(es.about.experience.note))
  assert.ok(!/remote collaboration/i.test(en.about.experience.note))
})

test('header and footer do not point at the retired destinations', () => {
  const header = read('components/layout/SiteHeader.jsx')
  assert.ok(header.includes('aria-current'))
  assert.ok(header.includes('nav.about'))
  assert.ok(header.includes('nav.contact'))
  const footer = read('components/Footer.jsx')
  assert.ok(!/#data-bi|#operations|#stack|#formacion|#enfoque|casework/i.test(footer))
})

test('About and Contact use the dark surface; a case study does not', () => {
  const html = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8')
  assert.ok(html.includes("hash === '#about'"))
  assert.ok(html.includes("hash === '#contact'"))
  assert.ok(html.includes('/^#about\\/[^/]+$/'))
  assert.ok(html.includes('/^#projects\\/[^/]+$/'))
  const app = read('App.jsx')
  assert.match(app, /rendersPaper = Boolean\(caseStudy\)/)
  assert.ok(read('styles/about.css').includes('.ds-about-page'))
  assert.ok(read('styles/contact.css').includes('.ds-contact-page'))
  assert.ok(read('components/About.jsx').includes('ds-about-page'))
})
