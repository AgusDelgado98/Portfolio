/**
 * Catalog presentation (F4). Three card layouts, derived from `tier`.
 * Featured reuses the standard card and only gains presence in CSS.
 */

export function cardVariant(tier) {
  if (tier === 'flagship') return 'flagship'
  if (tier === 'compact') return 'compact'
  return 'standard'
}

export function cardShowsFeaturedPresence(tier) {
  return tier === 'featured'
}
