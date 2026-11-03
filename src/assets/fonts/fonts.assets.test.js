import test from 'node:test'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

/**
 * Integrity of the self-hosted font files (F1): every file in the manifest exists,
 * has the recorded size and SHA-256, is a WOFF2, and ships with its OFL text.
 * A font that changes on disk without the manifest (and the register in
 * docs/design/superficie-de-decision/fonts-register.md) being updated fails here.
 */

const dir = new URL('./', import.meta.url)
const licenses = new URL('../../../public/fonts/licenses/', import.meta.url)
const manifest = JSON.parse(readFileSync(fileURLToPath(new URL('fonts.manifest.json', dir)), 'utf8'))
const path = (base, name) => fileURLToPath(new URL(name, base))

test('the manifest lists the five approved files', () => {
  assert.deepEqual(
    manifest.fonts.map((font) => font.id).sort(),
    ['fraunces-italic', 'fraunces-normal', 'ibm-plex-mono-400', 'ibm-plex-mono-500', 'instrument-sans-normal'],
  )
})

for (const font of manifest.fonts) {
  test(`${font.id}: file, size, SHA-256 and WOFF2 signature match the manifest`, () => {
    const file = path(dir, font.file)
    assert.ok(existsSync(file), `${font.file} is missing`)
    const bytes = readFileSync(file)
    assert.equal(statSync(file).size, font.bytes, 'size differs from the manifest')
    assert.equal(createHash('sha256').update(bytes).digest('hex'), font.sha256, 'SHA-256 differs from the manifest')
    assert.equal(bytes.toString('latin1', 0, 4), 'wOF2')
  })

  test(`${font.id}: origin and license are recorded and the OFL text ships with it`, () => {
    assert.match(font.source, /^https:\/\/fonts\.gstatic\.com\//)
    assert.match(font.licenseSource, /^https:\/\/raw\.githubusercontent\.com\//)
    assert.equal(font.license, 'OFL-1.1')
    assert.ok(font.copyright && font.copyright.length > 10)
    const file = path(licenses, font.licenseFile)
    assert.ok(existsSync(file), `${font.licenseFile} is missing`)
    assert.match(readFileSync(file, 'utf8'), /SIL OPEN FONT LICENSE Version 1\.1/i)
  })
}

test('all fonts together stay within the 210 KB budget', () => {
  const total = manifest.fonts.reduce((sum, font) => sum + font.bytes, 0)
  assert.ok(total <= manifest.budget.totalBytes, `${total} bytes`)
  assert.equal(manifest.budget.totalBytes, 210_000)
})
