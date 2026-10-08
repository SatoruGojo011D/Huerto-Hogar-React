import { formatPrice } from '../lib/storage.js'

export default function OrderReceiptModal({ order, onClose }) {
  if (!order) return null
  return (
    <div className="receipt-overlay" role="presentation">
      <section className="receipt-modal" role="dialog" aria-modal="true" aria-labelledby="receipt-title">
        <button className="receipt-close" type="button" aria-label="Cerrar comprobante" onClick={onClose}>×</button>
        <div className="receipt-success-icon" aria-hidden="true">✓</div>
        <p className="receipt-kicker">Pedido confirmado</p>
        <h2 id="receipt-title" className="serif">Gracias por tu compra</h2>
        <p className="receipt-lead">Tu pedido fue registrado correctamente y ya puedes seguirlo con su código.</p>
        <div className="receipt-code-box"><span>Número de pedido</span><strong>{order.code}</strong></div>
        <div className="receipt-details"><span>Entrega</span><strong>{order.delivery}</strong><span>Total pagado</span><strong>{formatPrice(order.total)}</strong></div>
        <a className="btn-checkout receipt-track-btn" href={`/seguimiento?codigo=${encodeURIComponent(order.code)}`}>Ver seguimiento</a>
        <button className="receipt-secondary-btn" type="button" onClick={onClose}>Volver al catálogo</button>
      </section>
    </div>
  )
}