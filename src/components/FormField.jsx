export default function FormField({ id, label, children, help, ...inputProps }) {
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      {children || <input id={id} {...inputProps} />}
      {help && <small className="texto-ayuda">{help}</small>}
    </div>
  )
}