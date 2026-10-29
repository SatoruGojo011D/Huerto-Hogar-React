// Fecha mínima para coordinar la entrega (hoy, en formato AAAA-MM-DD); la usa el campo de fecha del carrito.
export function getMinimumDeliveryDate() {
  const today = new Date()
  return [today.getFullYear(), String(today.getMonth() + 1).padStart(2, '0'), String(today.getDate()).padStart(2, '0')].join('-')
}
