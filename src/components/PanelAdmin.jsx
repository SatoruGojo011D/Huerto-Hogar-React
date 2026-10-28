import { clearSession, getSession } from '../js/storage.js'

const adminNavigation = [
  ['/admin', 'Dashboard'],
  ['/admin/ordenes', 'Órdenes / boletas'],
  ['/admin/productos', 'Productos'],
  ['/admin/productos-criticos', 'Stock crítico'],
  ['/admin/categorias', 'Categorías'],
  ['/admin/usuarios', 'Usuarios'],
  ['/admin/reportes', 'Reportes'],
  ['/admin/perfil', 'Perfil'],
]

function logout() {
  clearSession()
  window.location.href = '/cuenta'
}

export default function PanelAdmin({ children, title }) {
  const session = getSession()
  const path = window.location.pathname
  return (
    <div className="admin-container">
      <aside className="sidebar">
        <div className="sidebar-header"><h2>HuertoHogar</h2></div>
        <nav className="sidebar-nav" aria-label="Administración">
          {adminNavigation.map(([href, label]) => {
            const active = path === href
              || (href === '/admin/productos' && path.startsWith('/admin/productos/'))
              || (href === '/admin/usuarios' && path.startsWith('/admin/usuarios/'))
            return <a className={`nav-item${active ? ' active' : ''}`} href={href} key={href}>{label}</a>
          })}
        </nav>
        <div className="sidebar-footer"><a className="nav-item" href="/">Tienda</a><button className="nav-item" type="button" onClick={logout}>Cerrar sesión</button></div>
      </aside>
      <main className="main-content">
        <header className="header"><h1>{title}</h1><div className="user-info">{session?.nombre || 'Administrador'}</div></header>
        <div className="content">{children}</div>
      </main>
    </div>
  )
}