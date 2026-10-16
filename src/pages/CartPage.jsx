import { useState } from 'react'
import { resolveProductImage } from '../js/products.js'
import { getCart, getOrders, getSession, readStorage, saveCart, writeStorage } from '../js/storage.js'
import { formatPrice } from '../js/format.js'
import OrderReceiptModal from '../components/OrderReceiptModal.jsx'
import QuantityControl from '../components/QuantityControl.jsx'
import StatusMessage from '../components/StatusMessage.jsx'
import { getMinimumDeliveryDate } from '../js/delivery.js'

function createOrder(cart, delivery, subtotal, shipping) {
  const code = `HH-${Math.floor(10000 + Math.random() * 90000)}`
  const customer = getSession()
  return {
    code,
    createdAt: new Date().toISOString(),
    delivery: delivery || 'Fecha por confirmar',
    items: cart,
    subtotal,
    shipping,
    total: subtotal + shipping,
    status: 1,
    userId: customer?.id ?? null,
    customerName: customer?.nombre || '',
    customerEmail: customer?.correo || '',
  }
}

export function CartPage() {
  const [cart, setCart] = useState(getCart)
  const [delivery, setDelivery] = useState(() => readStorage('hh_fecha_entrega', ''))
  const [receipt, setReceipt] = useState(null)
  const [message, setMessage] = useState('')
  const subtotal = cart.reduce((sum, item) => sum + Number(item.precio) * Number(item.qty), 0)
  const count = cart.reduce((sum, item) => sum + Number(item.qty), 0)
  const shipping = subtotal >= 25000 ? 0 : 2990

  function updateCart(nextCart) {
    setCart(nextCart)
    saveCart(nextCart)
  }

  function confirmOrder() {
    if (!cart.length) {
      setMessage('Agrega al menos un producto antes de confirmar el pedido.')
      return
    }
    const order = createOrder(cart, delivery, subtotal, shipping)
    writeStorage('hh_ultimo_pedido', order)
    writeStorage('hh_pedidos', [order, ...getOrders()])
    updateCart([])
    setReceipt(order)
    setMessage('')
  }

  return (
    <main className="container">
      <h2 className="cart-title serif">Mi carrito</h2><p className="cart-subtitle">Cosechamos tu pedido el día anterior a la entrega.</p>
      <div className="cart-grid">
        <section className="cart-items" aria-label="Productos del carrito">
          {!cart.length ? <div className="empty-cart"><div className="empty-cart-icon">🛒</div><h3>Tu carrito está vacío</h3><p>Aún no has agregado productos. Explora el catálogo y añade lo que te guste.</p><a href="/catalogo" className="btn-checkout empty-cart-btn">Ver catálogo</a></div> : cart.map((item) => <article className="cart-card" key={item.id}>
            <img src={resolveProductImage(item.imagen)} alt={item.nombre} />
            <div className="cart-card-info"><h3 className="serif">{item.nombre}</h3><p className="unit-price">{item.precio_original > item.precio && <del>{formatPrice(item.precio_original)} </del>}{formatPrice(item.precio)}</p><QuantityControl label={`Cantidad de ${item.nombre}`} value={Number(item.qty)} max={999} onChange={(qty) => updateCart(cart.map((entry) => entry.id === item.id ? { ...entry, qty } : entry))} /></div>
            <button className="remove-btn" type="button" aria-label={`Eliminar ${item.nombre}`} onClick={() => updateCart(cart.filter((entry) => entry.id !== item.id))}>×</button><strong className="item-total-price">{formatPrice(item.precio * item.qty)}</strong>
          </article>)}
        </section>
        <aside className="summary-box">
          <h3 className="serif">Resumen del pedido</h3>
          <div className="summary-item"><span>Subtotal ({count} producto(s))</span><strong>{formatPrice(subtotal)}</strong></div>
          <div className="summary-item"><span>Despacho</span><strong>{formatPrice(subtotal ? shipping : 0)}</strong></div>
          <div className="summary-item total-row"><span>Total</span><strong>{formatPrice(subtotal ? subtotal + shipping : 0)}</strong></div>
          <div className="date-picker-box"><label htmlFor="delivery-date">Fecha de entrega</label><input id="delivery-date" type="date" min={getMinimumDeliveryDate()} value={delivery} onChange={(event) => { setDelivery(event.target.value); writeStorage('hh_fecha_entrega', event.target.value) }} /></div>
          <div className="green-impact-card"><div className="impact-header">🍃 Huella de carbono reducida</div><div className="impact-value">{(count * 0.416).toFixed(1)} kg CO₂e</div><p className="impact-sub">Este pedido evita intermediarios y usa envases retornables.</p><div className="progress-track" role="progressbar" aria-label="Huella de carbono del carrito" aria-valuemin="0" aria-valuemax="100" aria-valuenow={Math.min(100, count * 16)}><div className="progress-fill" style={{ width: `${Math.min(100, count * 16)}%` }} /></div></div>
          <button className="btn-checkout" type="button" onClick={confirmOrder}>Confirmar pedido</button>
          <p className="free-shipping-indicator">{subtotal >= 25000 ? '¡Tu envío es gratis!' : `Suma ${formatPrice(25000 - subtotal)} más para despacho gratis.`}</p>
          <StatusMessage>{message}</StatusMessage>
        </aside>
      </div>
      <OrderReceiptModal order={receipt} onClose={() => setReceipt(null)} />
    </main>
  )
}
