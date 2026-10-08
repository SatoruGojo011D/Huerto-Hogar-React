import { useState } from 'react'
import { products, resolveProductImage } from '../data/products.js'
import { addCartItem, formatPrice, getCart, getCatalogProducts, getOrders, getSession, readStorage, saveCart, writeStorage } from '../lib/storage.js'
import CatalogFilters from '../components/CatalogFilters.jsx'
import FormField from '../components/FormField.jsx'
import OrderReceiptModal from '../components/OrderReceiptModal.jsx'
import ProductCard from '../components/ProductCard.jsx'
import QuantityControl from '../components/QuantityControl.jsx'
import StatusMessage from '../components/StatusMessage.jsx'
import StatusTimeline from '../components/StatusTimeline.jsx'

const minimumDeliveryDate = new Date().toISOString().slice(0, 10)

function createOrder(cart, delivery, subtotal, shipping) {
  const code = `HH-${Math.floor(10000 + Math.random() * 90000)}`
  return { code, createdAt: new Date().toISOString(), delivery: delivery || 'Fecha por confirmar', items: cart, subtotal, shipping, total: subtotal + shipping, status: 1 }
}

export function HomePage() {
  const featured = [products[0], products[1], products[2], products[3]]
  return (
    <main>
      <section className="home-hero">
        <div className="home-hero__content container">
          <div>
            <span className="section-kicker">🌱 Cosecha de la semana</span>
            <h2 className="serif">Del campo directo a tu mesa</h2>
            <p>Productos frescos, orgánicos y cosechados por pequeños productores locales el día anterior a tu entrega.</p>
            <div className="hero-actions"><a href="/catalogo" className="btn-checkout home-btn">Ver Catálogo</a><a href="/nosotros" className="btn-secondary home-btn">Nuestra historia</a></div>
            <ul className="hero-points"><li>Entrega local</li><li>Sin intermediarios</li><li>Productos frescos</li></ul>
          </div>
        </div>
      </section>
      <section className="container home-section">
        <div className="section-heading"><span className="section-kicker">Lo más elegido</span><h2 className="serif">Productos destacados</h2></div>
        <div className="featured-grid">
          {featured.map((product) => <ProductCard product={product} featured key={product.id} />)}
        </div>
      </section>
    </main>
  )
}

export function CatalogPage() {
  const [categories, setCategories] = useState([])
  const [prices, setPrices] = useState([])
  const [search, setSearch] = useState('')
  const catalog = getCatalogProducts()
  const filteredProducts = catalog.filter((product) => {
    const categoryMatches = categories.length === 0 || categories.includes(product.category)
    const priceMatches = prices.length === 0 || prices.some((range) => (
      range === 'bajo' ? product.price < 1000 : range === 'medio' ? product.price >= 1000 && product.price <= 3000 : product.price > 3000
    ))
    return categoryMatches && priceMatches && product.name.toLowerCase().includes(search.trim().toLowerCase())
  })

  return (
    <main className="container">
      <h2 className="cart-title serif">Catálogo de productos</h2>
      <p className="cart-subtitle">Selecciona productos frescos directamente traídos de la granja.</p>
      <div className="catalogo-layout">
        <CatalogFilters categories={categories} setCategories={setCategories} prices={prices} setPrices={setPrices} search={search} setSearch={setSearch} />
        <section className="producto-grid" aria-label="Resultados del catálogo">
          {filteredProducts.length === 0 && <p className="sin-resultados">No encontramos productos con esos filtros.</p>}
          {filteredProducts.map((product) => <ProductCard product={product} key={product.id} />)}
        </section>
      </div>
    </main>
  )
}

