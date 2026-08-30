import React from 'react'
import { useLanguage } from '../i18n/LanguageContext.jsx'

export default function ProjectEvidenceGallery({ items = [] }) {
  const { t } = useLanguage()
  const visuals = items.filter((item) => item?.src).slice(0, 2)
  if (visuals.length === 0) return null

  return (
    <div className={`atlas-sheet-gallery atlas-sheet-gallery--${visuals.length}`}>
      {visuals.map((item) => {
        const caption = item.caption || ''
        const alt = item.alt || caption
        return (
          <figure key={item.id || item.src} className="atlas-sheet-gallery-item">
            <a
              href={item.src}
              target="_blank"
              rel="noopener noreferrer"
              className="atlas-sheet-gallery-link"
              aria-label={caption ? t('projects.openImageAria', { caption }) : t('projects.openImage')}
            >
              <span className="atlas-sheet-gallery-frame">
                <img src={item.src} alt={alt} loading="eager" decoding="async" />
              </span>
            </a>
            {caption ? (
              <figcaption className="atlas-sheet-gallery-caption">{caption}</figcaption>
            ) : null}
          </figure>
        )
      })}
    </div>
  )
}
