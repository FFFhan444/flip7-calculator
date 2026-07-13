import { useEffect } from 'react'

/**
 * iOS Safari scrolls the document to bring a focused input into view even
 * when the app shell is position:fixed with overflow:hidden — the native
 * scroll-into-view runs regardless of the fixed element's CSS. Snap the
 * document back to (0, 0) whenever it tries to move.
 */
export function useLockDocumentScroll() {
  useEffect(() => {
    const resetScroll = () => {
      if (window.scrollX !== 0 || window.scrollY !== 0) {
        window.scrollTo(0, 0)
      }
    }

    window.addEventListener('scroll', resetScroll, { passive: true })
    window.visualViewport?.addEventListener('scroll', resetScroll)
    window.visualViewport?.addEventListener('resize', resetScroll)

    return () => {
      window.removeEventListener('scroll', resetScroll)
      window.visualViewport?.removeEventListener('scroll', resetScroll)
      window.visualViewport?.removeEventListener('resize', resetScroll)
    }
  }, [])
}
