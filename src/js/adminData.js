import { readStorage } from './storage.js'

export const imageOptions = [
  ['img/manzanas-fuji.png', 'Manzanas'], ['img/naranjas.jpg', 'Naranjas'], ['img/platanos.jpg', 'Pl?tanos'],
  ['img/zanahorias.png', 'Zanahorias'], ['img/espinaca.png', 'Espinaca'], ['img/pimentones.jpg', 'Pimentones'],
  ['img/miel-organica.png', 'Miel'], ['img/quinoa.jpg', 'Quinua'], ['img/leche.jpg', 'Leche'],
]

export function getAdminProducts() {
  const products = readStorage('productos_huerto', [])
  return Array.isArray(products) ? products.filter((product) => product && typeof product === 'object') : []
}
