import { useState } from 'react'
import { addCartItem, formatPrice } from '../lib/storage.js'

export default function ProductCard({ product, featured = false }) {
  const [added, setAdded] = useState(false)
  const cardClass = featured ? 'feature-card' : 'cart-card producto-card'

  function addToCart() {
    addCartItem(product)
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1000)
  }

  return (
    <article className={cardClass}>
      <a className={featured ? undefined : 'img-container'} href={`/producto?id=${encodeURIComponent(product.id)}`} aria-label={`Ver detalles de ${product.name}`}>
        <img src={product.image} alt={product.name} />
        {!featured && <span className="overlay-detalles"><span className="btn-overlay">Ver detalles</span></span>}
      </a>
      <div className={featured ? 'feature-card__body' : 'product-card__body'}>
        <h3 className="serif">{product.name}</h3>
        <p className="unit-price">{formatPrice(product.price)} / {product.unit}</p>
        {!featured && <p className="stock-info">Stock: {product.stock} · {product.origin}</p>}
        <button className={`btn-checkout${featured ? ' feature-btn' : ' btn-agregar'}`} type="button" onClick={addToCart}>
          {added ? '✓ Añadido' : featured ? 'Añadir al Carrito' : 'Añadir'}
        </button>
      </div>
    </article>
  )
}