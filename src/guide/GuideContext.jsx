import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { GUIDE_INTENTS, GUIDE_VERSION, isValidIntent } from './intents.js'
import { readStoredIntent, writeStoredIntent, clearStoredIntent, resolveIntentAfterNavigation } from './guideStorage.js'

const GuideContext = createContext(null)

function getBrowserStorage() {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null
  } catch {
    // Some environments (locked-down privacy modes) throw just accessing
    // the property — never let that reach the caller.
    return null
  }
}

/**
 * Guided Portfolio Experience v0.2 — Fase 1A.
 *
 * Same shape as i18n/LanguageContext.jsx (state seeded from storage on
 * mount, a setter that persists, a Context Provider near the root) — the
 * persistence *rules* themselves (see guideStorage.js) are the part this
 * feature adds on top of that shared pattern.
 *
 * `intent` is `null` until the visitor has actually engaged — either by
 * clicking one of the three soft-invitation choices, or by navigating
 * elsewhere on the site while ignoring it (see the hashchange effect
 * below). Nothing here ever writes to storage on mount or on render; only
 * `chooseIntent` (a click) and the hashchange listener (a real navigation)
 * do, matching "nunca persistir default por simple impresión".
 */
export function GuideProvider({ children }) {
  const [intent, setIntent] = useState(() => readStoredIntent(getBrowserStorage(), GUIDE_VERSION))

  // Explicit choice — recruiter, technical, or "Seguir explorando" (which
  // passes GUIDE_INTENTS.DEFAULT). All three persist immediately on click,
  // per contract.
  const chooseIntent = useCallback((next) => {
    if (!isValidIntent(next)) return
    writeStoredIntent(getBrowserStorage(), next, GUIDE_VERSION)
    setIntent(next)
  }, [])

  // "Cambiar" — manual reset. Clears the persisted choice so the soft
  // invitation asks again; this is the "cambio manual" the contract names
  // as one of the only two ways a stored choice ever goes away (the other
  // being a guide_version bump).
  const resetIntent = useCallback(() => {
    clearStoredIntent(getBrowserStorage())
    setIntent(null)
  }, [])

  // "Ignora la card pero sigue usando el sitio -> persistir default."
  // A hashchange is a real navigation (the same signal App.jsx's router
  // treats as an actual visit), so it never fires for a bounce that closes
  // the tab without clicking anything. Only writes when there was no prior
  // choice to begin with — an existing recruiter/technical/default choice
  // is never touched by simply continuing to browse.
  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    const onHashChange = () => {
      setIntent((current) => {
        const next = resolveIntentAfterNavigation(current, GUIDE_INTENTS.DEFAULT)
        if (next !== current) writeStoredIntent(getBrowserStorage(), next, GUIDE_VERSION)
        return next
      })
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const value = useMemo(
    () => ({
      intent,
      chooseIntent,
      resetIntent,
      hasChosen: intent !== null,
      isRecruiter: intent === GUIDE_INTENTS.RECRUITER,
      isTechnical: intent === GUIDE_INTENTS.TECHNICAL,
      isDefault: intent === GUIDE_INTENTS.DEFAULT,
    }),
    [intent, chooseIntent, resetIntent],
  )

  return <GuideContext.Provider value={value}>{children}</GuideContext.Provider>
}

export function useGuide() {
  const ctx = useContext(GuideContext)
  if (!ctx) throw new Error('useGuide must be used within GuideProvider')
  return ctx
}
