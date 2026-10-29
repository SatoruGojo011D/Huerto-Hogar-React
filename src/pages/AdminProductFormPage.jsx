// Formulario compartido para crear (/admin/productos/nuevo) y editar (/admin/productos/editar) productos; la prop `edit` distingue ambos casos.
import { useState } from 'react'
import { resolveProductImage } from '../js/products.js'
import { writeStorage } from '../js/storage.js'
import { getAdminCategories, getAdminProducts, imageOptions } from '../js/adminData.js'

export function AdminProductFormPage({ edit = false }) {
  const id = new URLSearchParams(window.location.search).get('id')
  const products = getAdminProducts()
  const existing = edit ? products.find((product) => String(product.id) === id) : null
  const categories = getAdminCategories()
  const [message, setMessage] = useState(existing || !edit ? '' : 'No se encontró el producto.')
  const [image, setImage] = useState(existing?.imagen || imageOptions[0][0])
  if (edit && !existing) return <section className="card"><div className="card-body"><p role="alert">{message}</p><a className="btn btn-secondary" href="/admin/productos">Volver a productos</a></div></section>

  function submit(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const name = String(form.get('name')).trim()
    const category = String(form.get('category'))
    const price = Number(form.get('price'))
    const discountPercent = Number(form.get('discountPercent'))
    const stock = String(form.get('stock')).trim()
    if (!name || !Number.isFinite(price) || price <= 0 || !Number.isInteger(discountPercent) || discountPercent < 0 || discountPercent > 90 || !stock) {
      setMessage('Completa nombre, precio mayor a cero, stock y un descuento entre 0% y 90%.')
      return
    }
    const savedProducts = getAdminProducts()
    const payload = { id: existing?.id || `HH${Date.now()}`, nombre: name, categoria: category, precio: price, descuento: discountPercent, stock, imagen: image, activo: true }
    const next = edit ? savedProducts.map((product) => String(product.id) === id ? { ...product, ...payload } : product) : [...savedProducts, payload]
    writeStorage('productos_huerto', next)
    window.location.href = '/admin/productos'
  }

  function remove() {
    if (!window.confirm('¿Eliminar este producto?')) return
    writeStorage('productos_huerto', getAdminProducts().map((product) => String(product.id) === id ? { ...product, activo: false } : product))
    window.location.href = '/admin/productos'
  }


  return <section className="card"><div className="card-header"><h2>{edit ? 'Modificar detalles' : 'Detalles del producto'}</h2></div><div className="card-body"><form className="form" onSubmit={submit}><div className="form-group"><label htmlFor="product-name">Nombre del producto *</label><input id="product-name" name="name" defaultValue={existing?.nombre || ''} required /></div><div className="form-group"><label htmlFor="product-category">Categoría *</label><select id="product-category" name="category" defaultValue={existing?.categoria || categories[0]}>{categories.map((category) => <option key={category}>{category}</option>)}</select></div><div className="form-row"><div className="form-group"><label htmlFor="product-price">Precio normal (CLP) *</label><input id="product-price" name="price" type="number" min="1" defaultValue={existing?.precio || ''} required /></div><div className="form-group"><label htmlFor="product-discount">Descuento (%)</label><input id="product-discount" name="discountPercent" type="number" min="0" max="90" step="1" defaultValue={existing?.discountPercent || 0} /><span className="texto-ayuda">Usa 0 para no publicar una oferta; máximo 90%.</span></div><div className="form-group"><label htmlFor="product-stock">Stock disponible *</label><input id="product-stock" name="stock" type="number" min="0" step="1" defaultValue={existing?.stock || ''} placeholder="Ej: 25" required /></div></div><fieldset className="form-group image-picker-field"><legend>Imagen del producto</legend><div className="image-picker">{imageOptions.map(([path, label]) => <label className="image-option" key={path}><input type="radio" name="product-image" checked={image === path} onChange={() => setImage(path)} /><img src={resolveProductImage(path)} alt="" /><span>{label}</span></label>)}</div></fieldset><p className="form-message" aria-live="polite">{message}</p><div className="form-actions"><button className="btn btn-primary" type="submit">{edit ? 'Actualizar producto' : 'Guardar producto'}</button>{edit && <button className="btn btn-danger" type="button" onClick={remove}>Eliminar</button>}<a href="/admin/productos" className="btn btn-secondary">Cancelar</a></div></form></div></section>
}
