import { useEffect, useState } from 'react'
import { getItemCount, getSession } from '../js/storage.js'

const navigation = [
  ['Inicio', '/'],
  ['Catálogo', '/catalogo'],
  ['Ofertas', '/ofertas'],
  ['Nosotros', '/nosotros'],
  ['Blog', '/blog'],
  ['Contacto', '/contacto'],
  ['Seguimiento', '/seguimiento'],
]

function Brand({ href = '/' }) {
  return (
    <a href={href} className="brand-logo">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.4 19 2c1 2 2 4.1 2 9 0 4.97-4.03 9-9 9z" />
        <path d="M11 20v-5" />
      </svg>
      <span className="serif">HuertoHogar</span>
    </a>
  )
}

export default function SiteHeader({ active = '' }) {
  const [cartCount, setCartCount] = useState(getItemCount)
  const [session, setSession] = useState(getSession)

  useEffect(() => {
    const syncState = () => {
      setCartCount(getItemCount())
      setSession(getSession())
    }
    window.addEventListener('storage', syncState)
    window.addEventListener('hh:cart-change', syncState)
    window.addEventListener('hh:session-change', syncState)
    return () => {
      window.removeEventListener('storage', syncState)
      window.removeEventListener('hh:cart-change', syncState)
      window.removeEventListener('hh:session-change', syncState)
    }
  }, [])

  function logout() {
    localStorage.removeItem('sesion_activa')
    window.dispatchEvent(new Event('hh:session-change'))
    window.location.href = '/'
  }

  return (
    <header className="site-header">
      <Brand />
      <nav aria-label="Navegación principal">
        <ul>
          {navigation.map(([label, href]) => <li key={href}><a className={active === href ? 'active' : undefined} href={href}>{label}</a></li>)}
          {!session && <li><a className={active === '/cuenta' ? 'active' : undefined} href="/cuenta">Mi cuenta</a></li>}
          {session?.rol === 'admin' && <li><a href="/admin">Panel admin</a></li>}
        </ul>
      </nav>
      <div className="site-actions">
        {session && session.rol !== 'admin' && <a className="session-link" href="/perfil">Hola, {session.nombre?.split(' ')[0] || 'cliente'}</a>}
        {session && <button className="session-logout" type="button" onClick={logout}>Salir</button>}
        <a className="cart-icon-wrapper" href="/carrito" aria-label={`Carrito, ${cartCount} ${cartCount === 1 ? 'producto' : 'productos'}`}>
          <span aria-hidden="true">🛒</span><span className="cart-badge">{cartCount}</span>
        </a>
      </div>
    </header>
  )
}