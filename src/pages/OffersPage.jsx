import ProductCard from '../components/ProductCard.jsx'
import { addCartItem, getCatalogProducts } from '../js/storage.js'

const maxOfferPrice = 1200

export function OffersPage() {
  const products = getCatalogProducts().filter((product) => (
    ['frutas', 'verduras'].includes(product.category) && product.price <= maxOfferPrice
  ))

  return (
    <main className="container catalog-page py-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-2 mb-4">
        <div>
          <span className="section-kicker">Selección de temporada</span>
          <h2 className="cart-title serif mb-1">Ofertas frescas</h2>
          <p className="cart-subtitle mb-0">Frutas y verduras seleccionadas por su precio accesible, directo desde nuestro catálogo.</p>
        </div>
        <a className="btn btn-outline-success align-self-start align-self-md-end" href="/catalogo">Ver todo el catálogo</a>
      </div>
      <section className="row g-3 catalog-results" aria-label="Productos en oferta">
        {products.length === 0 && (
          <p className="sin-resultados col-12">Por ahora no hay productos disponibles en esta selección. Revisa nuestro catálogo completo.</p>
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
