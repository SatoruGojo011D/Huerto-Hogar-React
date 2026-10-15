import { useState } from 'react'
import { getSession, getUsers, writeStorage } from '../js/storage.js'
import StatusMessage from '../components/StatusMessage.jsx'

export function AdminUsersPage() {
  const [users, setUsers] = useState(getUsers)
  const [message, setMessage] = useState('')
  const session = getSession()

  function remove(id) {
    if (String(session?.id) === String(id)) {
      setMessage('No puedes eliminar la cuenta de administrador que está activa.')
      return
    }
    if (!window.confirm('¿Eliminar esta cuenta de usuario?')) return
    const next = users.filter((user) => String(user.id) !== String(id))
    writeStorage('usuarios_huerto', next)
    setUsers(next)
  }
  return <section className="summary-box"><div className="products-toolbar"><div><h2 className="serif">Administración de usuarios</h2><p>Gestiona las cuentas registradas en la plataforma.</p></div><a href="/admin/usuarios/nuevo" className="btn btn-primary">＋ Crear usuario</a></div><StatusMessage>{message}</StatusMessage><div className="admin-table-wrap"><table className="admin-products-table"><thead><tr><th>ID</th><th>Nombre</th><th>Correo</th><th>Rol</th><th>Acciones</th></tr></thead><tbody>{users.map((user) => { const isCurrentUser = String(session?.id) === String(user.id); return <tr key={user.id}><td>{user.id}</td><td className="product-name">{user.nombre}</td><td>{user.correo}</td><td><span className="user-role">{user.rol}</span></td><td><div className="product-actions"><a className="btn btn-secondary" href={`/admin/usuarios/editar?id=${encodeURIComponent(user.id)}`}>Editar</a><a className="btn btn-secondary" href={`/admin/usuarios/historial?id=${encodeURIComponent(user.id)}`}>Historial</a><button className="btn-action btn-delete" type="button" onClick={() => remove(user.id)} aria-label={`Eliminar ${user.nombre}`} disabled={isCurrentUser} title={isCurrentUser ? 'No puedes eliminar la sesión activa' : 'Eliminar usuario'}>×</button></div></td></tr> })}</tbody></table></div></section>
}
