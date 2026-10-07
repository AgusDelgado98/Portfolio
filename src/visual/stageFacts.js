import { CAELUM_LAYERS } from './data/caelum.js'
import { ALETHEIA_COUNTS } from './data/aletheia.js'
import { FINAL_PI90_COVERAGE, POLICY_TRADEOFF, REFERENCE_POLICY_ID } from './data/providentia.js'
import { formatPercent } from './format.js'

/**
 * One verifiable figure per pipeline stage, from the same data modules the
 * featured cards use (so a number can never differ between the two places).
 * Labels live in i18n (home.pipeline.stages.<stage>.factLabel).
 */
export function getStageFact(stage, language = 'es') {
  switch (stage) {
    case 'data':
      return CAELUM_LAYERS.map((layer) => layer.count).join(' · ')
    case 'evidence':
      return [ALETHEIA_COUNTS.sources, ALETHEIA_COUNTS.statisticalObjects, ALETHEIA_COUNTS.breaks].join(' · ')
    case 'prediction':
      return formatPercent(FINAL_PI90_COVERAGE.observed, language)
    case 'decision': {
      const reference = POLICY_TRADEOFF.find((policy) => policy.id === REFERENCE_POLICY_ID)
      const lowest = POLICY_TRADEOFF[0]
      return `${formatPercent(reference.exceedanceRate, language)} vs ${formatPercent(lowest.exceedanceRate, language)}`
    }
    default:
      return null
  }
}
