// Filtros del catálogo (búsqueda, categorías y rangos de precio). Componente controlado: el estado vive en CatalogPage.
import { useRef } from 'react'

const categoryOptions = [
  ['frutas', 'Frutas frescas'],
  ['verduras', 'Verduras orgánicas'],
  ['organicos', 'Productos orgánicos'],
  ['lacteos', 'Productos lácteos'],
]

const priceOptions = [
  ['bajo', 'Menos de $1.000 CLP'],
  ['medio', '$1.000 - $3.000 CLP'],
  ['alto', 'Más de $3.000 CLP'],
]

export default function FiltrosCatalogo({ categories, setCategories, prices, setPrices, search, setSearch }) {
  function toggle(setter, value) {
    setter((current) => current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value])
  }

  const searchRef = useRef(null)

  function clearFilters() {
    setCategories([])
    setPrices([])
    setSearch('')
    searchRef.current?.focus() // devuelve el foco al buscador
  }

  return (
    <aside className="summary-box filtros-sidebar" aria-label="Filtros del catálogo">
      <h3 className="serif">Buscar</h3>
      <input ref={searchRef} className="form-control mb-3" aria-label="Buscar productos" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Nombre del producto" />
      <h3 className="serif">Categorías</h3>
      <div className="lista-filtros">{categoryOptions.map(([value, label]) => <label key={value}><input type="checkbox" checked={categories.includes(value)} onChange={() => toggle(setCategories, value)} />{label}</label>)}</div>
      <h3 className="serif">Precio</h3>
      <div className="lista-filtros">{priceOptions.map(([value, label]) => <label key={value}><input type="checkbox" checked={prices.includes(value)} onChange={() => toggle(setPrices, value)} />{label}</label>)}</div>
      <button type="button" className="btn btn-outline-success w-100" onClick={clearFilters}>Limpiar filtros</button>
    </aside>
  )
}