import { useEffect } from 'react'

/**
 * Publishes the rendered height of the element behind `ref` as a CSS custom
 * property on <html> (e.g. `--site-header-h`), and keeps it current when the
 * element wraps, resizes or loads a font. Sticky tops and scroll margins read
 * the variable instead of repeating guessed pixel values per view.
 *
 * The first measurement waits for an idle moment. Measuring in the mount
 * effect forces a layout and a root-wide style recalculation before the first
 * paint, which delayed Home's first contentful paint; tokens.css carries a
 * fallback value for that short window. The property is only written when the
 * number actually changes.
 *
 * On unmount the property is reset to `resetTo` so a view that owned a
 * sub-bar (the section nav) does not leave its offset behind.
 */
export default function useCssVarHeight(ref, name, resetTo = null) {
  useEffect(() => {
    const node = ref.current
    if (!node) return undefined
    const root = document.documentElement
    let last = null
    const sync = () => {
      const height = Math.round(node.getBoundingClientRect().height)
      if (height === last) return
      last = height
      root.style.setProperty(name, `${height}px`)
    }

    let observer = null
    const start = () => {
      sync()
      if (typeof ResizeObserver !== 'undefined') {
        observer = new ResizeObserver(sync)
        observer.observe(node)
      } else {
        window.addEventListener('resize', sync)
      }
    }

    const useIdle = typeof window.requestIdleCallback === 'function'
    const handle = useIdle ? window.requestIdleCallback(start, { timeout: 600 }) : window.setTimeout(start, 200)

    return () => {
      if (useIdle) window.cancelIdleCallback(handle)
      else window.clearTimeout(handle)
      if (observer) observer.disconnect()
      else window.removeEventListener('resize', sync)
      if (resetTo === null) root.style.removeProperty(name)
      else root.style.setProperty(name, resetTo)
    }
  }, [ref, name, resetTo])
}
