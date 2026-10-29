// Página /admin/productos-criticos: productos con stock crítico (10 unidades o menos).
import { getAdminProducts } from '../js/adminData.js'
import { formatPrice } from '../js/format.js'

const criticalStockLimit = 10

function readStock(stock) {
  const value = Number.parseFloat(String(stock))
  return Number.isFinite(value) ? value : null
}

export function AdminCriticalProductsPage() {
  const products = getAdminProducts()
    .filter((product) => product.activo !== false)
    .map((product) => ({ ...product, stockAmount: readStock(product.stock) }))
    .filter((product) => product.stockAmount !== null && product.stockAmount <= criticalStockLimit)
    .sort((first, second) => first.stockAmount - second.stockAmount)

  return (
    <section className="summary-box">
      <div className="products-toolbar"><div><h2 className="serif">Productos con stock crítico</h2><p>Se consideran críticos los productos con 10 o menos en el valor numérico del stock registrado.</p></div><span className="badge rounded-pill text-bg-warning">{products.length} críticos</span></div>
      <div className="admin-table-wrap"><table className="admin-products-table">
        <thead><tr><th>Producto</th><th>Categoría</th><th>Precio</th><th>Stock actual</th><th>Acciones</th></tr></thead>
        <tbody>{products.length ? products.map((product) => <tr key={product.id}><td className="product-name">{product.nombre}</td><td>{product.categoria}</td><td>{formatPrice(product.precio)}</td><td><strong className="critical-stock">{product.stock}</strong></td><td><a className="btn btn-secondary" href={`/admin/productos/editar?id=${encodeURIComponent(product.id)}`}>Actualizar stock</a></td></tr>) : <tr><td colSpan="5" className="table-empty">No hay productos con stock crítico registrado.</td></tr>}</tbody>
      </table></div>
    </section>
  )
}
