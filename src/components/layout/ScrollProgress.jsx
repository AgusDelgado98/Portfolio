import React, { useEffect, useRef } from 'react'

/**
 * Reading-progress hairline under the header (a thin sand line whose length is
 * the scroll position). Decorative: hidden from assistive technology, and it
 * never animates on its own — it only follows the scroll, so it needs no
 * reduced-motion variant.
 *
 * The bar is written straight to the DOM (no React state): a scroll event
 * would otherwise re-render the header on every frame. Reads are batched into
 * one animation frame, and a ResizeObserver on <body> keeps the ratio right
 * when a route change or an image changes the page height.
 */
export default function ScrollProgress() {
  const barRef = useRef(null)

  useEffect(() => {
    const bar = barRef.current
    if (!bar) return undefined
    let frame = 0

    const paint = () => {
      frame = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      bar.style.transform = `scaleX(${ratio})`
    }
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(paint)
    }

    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    window.addEventListener('hashchange', schedule)
    let observer = null
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(schedule)
      observer.observe(document.body)
    }

    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      window.removeEventListener('hashchange', schedule)
      if (observer) observer.disconnect()
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div className="site-progress" aria-hidden="true">
      <span ref={barRef} className="site-progress__bar" />
    </div>
  )
}
