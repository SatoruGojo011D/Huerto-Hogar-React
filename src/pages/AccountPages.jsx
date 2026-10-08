import { useEffect, useState } from 'react'
import { getSession, getUsers, setSession, writeStorage } from '../lib/storage.js'
import FormField from '../components/FormField.jsx'
import StatusMessage from '../components/StatusMessage.jsx'

const emailPattern = /^[^\s@]+@(gmail|hotmail)\.[a-z]{2,}$/i

export function LoginPage() {
  const [message, setMessage] = useState('')

  function submit(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const email = String(form.get('email')).trim().toLowerCase()
    const password = String(form.get('password'))
    if (!emailPattern.test(email)) {
      setMessage('Ingresa un correo válido @gmail.com o @hotmail.com.')
      return
    }
    if (password.length < 8) {
      setMessage('La contraseña debe tener al menos 8 caracteres.')
      return
    }
    const user = getUsers().find((entry) => entry.correo?.toLowerCase() === email && entry.contrasena === password)
    if (!user) {
      setMessage('Correo o contraseña incorrectos.')
      return
    }
    setSession(user)
    window.location.href = user.rol === 'admin' ? '/admin/usuarios' : '/'
  }

  return <main className="container account-main"><div className="summary-box"><span className="section-kicker">Bienvenido de vuelta</span><h2 className="serif">Iniciar sesión</h2><p className="cart-subtitle">Ingresa a tu cuenta para administrar tus pedidos.</p><form className="account-form" onSubmit={submit}><FormField id="login-email" label="Correo electrónico" name="email" type="email" autoComplete="email" required /><FormField id="login-password" label="Contraseña" name="password" type="password" autoComplete="current-password" required /><StatusMessage>{message}</StatusMessage><button className="btn-checkout" type="submit">Ingresar</button><p className="account-switch">¿No tienes cuenta? <a href="/registro">Regístrate aquí</a></p><p className="demo-credentials">Cuenta de prueba: admin@gmail.com / Admin123!</p></form></div></main>
}

export function RegisterPage() {
  const [message, setMessage] = useState('')
  const [done, setDone] = useState(false)

  function submit(event) {
    event.preventDefault()
    setDone(false)
    const form = new FormData(event.currentTarget)
    const name = String(form.get('name')).trim()
    const email = String(form.get('email')).trim().toLowerCase()
    const password = String(form.get('password'))
    const confirmPassword = String(form.get('confirmPassword'))
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,}$/.test(name)) return setMessage('Ingresa un nombre válido de al menos 3 letras.')
    if (!emailPattern.test(email)) return setMessage('El correo debe ser @gmail.com o @hotmail.com.')
    if (password.length < 8 || !/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) return setMessage('La contraseña debe tener 8 caracteres e incluir letras y números.')
    if (password !== confirmPassword) return setMessage('Las contraseñas no coinciden.')
    if (!form.get('terms')) return setMessage('Debes aceptar los términos y condiciones.')
    const users = getUsers()
    if (users.some((user) => user.correo.toLowerCase() === email)) return setMessage('Este correo ya se encuentra registrado.')
    users.push({ id: users.reduce((max, user) => Math.max(max, Number(user.id) || 0), 0) + 1, nombre: name, correo: email, contrasena: password, telefono: '', direccion: '', rol: 'cliente' })
    writeStorage('usuarios_huerto', users)
    setDone(true)
    setMessage('Cuenta creada. Ya puedes iniciar sesión.')
    event.currentTarget.reset()
  }

  return <main className="container account-main"><div className="summary-box"><span className="section-kicker">Únete a la comunidad</span><h2 className="serif">Crear una cuenta</h2><p className="cart-subtitle">Recibe productos frescos en tu puerta.</p><form className="account-form" onSubmit={submit} noValidate><FormField id="register-name" label="Nombre completo" name="name" autoComplete="name" required /><FormField id="register-email" label="Correo electrónico" name="email" type="email" autoComplete="email" required /><FormField id="register-password" label="Contraseña" name="password" type="password" autoComplete="new-password" required help="Mínimo 8 caracteres, con letras y números." /><FormField id="register-confirm" label="Confirmar contraseña" name="confirmPassword" type="password" autoComplete="new-password" required /><label className="fila-checkbox"><input type="checkbox" name="terms" />Acepto los términos y condiciones.</label><StatusMessage variant={done ? 'success' : 'error'}>{message}</StatusMessage><button className="btn-checkout" type="submit">Registrarme</button><p className="account-switch">¿Ya tienes cuenta? <a href="/cuenta">Inicia sesión aquí</a></p></form></div></main>
}

export function ProfilePage() {
  const session = getSession()
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!session) window.location.replace('/cuenta')
  }, [session])

  if (!session) {
    return null
  }

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
    if (currentPassword && currentPassword !== session.contrasena) {
      setSuccess(false)
      setMessage('La contraseña actual no coincide.')
      return
    }
    if (newPassword && newPassword.length < 6) {
      setSuccess(false)
      setMessage('La nueva contraseña debe tener al menos 6 caracteres.')
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

  return <main className="container account-main profile-main"><h2 className="cart-title serif">Mi perfil</h2><p className="cart-subtitle">Actualiza tu información personal y credenciales de acceso.</p><form className="summary-box account-form profile-form" onSubmit={submit}><p className={`profile-alert ${success ? 'success' : 'error'}`} aria-live="polite">{message}</p><FormField id="profile-name" label="Nombre completo" name="name" defaultValue={session.nombre} required /><FormField id="profile-email" label="Correo electrónico" name="email" type="email" defaultValue={session.correo} required /><FormField id="profile-phone" label="Teléfono" name="phone" type="tel" defaultValue={session.telefono || ''} /><FormField id="profile-address" label="Dirección" name="address" defaultValue={session.direccion || ''} /><hr /><h3 className="serif">Cambiar contraseña</h3><FormField id="profile-current-password" label="Contraseña actual" name="currentPassword" type="password" autoComplete="current-password" /><FormField id="profile-new-password" label="Nueva contraseña" name="newPassword" type="password" autoComplete="new-password" /><div className="profile-actions"><button className="btn-checkout" type="submit">Guardar cambios</button><button className="btn-checkout btn-logout" type="button" onClick={logout}>Cerrar sesión</button></div></form></main>
}