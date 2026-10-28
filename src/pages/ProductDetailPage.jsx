import { useState } from 'react'
import { products } from '../js/products.js'
import { addCartItem, getCatalogProducts, getSession, readStorage, writeStorage } from '../js/storage.js'
import { formatPrice } from '../js/format.js'
import ControlCantidad from '../components/ControlCantidad.jsx'
import useTransientFeedback from '../hooks/useTransientFeedback.js'

export function ProductDetailPage() {
  const id = new URLSearchParams(window.location.search).get('id')
  const product = getCatalogProducts().find((item) => item.id === id)
  const displayProduct = product || products[0]
  const [quantity, setQuantity] = useState(1)
  const { isActive: addedToCart, trigger } = useTransientFeedback()
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [message, setMessage] = useState('')
  const [reviews, setReviews] = useState(() => {
    const storedReviews = readStorage(`hh_resenas_${displayProduct.id}`, [])
    return Array.isArray(storedReviews) ? storedReviews.filter((review) => review && typeof review.comment === 'string' && Number(review.rating) >= 1 && Number(review.rating) <= 5) : []
  })
  const average = reviews.length ? (reviews.reduce((sum, review) => sum + Number(review.rating), 0) / reviews.length).toFixed(1) : null

  function publishReview(event) {
    event.preventDefault()
    if (!rating || !comment.trim()) {
      setMessage('Selecciona una calificación y escribe una reseña.')
      return
    }
    const session = getSession()
    const nextReviews = [{ rating, comment: comment.trim(), author: session?.nombre || 'Cliente de HuertoHogar', date: new Date().toLocaleDateString('es-CL') }, ...reviews]
    writeStorage(`hh_resenas_${displayProduct.id}`, nextReviews)
    setReviews(nextReviews)
    setComment('')
    setRating(0)
    setMessage('Tu reseña fue publicada.')
  }

  function addDetailToCart() {
    addCartItem(displayProduct, quantity)
    trigger()
  }

  const currentPrice = displayProduct.discountedPrice ?? displayProduct.price

  if (!product) return <main className="container not-found"><h2 className="serif">Producto no encontrado</h2><p>Este producto ya no está disponible en el catálogo.</p><a className="btn-checkout" href="/catalogo">Volver al catálogo</a></main>

  return (
    <main id="detalle-producto">
      <section className="contenedor-detalle">
        <div className="imagen-producto"><img src={displayProduct.image} alt={displayProduct.name} /></div>
        <div className="info-producto">
          <span className="codigo-producto">Código: {displayProduct.id}</span><span className="categoria-detalle">{displayProduct.categoryLabel}</span>
          <h2>{displayProduct.name}</h2><p className="precio-detalle">{displayProduct.discountPercent > 0 && <><del>{formatPrice(displayProduct.price)}</del> <span className="product-discount-label">-{displayProduct.discountPercent}%</span>{' '}</>}{formatPrice(currentPrice)} / {displayProduct.unit}</p>
          <p className="stock-detalle">Stock disponible: {displayProduct.stock}</p><p>{displayProduct.description}</p>
          <div className="origen-detalle"><strong>Origen:</strong> {displayProduct.origin}<br /><strong>Prácticas sostenibles:</strong> {displayProduct.practices}</div>
          <div className="huella-carbono"><strong>🌿 Impacto ambiental</strong><p>{displayProduct.impact}</p></div>
          <div className="form-compra"><div className="form-group cantidad-detalle"><label>Cantidad</label><ControlCantidad value={quantity} onChange={setQuantity} /></div><button className="btn-comprar" type="button" onClick={addDetailToCart}>{addedToCart ? '✓ Añadido' : 'Añadir al Carrito'}</button></div>
          <hr className="detalle-divider" />
          <section className="resenas-detalle">
            <h3>Reseñas y calificaciones</h3>
            <p className="resumen-calificacion">{average ? `★ ${average}/5 (${reviews.length} reseña${reviews.length === 1 ? '' : 's'})` : 'Este producto todavía no tiene reseñas.'}</p>
            <form className="form-resena" onSubmit={publishReview}>
              <label>Tu calificación</label>
              <div className="estrellas-rating" aria-label="Seleccionar calificación de uno a cinco">
                {[1, 2, 3, 4, 5].map((value) => <button type="button" key={value} aria-label={`${value} estrellas`} aria-pressed={rating === value} className={value <= rating ? 'activa' : ''} onClick={() => setRating(value)}>★</button>)}
              </div>
              <textarea rows="4" value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Escribe tu opinión sobre este producto" />
              <p className="mensaje-resena" aria-live="polite">{message}</p>
              <button type="submit" className="btn-checkout">Publicar reseña</button>
            </form>
            <div className="lista-resenas">{reviews.map((review, index) => <article className="item-resena" key={`${review.date}-${index}`}><strong>{review.author}</strong><span>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span><p>{review.comment}</p><small>{review.date}</small></article>)}</div>
          </section>
        </div>
      </section>
    </main>
  )
}
