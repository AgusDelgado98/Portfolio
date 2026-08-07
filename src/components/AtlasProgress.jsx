import React from 'react'
import { useLanguage } from '../i18n/LanguageContext.jsx'

export const atlasPlates = [
  { id: '00', href: '#portada' },
  { id: '01', href: '#proyectos' },
  { id: '02', href: '#enfoque' },
  { id: '03', href: '#stack' },
  { id: '04', href: '#formacion' },
  { id: '05', href: '#contacto' },
]

export default function AtlasProgress({ activePlate, visitedPlates, onNavigate }) {
  const { t } = useLanguage()
  const active = atlasPlates.find((plate) => plate.id === activePlate) ?? atlasPlates[0]
  const activeLabel = t(`plates.${active.id}`)

  return (
    <nav className="atlas-progress" aria-label={t('plates.aria')}>
      <div className="atlas-progress-current" aria-hidden="true">
        <span>{t('plates.lamina')}</span>
        <strong>{active.id}</strong>
        <span>{activeLabel}</span>
      </div>

      <ol className="atlas-progress-list">
        {atlasPlates.map((plate) => {
          const isActive = plate.id === activePlate
          const isVisited = visitedPlates.has(plate.id)
          const label = t(`plates.${plate.id}`)

          return (
            <li
              key={plate.id}
              className={isActive ? 'is-active' : isVisited ? 'is-visited' : ''}
            >
              <a
                href={plate.href}
                aria-current={isActive ? 'location' : undefined}
                aria-label={t('plates.plateAria', {
                  id: plate.id,
                  label,
                  visited: isVisited && !isActive ? t('plates.visited') : '',
                })}
                title={`${plate.id} — ${label}`}
                onClick={() => onNavigate(plate.id)}
              >
                <span className="atlas-progress-marker" aria-hidden="true" />
                <span className="atlas-progress-code">{plate.id}</span>
                <span className="atlas-progress-label">{label}</span>
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
