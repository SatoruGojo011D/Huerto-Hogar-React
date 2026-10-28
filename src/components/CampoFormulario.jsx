export default function CampoFormulario({ id, label, children, help, error, className, ...inputProps }) {
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      {children || <input id={id} className={className} aria-invalid={error ? 'true' : undefined} aria-describedby={error ? `${id}-error` : undefined} {...inputProps} />}
      {help && <small className="texto-ayuda">{help}</small>}
      {error && <small id={`${id}-error`} className="form-error" role="alert">{error}</small>}
    </div>
  )
}
