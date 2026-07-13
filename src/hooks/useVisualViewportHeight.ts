import { useEffect, useState } from 'react'

export function useVisualViewportHeight() {
  const [height, setHeight] = useState<number | null>(null)

  useEffect(() => {
    const viewport = window.visualViewport
    if (!viewport) return

    const update = () => setHeight(viewport.height)
    update()
    viewport.addEventListener('resize', update)
    return () => viewport.removeEventListener('resize', update)
  }, [])

  return height
}
