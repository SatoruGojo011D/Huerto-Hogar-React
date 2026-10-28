import { useState } from 'react'
import FiltrosCatalogo from '../components/FiltrosCatalogo.jsx'

// Padre real con estado: permite comprobar que el componente controlado se actualiza.
export default function PadreFiltros({ onSearch }) {
  const [categories, setCategories] = useState([])
  const [prices, setPrices] = useState([])
  const [search, setSearch] = useState('')
  return (
    <>
      <FiltrosCatalogo
        categories={categories}
        setCategories={setCategories}
        prices={prices}
        setPrices={setPrices}
        search={search}
        setSearch={(value) => { setSearch(value); onSearch?.(value) }}
      />
      <output data-testid="resumen">{`${categories.join(',')}|${prices.join(',')}|${search}`}</output>
    </>
  )
}
