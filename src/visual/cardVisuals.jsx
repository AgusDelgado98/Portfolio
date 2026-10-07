import React from 'react'
import ForecastVisual from './ForecastVisual.jsx'
import LayersVisual from './LayersVisual.jsx'
import EvidenceGraphVisual from './EvidenceGraphVisual.jsx'
import RiskThresholdVisual from './RiskThresholdVisual.jsx'
import RulesVsMlVisual from './RulesVsMlVisual.jsx'
import ProceduralVisual from './ProceduralVisual.jsx'
import { FEATURED_VISUALS } from './featured.jsx'
import { TEKMERION_MACRO_F1 } from './data/tekmerion.js'
import { formatNumber } from './format.js'
import { proceduralStage } from './procedural.js'
import { getPrimaryCategory } from '../projects/categories.js'

/**
 * The picture and the one headline figure a catalog card shows.
 * The three Home visuals keep their approved labels (home.featured.cards).
 * Everything else uses the short captions in projects.visuals.
 */

const HOME_CARD_KEY = {
  forecast: 'providentia',
  pipeline: 'caelum',
  'evidence-network': 'aletheia',
}

export function visualStage(project) {
  if (project.visual === 'forecast' || project.visual === 'risk-threshold') return 'prediction'
  if (project.visual === 'pipeline') return 'data'
  if (project.visual === 'evidence-network' || project.visual === 'rules-vs-ml') return 'evidence'
  return proceduralStage(getPrimaryCategory(project))
}

export function visualLabels(project, t) {
  const homeKey = HOME_CARD_KEY[project.visual]
  if (homeKey) return t(`home.featured.cards.${homeKey}`)
  if (project.visual === 'risk-threshold') {
    return {
      caption: t('projects.visuals.risk-threshold'),
      ...t('projects.riskLabels'),
    }
  }
  if (project.visual === 'rules-vs-ml') {
    return {
      caption: t('projects.visuals.rules-vs-ml'),
      metricLabel: t('projects.metrics.f1'),
      metricNote: t('projects.metrics.f1Note'),
      rules: t('projects.metrics.rules'),
      svm: t('projects.metrics.svm'),
    }
  }
  return { caption: t('projects.visuals.procedural') }
}

export function renderProjectVisual(project, language, labels) {
  if (project.visual === 'forecast') return <ForecastVisual language={language} labels={labels} />
  if (project.visual === 'pipeline') return <LayersVisual labels={labels} />
  if (project.visual === 'evidence-network') return <EvidenceGraphVisual labels={labels} />
  if (project.visual === 'risk-threshold') return <RiskThresholdVisual labels={labels} />
  if (project.visual === 'rules-vs-ml') return <RulesVsMlVisual language={language} labels={labels} />
  return <ProceduralVisual id={project.id} category={getPrimaryCategory(project)} labels={labels} />
}

export function cardMetric(project, language, labels) {
  const featured = FEATURED_VISUALS[project.visual]
  if (featured) {
    const metric = featured.getMetric({ language, labels })
    return { label: labels.metricLabel, value: metric.value, note: metric.note }
  }
  if (project.visual === 'rules-vs-ml') {
    return {
      label: labels.metricLabel,
      value: formatNumber(TEKMERION_MACRO_F1.rules, language, 3),
      note: `${labels.metricNote} ${formatNumber(TEKMERION_MACRO_F1.linearSvm, language, 3)}`,
    }
  }
  return null
}
