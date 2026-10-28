import { getOrders, readStorage, saveCart, writeStorage } from './storage.js'
import { discountStock } from './adminData.js'

export const regions = {
  'Región Metropolitana de Santiago': ['Santiago', 'Cerrillos', 'Providencia', 'Ñuñoa', 'Maipú', 'Las Condes'],
  'Región de Valparaíso': ['Valparaíso', 'Viña del Mar', 'Quilpué', 'Villa Alemana'],
  'Región del Biobío': ['Concepción', 'Talcahuano', 'Los Ángeles', 'Chiguayante'],
}

const FREE_SHIPPING_FROM = 25000
const SHIPPING_COST = 2990
export const IVA_RATE = 0.19
const PENDING_KEY = 'hh_pedido_pendiente'

// subtotal es el valor neto; el IVA (19 %) se suma al neto y luego se agrega el despacho.
export function calculateTotals(cart) {
  const subtotal = cart.reduce((sum, item) => sum + Number(item.precio) * Number(item.qty), 0)
  const iva = Math.round(subtotal * IVA_RATE)
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_COST
  return { subtotal, iva, shipping, total: subtotal + iva + shipping }
}

export function validateCheckout(data) {
  const errors = {}
  if (!data.nombre?.trim()) errors.nombre = 'Ingresa tu nombre.'
  if (!data.apellidos?.trim()) errors.apellidos = 'Ingresa tus apellidos.'
  if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(data.correo?.trim() || '')) errors.correo = 'Ingresa un correo válido.'
  if (!data.calle?.trim()) errors.calle = 'Ingresa la calle y número.'
  if (!data.region) errors.region = 'Selecciona una región.'
  if (!data.comuna || !regions[data.region]?.includes(data.comuna)) errors.comuna = 'Selecciona una comuna de la región.'
  return errors
}

export function buildOrder({ cart, customer, address, delivery, session }) {
  const { subtotal, iva, shipping, total } = calculateTotals(cart)
  return {
    code: `HH-${Math.floor(10000 + Math.random() * 90000)}`,
    createdAt: new Date().toISOString(),
    delivery: delivery || 'Fecha por confirmar',
    items: cart,
    subtotal,
    iva,
    shipping,
    total,
    status: 1,
    userId: session?.id ?? null,
    customerName: `${customer.nombre} ${customer.apellidos}`.trim(),
    customerEmail: customer.correo,
    customer,
    address,
  }
}

// Simula la pasarela de pago: aprueba salvo que se fuerce el rechazo.
export function processPayment(order, { approve = Math.random() < 0.85 } = {}) {
  return approve ? { ok: true, order } : { ok: false, order, reason: 'La pasarela rechazó el pago.' }
}

export function savePendingOrder(order) {
  writeStorage(PENDING_KEY, order)
}

export function getPendingOrder() {
  return readStorage(PENDING_KEY, null)
}

export function completeOrder(order) {
  writeStorage('hh_ultimo_pedido', order)
  writeStorage('hh_pedidos', [order, ...getOrders()])
  discountStock(order.items)
  localStorage.removeItem(PENDING_KEY)
  saveCart([])
}
