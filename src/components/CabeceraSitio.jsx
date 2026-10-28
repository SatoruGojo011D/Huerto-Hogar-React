import { useEffect, useState } from 'react'
import { formatPrice } from '../js/format.js'
import { clearSession, getCartTotal, getItemCount, getSession } from '../js/storage.js'
import LogoMarca from './LogoMarca.jsx'

const navigation = [
  ['Inicio', '/'],
  ['Catálogo', '/catalogo'],
  ['Categorías', '/categorias'],
  ['Ofertas', '/ofertas'],
  ['Nosotros', '/nosotros'],
  ['Blog', '/blog'],
  ['Contacto', '/contacto'],
  ['Seguimiento', '/seguimiento'],
]

export default function CabeceraSitio({ active = '' }) {
  const [cartCount, setCartCount] = useState(getItemCount)
  const [session, setSession] = useState(getSession)
  const [cartTotal, setCartTotal] = useState(getCartTotal)

  useEffect(() => {
    const syncState = () => {
      setCartCount(getItemCount())
      setCartTotal(getCartTotal())
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
    clearSession()
    window.location.href = '/'
  }

  return (
    <header className="site-header">
      <LogoMarca />
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
          <span aria-hidden="true">🛒</span><span className="cart-badge">{cartCount}</span>{cartTotal > 0 && <span className="cart-total">{formatPrice(cartTotal)}</span>}
        </a>
      </div>
    </header>
  )
}