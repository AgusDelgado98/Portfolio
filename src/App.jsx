import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import './styles.css'
import './styles/shell.css'
import './styles/tokens.css'
import './styles/base.css'
import './styles/home.css'
import './styles/projects.css'
import './styles/visuals.css'
import './styles/about.css'
import './styles/contact.css'
import SiteHeader from './components/layout/SiteHeader'
import Home from './components/Home'
import Footer from './components/Footer'
import About from './components/About'
import ContactView from './components/ContactView'
import ProjectsIndex from './components/ProjectsIndex'
import ProjectDetail from './components/ProjectDetail'
import CaseShell from './components/CaseShell'
import { getLazyCase } from './casework/components.js'
import { getCaseStudy } from './projects/caseStudies.js'
import { getProjectBackHash, getProjectEntry } from './projects/registry.js'
import { resolveAppRoute, getRenderKey } from './router/resolveAppRoute.js'
import { syncRouteFromLocation } from './router/syncRoute.js'
import { MAIN_CONTENT_ID, MAIN_CONTENT_HASH, isAboutScrollSection } from './router/hashes.js'
import { getRouteTitle } from './router/documentTitle.js'
import { useLanguage } from './i18n/LanguageContext.jsx'

function App() {
  const { t } = useLanguage()
  const [route, setRoute] = useState(() =>
    resolveAppRoute(typeof window !== 'undefined' ? window.location.hash : ''),
  )
  const { view, params } = route

  useEffect(() => {
    const syncView = () => {
      const next = syncRouteFromLocation(window)
      if (next) setRoute(next)
    }
    window.addEventListener('hashchange', syncView)
    syncView()
    return () => window.removeEventListener('hashchange', syncView)
  }, [])

  useEffect(() => {
    document.title = getRouteTitle(route, t)
  }, [route, t])

  // Focus Management + scroll: on a *real* view change — never on first mount
  // (don't steal the browser's own initial-load focus or scroll restoration),
  // and never for navigation that stays within the same rendered view (see
  // getRenderKey) — scroll to the top and move focus to <main>.
  //
  // Tracks the *previous* renderKey rather than a "have we run yet?" flag: a
  // boolean flag breaks under React 18 StrictMode, which double-invokes an
  // effect once right after initial mount — a flag flipped by the first
  // invocation is already flipped for the second, so it fires anyway.
  // Comparing values is idempotent: both invocations see the same (initial)
  // renderKey and correctly skip.
  //
  // Exception: `#about/<section>` opens About already scrolled to — and focused
  // on — that block (components/About.jsx), so sending the page to the top and
  // focus to <main> here would undo that.
  const mainRef = useRef(null)
  const renderKey = getRenderKey(route)
  const previousRenderKeyRef = useRef(renderKey)
  const opensAboutSection = view === 'about' && isAboutScrollSection(params.section)

  useEffect(() => {
    if (previousRenderKeyRef.current === renderKey) return
    previousRenderKeyRef.current = renderKey
    if (opensAboutSection) return
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    mainRef.current?.focus({ preventScroll: true })
  }, [renderKey])

  // Scroll-reveal for every `.fade-in` element in whatever is currently
  // mounted. Re-queries on every real view change.
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

  // The case study component for a `project-case` route. The router already
  // resolved project + case from projects/caseStudies.js; this only looks up
  // which React component renders it.
  const caseStudy = view === 'project-case' ? getCaseStudy(params.projectId, params.caseSlug) : null
  const LazyCase = caseStudy ? getLazyCase(caseStudy.projectId, caseStudy.slug) : null
  const AboutView = view === 'about' ? About : null

  // The document stays on the dark surface, including case studies. The case
  // body opts into paper locally (see .ds-case-stage).
  useLayoutEffect(() => {
    document.documentElement.dataset.surface = 'dark'
  }, [])

  return (
    <div className="page">
      <a className="skip-link" href={MAIN_CONTENT_HASH}>
        {t('nav.skipToContent')}
      </a>

      <div className="content-layer">
        <div className="shell shell--site">
          <SiteHeader currentView={view} />
          <main id={MAIN_CONTENT_ID} className="site-main" ref={mainRef} tabIndex={-1}>
            {caseStudy && LazyCase ? (
              <CaseShell
                study={caseStudy}
                project={getProjectEntry(caseStudy.projectId)}
                backHref={getProjectBackHash(caseStudy.projectId)}
              >
                <LazyCase section={params.caseSection} backHref={getProjectBackHash(caseStudy.projectId)} />
              </CaseShell>
            ) : AboutView ? (
              <AboutView section={params.section} />
            ) : view === 'contact' ? (
              <ContactView />
            ) : view === 'project-detail' ? (
              <ProjectDetail id={params.projectId} />
            ) : view === 'projects' ? (
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
