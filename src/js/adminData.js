import { normalizeDiscount, products } from './products.js'
import { readStorage } from './storage.js'

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
      stock: String(override.stock ?? product.stock),
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

export function getAdminCategories() {
  const saved = readStorage('categorias_huerto', [])
  const categories = Array.isArray(saved) ? saved.filter((category) => typeof category === 'string') : []
  const productCategories = getAdminProducts().filter((product) => product.activo !== false).map((product) => product.categoria)
  return [...new Set([...categories, ...productCategories]
    .map((category) => String(category || '').trim())
    .filter(Boolean))]
}
