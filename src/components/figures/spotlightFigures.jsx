import React from 'react'
import ForecastFan from './ForecastFan.jsx'
import QualityMosaic from './QualityMosaic.jsx'

/** Published-project figure map for Home and Projects spotlight (F6). */
const FIGURE_BY_ID = {
  providentia: ForecastFan,
  paradigm: QualityMosaic,
}

export function SpotlightFigure({ id, copy, lazy = true }) {
  const Figure = FIGURE_BY_ID[id]
  if (!Figure || !copy?.figure) return null
  return <Figure copy={copy.figure} lazy={lazy} />
}

export function hasSpotlightFigure(id) {
  return Boolean(FIGURE_BY_ID[id])
}
