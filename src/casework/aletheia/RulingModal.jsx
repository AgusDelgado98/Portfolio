import React, { useEffect, useId, useRef } from 'react'
import { useLanguage } from '../../i18n/LanguageContext.jsx'
import { ALETHEIA_EVIDENCE as EV } from './data.js'

/**
 * Accessible ruling modal — portfolio chrome only, no raw markdown/JSON.
 */
export default function RulingModal({ rulingId, onClose }) {
  const { t } = useLanguage()
  const titleId = useId()
  const closeRef = useRef(null)
  const ruling = EV.rulings?.[rulingId]

  useEffect(() => {
    if (!ruling) return undefined
    const previous = document.activeElement
    closeRef.current?.focus()
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      if (previous && typeof previous.focus === 'function') previous.focus()
    }
  }, [ruling, onClose])

  if (!ruling) return null

  return (
    <div className="aletheia-modal-root" role="presentation">
      <button type="button" className="aletheia-modal-backdrop" aria-label={t('aletheia.rulingModal.close')} onClick={onClose} />
      <div
        className="aletheia-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <header className="aletheia-modal-head">
          <div>
            <p className="aletheia-modal-eyebrow">{ruling.code}</p>
            <h2 id={titleId}>{t(`aletheia.rulingModal.${rulingId}.title`)}</h2>
          </div>
          <button ref={closeRef} type="button" className="aletheia-modal-close" onClick={onClose}>
            {t('aletheia.rulingModal.close')}
          </button>
        </header>

        <p className="aletheia-modal-status">{ruling.status}</p>

        <section className="aletheia-modal-section">
          <h3>{t('aletheia.rulingModal.decision')}</h3>
          <p>{t(`aletheia.rulingModal.${rulingId}.decision`)}</p>
        </section>

        <section className="aletheia-modal-section">
          <h3>{t('aletheia.rulingModal.why')}</h3>
          <p>{t(`aletheia.rulingModal.${rulingId}.why`)}</p>
        </section>

        {ruling.restrictions?.length ? (
          <section className="aletheia-modal-section">
            <h3>{t('aletheia.rulingModal.restrictions')}</h3>
            <ul className="elog-list">
              {ruling.restrictions.map((rule) => (
                <li key={rule}>
                  <code>{rule}</code>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {ruling.provenance ? (
          <section className="aletheia-modal-section">
            <h3>{t('aletheia.rulingModal.provenance')}</h3>
            <p>
              <code>{ruling.provenance}</code>
            </p>
          </section>
        ) : null}
      </div>
    </div>
  )
}
