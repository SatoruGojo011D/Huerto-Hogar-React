import { useState } from 'react'
import { formatPrice } from '../js/format.js'
import { getOrders, getUsers, writeStorage } from '../js/storage.js'

const orderStatuses = ['Confirmado', 'En preparación', 'En camino', 'Entregado']

function getCustomer(order, users) {
  const user = users.find((entry) => (
    (order.userId != null && String(entry.id) === String(order.userId))
    || (order.customerEmail && entry.correo?.toLowerCase() === order.customerEmail.toLowerCase())
  ))
  return user?.nombre || order.customerName || order.customerEmail || 'Compra sin cuenta asociada'
}

export function AdminOrdersPage() {
  const [orders, setOrders] = useState(() => getOrders())
  const [selectedOrder, setSelectedOrder] = useState(null)
  const users = getUsers()

  function updateStatus(orderCode, status) {
    const next = orders.map((order) => order.code === orderCode ? { ...order, status: Number(status) } : order)
    writeStorage('hh_pedidos', next)
    setOrders(next)
  }

  return (
    <div className="admin-page-stack">
      <section className="summary-box">
        <div className="products-toolbar">
          <div><h2 className="serif">Órdenes y boletas</h2><p>Consulta pedidos, actualiza su estado y revisa el comprobante de compra.</p></div>
          <span className="badge rounded-pill text-bg-success">{orders.length} pedidos</span>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-products-table">
            <thead><tr><th>Pedido</th><th>Fecha</th><th>Cliente</th><th>Estado</th><th>Total</th><th>Boleta</th></tr></thead>
            <tbody>
              {orders.length ? orders.map((order, index) => (
                <tr key={order.code || index}>
                  <td className="product-name">{order.code || 'Sin código'}</td>
                  <td>{order.createdAt ? new Date(order.createdAt).toLocaleDateString('es-CL') : 'Sin fecha'}</td>
                  <td>{getCustomer(order, users)}</td>
                  <td><select aria-label={`Estado de ${order.code || 'pedido'}`} value={Number(order.status) || 1} onChange={(event) => updateStatus(order.code, event.target.value)}>{orderStatuses.map((status, statusIndex) => <option key={status} value={statusIndex + 1}>{status}</option>)}</select></td>
                  <td>{formatPrice(order.total)}</td>
                  <td><button className="btn btn-secondary" type="button" onClick={() => setSelectedOrder(order)}>Ver boleta</button></td>
                </tr>
              )) : <tr><td colSpan="6" className="table-empty">Todavía no hay órdenes registradas.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
      {selectedOrder && (
        <section className="card receipt-admin" aria-labelledby="admin-receipt-title">
          <div className="card-header"><h2 id="admin-receipt-title">Boleta {selectedOrder.code || ''}</h2></div>
          <div className="card-body">
            <dl className="receipt-admin-meta">
              <dt>Cliente</dt><dd>{getCustomer(selectedOrder, users)}</dd>
              <dt>Fecha del pedido</dt><dd>{selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString('es-CL') : 'Sin fecha registrada'}</dd>
              <dt>Entrega</dt><dd>{selectedOrder.delivery || 'Fecha por confirmar'}</dd>
              <dt>Estado</dt><dd>{orderStatuses[(Number(selectedOrder.status) || 1) - 1] || 'Confirmado'}</dd>
            </dl>
            <div className="admin-table-wrap">
              <table className="admin-products-table">
                <thead><tr><th>Producto</th><th>Cantidad</th><th>Precio unitario</th><th>Subtotal</th></tr></thead>
                <tbody>{(selectedOrder.items || []).map((item, index) => <tr key={`${item.id || item.nombre}-${index}`}><td>{item.nombre || item.name || 'Producto'}</td><td>{Number(item.qty) || 0}</td><td>{formatPrice(item.precio ?? item.price)}</td><td>{formatPrice((Number(item.precio ?? item.price) || 0) * (Number(item.qty) || 0))}</td></tr>)}</tbody>
                <tfoot><tr><th colSpan="3">Neto</th><td>{formatPrice(selectedOrder.subtotal)}</td></tr><tr><th colSpan="3">IVA (19 %)</th><td>{formatPrice(selectedOrder.iva ?? 0)}</td></tr><tr><th colSpan="3">Despacho</th><td>{formatPrice(selectedOrder.shipping)}</td></tr><tr><th colSpan="3">Total</th><td><strong>{formatPrice(selectedOrder.total)}</strong></td></tr></tfoot>
              </table>
            </div>
            <div className="form-actions mt-3"><button className="btn btn-primary" type="button" onClick={() => window.print()}>Imprimir boleta</button><button className="btn btn-secondary" type="button" onClick={() => setSelectedOrder(null)}>Cerrar</button></div>
          </div>
        </section>
      )}
    </div>
  )
}
