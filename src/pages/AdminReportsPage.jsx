// Página /admin/reportes: ventas, órdenes por estado y productos más vendidos, calculados con los pedidos guardados.
import { getOrders } from '../js/storage.js'
import { formatPrice } from '../js/format.js'

export function AdminReportsPage() {
  const orders = getOrders()
  const sales = orders.reduce((sum, order) => sum + (Number(order.total) || 0), 0)
  const average = orders.length ? sales / orders.length : 0
  const statusCounts = orders.reduce((counts, order) => {
    const status = ['Confirmado', 'En preparación', 'En camino', 'Entregado'][(Number(order.status) || 1) - 1] || 'Confirmado'
    counts[status] = (counts[status] || 0) + 1
    return counts
  }, {})
  const productTotals = new Map()
  orders.forEach((order) => (order.items || []).forEach((item) => {
    const name = item.nombre || item.name || 'Producto'
    const current = productTotals.get(name) || { quantity: 0, total: 0 }
    const quantity = Number(item.qty) || 0
    current.quantity += quantity
    current.total += (Number(item.precio ?? item.price) || 0) * quantity
    productTotals.set(name, current)
  }))
  const bestSellers = [...productTotals.entries()].sort((a, b) => b[1].quantity - a[1].quantity)

  return (
    <div className="admin-page-stack">
      <div className="stats-grid">
        {[['Ventas totales', formatPrice(sales)], ['Órdenes', orders.length], ['Ticket promedio', formatPrice(average)], ['Productos vendidos', [...productTotals.values()].reduce((sum, item) => sum + item.quantity, 0)]].map(([label, value]) => <article className="stat-card" key={label}><h3>{label}</h3><p>{value}</p></article>)}
      </div>
      <section className="summary-box"><div className="products-toolbar"><div><h2 className="serif">Reportes de ventas</h2><p>Resumen calculado a partir de las órdenes guardadas.</p></div></div>
        <h3 className="serif">Órdenes por estado</h3>
        {Object.keys(statusCounts).length ? <ul className="report-status-list">{Object.entries(statusCounts).map(([status, count]) => <li key={status}><span>{status}</span><strong>{count}</strong></li>)}</ul> : <p className="table-empty">Aún no hay órdenes para reportar.</p>}
        <h3 className="serif mt-4">Productos más vendidos</h3>
        <div className="admin-table-wrap"><table className="admin-products-table"><thead><tr><th>Producto</th><th>Unidades</th><th>Ventas</th></tr></thead><tbody>{bestSellers.length ? bestSellers.map(([name, totals]) => <tr key={name}><td className="product-name">{name}</td><td>{totals.quantity}</td><td>{formatPrice(totals.total)}</td></tr>) : <tr><td colSpan="3" className="table-empty">Aún no hay productos vendidos.</td></tr>}</tbody></table></div>
      </section>
    </div>
  )
}
