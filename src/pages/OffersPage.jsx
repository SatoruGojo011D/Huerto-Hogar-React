import ProductCard from '../components/ProductCard.jsx'
import { addCartItem, getCatalogProducts } from '../js/storage.js'

export function OffersPage() {
  const products = getCatalogProducts().filter((product) => product.discountPercent > 0)

  return (
    <main className="container catalog-page py-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-2 mb-4">
        <div>
          <span className="section-kicker">Selección de temporada</span>
          <h2 className="cart-title serif mb-1">Ofertas frescas</h2>
          <p className="cart-subtitle mb-0">Descuentos activos definidos por el equipo en la administración de productos.</p>
        </div>
        <a className="btn btn-outline-success align-self-start align-self-md-end" href="/catalogo">Ver todo el catálogo</a>
      </div>
      <section className="row g-3 catalog-results" aria-label="Productos en oferta">
        {products.length === 0 && (
          <p className="sin-resultados col-12">No hay descuentos activos por ahora. Revisa pronto o explora nuestro catálogo completo.</p>
        )}
        {products.map((product) => (
          <div className="col-12 col-sm-6 col-lg-4 col-xl-3 d-flex" key={product.id}>
            <ProductCard product={product} onAdd={addCartItem} />
          </div>
        ))}
      </section>
    </main>
  )
}
