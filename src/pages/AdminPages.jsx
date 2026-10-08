import { useState } from 'react'
import { resolveProductImage } from '../data/products.js'
import { formatPrice, getOrders, getSession, getUsers, readStorage, writeStorage } from '../lib/storage.js'
import StatusMessage from '../components/StatusMessage.jsx'

const imageOptions = [
  ['img/manzanas-fuji.png', 'Manzanas'], ['img/naranjas.jpg', 'Naranjas'], ['img/platanos.jpg', 'Plátanos'],
  ['img/zanahorias.png', 'Zanahorias'], ['img/espinaca.png', 'Espinaca'], ['img/pimentones.jpg', 'Pimentones'],
  ['img/miel-organica.png', 'Miel'], ['img/quinoa.jpg', 'Quinua'], ['img/leche.jpg', 'Leche'],
]

function userRows() {
  return getUsers()
}

function productRows() {
  const products = readStorage('productos_huerto', [])
  return Array.isArray(products) ? products.filter((product) => product && typeof product === 'object') : []
}

export function AdminDashboardPage() {
  const users = userRows()
  const products = productRows()
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

export function AdminProductsPage() {
  const [items, setItems] = useState(productRows)
  function remove(id) {
    if (!window.confirm('¿Eliminar este producto del catálogo?')) return
    const next = items.filter((product) => String(product.id) !== String(id))
    writeStorage('productos_huerto', next)
    setItems(next)
  }
  return <section className="summary-box"><div className="products-toolbar"><div><h2 className="serif">Administración de productos</h2><p>Gestiona el catálogo e inventario de la tienda.</p></div><a href="/admin/productos/nuevo" className="btn btn-primary">＋ Agregar producto</a></div><div className="admin-table-wrap"><table className="admin-products-table"><thead><tr><th>Imagen</th><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>Acciones</th></tr></thead><tbody>{items.length ? items.map((product) => <tr key={product.id}><td><img className="product-thumb" src={resolveProductImage(product.imagen)} alt="" /></td><td className="product-name">{product.nombre}</td><td className="product-category">{product.categoria}</td><td className="product-price">{formatPrice(product.precio)}</td><td>{product.stock}</td><td><div className="product-actions"><a className="btn-action btn-edit" href={`/admin/productos/editar?id=${encodeURIComponent(product.id)}`} aria-label={`Editar ${product.nombre}`}>Editar</a><button className="btn-action btn-delete" type="button" onClick={() => remove(product.id)} aria-label={`Eliminar ${product.nombre}`}>×</button></div></td></tr>) : <tr><td colSpan="6" className="table-empty">No hay productos personalizados todavía. Los nueve productos base del catálogo están disponibles para venta.</td></tr>}</tbody></table></div></section>
}

export function AdminProductFormPage({ edit = false }) {
  const id = new URLSearchParams(window.location.search).get('id')
  const products = productRows()
  const existing = edit ? products.find((product) => String(product.id) === id) : null
  const [message, setMessage] = useState(existing || !edit ? '' : 'No se encontró el producto.')
  const [image, setImage] = useState(existing?.imagen || imageOptions[0][0])
  if (edit && !existing) return <section className="card"><div className="card-body"><p role="alert">{message}</p><a className="btn btn-secondary" href="/admin/productos">Volver a productos</a></div></section>

  function submit(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const name = String(form.get('name')).trim()
    const category = String(form.get('category'))
    const price = Number(form.get('price'))
    const stock = String(form.get('stock')).trim()
    if (!name || !Number.isFinite(price) || price <= 0 || !stock) {
      setMessage('Completa nombre, precio mayor a cero y stock.')
      return
    }
    const savedProducts = productRows()
    const payload = { id: existing?.id || `HH${Date.now()}`, nombre: name, categoria: category, precio: price, stock, imagen: image }
    const next = edit ? savedProducts.map((product) => String(product.id) === id ? { ...product, ...payload } : product) : [...savedProducts, payload]
    writeStorage('productos_huerto', next)
    window.location.href = '/admin/productos'
  }

  function remove() {
    if (!window.confirm('¿Eliminar este producto?')) return
    writeStorage('productos_huerto', productRows().filter((product) => String(product.id) !== id))
    window.location.href = '/admin/productos'
  }

  return <section className="card"><div className="card-header"><h2>{edit ? 'Modificar detalles' : 'Detalles del producto'}</h2></div><div className="card-body"><form className="form" onSubmit={submit}><div className="form-group"><label htmlFor="product-name">Nombre del producto *</label><input id="product-name" name="name" defaultValue={existing?.nombre || ''} required /></div><div className="form-group"><label htmlFor="product-category">Categoría *</label><select id="product-category" name="category" defaultValue={existing?.categoria || 'Verduras'}><option>Verduras</option><option>Frutas</option><option>Productos Orgánicos</option><option>Productos Lácteos</option><option>Herramientas</option><option>Semillas</option></select></div><div className="form-row"><div className="form-group"><label htmlFor="product-price">Precio (CLP) *</label><input id="product-price" name="price" type="number" min="1" defaultValue={existing?.precio || ''} required /></div><div className="form-group"><label htmlFor="product-stock">Stock disponible *</label><input id="product-stock" name="stock" defaultValue={existing?.stock || ''} placeholder="Ej: 25 kg o 50 unidades" required /></div></div><fieldset className="form-group image-picker-field"><legend>Imagen del producto</legend><div className="image-picker">{imageOptions.map(([path, label]) => <label className="image-option" key={path}><input type="radio" name="product-image" checked={image === path} onChange={() => setImage(path)} /><img src={resolveProductImage(path)} alt="" /><span>{label}</span></label>)}</div></fieldset><p className="form-message" aria-live="polite">{message}</p><div className="form-actions"><button className="btn btn-primary" type="submit">{edit ? 'Actualizar producto' : 'Guardar producto'}</button>{edit && <button className="btn btn-danger" type="button" onClick={remove}>Eliminar</button>}<a href="/admin/productos" className="btn btn-secondary">Cancelar</a></div></form></div></section>
}

export function AdminUsersPage() {
  const [users, setUsers] = useState(userRows)
  const [message, setMessage] = useState('')
  const session = getSession()

  function remove(id) {
    if (String(session?.id) === String(id)) {
      setMessage('No puedes eliminar la cuenta de administrador que está activa.')
      return
    }
    if (!window.confirm('¿Eliminar esta cuenta de usuario?')) return
    const next = users.filter((user) => String(user.id) !== String(id))
    writeStorage('usuarios_huerto', next)
    setUsers(next)
  }
  return <section className="summary-box"><div className="products-toolbar"><div><h2 className="serif">Administración de usuarios</h2><p>Gestiona las cuentas registradas en la plataforma.</p></div><a href="/admin/usuarios/nuevo" className="btn btn-primary">＋ Crear usuario</a></div><StatusMessage>{message}</StatusMessage><div className="admin-table-wrap"><table className="admin-products-table"><thead><tr><th>ID</th><th>Nombre</th><th>Correo</th><th>Rol</th><th>Acciones</th></tr></thead><tbody>{users.map((user) => { const isCurrentUser = String(session?.id) === String(user.id); return <tr key={user.id}><td>{user.id}</td><td className="product-name">{user.nombre}</td><td>{user.correo}</td><td><span className="user-role">{user.rol}</span></td><td><div className="product-actions"><a className="btn-action btn-edit" href={`/admin/usuarios/editar?id=${encodeURIComponent(user.id)}`} aria-label={`Editar ${user.nombre}`}>Editar</a><button className="btn-action btn-delete" type="button" onClick={() => remove(user.id)} aria-label={`Eliminar ${user.nombre}`} disabled={isCurrentUser} title={isCurrentUser ? 'No puedes eliminar la sesión activa' : 'Eliminar usuario'}>×</button></div></td></tr> })}</tbody></table></div></section>
}

export function AdminUserFormPage({ edit = false }) {
  const id = new URLSearchParams(window.location.search).get('id')
  const users = userRows()
  const existing = edit ? users.find((user) => String(user.id) === id) : null
  const session = getSession()
  const isEditingSelf = edit && String(session?.id) === id
  const [message, setMessage] = useState(existing || !edit ? '' : 'No se encontró el usuario.')
  if (edit && !existing) return <section className="card"><div className="card-body"><p role="alert">{message}</p><a className="btn btn-secondary" href="/admin/usuarios">Volver a usuarios</a></div></section>

  function submit(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const name = String(form.get('name')).trim()
    const email = String(form.get('email')).trim().toLowerCase()
    const password = String(form.get('password'))
    const phone = String(form.get('phone')).trim()
    const address = String(form.get('address')).trim()
    const role = String(form.get('role') || existing?.rol || 'cliente')
    const currentUsers = userRows()
    if (!name || !/^[^\s@]+@(gmail|hotmail)\.[a-z]{2,}$/i.test(email)) {
      setMessage('Ingresa nombre y correo @gmail.com o @hotmail.com válidos.')
      return
    }
    if (currentUsers.some((user) => String(user.id) !== id && user.correo.toLowerCase() === email)) {
      setMessage('Ese correo ya está registrado.')
      return
    }
    if ((!edit || password) && password.length < 8) {
      setMessage('La contraseña debe tener al menos 8 caracteres.')
      return
    }
    if (isEditingSelf && role !== session.rol) {
      setMessage('No puedes cambiar tu propio rol mientras esta sesión está activa.')
      return
    }
    const record = { id: existing?.id || currentUsers.reduce((max, user) => Math.max(max, Number(user.id) || 0), 0) + 1, nombre: name, correo: email, contrasena: password || existing?.contrasena || '', telefono: phone, direccion: address, rol: role }
    const next = edit ? currentUsers.map((user) => String(user.id) === id ? record : user) : [...currentUsers, record]
    writeStorage('usuarios_huerto', next)
    window.location.href = '/admin/usuarios'
  }

  function remove() {
    if (isEditingSelf) {
      setMessage('No puedes eliminar la cuenta de administrador que está activa.')
      return
    }
    if (!window.confirm('¿Eliminar este usuario?')) return
    writeStorage('usuarios_huerto', userRows().filter((user) => String(user.id) !== id))
    window.location.href = '/admin/usuarios'
  }

  return <section className="summary-box user-form-box"><h2 className="serif">{edit ? 'Editar usuario' : 'Registrar usuario'}</h2><p className="cart-subtitle">{edit ? 'Modifica los permisos o datos de la cuenta.' : 'Crea un nuevo perfil para la plataforma.'}</p><form className="form" onSubmit={submit}><div className="form-group"><label htmlFor="user-name">Nombre completo</label><input id="user-name" name="name" defaultValue={existing?.nombre || ''} required /></div><div className="form-group"><label htmlFor="user-email">Correo electrónico</label><input id="user-email" name="email" type="email" defaultValue={existing?.correo || ''} required /></div><div className="form-group"><label htmlFor="user-password">{edit ? 'Nueva contraseña (opcional)' : 'Contraseña'}</label><input id="user-password" name="password" type="password" required={!edit} /></div><div className="form-group"><label htmlFor="user-phone">Teléfono</label><input id="user-phone" name="phone" type="tel" defaultValue={existing?.telefono || ''} /></div><div className="form-group"><label htmlFor="user-address">Dirección</label><input id="user-address" name="address" defaultValue={existing?.direccion || ''} /></div><div className="form-group"><label htmlFor="user-role">Rol</label><select id="user-role" name="role" defaultValue={existing?.rol || 'cliente'} disabled={isEditingSelf}><option value="cliente">Cliente</option><option value="admin">Administrador</option></select></div><StatusMessage>{message}</StatusMessage><div className="form-actions"><button className="btn btn-primary" type="submit">{edit ? 'Actualizar datos' : 'Guardar usuario'}</button>{edit && <button className="btn btn-danger" type="button" onClick={remove} disabled={isEditingSelf}>Eliminar usuario</button>}<a className="btn btn-secondary" href="/admin/usuarios">Cancelar</a></div></form></section>
}