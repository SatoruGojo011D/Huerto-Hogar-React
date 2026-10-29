// Catálogo base de productos y manejo de imágenes (resolveProductImage) y descuentos (normalizeDiscount, getDiscountedPrice).
import applesImage from '../img/manzanas-fuji.png'
import orangesImage from '../img/naranjas.jpg'
import bananasImage from '../img/platanos.jpg'
import carrotsImage from '../img/zanahorias.png'
import spinachImage from '../img/espinaca.png'
import peppersImage from '../img/pimentones.jpg'
import honeyImage from '../img/miel-organica.png'
import quinoaImage from '../img/quinoa.jpg'
import milkImage from '../img/leche.jpg'

export const products = [
  {
    id: 'FR001', name: 'Manzanas Fuji', category: 'frutas', categoryLabel: 'Frutas Frescas',
    price: 1200, discountPercent: 10, unit: 'kg', stock: 32, origin: 'Valle del Maule', imagePath: 'img/manzanas-fuji.png', image: applesImage,
    description: 'Manzanas crocantes y jugosas, recién cosechadas. Ideales para colaciones sanas.',
    practices: 'Cultivo local con manejo responsable del suelo y cosecha de temporada.',
    impact: 'Huella de carbono baja gracias a su producción y distribución local.',
  },
  {
    id: 'FR002', name: 'Naranjas Valencia', category: 'frutas', categoryLabel: 'Frutas Frescas',
    price: 1000, unit: 'kg', stock: 26, origin: 'Valle de Azapa', imagePath: 'img/naranjas.jpg', image: orangesImage,
    description: 'Naranjas dulces con alto contenido de jugo y vitamina C natural.',
    practices: 'Producción de temporada con selección manual de cada fruto.',
    impact: 'Producto de temporada que reduce el uso de almacenamiento prolongado.',
  },
  {
    id: 'FR003', name: 'Plátanos Cavendish', category: 'frutas', categoryLabel: 'Frutas Frescas',
    price: 800, discountPercent: 15, unit: 'kg', stock: 40, origin: 'Importación Directa', imagePath: 'img/platanos.jpg', image: bananasImage,
    description: 'Plátanos de textura suave y maduración perfecta para batidos y repostería.',
    practices: 'Seleccionados por madurez para evitar desperdicios en el hogar.',
    impact: 'Distribución planificada para conservar la frescura y reducir mermas.',
  },
  {
    id: 'VR001', name: 'Zanahorias Orgánicas', category: 'verduras', categoryLabel: 'Verduras Orgánicas',
    price: 900, discountPercent: 10, unit: 'kg', stock: 20, origin: "Región de O'Higgins", imagePath: 'img/zanahorias.png', image: carrotsImage,
    description: 'Cultivadas sin pesticidas en suelos ricos en nutrientes. Sabor intenso y textura firme.',
    practices: 'Manejo orgánico y cuidado del suelo durante todo el cultivo.',
    impact: 'Cultivo cercano que favorece recorridos de entrega más cortos.',
  },
  {
    id: 'VR002', name: 'Espinacas Frescas', category: 'verduras', categoryLabel: 'Verduras Orgánicas',
    price: 700, discountPercent: 10, unit: 'bolsa 500 g', stock: 15, origin: 'Melipilla', imagePath: 'img/espinaca.png', image: spinachImage,
    description: 'Hojas verdes lavadas, listas para ensaladas o salteados llenos de hierro.',
    practices: 'Cosecha cuidadosa y empaque práctico para conservar sus hojas.',
    impact: 'Se entrega fresca para reducir el desperdicio por pérdida de calidad.',
  },
  {
    id: 'VR003', name: 'Pimientos Tricolores', category: 'verduras', categoryLabel: 'Verduras Orgánicas',
    price: 1500, unit: 'kg', stock: 28, origin: 'Limache', imagePath: 'img/pimentones.jpg', image: peppersImage,
    description: 'Surtido de pimientos rojo, verde y amarillo de cultivo bajo invernadero.',
    practices: 'Cultivo protegido con uso eficiente del agua y cosecha manual.',
    impact: 'Producción local que disminuye la distancia entre huerto y hogar.',
  },
  {
    id: 'PO001', name: 'Miel Orgánica', category: 'organicos', categoryLabel: 'Productos Orgánicos',
    price: 5000, unit: 'frasco 500 g', stock: 12, origin: 'Apicultores locales', imagePath: 'img/miel-organica.png', image: honeyImage,
    description: 'Miel multifloral 100% pura y no procesada de apicultores locales.',
    practices: 'Apicultura responsable que protege las colmenas y la biodiversidad.',
    impact: 'Apoya la polinización y el trabajo de productores de la zona.',
  },
  {
    id: 'PO003', name: 'Quinua Orgánica', category: 'organicos', categoryLabel: 'Productos Orgánicos',
    price: 3200, unit: 'kg', stock: 18, origin: 'Altiplano Chileno', imagePath: 'img/quinoa.jpg', image: quinoaImage,
    description: 'Superalimento andino rico en proteínas, fibra y libre de gluten.',
    practices: 'Cultivo tradicional con selección y limpieza cuidadosa del grano.',
    impact: 'Producto seco de larga duración que ayuda a evitar desperdicios.',
  },
  {
    id: 'PL001', name: 'Leche Entera', category: 'lacteos', categoryLabel: 'Productos Lácteos',
    price: 1800, unit: 'botella 1 L', stock: 22, origin: 'Granjas de Osorno', imagePath: 'img/leche.jpg', image: milkImage,
    description: 'Leche de libre pastoreo, pasteurizada y fresca del día.',
    practices: 'Producida por granjas familiares con cuidado del ganado y envases retornables.',
    impact: 'Envase retornable y abastecimiento directo desde granjas locales.',
  },
]

const imagePaths = {
  'manzanas-fuji.png': applesImage,
  'naranjas.jpg': orangesImage,
  'platanos.jpg': bananasImage,
  'zanahorias.png': carrotsImage,
  'espinaca.png': spinachImage,
  'pimentones.jpg': peppersImage,
  'miel-organica.png': honeyImage,
  'quinoa.jpg': quinoaImage,
  'leche.jpg': milkImage,
}

export function resolveProductImage(path) {
  if (!path) return applesImage
  const filename = String(path).split(/[\\/]/).pop()
  return imagePaths[filename] || path
}

export function normalizeDiscount(value) {
  const discount = Number(value)
  return Number.isFinite(discount) ? Math.min(90, Math.max(0, Math.floor(discount))) : 0
}

export function getDiscountedPrice(price, discountPercent) {
  return Math.round(price * (100 - normalizeDiscount(discountPercent)) / 100)
}