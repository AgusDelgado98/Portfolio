/**
 * ALETHEIA — registry counts behind Home's evidence visual.
 *
 * Source: casework/aletheia/data.js (ALETHEIA_METRICS, the project's "single
 * numeric source of truth"): sourceManifestRecords, statisticalObjects and
 * statisticalBreaks. Copied here so Home does not import the Evidence Case's
 * data (and its chart payloads); `visual/data.test.js` fails on any drift.
 */
export const ALETHEIA_COUNTS = Object.freeze({
  sources: 22,
  statisticalObjects: 16,
  breaks: 8,
})

/**
 * The explicit compatibility relationships between statistical objects
 * (ALETHEIA_METRICS.compatibilityRelationships = 8) by their recorded status
 * (publication-charts.js, compatibilityMatrix.full). The data names the object
 * pair of each relationship but does not place them on the 16 objects drawn
 * here, so the visual states the counts and never draws a pair.
 * `visual/data.test.js` fails on any drift.
 */
export const ALETHEIA_COMPATIBILITY = Object.freeze({
  relationships: 8,
  forbidden: 6,
  conditional: 1,
  descriptive: 1,
})
