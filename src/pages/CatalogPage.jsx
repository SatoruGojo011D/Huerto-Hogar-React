import { useState } from 'react'
import { addCartItem, getCatalogProducts } from '../js/storage.js'
import CatalogFilters from '../components/CatalogFilters.jsx'
import ProductCard from '../components/ProductCard.jsx'

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
    <main className="container catalog-page py-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-2 mb-4">
        <div><h2 className="cart-title serif mb-1">Catálogo de productos</h2><p className="cart-subtitle mb-0">Selecciona productos frescos directamente traídos de la granja.</p></div>
        <span className="badge rounded-pill text-bg-success align-self-start align-self-md-end">{filteredProducts.length} productos</span>
      </div>
      <div className="row g-4 align-items-start">
        <div className="col-12 col-lg-3"><CatalogFilters categories={categories} setCategories={setCategories} prices={prices} setPrices={setPrices} search={search} setSearch={setSearch} /></div>
        <section className="col-12 col-lg-9" aria-label="Resultados del catálogo">
          <div className="row g-3 catalog-results">
            {filteredProducts.length === 0 && <p className="sin-resultados col-12">No encontramos productos con esos filtros.</p>}
            {filteredProducts.map((product) => <div className="col-12 col-sm-6 col-xl-4 d-flex" key={product.id}><ProductCard product={product} onAdd={addCartItem} /></div>)}
          </div>
        </section>
      </div>
    </main>
  )
}
