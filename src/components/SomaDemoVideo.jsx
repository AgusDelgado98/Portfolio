import React, { useState, useRef, useEffect } from 'react'
import { SOMA_DEMO_POSTER_SRC, SOMA_DEMO_VIDEO_SRC } from '../constants/links.js'

/**
 * Soma's demo video — extracted from the old Projects.jsx dialog (Phase 4,
 * Projects Experience), unchanged, now rendered inline on Soma's real
 * Project Detail page instead of inside a modal. Respects
 * prefers-reduced-motion (pauses/resets instead of autoplaying/looping).
 */
export default function SomaDemoVideo({ label, fallback }) {
  const videoRef = useRef(null)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReducedMotion(media.matches)
    sync()
    media.addEventListener?.('change', sync)
    return () => media.removeEventListener?.('change', sync)
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return undefined

    if (reducedMotion) {
      video.pause()
      video.currentTime = 0
      return undefined
    }

    const play = video.play()
    if (play && typeof play.catch === 'function') {
      play.catch(() => {})
    }
    return undefined
  }, [reducedMotion])

  return (
    <figure className="atlas-sheet-demo" id="soma-demo">
      <div className="atlas-sheet-demo-frame">
        <video
          ref={videoRef}
          className="atlas-sheet-demo-video"
          autoPlay={!reducedMotion}
          muted
          loop={!reducedMotion}
          playsInline
          preload="metadata"
          controls={false}
          poster={SOMA_DEMO_POSTER_SRC}
          aria-label={label}
        >
          <source src={SOMA_DEMO_VIDEO_SRC} type="video/webm" />
          {fallback}
        </video>
      </div>
      <figcaption className="atlas-sheet-demo-caption">{label}</figcaption>
    </figure>
  )
}
