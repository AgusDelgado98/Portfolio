/**
 * Deterministic marks for projects without their own diagram.
 * The same id always draws the same picture. The series is a fixed hash, never a random draw.
 */

export function proceduralSeries(id, length = 7) {
  let n = 2166136261
  const text = String(id || '')
  for (let i = 0; i < text.length; i += 1) {
    n ^= text.charCodeAt(i)
    n = Math.imul(n, 16777619)
  }
  const out = []
  let x = n >>> 0
  for (let i = 0; i < length; i += 1) {
    x = (Math.imul(x, 1664525) + 1013904223) >>> 0
    out.push(22 + (x % 74))
  }
  return out
}

/** Pipeline color for a procedural visual. Products stay neutral: they are not a stage. */
export function proceduralStage(category) {
  if (category === 'ds-ml') return 'prediction'
  if (category === 'analytics-bi') return 'data'
  if (category === 'evidence-research') return 'evidence'
  return null
}
