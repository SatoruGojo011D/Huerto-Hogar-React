export default function FormField({ id, label, children, help, className, ...inputProps }) {
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      {children || <input id={id} className={className} {...inputProps} />}
      {help && <small className="texto-ayuda">{help}</small>}
    </div>
  )
}