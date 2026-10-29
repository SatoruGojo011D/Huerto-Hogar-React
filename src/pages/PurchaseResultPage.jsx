// Páginas /compra/exitosa y /compra/error: boleta de la compra o error de pago (con su motivo) y opción de reintentar.
import { formatPrice } from '../js/format.js'
import { getOrders } from '../js/storage.js'
import { getPendingOrder } from '../js/checkout.js'
import TablaProductosPedido from '../components/TablaProductosPedido.jsx'

function OrderDetail({ order }) {
  const { address = {} } = order
  const location = [address.calle, address.departamento && `Depto ${address.departamento}`, address.comuna, address.region].filter(Boolean).join(', ')
  return (
    <>
      <dl className="receipt-admin-meta">
        <dt>Cliente</dt><dd>{order.customerName} ({order.customerEmail})</dd>
        <dt>Dirección</dt><dd>{location}</dd>
        <dt>Entrega</dt><dd>{order.delivery}</dd>
        {address.indicaciones && <><dt>Indicaciones</dt><dd>{address.indicaciones}</dd></>}
      </dl>
      <TablaProductosPedido items={order.items} />
      <p className="text-center mb-1">Neto {formatPrice(order.subtotal)} + IVA {formatPrice(order.iva ?? 0)} + despacho {formatPrice(order.shipping)}</p>
      <p className="fs-5 text-center"><strong>Total: {formatPrice(order.total)}</strong></p>
    </>
  )
}

function findOrder(success) {
  const code = new URLSearchParams(window.location.search).get('codigo')
  const order = success ? getOrders().find((entry) => entry.code === code) : getPendingOrder()
  return order && order.code === code ? order : null
}

export function PurchaseResultPage({ success }) {
  const order = findOrder(success)
  if (!order) {
    return <main className="container py-5"><div className="empty-cart"><h3>No encontramos la compra</h3><a href="/catalogo" className="btn-checkout empty-cart-btn">Volver al catálogo</a></div></main>
  }
  return (
    <main className="container py-5">
      <section className="summary-box" aria-labelledby="purchase-title">
        <h2 id="purchase-title" className="serif">
          <span aria-hidden="true">{success ? '✅ ' : '❌ '}</span>
          {success ? `Se ha realizado la compra. nro #${order.code}` : `No se pudo realizar el pago. nro #${order.code}`}
        </h2>
        {success
          ? <p className="cart-subtitle">Gracias por tu compra. <a href={`/seguimiento?codigo=${encodeURIComponent(order.code)}`}>Ver seguimiento</a></p>
          : <>{order.rejectionReason && <p className="cart-subtitle">Motivo: {order.rejectionReason}</p>}<a className="btn-checkout" href="/checkout">Volver a realizar el pago</a></>}
        <OrderDetail order={order} />
        {success && <div className="d-flex gap-2 justify-content-center flex-wrap"><button className="btn btn-danger" type="button" onClick={() => window.print()}>Imprimir boleta en PDF</button><a className="btn btn-success" href={`mailto:${order.customerEmail}?subject=Boleta ${order.code}`}>Enviar boleta por email</a></div>}
      </section>
    </main>
  )
}
