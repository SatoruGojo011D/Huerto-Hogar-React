import { useState } from 'react'
import { resolveProductImage } from '../js/products.js'
import { writeStorage } from '../js/storage.js'
import { getAdminProducts } from '../js/adminData.js'
import { formatPrice } from '../js/format.js'

export function AdminProductsPage() {
  const [items, setItems] = useState(getAdminProducts)
  function remove(id) {
    if (!window.confirm('¿Desactivar este producto del catálogo?')) return
    const next = items.map((product) => String(product.id) === String(id) ? { ...product, activo: false } : product)
    writeStorage('productos_huerto', next)
    setItems(next)
  }
  const visibleItems = items.filter((product) => product.activo !== false)
  return <section className="summary-box"><div className="products-toolbar"><div><h2 className="serif">Administración de productos</h2><p>Gestiona el catálogo e inventario de la tienda.</p></div><a href="/admin/productos/nuevo" className="btn btn-primary">＋ Agregar producto</a></div><div className="admin-table-wrap"><table className="admin-products-table"><thead><tr><th>Imagen</th><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>Acciones</th></tr></thead><tbody>{visibleItems.length ? visibleItems.map((product) => <tr key={product.id}><td><img className="product-thumb" src={resolveProductImage(product.imagen)} alt="" /></td><td className="product-name">{product.nombre}</td><td className="product-category">{product.categoria}</td><td className="product-price">{formatPrice(product.precio)}</td><td>{product.stock}</td><td><div className="product-actions"><a className="btn-action btn-edit" href={`/admin/productos/editar?id=${encodeURIComponent(product.id)}`} aria-label={`Editar ${product.nombre}`}>Editar</a><button className="btn-action btn-delete" type="button" onClick={() => remove(product.id)} aria-label={`Desactivar ${product.nombre}`}>×</button></div></td></tr>) : <tr><td colSpan="6" className="table-empty">No hay productos activos en el catálogo.</td></tr>}</tbody></table></div></section>
}
