import React from 'react'
import ForecastVisual from './ForecastVisual.jsx'
import LayersVisual from './LayersVisual.jsx'
import EvidenceGraphVisual from './EvidenceGraphVisual.jsx'
import RiskThresholdVisual from './RiskThresholdVisual.jsx'
import SomaProductVisual from './SomaProductVisual.jsx'
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
 *
 * `renderVisual` receives `interactive`: Home turns it on for the work-linked
 * cards, whose parts become keyboard-focusable buttons with a one-line readout.
 *
 * `getMetric` may return null: a card then shows no headline figure. The two
 * schematic visuals below (risk-threshold, product-surfaces) draw no number on
 * purpose — the public-case metrics stay in each project's page.
 */
export const FEATURED_VISUALS = {
  forecast: {
    stage: 'prediction',
    renderVisual: ({ language, labels, interactive }) => <ForecastVisual language={language} labels={labels} interactive={interactive} />,
    getMetric: ({ language, labels }) => ({
      value: formatPercent(FINAL_WAPE.ets, language),
      note: `${labels.metricNote} ${formatPercent(FINAL_WAPE.naive, language)}`,
    }),
  },
  pipeline: {
    stage: 'data',
    renderVisual: ({ labels, interactive }) => <LayersVisual labels={labels} interactive={interactive} />,
    getMetric: () => ({ value: String(CAELUM_DBT_TESTS), note: null }),
  },
  'evidence-network': {
    stage: 'evidence',
    renderVisual: ({ labels, interactive }) => <EvidenceGraphVisual labels={labels} interactive={interactive} />,
    getMetric: () => ({
      value: `${ALETHEIA_COUNTS.sources} → ${ALETHEIA_COUNTS.statisticalObjects} → ${ALETHEIA_COUNTS.breaks}`,
      note: null,
    }),
  },
  'risk-threshold': {
    stage: 'prediction',
    renderVisual: ({ labels, interactive }) => <RiskThresholdVisual labels={labels} interactive={interactive} />,
    getMetric: () => null,
  },
  'product-surfaces': {
    stage: 'neutral',
    renderVisual: ({ labels, interactive }) => <SomaProductVisual labels={labels} interactive={interactive} />,
    getMetric: () => null,
  },
}
