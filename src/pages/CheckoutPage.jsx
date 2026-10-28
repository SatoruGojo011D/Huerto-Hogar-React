import { useState } from 'react'
import { getCart, getSession, readStorage } from '../js/storage.js'
import { formatPrice } from '../js/format.js'
import { buildOrder, calculateTotals, completeOrder, processPayment, regions, savePendingOrder, validateCheckout } from '../js/checkout.js'
import CampoFormulario from '../components/CampoFormulario.jsx'
import TablaProductosPedido from '../components/TablaProductosPedido.jsx'
import MensajeEstado from '../components/MensajeEstado.jsx'

const regionNames = Object.keys(regions)

function initialForm(session) {
  const [nombre = '', ...rest] = (session?.nombre || '').split(' ')
  return { nombre, apellidos: rest.join(' '), correo: session?.correo || '', calle: session?.direccion || '', departamento: '', region: regionNames[0], comuna: regions[regionNames[0]][0], indicaciones: '' }
}

export function CheckoutPage({ onNavigate = (url) => window.location.assign(url), approve }) {
  const session = getSession()
  const [cart] = useState(getCart)
  const [form, setForm] = useState(() => initialForm(session))
  const [errors, setErrors] = useState({})
  const { subtotal, iva, shipping, total } = calculateTotals(cart)

  if (!cart.length) {
    return <main className="container py-5"><div className="empty-cart"><h3>No hay productos para pagar</h3><p>Agrega productos al carrito antes de continuar.</p><a href="/catalogo" className="btn-checkout empty-cart-btn">Ver catálogo</a></div></main>
  }

  function change(event) {
    const { name, value } = event.target
    setForm((current) => name === 'region' ? { ...current, region: value, comuna: regions[value][0] } : { ...current, [name]: value })
  }

  function submit(event) {
    event.preventDefault()
    const found = validateCheckout(form)
    setErrors(found)
    if (Object.keys(found).length) return
    const { nombre, apellidos, correo, ...address } = form
    const order = buildOrder({ cart, customer: { nombre, apellidos, correo }, address, delivery: readStorage('hh_fecha_entrega', ''), session })
    const result = processPayment(order, approve === undefined ? undefined : { approve })
    if (result.ok) {
      completeOrder(order)
      onNavigate(`/compra/exitosa?codigo=${encodeURIComponent(order.code)}`)
    } else {
      savePendingOrder(order)
      onNavigate(`/compra/error?codigo=${encodeURIComponent(order.code)}`)
    }
  }

  const field = (id, label, name, extra = {}) => (
    <CampoFormulario id={id} label={label} name={name} value={form[name]} onChange={change} aria-invalid={errors[name] ? 'true' : undefined} help={errors[name]} {...extra} />
  )

  return (
    <main className="container py-5 checkout-page">
      <form className="summary-box" onSubmit={submit} noValidate aria-label="Formulario de pago">
        <div className="d-flex flex-column flex-md-row justify-content-between gap-2 mb-3">
          <div><h2 className="serif mb-1">Carrito de compra</h2><p className="cart-subtitle mb-0">Completa la siguiente información</p></div>
          <strong className="badge text-bg-primary align-self-start fs-6">Total a pagar: {formatPrice(total)}</strong>
        </div>
        <TablaProductosPedido items={cart} />
        <dl className="checkout-totals text-end">
          <div><dt>Neto</dt><dd>{formatPrice(subtotal)}</dd></div>
          <div><dt>IVA (19 %)</dt><dd>{formatPrice(iva)}</dd></div>
          <div><dt>Despacho</dt><dd>{formatPrice(shipping)}</dd></div>
        </dl>
        <h3 className="serif">Información del cliente</h3>
        <div className="row g-3">
          <div className="col-12 col-md-6">{field('checkout-nombre', 'Nombre', 'nombre', { required: true })}</div>
          <div className="col-12 col-md-6">{field('checkout-apellidos', 'Apellidos', 'apellidos', { required: true })}</div>
          <div className="col-12">{field('checkout-correo', 'Correo', 'correo', { type: 'email', required: true })}</div>
        </div>
        <h3 className="serif mt-3">Dirección de entrega de los productos</h3>
        <div className="row g-3">
          <div className="col-12 col-md-6">{field('checkout-calle', 'Calle', 'calle', { required: true })}</div>
          <div className="col-12 col-md-6">{field('checkout-depto', 'Departamento (opcional)', 'departamento', { placeholder: 'Ej: 603' })}</div>
          <div className="col-12 col-md-6">
            <CampoFormulario id="checkout-region" label="Región" help={errors.region}><select id="checkout-region" name="region" className="form-select" value={form.region} onChange={change}>{regionNames.map((region) => <option key={region}>{region}</option>)}</select></CampoFormulario>
          </div>
          <div className="col-12 col-md-6">
            <CampoFormulario id="checkout-comuna" label="Comuna" help={errors.comuna}><select id="checkout-comuna" name="comuna" className="form-select" value={form.comuna} onChange={change}>{regions[form.region].map((comuna) => <option key={comuna}>{comuna}</option>)}</select></CampoFormulario>
          </div>
          <div className="col-12">
            <CampoFormulario id="checkout-indicaciones" label="Indicaciones para la entrega (opcional)"><textarea id="checkout-indicaciones" name="indicaciones" className="form-control" rows="3" value={form.indicaciones} onChange={change} /></CampoFormulario>
          </div>
        </div>
        <MensajeEstado>{Object.keys(errors).length ? 'Revisa los campos marcados antes de pagar.' : ''}</MensajeEstado>
        <div className="text-end mt-3"><button className="btn-checkout" type="submit">Pagar ahora {formatPrice(total)}</button></div>
      </form>
    </main>
  )
}
