import { useState } from 'react'
import { getSession, getUsers, writeStorage } from '../js/storage.js'
import { emailPattern } from '../js/validation.js'
import StatusMessage from '../components/StatusMessage.jsx'

export function AdminUserFormPage({ edit = false }) {
  const id = new URLSearchParams(window.location.search).get('id')
  const users = getUsers()
  const existing = edit ? users.find((user) => String(user.id) === id) : null
  const session = getSession()
  const isEditingSelf = edit && String(session?.id) === id
  const [message, setMessage] = useState(existing || !edit ? '' : 'No se encontró el usuario.')
  if (edit && !existing) return <section className="card"><div className="card-body"><p role="alert">{message}</p><a className="btn btn-secondary" href="/admin/usuarios">Volver a usuarios</a></div></section>

  function submit(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const name = String(form.get('name')).trim()
    const email = String(form.get('email')).trim().toLowerCase()
    const password = String(form.get('password'))
    const phone = String(form.get('phone')).trim()
    const address = String(form.get('address')).trim()
    const role = String(form.get('role') || existing?.rol || 'cliente')
    const currentUsers = getUsers()
    if (!name || !emailPattern.test(email)) {
      setMessage('Ingresa nombre y correo @gmail.com o @hotmail.com válidos.')
      return
    }
    if (currentUsers.some((user) => String(user.id) !== id && user.correo.toLowerCase() === email)) {
      setMessage('Ese correo ya está registrado.')
      return
    }
    if ((!edit || password) && password.length < 8) {
      setMessage('La contraseña debe tener al menos 8 caracteres.')
      return
    }
    if (isEditingSelf && role !== session.rol) {
      setMessage('No puedes cambiar tu propio rol mientras esta sesión está activa.')
      return
    }
    const record = { id: existing?.id || currentUsers.reduce((max, user) => Math.max(max, Number(user.id) || 0), 0) + 1, nombre: name, correo: email, contrasena: password || existing?.contrasena || '', telefono: phone, direccion: address, rol: role }
    const next = edit ? currentUsers.map((user) => String(user.id) === id ? record : user) : [...currentUsers, record]
    writeStorage('usuarios_huerto', next)
    window.location.href = '/admin/usuarios'
  }

  function remove() {
    if (isEditingSelf) {
      setMessage('No puedes eliminar la cuenta de administrador que está activa.')
      return
    }
    if (!window.confirm('¿Eliminar este usuario?')) return
    writeStorage('usuarios_huerto', getUsers().filter((user) => String(user.id) !== id))
    window.location.href = '/admin/usuarios'
  }

  return <section className="summary-box user-form-box"><h2 className="serif">{edit ? 'Editar usuario' : 'Registrar usuario'}</h2><p className="cart-subtitle">{edit ? 'Modifica los permisos o datos de la cuenta.' : 'Crea un nuevo perfil para la plataforma.'}</p><form className="form" onSubmit={submit}><div className="form-group"><label htmlFor="user-name">Nombre completo</label><input id="user-name" name="name" defaultValue={existing?.nombre || ''} required /></div><div className="form-group"><label htmlFor="user-email">Correo electrónico</label><input id="user-email" name="email" type="email" defaultValue={existing?.correo || ''} required /></div><div className="form-group"><label htmlFor="user-password">{edit ? 'Nueva contraseña (opcional)' : 'Contraseña'}</label><input id="user-password" name="password" type="password" required={!edit} /></div><div className="form-group"><label htmlFor="user-phone">Teléfono</label><input id="user-phone" name="phone" type="tel" defaultValue={existing?.telefono || ''} /></div><div className="form-group"><label htmlFor="user-address">Dirección</label><input id="user-address" name="address" defaultValue={existing?.direccion || ''} /></div><div className="form-group"><label htmlFor="user-role">Rol</label><select id="user-role" name="role" defaultValue={existing?.rol || 'cliente'} disabled={isEditingSelf}><option value="cliente">Cliente</option><option value="admin">Administrador</option></select></div><StatusMessage>{message}</StatusMessage><div className="form-actions"><button className="btn btn-primary" type="submit">{edit ? 'Actualizar datos' : 'Guardar usuario'}</button>{edit && <a className="btn btn-secondary" href={`/admin/usuarios/historial?id=${encodeURIComponent(existing.id)}`}>Ver historial de compras</a>}{edit && <button className="btn btn-danger" type="button" onClick={remove} disabled={isEditingSelf}>Eliminar usuario</button>}<a className="btn btn-secondary" href="/admin/usuarios">Cancelar</a></div></form></section>
}
