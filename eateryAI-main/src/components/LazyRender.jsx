import { useEffect, useRef, useState } from 'react'

export default function LazyRender({
  children,
  placeholder,
  rootMargin = '200px',
  minHeight = '240px',
}) {
  const [isVisible, setIsVisible] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    if (isVisible) return undefined
    const node = containerRef.current
    if (!node || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true)
      return undefined
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true)
          }
        })
      },
      { rootMargin }
    )

    observer.observe(node)

    return () => {
      observer.disconnect()
    }
  }, [isVisible, rootMargin])

  return (
    <div ref={containerRef} style={{ minHeight }}>
      {isVisible ? children : placeholder}
    </div>
  )
}
