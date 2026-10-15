import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CatalogFilters from '../../components/CatalogFilters.jsx'
import FormField from '../../components/FormField.jsx'
import ProductCard from '../../components/ProductCard.jsx'
import QuantityControl from '../../components/QuantityControl.jsx'
import StatusMessage from '../../components/StatusMessage.jsx'
import StatusTimeline from '../../components/StatusTimeline.jsx'

afterEach(cleanup)

describe('Componentes React', () => {
  it('QuantityControl informa el incremento al componente padre', async () => {
    const user = userEvent.setup()
    const onChange = jasmine.createSpy('onChange')
    render(<QuantityControl value={1} onChange={onChange} />)

    await user.click(screen.getByRole('button', { name: 'Aumentar cantidad' }))

    expect(onChange).toHaveBeenCalledOnceWith(2)
  })

  it('QuantityControl informa la disminución al componente padre', async () => {
    const user = userEvent.setup()
    const onChange = jasmine.createSpy('onChange')
    render(<QuantityControl value={2} onChange={onChange} />)

    await user.click(screen.getByRole('button', { name: 'Disminuir cantidad' }))

    expect(onChange).toHaveBeenCalledOnceWith(1)
  })

  it('QuantityControl deshabilita los controles al llegar a sus límites', () => {
    const onChange = jasmine.createSpy('onChange')
    const { rerender } = render(<QuantityControl value={1} min={1} max={3} onChange={onChange} />)

    expect(screen.getByRole('button', { name: 'Disminuir cantidad' }).disabled).toBeTrue()
    expect(screen.getByRole('button', { name: 'Aumentar cantidad' }).disabled).toBeFalse()
    rerender(<QuantityControl value={3} min={1} max={3} onChange={onChange} />)
    expect(screen.getByRole('button', { name: 'Disminuir cantidad' }).disabled).toBeFalse()
    expect(screen.getByRole('button', { name: 'Aumentar cantidad' }).disabled).toBeTrue()
    expect(onChange).not.toHaveBeenCalled()
  })

  it('StatusMessage no renderiza un mensaje vacío', () => {
    const { container } = render(<StatusMessage />)

    expect(container.firstChild).toBeNull()
  })

  it('StatusMessage marca errores como alertas accesibles', () => {
    render(<StatusMessage>Ocurrió un error</StatusMessage>)

    expect(screen.getByRole('alert').textContent).toContain('Ocurrió un error')
    expect(screen.getByRole('alert').getAttribute('aria-live')).toBe('assertive')
  })

  it('StatusMessage marca confirmaciones como estado accesible', () => {
    render(<StatusMessage variant="success">Guardado</StatusMessage>)

    expect(screen.getByRole('status').textContent).toContain('Guardado')
    expect(screen.getByRole('status').getAttribute('aria-live')).toBe('polite')
  })

  it('StatusTimeline marca los pasos completados y el paso actual', () => {
    const { container } = render(<StatusTimeline status={2} />)

    expect(container.querySelectorAll('.paso.activo').length).toBe(2)
    expect(container.querySelector('[aria-current="step"]').textContent).toContain('En preparación')
  })

  it('FormField asocia la etiqueta con su campo de entrada', () => {
    render(<FormField id="email" label="Correo electrónico" name="email" type="email" />)

    expect(screen.getByRole('textbox', { name: 'Correo electrónico' }).getAttribute('id')).toBe('email')
  })

  it('CatalogFilters comunica la búsqueda y permite limpiar los filtros', async () => {
    const setCategories = jasmine.createSpy('setCategories')
    const setPrices = jasmine.createSpy('setPrices')
    const setSearch = jasmine.createSpy('setSearch')
    render(<CatalogFilters categories={['frutas']} setCategories={setCategories} prices={['bajo']} setPrices={setPrices} search="" setSearch={setSearch} />)
    const search = screen.getByRole('textbox', { name: 'Buscar productos' })

    fireEvent.change(search, { target: { value: 'manzana' } })
    expect(setSearch.calls.mostRecent().args[0]).toBe('manzana')
    fireEvent.click(screen.getByRole('button', { name: 'Limpiar filtros' }))
    expect(setSearch.calls.mostRecent().args[0]).toBe('')
    expect(setCategories).toHaveBeenCalledOnceWith([])
    expect(setPrices).toHaveBeenCalledOnceWith([])
  })

  it('ProductCard llama onAdd con el producto al pulsar Añadir', async () => {
    const user = userEvent.setup()
    const onAdd = jasmine.createSpy('onAdd')
    const product = {
      id: 'VR001',
      name: 'Zanahorias',
      image: 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=',
      price: 900,
      unit: 'kg',
      stock: '10 kg',
      origin: 'Chile',
    }
    render(<ProductCard product={product} onAdd={onAdd} />)

    await user.click(screen.getByRole('button', { name: 'Añadir' }))

    expect(onAdd).toHaveBeenCalledOnceWith(product)
  })
})
