export const PIXEL = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='

// Producto de ejemplo con descuento; cada prueba parte de una copia nueva.
export function buildProduct(overrides = {}) {
  return {
    id: 'VR001',
    name: 'Zanahorias Orgánicas',
    image: PIXEL,
    price: 1000,
    discountedPrice: 900,
    discountPercent: 10,
    unit: 'kg',
    stock: '10',
    origin: "Región de O'Higgins",
    ...overrides,
  }
}
