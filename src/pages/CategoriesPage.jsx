// Página /categorias: productos agrupados por categoría, mostrados con TarjetaProducto.
import { useMemo } from 'react'
import { addCartItem, getCatalogProducts } from '../js/storage.js'
import TarjetaProducto from '../components/TarjetaProducto.jsx'

export function CategoriesPage() {
  const catalog = useMemo(() => getCatalogProducts(), [])
  const categories = useMemo(() => [...new Map(catalog.map((product) => [product.category, product.categoryLabel])).entries()], [catalog])
  const selected = new URLSearchParams(window.location.search).get('categoria') || categories[0]?.[0]
  const visible = catalog.filter((product) => product.category === selected)
  const selectedLabel = categories.find(([slug]) => slug === selected)?.[1]

  return (
    <main className="container py-5">
      <h2 className="cart-title serif">Categorías</h2>
      <nav aria-label="Categorías de productos" className="row g-3 mb-4">
        {categories.map(([slug, label]) => (
          <div className="col-6 col-md-3" key={slug}>
            <a href={`/categorias?categoria=${slug}`} className={`card text-center text-decoration-none h-100 p-3 ${slug === selected ? 'border-success' : ''}`} aria-current={slug === selected ? 'page' : undefined}>
              <strong>{label}</strong>
            </a>
          </div>
        ))}
      </nav>
      {selectedLabel ? <h3 className="serif">{selectedLabel}</h3> : <p className="sin-resultados">No encontramos esa categoría.</p>}
      <div className="row g-3">
        {visible.map((product) => <div className="col-12 col-sm-6 col-lg-4 d-flex" key={product.id}><TarjetaProducto product={product} onAdd={addCartItem} /></div>)}
      </div>
    </main>
  )
}
