// Mensaje breve de estado accesible (error o éxito). No muestra nada si no recibe contenido.
export default function MensajeEstado({ children, variant = 'error', className = '' }) {
  if (!children) return null
  const role = variant === 'error' ? 'alert' : 'status'
  return <p className={`form-message ${variant} ${className}`.trim()} role={role} aria-live={role === 'alert' ? 'assertive' : 'polite'}>{children}</p>
}