export function ProductDetailPage() {
  const id = new URLSearchParams(window.location.search).get('id')
  const product = getCatalogProducts().find((item) => item.id === id)
  const displayProduct = product || products[0]
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
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
    setAddedToCart(true)
    window.setTimeout(() => setAddedToCart(false), 1000)
  }

  if (!product) return <main className="container not-found"><h2 className="serif">Producto no encontrado</h2><p>Este producto ya no está disponible en el catálogo.</p><a className="btn-checkout" href="/catalogo">Volver al catálogo</a></main>

  return (
    <main id="detalle-producto">
      <section className="contenedor-detalle">
        <div className="imagen-producto"><img src={displayProduct.image} alt={displayProduct.name} /></div>
        <div className="info-producto">
          <span className="codigo-producto">Código: {displayProduct.id}</span><span className="categoria-detalle">{displayProduct.categoryLabel}</span>
          <h2>{displayProduct.name}</h2><p className="precio-detalle">{formatPrice(displayProduct.price)} / {displayProduct.unit}</p>
          <p className="stock-detalle">Stock disponible: {displayProduct.stock}</p><p>{displayProduct.description}</p>
          <div className="origen-detalle"><strong>Origen:</strong> {displayProduct.origin}<br /><strong>Prácticas sostenibles:</strong> {displayProduct.practices}</div>
          <div className="huella-carbono"><strong>🌿 Impacto ambiental</strong><p>{displayProduct.impact}</p></div>
          <div className="form-compra"><div className="form-group cantidad-detalle"><label>Cantidad</label><QuantityControl value={quantity} onChange={setQuantity} /></div><button className="btn-comprar" type="button" onClick={addDetailToCart}>{addedToCart ? '✓ Añadido' : 'Añadir al Carrito'}</button></div>
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

export function CartPage() {
  const [cart, setCart] = useState(getCart)
  const [delivery, setDelivery] = useState(() => readStorage('hh_fecha_entrega', ''))
  const [receipt, setReceipt] = useState(null)
  const [message, setMessage] = useState('')
  const subtotal = cart.reduce((sum, item) => sum + Number(item.precio) * Number(item.qty), 0)
  const count = cart.reduce((sum, item) => sum + Number(item.qty), 0)
  const shipping = subtotal >= 25000 ? 0 : 2990

  function updateCart(nextCart) {
    setCart(nextCart)
    saveCart(nextCart)
  }

  function confirmOrder() {
    if (!cart.length) {
      setMessage('Agrega al menos un producto antes de confirmar el pedido.')
      return
    }
    const order = createOrder(cart, delivery, subtotal, shipping)
    writeStorage('hh_ultimo_pedido', order)
    writeStorage('hh_pedidos', [order, ...getOrders()])
    updateCart([])
    setReceipt(order)
    setMessage('')
  }

  return (
    <main className="container">
      <h2 className="cart-title serif">Mi carrito</h2><p className="cart-subtitle">Cosechamos tu pedido el día anterior a la entrega.</p>
      <div className="cart-grid">
        <section className="cart-items" aria-label="Productos del carrito">
          {!cart.length ? <div className="empty-cart"><div className="empty-cart-icon">🛒</div><h3>Tu carrito está vacío</h3><p>Aún no has agregado productos. Explora el catálogo y añade lo que te guste.</p><a href="/catalogo" className="btn-checkout empty-cart-btn">Ver catálogo</a></div> : cart.map((item) => <article className="cart-card" key={item.id}>
            <img src={resolveProductImage(item.imagen)} alt={item.nombre} />
            <div className="cart-card-info"><h3 className="serif">{item.nombre}</h3><p className="unit-price">{formatPrice(item.precio)}</p><QuantityControl label={`Cantidad de ${item.nombre}`} value={Number(item.qty)} max={999} onChange={(qty) => updateCart(cart.map((entry) => entry.id === item.id ? { ...entry, qty } : entry))} /></div>
            <button className="remove-btn" type="button" aria-label={`Eliminar ${item.nombre}`} onClick={() => updateCart(cart.filter((entry) => entry.id !== item.id))}>×</button><strong className="item-total-price">{formatPrice(item.precio * item.qty)}</strong>
          </article>)}
        </section>
        <aside className="summary-box">
          <h3 className="serif">Resumen del pedido</h3>
          <div className="summary-item"><span>Subtotal ({count} producto(s))</span><strong>{formatPrice(subtotal)}</strong></div>
          <div className="summary-item"><span>Despacho</span><strong>{formatPrice(subtotal ? shipping : 0)}</strong></div>
          <div className="summary-item total-row"><span>Total</span><strong>{formatPrice(subtotal ? subtotal + shipping : 0)}</strong></div>
          <div className="date-picker-box"><label htmlFor="delivery-date">Fecha de entrega</label><input id="delivery-date" type="date" min={minimumDeliveryDate} value={delivery} onChange={(event) => { setDelivery(event.target.value); writeStorage('hh_fecha_entrega', event.target.value) }} /></div>
          <div className="green-impact-card"><div className="impact-header">🍃 Huella de carbono reducida</div><div className="impact-value">{(count * 0.416).toFixed(1)} kg CO₂e</div><p className="impact-sub">Este pedido evita intermediarios y usa envases retornables.</p><div className="progress-track" role="progressbar" aria-label="Huella de carbono del carrito" aria-valuemin="0" aria-valuemax="100" aria-valuenow={Math.min(100, count * 16)}><div className="progress-fill" style={{ width: `${Math.min(100, count * 16)}%` }} /></div></div>
          <button className="btn-checkout" type="button" onClick={confirmOrder}>Confirmar pedido</button>
          <p className="free-shipping-indicator">{subtotal >= 25000 ? '¡Tu envío es gratis!' : `Suma ${formatPrice(25000 - subtotal)} más para despacho gratis.`}</p>
          <StatusMessage>{message}</StatusMessage>
        </aside>
      </div>
      <OrderReceiptModal order={receipt} onClose={() => setReceipt(null)} />
    </main>
  )
}

export function AboutPage() {
  const [location, setLocation] = useState(null)
  const cities = [
    ['Santiago', 'Av. Providencia 1208, Providencia, Santiago, Chile'],
    ['Puerto Montt', 'Av. Diego Portales 1000, Puerto Montt, Chile'],
    ['Villarrica', 'Camino Villarrica-Pucón 1500, Villarrica, Chile'],
    ['Viña del Mar', 'Av. San Martín 2100, Viña del Mar, Chile'],
  ]
  return (
    <main className="seccion-nosotros">
      <section className="about-intro"><span className="section-kicker">Del campo a tu hogar</span><h2 className="cart-title serif">Nuestra historia</h2><p>HuertoHogar es una tienda online dedicada a llevar la frescura y calidad de los productos del campo directamente a la puerta de nuestros clientes en Chile. Con más de 6 años de experiencia, conectamos a las familias con pequeños productores y promovemos un estilo de vida saludable y sostenible.</p></section>
      <section className="mision-vision-grid" aria-label="Misión, visión y compromiso"><article className="mision-vision-card"><h3 className="serif">🌱 Misión</h3><p>Proporcionar productos frescos y de calidad directamente desde el campo hasta la puerta de nuestros clientes.</p></article><article className="mision-vision-card"><h3 className="serif">🔭 Visión</h3><p>Ser una tienda referente en distribución de productos naturales en Chile, reconocida por su calidad y compromiso ecológico.</p></article><article className="mision-vision-card"><h3 className="serif">🤝 Compromiso</h3><p>Reducimos intermediarios entre el productor y tu mesa, apoyando a pequeños agricultores locales.</p></article></section>
      <section className="redes-sociales-section"><h3 className="serif">Síguenos y comparte</h3><p className="redes-subtitulo">Ofertas, cosechas del día y recetas de nuestra comunidad.</p><div className="redes-grid"><a className="red-card" href="https://instagram.com" target="_blank" rel="noreferrer"><h4>Instagram</h4><span className="red-handle">@HuertoHogar.cl</span><p>Recetas y cosechas diarias.</p></a><a className="red-card" href="https://wa.me/56912345678" target="_blank" rel="noreferrer"><h4>WhatsApp</h4><span className="red-handle">+56 9 1234 5678</span><p>Atención y pedidos rápidos.</p></a><a className="red-card" href="https://facebook.com" target="_blank" rel="noreferrer"><h4>Facebook</h4><span className="red-handle">/HuertoHogarChile</span></a><a className="red-card" href="https://tiktok.com" target="_blank" rel="noreferrer"><h4>TikTok</h4><span className="red-handle">@HuertoHogar</span><p>Consejos para tu hogar.</p></a></div></section>
      <section className="mapa-sucursales"><h3 className="serif">Nuestras ubicaciones</h3><p>Selecciona una ciudad para ver la sucursal de acopio.</p><div className="grupo-ciudades">{cities.map(([city, address]) => <button className="btn-checkout btn-ciudad" type="button" key={city} onClick={() => setLocation({ city, address })}>{city}</button>)}</div>{location && <div className="location-result"><strong>{location.city}</strong><p>{location.address}</p><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address)}`} target="_blank" rel="noreferrer">Abrir en Google Maps</a></div>}</section>
    </main>
  )
}

const articles = [
  { title: 'Cómo mantener tus verduras frescas por más tiempo', category: 'Guía práctica', text: 'Separa frutas que emiten etileno, como manzanas y plátanos, de las hojas verdes. Lava las hojas con agua fría, sécalas muy bien y guárdalas en un recipiente con papel absorbente.' },
  { title: 'Compostaje urbano paso a paso', category: 'Sustentabilidad', text: 'Transforma los restos orgánicos de tu cocina en abono para tus plantas. Alterna materiales húmedos y secos, airea la mezcla y mantén una humedad similar a una esponja escurrida.' },
  { title: '¿Por qué consumir productos de estación?', category: 'Temporada', text: 'Elegir alimentos de estación ayuda a aprovechar su sabor y frescura, apoya a productores locales y reduce la necesidad de almacenamiento y transporte prolongado.' },
]

export function BlogPage() {
  const articleImages = [products[3].image, products[5].image, products[0].image]
  return <main className="container blog-page"><div className="blog-heading"><span className="section-kicker">Blog & guías sustentables</span><h2 className="serif">El arte de cultivar en casa</h2><p>Técnicas orgánicas, conservación de alimentos y consejos de nuestros agricultores.</p></div><div className="grid-blog">{articles.map((article, index) => <article className="card-blog" key={article.title}><div className={`img-blog blog-image-${index}`}><img src={articleImages[index]} alt={article.category} /></div><div className="contenido-blog"><span className="fecha-blog">{article.category}</span><h3 className="serif">{article.title}</h3><p>{article.text}</p></div></article>)}</div></main>
}

export function ContactPage() {
  const [message, setMessage] = useState('')
  function submit(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const storedContacts = readStorage('hh_contactos', [])
    const contacts = Array.isArray(storedContacts) ? storedContacts : []
    contacts.unshift({ id: Date.now(), nombre: formData.get('name'), correo: formData.get('email'), asunto: formData.get('subject'), mensaje: formData.get('message'), fecha: new Date().toISOString() })
    writeStorage('hh_contactos', contacts)
    event.currentTarget.reset()
    setMessage('Gracias por escribirnos. Registramos tu mensaje y te responderemos pronto.')
  }
  return <main className="container contact-main"><div className="summary-box"><span className="section-kicker">Atención al cliente</span><h2 className="serif">Hablemos</h2><p className="cart-subtitle">¿Tienes dudas sobre tu pedido o nuestros productos? Déjanos un mensaje.</p><form className="contact-form" onSubmit={submit}><FormField id="contact-name" label="Nombre completo" name="name" required minLength="3" /><FormField id="contact-email" label="Correo electrónico" name="email" type="email" required /><FormField id="contact-subject" label="Asunto"><select id="contact-subject" name="subject" required defaultValue=""><option value="" disabled>Selecciona un asunto</option><option value="pedidos">Consulta sobre pedidos</option><option value="productos">Dudas de productos</option><option value="reclamos">Reclamos y sugerencias</option></select></FormField><FormField id="contact-message" label="Mensaje"><textarea id="contact-message" name="message" rows="4" required minLength="10" /></FormField><button className="btn-checkout" type="submit">Enviar mensaje</button><StatusMessage variant="success">{message}</StatusMessage></form></div></main>
}

export function TrackingPage() {
  const latestOrder = readStorage('hh_ultimo_pedido', null)
  const codeFromUrl = new URLSearchParams(window.location.search).get('codigo') || latestOrder?.code || ''
  const [code, setCode] = useState(codeFromUrl)
  const [status, setStatus] = useState(0)
  const [error, setError] = useState('')
  const [date, setDate] = useState(() => readStorage('hh_fecha_entrega', ''))
  const [dateMessage, setDateMessage] = useState('')
  function track(event) {
    event.preventDefault()
    const normalizedCode = code.trim().toUpperCase()
    if (!/^HH-\d{4,5}$/.test(normalizedCode)) {
      setError('Ingresa un código con formato HH-98765.')
      setStatus(0)
      return
    }
    const savedOrder = getOrders().find((order) => order.code === normalizedCode)
    const examples = { 'HH-10234': 1, 'HH-55321': 2, 'HH-98765': 3, 'HH-40001': 4 }
    setError('')
    setStatus(savedOrder?.status || examples[normalizedCode] || 3)
  }

  function saveDate(event) {
    event.preventDefault()
    if (!date) {
      setDateMessage('Selecciona una fecha de entrega.')
      return
    }
    writeStorage('hh_fecha_entrega', date)
    setDateMessage(`Fecha de entrega guardada: ${date}`)
  }

  return <main className="container tracking-main"><h2 className="cart-title serif">Seguimiento de pedidos</h2><p className="cart-subtitle">Programa tu entrega y revisa el estado de tu pedido.</p><div className="summary-box"><section className="bloque-seguimiento"><h3 className="serif">Programar entrega</h3><p>Selecciona tu fecha preferida para próximos pedidos.</p><form onSubmit={saveDate} className="fila-inline"><FormField id="tracking-date" label="Fecha de entrega"><input id="tracking-date" type="date" min={minimumDeliveryDate} value={date} onChange={(event) => setDate(event.target.value)} /></FormField><button className="btn-checkout" type="submit">Guardar fecha</button></form><StatusMessage variant="success">{dateMessage}</StatusMessage></section><section className="bloque-seguimiento"><h3 className="serif">Rastreo de pedido</h3><p>Ingresa tu número de pedido para consultar su estado.</p><form onSubmit={track} className="fila-inline"><FormField id="tracking-code" label="Número de pedido" help="Prueba HH-10234, HH-55321, HH-98765 o HH-40001."><input id="tracking-code" value={code} onChange={(event) => setCode(event.target.value)} placeholder="Ej: HH-98765" /></FormField><button className="btn-checkout" type="submit">Rastrear</button></form><StatusMessage>{error}</StatusMessage><StatusTimeline status={status} /></section></div></main>
}