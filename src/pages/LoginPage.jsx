import { useState } from 'react'
import { getUsers, setSession } from '../js/storage.js'
import { emailPattern } from '../js/validation.js'
import FormField from '../components/FormField.jsx'
import StatusMessage from '../components/StatusMessage.jsx'

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
