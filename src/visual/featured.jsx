import React from 'react'
import ForecastVisual from './ForecastVisual.jsx'
import LayersVisual from './LayersVisual.jsx'
import EvidenceGraphVisual from './EvidenceGraphVisual.jsx'
import { FINAL_WAPE } from './data/providentia.js'
import { CAELUM_DBT_TESTS } from './data/caelum.js'
import { ALETHEIA_COUNTS } from './data/aletheia.js'
import { formatPercent } from './format.js'

/**
 * What Home's featured card shows for a project, keyed by the project's
 * registry `visual` — so the cards never name a project. Adding DECERNO means
 * adding one entry here (its visual + its headline metric) and its registry
 * entry; FeaturedProjects itself does not change.
 *
 * `labels` is the project's card copy from i18n (messages/home.js).
 */
export const FEATURED_VISUALS = {
  forecast: {
    stage: 'prediction',
    renderVisual: ({ language, labels }) => <ForecastVisual language={language} labels={labels} />,
    getMetric: ({ language, labels }) => ({
      value: formatPercent(FINAL_WAPE.ets, language),
      note: `${labels.metricNote} ${formatPercent(FINAL_WAPE.naive, language)}`,
    }),
  },
  pipeline: {
    stage: 'data',
    renderVisual: ({ labels }) => <LayersVisual labels={labels} />,
    getMetric: () => ({ value: String(CAELUM_DBT_TESTS), note: null }),
  },
  'evidence-network': {
    stage: 'evidence',
    renderVisual: ({ labels }) => <EvidenceGraphVisual labels={labels} />,
    getMetric: () => ({
      value: `${ALETHEIA_COUNTS.sources} → ${ALETHEIA_COUNTS.statisticalObjects} → ${ALETHEIA_COUNTS.breaks}`,
      note: null,
    }),
  },
}
