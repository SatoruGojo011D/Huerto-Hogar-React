// Página /carrito: líneas del pedido, cambio de cantidades (useReducer), eliminación, fecha de entrega y totales; lleva a /checkout.
import { useEffect, useReducer, useState } from 'react'
import { resolveProductImage } from '../js/products.js'
import { getCart, readStorage, saveCart, writeStorage } from '../js/storage.js'
import { formatPrice } from '../js/format.js'
import ControlCantidad from '../components/ControlCantidad.jsx'
import MensajeEstado from '../components/MensajeEstado.jsx'
import { getMinimumDeliveryDate } from '../js/delivery.js'
import { cartReducer } from '../js/cartReducer.js'
import { calculateTotals } from '../js/checkout.js'

export function CartPage() {
  const [cart, dispatch] = useReducer(cartReducer, undefined, getCart)
  const [delivery, setDelivery] = useState(() => readStorage('hh_fecha_entrega', ''))
  const [message, setMessage] = useState('')
  const count = cart.reduce((sum, item) => sum + Number(item.qty), 0)
  const { subtotal, iva, shipping, total } = calculateTotals(cart)

  // El carrito vive en el reductor; cada cambio se guarda en el navegador.
  useEffect(() => { saveCart(cart) }, [cart])

  function goToCheckout() {
    if (!cart.length) {
      setMessage('Agrega al menos un producto antes de continuar al pago.')
      return
    }
    window.location.assign('/checkout')
  }

  return (
    <main className="container">
      <h2 className="cart-title serif">Mi carrito</h2><p className="cart-subtitle">Cosechamos tu pedido el día anterior a la entrega.</p>
      <div className="cart-grid">
        <section className="cart-items" aria-label="Productos del carrito">
          {!cart.length ? <div className="empty-cart"><div className="empty-cart-icon">🛒</div><h3>Tu carrito está vacío</h3><p>Aún no has agregado productos. Explora el catálogo y añade lo que te guste.</p><a href="/catalogo" className="btn-checkout empty-cart-btn">Ver catálogo</a></div> : cart.map((item) => <article className="cart-card" key={item.id}>
            <img src={resolveProductImage(item.imagen)} alt={item.nombre} />
            <div className="cart-card-info"><h3 className="serif">{item.nombre}</h3><p className="unit-price">{item.precio_original > item.precio && <del>{formatPrice(item.precio_original)} </del>}{formatPrice(item.precio)}</p><ControlCantidad label={`Cantidad de ${item.nombre}`} value={Number(item.qty)} max={999} onChange={(qty) => dispatch({ tipo: 'cambiar_cantidad', id: item.id, qty })} /></div>
            <button className="remove-btn" type="button" aria-label={`Eliminar ${item.nombre}`} onClick={() => dispatch({ tipo: 'eliminar', id: item.id })}>×</button><strong className="item-total-price">{formatPrice(item.precio * item.qty)}</strong>
          </article>)}
        </section>
        <aside className="summary-box">
          <h3 className="serif">Resumen del pedido</h3>
          <div className="summary-item"><span>Neto ({count} producto(s))</span><strong>{formatPrice(subtotal)}</strong></div>
          <div className="summary-item"><span>IVA (19 %)</span><strong>{formatPrice(iva)}</strong></div>
          <div className="summary-item"><span>Despacho</span><strong>{formatPrice(subtotal ? shipping : 0)}</strong></div>
          <div className="summary-item total-row"><span>Total</span><strong>{formatPrice(total)}</strong></div>
          <div className="date-picker-box"><label htmlFor="delivery-date">Fecha de entrega</label><input id="delivery-date" type="date" min={getMinimumDeliveryDate()} value={delivery} onChange={(event) => { setDelivery(event.target.value); writeStorage('hh_fecha_entrega', event.target.value) }} /></div>
          <div className="green-impact-card"><div className="impact-header">🍃 Huella de carbono reducida</div><div className="impact-value">{(count * 0.416).toFixed(1)} kg CO₂e</div><p className="impact-sub">Este pedido evita intermediarios y usa envases retornables.</p><div className="progress-track" role="progressbar" aria-label="Huella de carbono del carrito" aria-valuemin="0" aria-valuemax="100" aria-valuenow={Math.min(100, count * 16)}><div className="progress-fill" style={{ width: `${Math.min(100, count * 16)}%` }} /></div></div>
          <button className="btn-checkout" type="button" onClick={goToCheckout}>Ir a pagar</button>
          <p className="free-shipping-indicator">{subtotal >= 25000 ? '¡Tu envío es gratis!' : `Suma ${formatPrice(25000 - subtotal)} más para despacho gratis.`}</p>
          <MensajeEstado>{message}</MensajeEstado>
        </aside>
      </div>
    </main>
  )
}
