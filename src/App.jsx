import React, { useEffect, useRef, useState } from 'react'
import './styles.css'
import './atlas.css'
import './engineering-log.css'
import './destination-views.css'
import './home.css'
import './projects-view.css'
import Header from './components/Header'
import Home from './components/Home'
import Footer from './components/Footer'
import CaseworkIndex from './components/CaseworkIndex'
import DataBI from './components/DataBI'
import Operations from './components/Operations'
import About from './components/About'
import ContactView from './components/ContactView'
import ProjectsIndex from './components/ProjectsIndex'
import ProjectDetail from './components/ProjectDetail'
import { getCaseworkComponent, getCaseworkEntry } from './casework/registry.js'
import { resolveAppRoute, getRenderKey } from './router/resolveAppRoute.js'
import { getRouteTitle } from './router/documentTitle.js'
import { useLanguage } from './i18n/LanguageContext.jsx'

// resolveAppRoute/getRouteTitle take the live Casework registry by
// injection (see router/resolveAppRoute.js) so those modules stay
// JSX/CSS-free and unit-testable — this is the one place that wires them
// to the real registry.
const hasCaseworkCase = (slug) => Boolean(getCaseworkComponent(slug))
const getCaseworkSystem = (slug) => getCaseworkEntry(slug)?.meta.system ?? null

// Skip-to-content target. Not an app route — resolveAppRoute() never sees
// it (see the hashchange guard below) — it's a plain in-page anchor to the
// always-present <main>.
const MAIN_CONTENT_ID = 'main-content'
const MAIN_CONTENT_HASH = `#${MAIN_CONTENT_ID}`

function App() {
  const { t } = useLanguage()
  const [route, setRoute] = useState(() =>
    resolveAppRoute(typeof window !== 'undefined' ? window.location.hash : '', { hasCaseworkCase }),
  )
  const { view, params } = route
  const caseSlug = params?.caseSlug ?? null
  const caseSection = params?.caseSection ?? null

  useEffect(() => {
    const syncView = () => {
      // Skip-to-content is a plain anchor to <main>, not a navigation — let
      // the browser's native fragment focus/scroll handle it and leave the
      // current route (and rendered view) untouched.
      if (window.location.hash === MAIN_CONTENT_HASH) return
      setRoute(resolveAppRoute(window.location.hash, { hasCaseworkCase }))
    }
    window.addEventListener('hashchange', syncView)
    syncView()
    return () => window.removeEventListener('hashchange', syncView)
  }, [])

  useEffect(() => {
    document.title = getRouteTitle(route, t, { getCaseworkSystem })
  }, [route, t])

  const ActiveCaseComponent = view === 'casework-detail' ? getCaseworkComponent(caseSlug) : null
  const showCaseworkIndex = view === 'casework-index'
  const showDataBI = view === 'data-bi'
  const showOperations = view === 'operations'
  const showAbout = view === 'about'
  const showContactView = view === 'contact'
  const showProjectsIndex = view === 'projects'
  const showProjectDetail = view === 'project-detail'

  // Focus Management: move focus to <main> only on a *real* view change,
  // never on first mount (don't steal the browser's own initial-load
  // focus), and never for navigation that stays within the same rendered
  // view (see getRenderKey).
  //
  // Tracks the *previous* renderKey rather than a "have we run yet?" flag:
  // a boolean flag breaks under React 18 StrictMode, which double-invokes
  // an effect once right after initial mount (to catch non-idempotent
  // effects) — a flag flipped by the first invocation is already flipped
  // for the second, so it fires anyway. Comparing values is idempotent:
  // both invocations see the same (initial) renderKey and correctly skip.
  const mainRef = useRef(null)
  const renderKey = getRenderKey(route)
  const previousRenderKeyRef = useRef(renderKey)

  useEffect(() => {
    if (previousRenderKeyRef.current === renderKey) return
    previousRenderKeyRef.current = renderKey
    mainRef.current?.focus({ preventScroll: true })
  }, [renderKey])

  // Scroll-reveal for every `.fade-in` element in whatever is currently
  // mounted (Home Hub and several destinations reuse the same fade-in
  // sub-components — About/DataBI/Projects/Contact — so this must run for
  // all of them, not just Home). Re-queries on every real view change.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -50px 0px',
      },
    )

    document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [renderKey])

  const exitCasework = () => {
    setRoute({ view: 'home', params: {} })
  }

  return (
    <div className="page">
      <a className="skip-link" href={MAIN_CONTENT_HASH}>
        {t('nav.skipToContent')}
      </a>
      <div className="grid-bg" />

      <div className="content-layer">
        <div className="shell shell--site">
          <Header currentView={view} />
          <main id={MAIN_CONTENT_ID} className="site-main" ref={mainRef} tabIndex={-1}>
            {ActiveCaseComponent ? (
              <ActiveCaseComponent onExit={exitCasework} section={caseSection} />
            ) : showCaseworkIndex ? (
              <CaseworkIndex onExit={exitCasework} />
            ) : showDataBI ? (
              <DataBI />
            ) : showOperations ? (
              <Operations />
            ) : showAbout ? (
              <About />
            ) : showContactView ? (
              <ContactView />
            ) : showProjectDetail ? (
              <ProjectDetail id={params.projectId} />
            ) : showProjectsIndex ? (
              <ProjectsIndex />
            ) : (
              <Home />
            )}
          </main>
          <Footer />
        </div>
      </div>
    </div>
  )
}

export default App
