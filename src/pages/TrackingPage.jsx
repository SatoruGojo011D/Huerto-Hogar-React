// Página /seguimiento: busca un pedido por su código y muestra sus etapas con LineaTiempoEstado.
import { useState } from 'react'
import { getOrders, readStorage, writeStorage } from '../js/storage.js'
import CampoFormulario from '../components/CampoFormulario.jsx'
import MensajeEstado from '../components/MensajeEstado.jsx'
import LineaTiempoEstado from '../components/LineaTiempoEstado.jsx'
import { getMinimumDeliveryDate } from '../js/delivery.js'

export function TrackingPage() {
  const latestOrder = readStorage('hh_ultimo_pedido', null)
  const codeFromUrl = new URLSearchParams(window.location.search).get('codigo') || latestOrder?.code || ''
  const [code, setCode] = useState(codeFromUrl)
  const [status, setStatus] = useState(0)
  const [error, setError] = useState('')
  const [date, setDate] = useState(() => readStorage('hh_fecha_entrega', ''))
  const [dateMessage, setDateMessage] = useState('')
  function track(event) {
    event.preventDefault()
    const normalizedCode = code.trim().toUpperCase()
    if (!/^HH-\d{4,5}$/.test(normalizedCode)) {
      setError('Ingresa un código con formato HH-98765.')
      setStatus(0)
      return
    }
    const savedOrder = getOrders().find((order) => order.code === normalizedCode)
    const examples = { 'HH-10234': 1, 'HH-55321': 2, 'HH-98765': 3, 'HH-40001': 4 }
    const nextStatus = savedOrder?.status ?? examples[normalizedCode]
    if (nextStatus === undefined) {
      setError('No encontramos un pedido con ese código.')
      setStatus(0)
      return
    }
    setError('')
    setStatus(nextStatus)
  }

  function saveDate(event) {
    event.preventDefault()
    if (!date) {
      setDateMessage('Selecciona una fecha de entrega.')
      return
    }
    writeStorage('hh_fecha_entrega', date)
    setDateMessage(`Fecha de entrega guardada: ${date}`)
  }

  return <main className="container tracking-main"><h2 className="cart-title serif">Seguimiento de pedidos</h2><p className="cart-subtitle">Programa tu entrega y revisa el estado de tu pedido.</p><div className="summary-box"><section className="bloque-seguimiento"><h3 className="serif">Programar entrega</h3><p>Selecciona tu fecha preferida para próximos pedidos.</p><form onSubmit={saveDate} className="fila-inline"><CampoFormulario id="tracking-date" label="Fecha de entrega"><input id="tracking-date" type="date" min={getMinimumDeliveryDate()} value={date} onChange={(event) => setDate(event.target.value)} /></CampoFormulario><button className="btn-checkout" type="submit">Guardar fecha</button></form><MensajeEstado variant="success">{dateMessage}</MensajeEstado></section><section className="bloque-seguimiento"><h3 className="serif">Rastreo de pedido</h3><p>Ingresa tu número de pedido para consultar su estado.</p><form onSubmit={track} className="fila-inline"><CampoFormulario id="tracking-code" label="Número de pedido" help="Prueba HH-10234, HH-55321, HH-98765 o HH-40001."><input id="tracking-code" value={code} onChange={(event) => setCode(event.target.value)} placeholder="Ej: HH-98765" /></CampoFormulario><button className="btn-checkout" type="submit">Rastrear</button></form><MensajeEstado>{error}</MensajeEstado><LineaTiempoEstado status={status} /></section></div></main>
}
