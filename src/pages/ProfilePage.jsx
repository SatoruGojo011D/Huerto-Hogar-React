import { useEffect, useState } from 'react'
import { getSession, getUsers, setSession, writeStorage } from '../js/storage.js'
import { emailPattern } from '../js/validation.js'
import FormField from '../components/FormField.jsx'

export function ProfilePage({ adminMode = false }) {
  const session = getSession()
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!session) window.location.replace('/cuenta')
  }, [session])

  if (!session) {
    return null
  }
  const Container = adminMode ? 'section' : 'main'

  function submit(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const name = String(form.get('name')).trim()
    const email = String(form.get('email')).trim().toLowerCase()
    const phone = String(form.get('phone')).trim()
    const address = String(form.get('address')).trim()
    const currentPassword = String(form.get('currentPassword'))
    const newPassword = String(form.get('newPassword'))
    const users = getUsers()
    if (!name || !emailPattern.test(email)) {
      setSuccess(false)
      setMessage('Ingresa un nombre y un correo @gmail.com o @hotmail.com válido.')
      return
    }
    if (users.some((user) => user.id !== session.id && user.correo.toLowerCase() === email)) {
      setSuccess(false)
      setMessage('Ese correo ya está asociado a otra cuenta.')
      return
    }
    if (newPassword && !currentPassword) {
      setSuccess(false)
      setMessage('Ingresa tu contraseña actual para cambiarla.')
      return
    }
    if (currentPassword && currentPassword !== session.contrasena) {
      setSuccess(false)
      setMessage('La contraseña actual no coincide.')
      return
    }
    if (newPassword && (newPassword.length < 8 || !/[A-Za-z]/.test(newPassword) || !/[0-9]/.test(newPassword))) {
      setSuccess(false)
      setMessage('La nueva contraseña debe tener 8 caracteres e incluir letras y números.')
      return
    }
    const updated = { ...session, nombre: name, correo: email, telefono: phone, direccion: address, contrasena: newPassword || session.contrasena }
    writeStorage('usuarios_huerto', users.map((user) => user.id === session.id ? updated : user))
    setSession(updated)
    setSuccess(true)
    setMessage('Tus datos se guardaron correctamente.')
    event.currentTarget.elements.currentPassword.value = ''
    event.currentTarget.elements.newPassword.value = ''
  }

  function logout() {
    localStorage.removeItem('sesion_activa')
    window.location.href = '/'
  }

  return <Container className="container account-main profile-main"><h2 className="cart-title serif">Mi perfil</h2><p className="cart-subtitle">Actualiza tu información personal y credenciales de acceso.</p><form className="summary-box account-form profile-form" onSubmit={submit}><p className={`profile-alert ${success ? 'success' : 'error'}`} aria-live="polite">{message}</p><FormField id="profile-name" label="Nombre completo" name="name" defaultValue={session.nombre} required /><FormField id="profile-email" label="Correo electrónico" name="email" type="email" defaultValue={session.correo} required /><FormField id="profile-phone" label="Teléfono" name="phone" type="tel" defaultValue={session.telefono || ''} /><FormField id="profile-address" label="Dirección" name="address" defaultValue={session.direccion || ''} /><hr /><h3 className="serif">Cambiar contraseña</h3><FormField id="profile-current-password" label="Contraseña actual" name="currentPassword" type="password" autoComplete="current-password" /><FormField id="profile-new-password" label="Nueva contraseña" name="newPassword" type="password" autoComplete="new-password" help="Mínimo 8 caracteres, con letras y números." /><div className="profile-actions"><button className="btn-checkout" type="submit">Guardar cambios</button><button className="btn-checkout btn-logout" type="button" onClick={logout}>Cerrar sesión</button></div></form></Container>
}
