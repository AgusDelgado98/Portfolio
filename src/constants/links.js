/**
 * Public Halo Brief deploy.
 * Set to '#' to hide outbound CTAs while the public surface is offline.
 */
export const HALO_BRIEF_URL = 'https://paradise-paradise-halo.vercel.app/'

/** Paradigm public app / ecosystem hub — only Paradigm sheets should link here. */
export const PARADIGM_APP_URL = 'https://paradigm-web-swart.vercel.app/'
/** Paradigm source is private — do not render as a public outbound link. */
export const PARADIGM_REPO_PUBLIC = false
export const PARADIGM_REPO_URL = null

/** Soma source is private — no public GitHub CTA. */
export const SOMA_REPO_PUBLIC = false
export const SOMA_DEMO_VIDEO_SRC = '/media/soma-linkedin-demo.webm'
export const SOMA_DEMO_POSTER_SRC = '/media/soma-linkedin-demo-poster.png'

export const ENGINEERING_LOG_HASH = '#engineering-log'
export const CLINIC_CASE_EVIDENCE_BASE = '/engineering-log/clinic-no-show'

export function isHaloBriefLive(url = HALO_BRIEF_URL) {
  return Boolean(url && url !== '#')
}

export function isEngineeringLogHash(hash = typeof window !== 'undefined' ? window.location.hash : '') {
  return hash === ENGINEERING_LOG_HASH || hash.startsWith(`${ENGINEERING_LOG_HASH}/`)
}
