import { products } from '../js/products.js'
import { addCartItem } from '../js/storage.js'
import ProductCard from '../components/ProductCard.jsx'

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
        <div className="row g-4">
          {featured.map((product) => <div className="col-12 col-sm-6 col-lg-3" key={product.id}><ProductCard product={product} featured onAdd={addCartItem} /></div>)}
        </div>
      </section>
    </main>
  )
}
