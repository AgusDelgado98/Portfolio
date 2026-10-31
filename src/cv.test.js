import test from 'node:test'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { CV_HREF, getCvHref } from './i18n/config.js'

const root = new URL('../', import.meta.url)
const read = (p) => readFileSync(fileURLToPath(new URL(p, root)))
const readText = (p) => read(p).toString('utf8')

const CANONICAL_PDF = 'public/cv/Agustin-Delgado-2026.pdf'
const gitBlobSha = (buf) =>
  createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${buf.length}\0`), buf])).digest('hex')

test('CV: the static file is a one-page PDF with the three portfolio hyperlinks and a photo', () => {
  const pdf = read(CANONICAL_PDF)
  const raw = pdf.toString('latin1')
  assert.equal(raw.slice(0, 5), '%PDF-')
  assert.match(raw.trimEnd().slice(-5), /%%EOF/)
  assert.equal((raw.match(/\/Type\s*\/Page[^s]/g) || []).length, 1, 'one page')
  assert.ok(!raw.includes('/Encrypt'), 'not encrypted')
  assert.equal((raw.match(/\/Subtype\s*\/Image/g) || []).length, 1, 'one photo')
  const uris = [...raw.matchAll(/\/URI\s*\(([^)]*)\)/g)].map((m) => m[1]).sort()
  assert.deepEqual(uris, [
    'https://github.com/AgusDelgado98',
    'https://portfolio-me-f104.vercel.app/',
    'https://www.linkedin.com/in/agustin-delgado-data98615190/',
  ])
})

test('CV: the legacy copy is byte-identical to the canonical file', () => {
  assert.ok(read('public/cv/Agustin_Delgado_CV_EN.pdf').equals(read(CANONICAL_PDF)))
})

test('CV: /api/cv rebuilds exactly the static file, checks its SHA and sends the download headers', async () => {
  const pdf = read(CANONICAL_PDF)
  const handler = (await import(new URL('api/cv.js', root).href)).default
  const sent = { headers: {} }
  const res = {
    setHeader: (k, v) => { sent.headers[k] = v },
    status(code) { sent.status = code; return this },
    send(body) { sent.body = body; return this },
    json(body) { sent.json = body; return this },
  }
  handler({}, res)
  assert.equal(sent.status, 200, JSON.stringify(sent.json))
  assert.ok(Buffer.from(sent.body).equals(pdf), 'payload equals the static PDF')
  assert.equal(sent.headers['Content-Type'], 'application/pdf')
  assert.equal(sent.headers['Content-Length'], String(pdf.length))
  assert.match(sent.headers['Content-Disposition'], /^attachment; filename\*=UTF-8''Agust%C3%ADn%20Delgado%202026\.pdf$/)
})

test('CV: EXPECTED_GIT_BLOB_SHA in api/cv.js is the SHA of the static file', () => {
  const declared = readText('api/cv.js').match(/EXPECTED_GIT_BLOB_SHA = '([0-9a-f]{40})'/)?.[1]
  assert.equal(declared, gitBlobSha(read(CANONICAL_PDF)))
})

test('CV: vercel.json keeps the canonical rewrite to /api/cv and the legacy redirect', () => {
  const config = JSON.parse(readText('vercel.json'))
  assert.deepEqual(config.rewrites, [{ source: CV_HREF, destination: '/api/cv' }])
  assert.deepEqual(config.redirects, [{ source: '/cv/Agustin_Delgado_CV_EN.pdf', destination: CV_HREF, permanent: false }])
})

test('CV: every download button uses CV_HREF, and the target does not depend on the language', () => {
  assert.equal(CV_HREF, '/cv/Agustin-Delgado-2026.pdf')
  assert.equal(getCvHref('es'), CV_HREF)
  assert.equal(getCvHref('en'), CV_HREF)
  const users = [
    'src/components/home/HomeHero.jsx',
    'src/components/home/ContactStrip.jsx',
    'src/components/ContactView.jsx',
    'src/components/Footer.jsx',
    'src/components/About.jsx',
    'src/components/layout/SiteHeader.jsx',
    'src/components/layout/MobileNav.jsx',
  ]
  for (const file of users) {
    const source = readText(file)
    assert.match(source, /href=\{CV_HREF\}|href: CV_HREF/, file)
    assert.ok(!/\/cv\/|\.pdf/.test(source), `${file} must not hard-code a CV path`)
  }
})
