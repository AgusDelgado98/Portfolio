import { FINAL_WAPE } from '../../visual/data/providentia.js'
import { formatPercent } from '../../visual/format.js'

/**
 * Verifiable fact rows for the Projects spotlight plates (F6 / EG4 / EG5).
 * Numbers come from frozen evidence (`visual/data`); labels come from i18n.
 * The conceptual ForecastFan / QualityMosaic figures are separate from these rows.
 */
export function spotlightFacts(id, copy, language) {
  if (!copy?.facts) return []
  const rows = []
  if (copy.facts.method) rows.push({ label: copy.facts.methodLabel, value: copy.facts.method })
  if (id === 'providentia' && copy.facts.resultTemplate) {
    rows.push({
      label: copy.facts.resultLabel,
      value: copy.facts.resultTemplate
        .replace('{ets}', formatPercent(FINAL_WAPE.ets, language))
        .replace('{naive}', formatPercent(FINAL_WAPE.naive, language)),
    })
  } else if (copy.facts.result) {
    rows.push({ label: copy.facts.resultLabel, value: copy.facts.result })
  }
  if (copy.facts.scope) rows.push({ label: copy.facts.scopeLabel, value: copy.facts.scope })
  return rows.filter((row) => row.label && row.value)
}
