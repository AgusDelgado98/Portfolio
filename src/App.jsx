import React, { useEffect, useState } from 'react'
import './styles.css'
import './atlas.css'
import './engineering-log.css'
import Header from './components/Header'
import Hero from './components/Hero'
import Projects from './components/Projects'
import Approach from './components/Approach'
import Stack from './components/Stack'
import Contact from './components/Contact'
import Footer from './components/Footer'
import CaseworkIndex from './components/CaseworkIndex'
import AtlasProgress, { atlasPlates } from './components/AtlasProgress'
import { parseCaseworkHash } from './constants/links.js'
import { getCaseworkComponent } from './casework/registry.js'

/**
 * Resolves a location hash to an app route.
 * `#casework` (no slug) opens the CaseworkIndex. `#casework/<slug>` (and
 * the legacy `#engineering-log` alias) opens that case directly. An
 * unknown slug does NOT fall back to any case — it resolves to atlas.
 */
function resolveCaseworkRoute(hash) {
  const { inCasework, slug } = parseCaseworkHash(hash)
  if (!inCasework) return { view: 'atlas', caseSlug: null }

  if (slug === null) return { view: 'casework-index', caseSlug: null }

  return getCaseworkComponent(slug)
    ? { view: 'casework', caseSlug: slug }
    : { view: 'atlas', caseSlug: null }
}

function App() {
  const [activePlate, setActivePlate] = useState('00')
  const [visitedPlates, setVisitedPlates] = useState(() => new Set(['00']))
  const [route, setRoute] = useState(() =>
    resolveCaseworkRoute(typeof window !== 'undefined' ? window.location.hash : ''),
  )
  const { view, caseSlug } = route

  useEffect(() => {
    const syncView = () => {
      setRoute(resolveCaseworkRoute(window.location.hash))
    }
    window.addEventListener('hashchange', syncView)
    syncView()
    return () => window.removeEventListener('hashchange', syncView)
  }, [])

  useEffect(() => {
    if (view !== 'atlas') return undefined

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

    const elements = document.querySelectorAll('.fade-in')
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [view])

  useEffect(() => {
    if (view !== 'atlas') return undefined

    const plateTargets = atlasPlates
      .map((plate) => ({ plate, target: document.querySelector(plate.href) }))
      .filter(({ target }) => Boolean(target))

    const updateActivePlate = () => {
      const referenceLine = window.innerHeight * 0.33
      let nextPlate = atlasPlates[0]

      plateTargets.forEach(({ plate, target }) => {
        if (target && target.getBoundingClientRect().top <= referenceLine) {
          nextPlate = plate
        }
      })

      setActivePlate((current) => (current === nextPlate.id ? current : nextPlate.id))
      setVisitedPlates((current) => {
        if (current.has(nextPlate.id)) return current
        const updated = new Set(current)
        updated.add(nextPlate.id)
        return updated
      })
    }

    const plateObserver = new IntersectionObserver(updateActivePlate, {
      rootMargin: '-32% 0px -67% 0px',
      threshold: 0,
    })

    plateTargets.forEach(({ target }) => plateObserver.observe(target))
    updateActivePlate()

    return () => plateObserver.disconnect()
  }, [view])

  const handlePlateNavigation = (plateId) => {
    setActivePlate(plateId)
    setVisitedPlates((current) => {
      const updated = new Set(current)
      updated.add(plateId)
      return updated
    })
  }

  const exitCasework = () => {
    setRoute({ view: 'atlas', caseSlug: null })
  }

  const ActiveCaseComponent = view === 'casework' ? getCaseworkComponent(caseSlug) : null
  const showCaseworkIndex = view === 'casework-index'
  const inCaseworkChrome = Boolean(ActiveCaseComponent) || showCaseworkIndex

  return (
    <div className={`page${inCaseworkChrome ? ' page--elog' : ''}`}>
      <div className="grid-bg" />

      <div className="content-layer">
        <div className="shell shell--site">
          <Header activePlate={activePlate} view={inCaseworkChrome ? 'log' : 'atlas'}>
            {view === 'atlas' ? (
              <AtlasProgress
                activePlate={activePlate}
                visitedPlates={visitedPlates}
                onNavigate={handlePlateNavigation}
              />
            ) : null}
          </Header>
          <main className="site-main">
            {ActiveCaseComponent ? (
              <ActiveCaseComponent onExit={exitCasework} />
            ) : showCaseworkIndex ? (
              <CaseworkIndex onExit={exitCasework} />
            ) : (
              <>
                <Hero />
                <div className="divider" />
                <Projects />
                <Approach />
                <Stack />
                <Contact />
              </>
            )}
          </main>
          <Footer />
        </div>
      </div>
    </div>
  )
}

export default App
