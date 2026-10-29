// Página /contacto: datos de contacto y formulario de mensaje.
import { useState } from 'react'
import { readStorage, writeStorage } from '../js/storage.js'
import CampoFormulario from '../components/CampoFormulario.jsx'
import MensajeEstado from '../components/MensajeEstado.jsx'

export function ContactPage() {
  const [message, setMessage] = useState('')
  function submit(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const storedContacts = readStorage('hh_contactos', [])
    const contacts = Array.isArray(storedContacts) ? storedContacts : []
    contacts.unshift({ id: Date.now(), nombre: formData.get('name'), correo: formData.get('email'), asunto: formData.get('subject'), mensaje: formData.get('message'), fecha: new Date().toISOString() })
    writeStorage('hh_contactos', contacts)
    event.currentTarget.reset()
    setMessage('Gracias por escribirnos. Registramos tu mensaje y te responderemos pronto.')
  }
  return <main className="container contact-main py-5"><div className="row justify-content-center"><div className="col-12 col-lg-8"><section className="summary-box"><span className="section-kicker">Atención al cliente</span><h2 className="serif">Hablemos</h2><p className="cart-subtitle">¿Tienes dudas sobre tu pedido o nuestros productos? Déjanos un mensaje.</p><form className="contact-form" onSubmit={submit}><div className="row g-3"><div className="col-12 col-md-6"><CampoFormulario id="contact-name" label="Nombre completo" name="name" className="form-control" required minLength="3" /></div><div className="col-12 col-md-6"><CampoFormulario id="contact-email" label="Correo electrónico" name="email" type="email" className="form-control" required /></div><div className="col-12"><CampoFormulario id="contact-subject" label="Asunto"><select className="form-select" id="contact-subject" name="subject" required defaultValue=""><option value="" disabled>Selecciona un asunto</option><option value="pedidos">Consulta sobre pedidos</option><option value="productos">Dudas de productos</option><option value="reclamos">Reclamos y sugerencias</option></select></CampoFormulario></div><div className="col-12"><CampoFormulario id="contact-message" label="Mensaje"><textarea className="form-control" id="contact-message" name="message" rows="4" required minLength="10" /></CampoFormulario></div><div className="col-12"><button className="btn-checkout btn btn-success" type="submit">Enviar mensaje</button></div><div className="col-12"><MensajeEstado variant="success" className="alert alert-success mb-0">{message}</MensajeEstado></div></div></form></section></div></div></main>
}
