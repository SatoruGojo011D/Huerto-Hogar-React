import { memo } from 'react'
import { formatPrice } from '../js/format.js'
import useTransientFeedback from '../hooks/useTransientFeedback.js'

function TarjetaProducto({ product, featured = false, onAdd }) {
  const { isActive: added, trigger } = useTransientFeedback()
  const cardClass = featured ? 'feature-card' : 'cart-card producto-card'
  const price = product.discountedPrice ?? product.price

  function addToCart() {
    onAdd(product)
    trigger()
  }

  return (
    <article className={cardClass}>
      <a className={featured ? undefined : 'img-container'} href={`/producto?id=${encodeURIComponent(product.id)}`} aria-label={`Ver detalles de ${product.name}`}>
        <img className={`product-image product-image-${String(product.id).toLowerCase()}`} src={product.image} alt={product.name} />
        {product.discountPercent > 0 && <span className="product-discount-badge">-{product.discountPercent}%</span>}
        {!featured && <span className="overlay-detalles"><span className="btn-overlay">Ver detalles</span></span>}
      </a>
      <div className={featured ? 'feature-card__body' : 'product-card__body'}>
        <h3 className="serif">{product.name}</h3>
        <p className="unit-price">
          {product.discountPercent > 0 && <del>{formatPrice(product.price)} </del>}
          <strong className={product.discountPercent > 0 ? 'discounted-price' : undefined}>{formatPrice(price)}</strong> / {product.unit}
        </p>
        {!featured && <p className="stock-info">Stock: {product.stock} · {product.origin}</p>}
        <button className={`btn-checkout${featured ? ' feature-btn' : ' btn-agregar'}`} type="button" onClick={addToCart}>
          {added ? '✓ Añadido' : featured ? 'Añadir al Carrito' : 'Añadir'}
        </button>
      </div>
    </article>
  )
}

export default memo(TarjetaProducto)