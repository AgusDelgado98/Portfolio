import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const root = new URL('../', import.meta.url)
const text = (p) => readFileSync(fileURLToPath(new URL(p, root)), 'utf8')

const CANONICAL = 'https://portfolio-me-f104.vercel.app'
const html = text('index.html')
const meta = (attr, name) =>
  html.match(new RegExp(`<meta ${attr}="${name}" content="([^"]*)"`))?.[1]

test('SEO: one canonical URL, shared by og:url (routes are hash fragments of the same document)', () => {
  assert.deepEqual([...html.matchAll(/<link rel="canonical" href="([^"]*)"/g)].map((m) => m[1]), [`${CANONICAL}/`])
  assert.equal(meta('property', 'og:url'), `${CANONICAL}/`)
})

test('SEO: Open Graph and Twitter share the canonical image, which exists at 1200×630', () => {
  const image = `${CANONICAL}/og/og-default.png`
  assert.equal(meta('property', 'og:image'), image)
  assert.equal(meta('name', 'twitter:image'), image)
  assert.equal(meta('name', 'twitter:card'), 'summary_large_image')
  assert.equal(meta('property', 'og:image:width'), '1200')
  assert.equal(meta('property', 'og:image:height'), '630')
  const path = fileURLToPath(new URL('public/og/og-default.png', root))
  assert.ok(existsSync(path))
  const png = readFileSync(path)
  assert.equal(png.readUInt32BE(16), 1200)
  assert.equal(png.readUInt32BE(20), 630)
})

test('SEO: nothing in the document asks crawlers to stay away', () => {
  assert.ok(!/name="robots"[^>]*(noindex|nofollow)/i.test(html))
  const robots = text('public/robots.txt')
  assert.match(robots, /^User-agent: \*$/m)
  assert.match(robots, /^Allow: \/$/m)
  assert.ok(!/^Disallow:\s*\/\s*$/m.test(robots), 'robots.txt must not block the whole site')
  assert.match(robots, new RegExp(`^Sitemap: ${CANONICAL}/sitemap\\.xml$`, 'm'))
})

test('SEO: the sitemap lists the canonical URL only (fragment routes are not separate URLs)', () => {
  const sitemap = text('public/sitemap.xml')
  assert.deepEqual([...sitemap.matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) => m[1]), [`${CANONICAL}/`])
  assert.ok(!sitemap.includes('#'))
})

test('Public surface: no static file links to the professional SOMA application or its backend', () => {
  for (const file of ['index.html', 'public/robots.txt', 'public/sitemap.xml', 'public/cv/README.txt']) {
    assert.ok(!/soma-eight-pi|supabase\.co/i.test(text(file)), file)
  }
})
