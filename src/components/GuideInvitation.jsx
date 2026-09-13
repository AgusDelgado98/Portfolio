import React from 'react'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { useGuide } from '../guide/GuideContext.jsx'
import { GUIDE_INTENTS } from '../guide/intents.js'

/**
 * Soft invitation — Guided Portfolio Experience v0.2, Fase 1A.
 *
 * Integrated into Home's normal flow, never a modal/overlay: three plain
 * buttons in a row, same `atlas-access` visual language Home already uses
 * for its own CTAs (no parallel button system). Renders nothing once the
 * visitor has an intent — explicit or defaulted via navigation (see
 * GuideContext.jsx) — so it never lingers as dead chrome; "Cambiar" in the
 * Header brings it back by resetting to unset.
 *
 * All three choices persist immediately on click, per contract — including
 * "Seguir explorando", which persists `default` explicitly rather than
 * leaving it unset (only a genuine bounce, or continuing to browse without
 * ever clicking here, goes through the other two persistence paths in
 * GuideContext.jsx).
 */
export default function GuideInvitation() {
  const { t } = useLanguage()
  const { hasChosen, chooseIntent } = useGuide()

  if (hasChosen) return null

  return (
    <section className="home-guide-invitation" aria-labelledby="home-guide-invitation-title">
      <div className="home-guide-invitation-copy">
        <span className="home-guide-invitation-eyebrow">{t('guide.invitation.eyebrow')}</span>
        <p id="home-guide-invitation-title" className="home-guide-invitation-lede">
          {t('guide.invitation.lede')}
        </p>
      </div>
      <div className="home-guide-invitation-actions" role="group" aria-label={t('guide.invitation.aria')}>
        <button
          type="button"
          className="atlas-access atlas-access--primary home-guide-invitation-choice"
          onClick={() => chooseIntent(GUIDE_INTENTS.RECRUITER)}
        >
          <span>{t('guide.invitation.recruiter')}</span>
        </button>
        <button
          type="button"
          className="atlas-access home-guide-invitation-choice"
          onClick={() => chooseIntent(GUIDE_INTENTS.TECHNICAL)}
        >
          <span>{t('guide.invitation.technical')}</span>
        </button>
        <button
          type="button"
          className="home-guide-invitation-dismiss"
          onClick={() => chooseIntent(GUIDE_INTENTS.DEFAULT)}
        >
          {t('guide.invitation.dismiss')}
        </button>
      </div>
    </section>
  )
}
