/**
 * Shared About chunk loader (F12).
 * Keeps About JS deferred, but lets cold `#about` boots await the same promise
 * before the first React paint so Suspense does not flash a short shell (CLS).
 */
let aboutPromise
let aboutModule = null

export function loadAbout() {
  if (!aboutPromise) {
    aboutPromise = import('./components/About.jsx').then((mod) => {
      aboutModule = mod
      return mod
    })
  }
  return aboutPromise
}

/** Sync handle after loadAbout() has resolved (used to skip Suspense on cold boot). */
export function getAboutModule() {
  return aboutModule
}
