// Página /admin/categorias: agregar, editar y eliminar las categorías con que se clasifican los productos.
import { useState } from 'react'
import { getAdminCategories, getAdminProducts } from '../js/adminData.js'
import { writeStorage } from '../js/storage.js'

export function AdminCategoriesPage() {
  const [categories, setCategories] = useState(getAdminCategories)
  const [editing, setEditing] = useState('')
  const [message, setMessage] = useState('')

  function submit(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const name = String(form.get('category')).trim()
    if (!name) return
    if (categories.some((category) => category.toLocaleLowerCase() === name.toLocaleLowerCase() && category !== editing)) {
      setMessage('Ya existe una categoría con ese nombre.')
      return
    }
    const next = editing
      ? categories.map((category) => category === editing ? name : category)
      : [...categories, name]
    if (editing) {
      const products = getAdminProducts().map((product) => product.categoria === editing ? { ...product, categoria: name } : product)
      writeStorage('productos_huerto', products)
    }
    writeStorage('categorias_huerto', next)
    setCategories(next)
    setEditing('')
    setMessage(editing ? 'Categoría actualizada.' : 'Categoría agregada.')
    event.currentTarget.reset()
  }

  function remove(category) {
    if (getAdminProducts().some((product) => product.categoria === category && product.activo !== false)) {
      setMessage('No se puede eliminar: hay productos activos asociados a esta categoría.')
      return
    }
    if (!window.confirm(`¿Eliminar la categoría "${category}"?`)) return
    const next = categories.filter((entry) => entry !== category)
    writeStorage('categorias_huerto', next)
    setCategories(next)
    setMessage('Categoría eliminada.')
  }

  return (
    <section className="summary-box">
      <div className="products-toolbar"><div><h2 className="serif">Categorías</h2><p>Crea y modifica las categorías disponibles para clasificar productos.</p></div></div>
      <form className="category-form" onSubmit={submit}>
        <div className="form-group"><label htmlFor="category-name">{editing ? 'Editar categoría' : 'Nueva categoría'}</label><input id="category-name" name="category" key={editing || 'new-category'} defaultValue={editing} required /></div>
        <div className="form-actions"><button className="btn btn-primary" type="submit">{editing ? 'Guardar cambios' : 'Agregar categoría'}</button>{editing && <button className="btn btn-secondary" type="button" onClick={() => setEditing('')}>Cancelar edición</button>}</div>
      </form>
      <p className="admin-feedback" aria-live="polite">{message}</p>
      <div className="admin-table-wrap"><table className="admin-products-table">
        <thead><tr><th>Categoría</th><th>Productos activos</th><th>Acciones</th></tr></thead>
        <tbody>{categories.map((category) => {
          const productCount = getAdminProducts().filter((product) => product.categoria === category && product.activo !== false).length
          return <tr key={category}><td className="product-name">{category}</td><td>{productCount}</td><td><div className="product-actions"><button className="btn btn-secondary" type="button" onClick={() => { setEditing(category); setMessage('') }}>Editar</button><button className="btn-action btn-delete" type="button" aria-label={`Eliminar ${category}`} onClick={() => remove(category)}>×</button></div></td></tr>
        })}</tbody>
      </table></div>
    </section>
  )
}
