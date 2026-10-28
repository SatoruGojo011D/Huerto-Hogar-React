import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { getUsers, writeStorage } from '../js/storage.js'
import { registerSchema } from '../js/validation.js'
import CampoFormulario from '../components/CampoFormulario.jsx'
import MensajeEstado from '../components/MensajeEstado.jsx'

export function RegisterPage() {
  const [message, setMessage] = useState('')
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(registerSchema) })

  // Solo se ejecuta cuando Yup validó todos los campos.
  function onSubmit({ name, email, password }) {
    const normalizedEmail = email.toLowerCase()
    const users = getUsers()
    if (users.some((user) => user.correo.toLowerCase() === normalizedEmail)) {
      setMessage('Este correo ya se encuentra registrado.')
      return
    }
    users.push({ id: users.reduce((max, user) => Math.max(max, Number(user.id) || 0), 0) + 1, nombre: name, correo: normalizedEmail, contrasena: password, telefono: '', direccion: '', rol: 'cliente' })
    writeStorage('usuarios_huerto', users)
    window.location.assign('/cuenta?registro=exitoso')
  }

  return (
    <main className="container account-main">
      <div className="summary-box">
        <span className="section-kicker">Únete a la comunidad</span>
        <h2 className="serif">Crear una cuenta</h2>
        <p className="cart-subtitle">Recibe productos frescos en tu puerta.</p>
        <form className="account-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <CampoFormulario id="register-name" label="Nombre completo" autoComplete="name" error={errors.name?.message} {...register('name')} />
          <CampoFormulario id="register-email" label="Correo electrónico" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
          <CampoFormulario id="register-password" label="Contraseña" type="password" autoComplete="new-password" help="Mínimo 8 caracteres, con letras y números." error={errors.password?.message} {...register('password')} />
          <CampoFormulario id="register-confirm" label="Confirmar contraseña" type="password" autoComplete="new-password" error={errors.confirmPassword?.message} {...register('confirmPassword')} />
          <label className="fila-checkbox"><input type="checkbox" {...register('terms')} />Acepto los términos y condiciones.</label>
          {errors.terms && <p className="form-error" role="alert">{errors.terms.message}</p>}
          <MensajeEstado>{message}</MensajeEstado>
          <button className="btn-checkout" type="submit">Registrarme</button>
          <p className="account-switch">¿Ya tienes cuenta? <a href="/cuenta">Inicia sesión aquí</a></p>
        </form>
      </div>
    </main>
  )
}
