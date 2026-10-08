export default function QuantityControl({ value, onChange, label = 'Cantidad', min = 1, max = 999 }) {
  function change(nextValue) {
    onChange(Math.min(max, Math.max(min, nextValue)))
  }

  return (
    <div className="qty-control" aria-label={label}>
      <button className="qty-btn" type="button" aria-label={`Disminuir ${label.toLowerCase()}`} disabled={value <= min} onClick={() => change(value - 1)}>−</button>
      <output className="qty-val" aria-live="polite">{value}</output>
      <button className="qty-btn" type="button" aria-label={`Aumentar ${label.toLowerCase()}`} disabled={value >= max} onClick={() => change(value + 1)}>+</button>
    </div>
  )
}