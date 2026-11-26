import React from 'react'
import '../styles/project-media.css'
import { useLanguage } from '../i18n/LanguageContext.jsx'

// Two stills (every project but CONSTANTIA) load eagerly as before; longer galleries load lazily.
const MAX_ITEMS = 12

export default function ProjectEvidenceGallery({ items = [] }) {
  const { t } = useLanguage()
  const visuals = items.filter((item) => item?.src).slice(0, MAX_ITEMS)
  if (visuals.length === 0) return null

  return (
    <div className={`atlas-sheet-gallery atlas-sheet-gallery--${Math.min(visuals.length, 2)}`}>
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
                <img
                  src={item.src}
                  alt={alt}
                  width={item.width}
                  height={item.height}
                  loading={visuals.length > 2 ? 'lazy' : 'eager'}
                  decoding="async"
                />
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
