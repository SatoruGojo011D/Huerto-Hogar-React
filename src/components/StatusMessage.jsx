export default function StatusMessage({ children, variant = 'error', className = '' }) {
  if (!children) return null
  const role = variant === 'error' ? 'alert' : 'status'
  return <p className={`form-message ${variant} ${className}`.trim()} role={role} aria-live={role === 'alert' ? 'assertive' : 'polite'}>{children}</p>
}