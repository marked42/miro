import { useEffect, useRef } from 'react'

export function usePreventTouchpadBack<T>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const container = ref.current
    if (!container) {
      return
    }

    const handleWheel = (e: WheelEvent) => {
      // 检测触摸板 - 通常触摸板的delta值较小且更连续
      const isTouchpad = Math.abs(e.deltaX) > 0 && Math.abs(e.deltaX) % 1 !== 0

      if (isTouchpad && Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault()
      }
    }

    container.addEventListener('wheel', handleWheel, { passive: false })
    return () => container.removeEventListener('wheel', handleWheel)
  }, [])

  return ref
}
