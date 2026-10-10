import { products, resolveProductImage } from './products.js'

export function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key)
    return value === null ? fallback : JSON.parse(value)
  } catch {
    return fallback
  }
}

export function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function ensureSeedUsers() {
  const users = getUsers()
  const admin = users.find((user) => user.correo?.toLowerCase() === 'admin@gmail.com')
  if (!admin) {
    users.unshift({ id: Date.now(), nombre: 'Administrador Jefe', correo: 'admin@gmail.com', contrasena: 'Admin123!', telefono: '987654321', direccion: 'Sede Central', rol: 'admin' })
  }
  if (!users.some((user) => user.correo?.toLowerCase() === 'cliente@hotmail.com')) {
    users.push({ id: Date.now() + 1, nombre: 'Juan Pérez', correo: 'cliente@hotmail.com', contrasena: 'Cliente123!', telefono: '912345678', direccion: 'Av. Las Flores 123', rol: 'cliente' })
  }
  writeStorage('usuarios_huerto', users)
  return users
}

export function getUsers() {
  const users = readStorage('usuarios_huerto', [])
  return Array.isArray(users) ? users.filter((user) => user && typeof user === 'object' && typeof user.correo === 'string') : []
}

export function getOrders() {
  const orders = readStorage('hh_pedidos', [])
  return Array.isArray(orders) ? orders.filter((order) => order && typeof order === 'object') : []
}

export function getSession() {
  return readStorage('sesion_activa', null)
}

export function setSession(user) {
  writeStorage('sesion_activa', user)
  window.dispatchEvent(new Event('hh:session-change'))
}

export function getCart() {
  const cart = readStorage('hh_carrito', [])
  if (!Array.isArray(cart)) return []
  return cart.filter((item) => item && typeof item === 'object' && item.id != null).map((item) => {
    const price = Number(item.precio)
    const quantity = Number(item.qty)
    return {
      ...item,
      precio: Number.isFinite(price) && price >= 0 ? price : 0,
      qty: Number.isFinite(quantity) && quantity > 0 ? Math.floor(quantity) : 1,
    }
  })
}

export function saveCart(cart) {
  const total = cart.reduce((sum, item) => sum + (Number(item.qty) || 0), 0)
  writeStorage('hh_carrito', cart)
  localStorage.setItem('hh_carrito_cantidad', String(total))
  window.dispatchEvent(new Event('hh:cart-change'))
  return total
}

export function addCartItem(product, quantity = 1) {
  const cart = getCart()
  const id = String(product.id)
  const amount = Math.max(1, Math.floor(Number(quantity) || 1))
  const item = cart.find((entry) => String(entry.id) === id)
  if (item) {
    item.qty = (Number(item.qty) || 0) + amount
  } else {
    cart.push({
      id,
      nombre: product.nombre || product.name,
      precio: Number(product.precio ?? product.price) || 0,
      imagen: product.imagen || product.imagePath || 'img/manzanas-fuji.png',
      qty: amount,
    })
  }
  return saveCart(cart)
}

export function getCatalogProducts() {
  const storedProducts = readStorage('productos_huerto', [])
  const custom = Array.isArray(storedProducts) ? storedProducts.filter((product) => product && typeof product === 'object' && product.id != null && String(product.nombre || '').trim()) : []
  const additions = custom.map((product) => ({
    id: String(product.id),
    name: product.nombre,
    category: normalizeCategory(product.categoria),
    categoryLabel: product.categoria || 'Otros',
    price: Number(product.precio) || 0,
    unit: 'unidad',
    stock: String(product.stock || 'Sin stock informado'),
    origin: 'HuertoHogar',
    imagePath: product.imagen,
    image: resolveProductImage(product.imagen),
    description: `${product.nombre} disponible en HuertoHogar.`,
    practices: 'Producto incorporado por nuestro equipo.',
    impact: 'Consulta su origen y disponibilidad con nuestro equipo.',
  }))
  return [...products, ...additions]
}

function normalizeCategory(value) {
  const category = String(value || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  if (category.includes('frut')) return 'frutas'
  if (category.includes('verd')) return 'verduras'
  if (category.includes('organ')) return 'organicos'
  if (category.includes('lact')) return 'lacteos'
  return category.split(/\s+/)[0] || 'otros'
}

export function getItemCount() {
  return getCart().reduce((sum, item) => {
    const quantity = Number(item.qty)
    return sum + (Number.isFinite(quantity) ? Math.max(0, quantity) : 0)
  }, 0)
}