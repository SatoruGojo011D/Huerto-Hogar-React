import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { getUsers, setSession } from '../js/storage.js'
import { loginSchema } from '../js/validation.js'
import CampoFormulario from '../components/CampoFormulario.jsx'
import MensajeEstado from '../components/MensajeEstado.jsx'

export function LoginPage() {
  const registered = new URLSearchParams(window.location.search).get('registro') === 'exitoso'
  const [message, setMessage] = useState(registered ? 'Cuenta creada. Ya puedes iniciar sesión.' : '')
  const [isSuccess, setIsSuccess] = useState(registered)
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(loginSchema) })

  // Solo se ejecuta cuando Yup validó los campos.
  function onSubmit({ email, password }) {
    const normalizedEmail = email.toLowerCase()
    const user = getUsers().find((entry) => entry.correo?.toLowerCase() === normalizedEmail && entry.contrasena === password)
    if (!user) {
      setIsSuccess(false)
      setMessage('Correo o contraseña incorrectos.')
      return
    }
    setSession(user)
    window.location.assign(user.rol === 'admin' ? '/admin/usuarios' : '/')
  }

  return (
    <main className="container account-main">
      <div className="summary-box">
        <span className="section-kicker">Bienvenido de vuelta</span>
        <h2 className="serif">Iniciar sesión</h2>
        <p className="cart-subtitle">Ingresa a tu cuenta para administrar tus pedidos.</p>
        <form className="account-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <CampoFormulario id="login-email" label="Correo electrónico" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
          <CampoFormulario id="login-password" label="Contraseña" type="password" autoComplete="current-password" error={errors.password?.message} {...register('password')} />
          <MensajeEstado variant={isSuccess ? 'success' : 'error'}>{message}</MensajeEstado>
          <button className="btn-checkout" type="submit">Ingresar</button>
          <p className="account-switch">¿No tienes cuenta? <a href="/registro">Regístrate aquí</a></p>
        </form>
      </div>
    </main>
  )
}
