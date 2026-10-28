export function formatPrice(value) {
  return `$${Number(value || 0).toLocaleString('es-CL')} CLP`
}

// Muestra el stock solo como cantidad: "150 kg" se muestra como "150".
export function formatStock(stock) {
  const amount = Number.parseFloat(String(stock))
  return Number.isFinite(amount) ? String(amount) : String(stock ?? '')
}
