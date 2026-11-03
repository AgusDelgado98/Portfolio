import { useEffect, useRef } from 'react'

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
const DESKTOP_QUERY = '(min-width: 800px)'

/**
 * Behavior of the full-screen mobile menu (SiteHeader + MobileNav), kept out
 * of the components so the contract is in one place:
 *
 *  - Escape closes it and returns focus to the toggle button.
 *  - Tab and Shift+Tab cycle inside the header (the bar with the toggle and the
 *    menu); focus never lands on the page behind.
 *  - The page behind is `inert` and does not scroll while the menu is open.
 *  - It closes by itself when the route changes (`hashchange`, which covers
 *    links, the back button and a typed address) and when the viewport grows
 *    past the menu breakpoint (rotation, resize), where the inline nav takes
 *    over.
 *  - After it closes, if focus was left on a control that just disappeared,
 *    it goes back to the toggle. A real route change is not affected: App.jsx
 *    moves focus to <main> and that wins.
 *
 * No animation lives here; the CSS fades the panel and drops the fade under
 * `prefers-reduced-motion`.
 */
export default function useModalMenu({ open, containerRef, toggleRef, onClose }) {
  const wasOpen = useRef(false)

  useEffect(() => {
    if (!open) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        toggleRef.current?.focus()
        return
      }
      if (event.key !== 'Tab') return
      const container = containerRef.current
      if (!container) return
      const items = Array.from(container.querySelectorAll(FOCUSABLE)).filter(
        (element) => element.offsetParent !== null || element === document.activeElement,
      )
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      const active = document.activeElement
      if (!container.contains(active)) {
        event.preventDefault()
        first.focus()
      } else if (event.shiftKey && active === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, containerRef, toggleRef, onClose])

  // Inert page + no scroll behind the menu.
  useEffect(() => {
    if (!open) return undefined
    const header = containerRef.current
    const root = document.documentElement
    const previousOverflow = root.style.overflow
    root.style.overflow = 'hidden'

    const inerted = []
    let node = header
    while (node && node.parentElement && node.parentElement !== document.body) {
      for (const sibling of node.parentElement.children) {
        if (sibling !== node && !sibling.inert) {
          sibling.inert = true
          inerted.push(sibling)
        }
      }
      node = node.parentElement
    }

    return () => {
      root.style.overflow = previousOverflow
      for (const element of inerted) element.inert = false
    }
  }, [open, containerRef])

  // Close on route change and when the inline nav takes over.
  useEffect(() => {
    if (!open) return undefined
    window.addEventListener('hashchange', onClose)
    const query = typeof window.matchMedia === 'function' ? window.matchMedia(DESKTOP_QUERY) : null
    const onQueryChange = (event) => {
      if (event.matches) onClose()
    }
    query?.addEventListener('change', onQueryChange)
    return () => {
      window.removeEventListener('hashchange', onClose)
      query?.removeEventListener('change', onQueryChange)
    }
  }, [open, onClose])

  // Do not leave focus on a control that just disappeared.
  useEffect(() => {
    if (open) {
      wasOpen.current = true
      return undefined
    }
    if (!wasOpen.current) return undefined
    wasOpen.current = false
    const frame = window.requestAnimationFrame(() => {
      const active = document.activeElement
      const lost = !active || active === document.body || active.closest?.('.mobile-nav')
      if (lost) toggleRef.current?.focus({ preventScroll: true })
    })
    return () => window.cancelAnimationFrame(frame)
  }, [open, toggleRef])
}
