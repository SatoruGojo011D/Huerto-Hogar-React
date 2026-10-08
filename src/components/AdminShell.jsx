import { getSession } from '../lib/storage.js'

const adminNavigation = [
  ['/admin', 'Dashboard'],
  ['/admin/productos', 'Productos'],
  ['/admin/usuarios', 'Usuarios'],
  ['/', 'Volver al sitio'],
]

export default function AdminShell({ children, title }) {
  const session = getSession()
  return (
    <div className="admin-container">
      <aside className="sidebar">
        <div className="sidebar-header"><h2>HuertoHogar</h2></div>
        <nav className="sidebar-nav" aria-label="Administración">
          {adminNavigation.map(([href, label]) => <a className={`nav-item${window.location.pathname === href ? ' active' : ''}`} href={href} key={href}>{label}</a>)}
        </nav>
      </aside>
      <main className="main-content">
        <header className="header"><h1>{title}</h1><div className="user-info">{session?.nombre || 'Administrador'}</div></header>
        <div className="content">{children}</div>
      </main>
    </div>
  )
}