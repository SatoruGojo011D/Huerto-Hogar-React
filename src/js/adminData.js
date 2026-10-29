// Datos del panel de administración: lista de productos administrables (catálogo base más cambios guardados), categorías, imágenes disponibles y descuento de stock.
import { normalizeDiscount, products } from './products.js'
import { formatStock } from './format.js'
import { readStorage, writeStorage } from './storage.js'

export const imageOptions = [
  ['img/manzanas-fuji.png', 'Manzanas'], ['img/naranjas.jpg', 'Naranjas'], ['img/platanos.jpg', 'Pl?tanos'],
  ['img/zanahorias.png', 'Zanahorias'], ['img/espinaca.png', 'Espinaca'], ['img/pimentones.jpg', 'Pimentones'],
  ['img/miel-organica.png', 'Miel'], ['img/quinoa.jpg', 'Quinua'], ['img/leche.jpg', 'Leche'],
]

export function getAdminProducts() {
  const saved = readStorage('productos_huerto', [])
  const records = Array.isArray(saved)
    ? saved.filter((product) => product && typeof product === 'object' && product.id != null)
    : []
  const savedById = new Map(records.map((product) => [String(product.id), product]))
  const baseIds = new Set(products.map((product) => String(product.id)))
  const baseProducts = products.map((product) => {
    const override = savedById.get(String(product.id)) || {}
    return {
      ...override,
      id: String(product.id),
      nombre: override.nombre || product.name,
      categoria: override.categoria || product.categoryLabel,
      precio: Number(override.precio ?? product.price) || 0,
      stock: formatStock(override.stock ?? product.stock),
      imagen: override.imagen || product.imagePath,
      discountPercent: normalizeDiscount(override.descuento ?? override.discountPercent ?? product.discountPercent),
      activo: override.activo !== false,
    }
  })
  const customProducts = records
    .filter((product) => !baseIds.has(String(product.id)) && String(product.nombre || '').trim())
    .map((product) => ({
      ...product,
      discountPercent: normalizeDiscount(product.descuento ?? product.discountPercent),
      activo: product.activo !== false,
    }))
  return [...baseProducts, ...customProducts]
}

// Descuenta del stock las unidades vendidas; así los productos que quedan con poco stock aparecen como críticos.
export function discountStock(items) {
  const sold = new Map()
  for (const item of items || []) sold.set(String(item.id), (sold.get(String(item.id)) || 0) + (Number(item.qty) || 0))
  const saved = readStorage('productos_huerto', [])
  const records = Array.isArray(saved) ? saved.filter((product) => product && typeof product === 'object' && product.id != null) : []
  const updated = getAdminProducts().filter((product) => sold.has(product.id)).map((product) => {
    const current = Number.parseFloat(product.stock)
    return Number.isFinite(current) ? { ...product, stock: Math.max(0, current - sold.get(product.id)) } : product
  })
  const updatedIds = new Set(updated.map((product) => product.id))
  writeStorage('productos_huerto', [...records.filter((product) => !updatedIds.has(String(product.id))), ...updated])
}

export function getAdminCategories() {
  const saved = readStorage('categorias_huerto', [])
  const categories = Array.isArray(saved) ? saved.filter((category) => typeof category === 'string') : []
  const productCategories = getAdminProducts().filter((product) => product.activo !== false).map((product) => product.categoria)
  return [...new Set([...categories, ...productCategories]
    .map((category) => String(category || '').trim())
    .filter(Boolean))]
}
