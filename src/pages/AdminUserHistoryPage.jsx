// Página /admin/usuarios/historial: compras asociadas a un usuario.
import { getOrders, getUsers } from '../js/storage.js'
import { formatPrice } from '../js/format.js'

export function AdminUserHistoryPage() {
  const id = new URLSearchParams(window.location.search).get('id')
  const user = getUsers().find((entry) => String(entry.id) === id)
  if (!user) return <section className="card"><div className="card-body"><p role="alert">No se encontró el usuario solicitado.</p><a className="btn btn-secondary" href="/admin/usuarios">Volver a usuarios</a></div></section>

  const orders = getOrders().filter((order) => (
    (order.userId != null && String(order.userId) === String(user.id))
    || (order.customerEmail && order.customerEmail.toLowerCase() === user.correo.toLowerCase())
  ))
  return (
    <div className="admin-page-stack">
      <section className="summary-box">
        <div className="products-toolbar"><div><h2 className="serif">{user.nombre}</h2><p>{user.correo} · {user.rol}</p></div><div className="form-actions"><a className="btn btn-primary" href={`/admin/usuarios/editar?id=${encodeURIComponent(user.id)}`}>Editar usuario</a><a className="btn btn-secondary" href="/admin/usuarios">Volver a usuarios</a></div></div>
        <h3 className="serif">Historial de compras</h3>
        <div className="admin-table-wrap"><table className="admin-products-table">
          <thead><tr><th>Pedido</th><th>Fecha</th><th>Productos</th><th>Total</th><th>Estado</th></tr></thead>
          <tbody>{orders.length ? orders.map((order, index) => <tr key={order.code || index}><td className="product-name">{order.code || 'Sin código'}</td><td>{order.createdAt ? new Date(order.createdAt).toLocaleDateString('es-CL') : 'Sin fecha'}</td><td>{(order.items || []).map((item) => `${item.nombre || item.name} × ${Number(item.qty) || 0}`).join(', ') || 'Sin detalle'}</td><td>{formatPrice(order.total)}</td><td>{['', 'Confirmado', 'En preparación', 'En camino', 'Entregado'][Number(order.status)] || 'Confirmado'}</td></tr>) : <tr><td colSpan="5" className="table-empty">Este usuario todavía no tiene compras asociadas. Los pedidos antiguos sin datos de cliente no se pueden atribuir automáticamente.</td></tr>}</tbody>
        </table></div>
      </section>
    </div>
  )
}
