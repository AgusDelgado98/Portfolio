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
