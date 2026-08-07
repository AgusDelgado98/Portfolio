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
import EngineeringLog from './components/EngineeringLog'
import AtlasProgress, { atlasPlates } from './components/AtlasProgress'
import { isEngineeringLogHash } from './constants/links.js'

function App() {
  const [activePlate, setActivePlate] = useState('00')
  const [visitedPlates, setVisitedPlates] = useState(() => new Set(['00']))
  const [view, setView] = useState(() =>
    typeof window !== 'undefined' && isEngineeringLogHash(window.location.hash) ? 'log' : 'atlas',
  )

  useEffect(() => {
    const syncView = () => {
      setView(isEngineeringLogHash(window.location.hash) ? 'log' : 'atlas')
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

  const exitEngineeringLog = () => {
    setView('atlas')
  }

  return (
    <div className={`page${view === 'log' ? ' page--elog' : ''}`}>
      <div className="grid-bg" />

      <div className="content-layer">
        <div className="shell shell--site">
          <Header activePlate={activePlate} view={view}>
            {view === 'atlas' ? (
              <AtlasProgress
                activePlate={activePlate}
                visitedPlates={visitedPlates}
                onNavigate={handlePlateNavigation}
              />
            ) : null}
          </Header>
          <main className="site-main">
            {view === 'log' ? (
              <EngineeringLog onExit={exitEngineeringLog} />
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
