// Hook que activa un estado temporal (por defecto 1 segundo) tras una acción; lo usa TarjetaProducto para mostrar "✓ Añadido".
import { useCallback, useEffect, useRef, useState } from 'react'

export default function useTransientFeedback(duration = 1000) {
  const [isActive, setIsActive] = useState(false)
  const timeoutRef = useRef(null)

  const trigger = useCallback(() => {
    setIsActive(true)
    window.clearTimeout(timeoutRef.current)
    timeoutRef.current = window.setTimeout(() => {
      setIsActive(false)
      timeoutRef.current = null
    }, duration)
  }, [duration])

  useEffect(() => () => window.clearTimeout(timeoutRef.current), [])

  return { isActive, trigger }
}
