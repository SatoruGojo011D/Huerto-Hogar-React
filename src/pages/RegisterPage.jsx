import { useState } from 'react'
import { getUsers, writeStorage } from '../js/storage.js'
import { emailPattern } from '../js/validation.js'
import FormField from '../components/FormField.jsx'
import StatusMessage from '../components/StatusMessage.jsx'

export function RegisterPage() {
  const [message, setMessage] = useState('')

  function submit(event) {
    event.preventDefault()
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
    window.location.href = '/cuenta?registro=exitoso'
  }

  return <main className="container account-main"><div className="summary-box"><span className="section-kicker">Únete a la comunidad</span><h2 className="serif">Crear una cuenta</h2><p className="cart-subtitle">Recibe productos frescos en tu puerta.</p><form className="account-form" onSubmit={submit} noValidate><FormField id="register-name" label="Nombre completo" name="name" autoComplete="name" required /><FormField id="register-email" label="Correo electrónico" name="email" type="email" autoComplete="email" required /><FormField id="register-password" label="Contraseña" name="password" type="password" autoComplete="new-password" required help="Mínimo 8 caracteres, con letras y números." /><FormField id="register-confirm" label="Confirmar contraseña" name="confirmPassword" type="password" autoComplete="new-password" required /><label className="fila-checkbox"><input type="checkbox" name="terms" />Acepto los términos y condiciones.</label><StatusMessage>{message}</StatusMessage><button className="btn-checkout" type="submit">Registrarme</button><p className="account-switch">¿Ya tienes cuenta? <a href="/cuenta">Inicia sesión aquí</a></p></form></div></main>
}
