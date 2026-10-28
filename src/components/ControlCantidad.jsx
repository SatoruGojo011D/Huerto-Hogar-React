export default function ControlCantidad({ value, onChange, label = 'Cantidad', min = 1, max = 999 }) {
  function change(nextValue) {
    const numericValue = Number(nextValue)
    const safeValue = Number.isFinite(numericValue) ? numericValue : min
    onChange(Math.min(max, Math.max(min, safeValue)))
  }

  return (
    <div className="qty-control" aria-label={label}>
      <button className="qty-btn" type="button" aria-label={`Disminuir ${label.toLowerCase()}`} disabled={value <= min} onClick={() => change(value - 1)}>−</button>
      <output className="qty-val" aria-live="polite">{value}</output>
      <button className="qty-btn" type="button" aria-label={`Aumentar ${label.toLowerCase()}`} disabled={value >= max} onClick={() => change(value + 1)}>+</button>
    </div>
  )
}