// Página /admin: resumen con las cifras principales del panel y la actividad reciente.
import { getOrders, getUsers } from '../js/storage.js'
import { getAdminProducts } from '../js/adminData.js'
import { formatPrice } from '../js/format.js'

export function AdminDashboardPage() {
  const users = getUsers()
  const products = getAdminProducts()
  const orders = getOrders()
  const sales = orders.reduce((sum, order) => sum + (Number(order.total) || 0), 0)
  const stats = [
    ['Ventas registradas', formatPrice(sales)],
    ['Productos administrados', products.length],
    ['Usuarios registrados', users.length],
    ['Pedidos registrados', orders.length],
  ]
  return <div className="admin-dashboard"><div className="stats-grid">{stats.map(([label, value]) => <article className="stat-card" key={label}><h3>{label}</h3><p>{value}</p></article>)}</div><section className="card"><div className="card-header"><h2>Actividad reciente</h2></div><div className="card-body"><div className="admin-table-wrap"><table className="admin-products-table"><thead><tr><th>Pedido</th><th>Entrega</th><th>Estado</th><th>Total</th></tr></thead><tbody>{orders.length ? orders.slice(0, 8).map((order) => <tr key={order.code}><td>{order.code}</td><td>{order.delivery}</td><td>{['', 'Confirmado', 'En preparación', 'En camino', 'Entregado'][order.status] || 'Confirmado'}</td><td>{formatPrice(order.total)}</td></tr>) : <tr><td colSpan="4">Aún no hay pedidos registrados.</td></tr>}</tbody></table></div></div></section></div>
}
