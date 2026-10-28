// Estado y eventos: un padre con useState recibe los cambios de los filtros.
import { describe, expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PadreFiltros from '../testing/PadreFiltros.jsx'

describe('FiltrosCatalogo', () => {
  test('actualiza búsqueda, categorías y precios en el padre y los limpia devolviendo el foco al buscador', async () => {
    const user = userEvent.setup()
    render(<PadreFiltros />)
    const summary = () => screen.getByTestId('resumen').textContent
    const search = screen.getByRole('textbox', { name: 'Buscar productos' })

    await user.type(search, 'manzana')
    await user.click(screen.getByRole('checkbox', { name: 'Frutas frescas' }))
    await user.click(screen.getByRole('checkbox', { name: 'Productos lácteos' }))
    await user.click(screen.getByRole('checkbox', { name: 'Menos de $1.000 CLP' }))
    expect(summary()).toBe('frutas,lacteos|bajo|manzana')

    await user.click(screen.getByRole('checkbox', { name: 'Frutas frescas' }))
    expect(summary()).toBe('lacteos|bajo|manzana')

    await user.click(screen.getByRole('button', { name: 'Limpiar filtros' }))
    expect(summary()).toBe('||')
    expect(search.value).toBe('')
    expect(document.activeElement).toBe(search)
  })
})
