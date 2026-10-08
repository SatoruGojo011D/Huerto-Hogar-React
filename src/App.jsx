import { useEffect } from 'react'
import './styles/variables.css'
import './styles/reset.css'
import './styles/header.css'
import './styles/footer.css'
import './styles/buttons.css'
import './styles/home.css'
import './styles/catalogo.css'
import './styles/carrito.css'
import './styles/forms.css'
import './styles/perfil.css'
import './styles/seguimiento.css'
import './styles/producto-detalle.css'
import './styles/nosotros.css'
import './styles/blog.css'
import './styles/admin.css'
import './App.css'
import SiteHeader from './components/SiteHeader.jsx'
import SiteFooter from './components/SiteFooter.jsx'
import AdminShell from './components/AdminShell.jsx'
import { ensureSeedUsers, getSession } from './lib/storage.js'
import { HomePage, CatalogPage, ProductDetailPage, CartPage, AboutPage, BlogPage, ContactPage, TrackingPage } from './pages/StorePages.jsx'
import { LoginPage, RegisterPage, ProfilePage } from './pages/AccountPages.jsx'
import { AdminDashboardPage, AdminProductsPage, AdminProductFormPage, AdminUsersPage, AdminUserFormPage } from './pages/AdminPages.jsx'

const publicRoutes = {
  '/': { title: 'HuertoHogar | Frescura del Campo a tu Mesa', active: '/', Page: HomePage },
  '/catalogo': { title: 'HuertoHogar | Catálogo de Productos', active: '/catalogo', Page: CatalogPage },
  '/producto': { title: 'HuertoHogar | Detalle de Producto', active: '/catalogo', Page: ProductDetailPage },
  '/carrito': { title: 'HuertoHogar | Mi carrito', active: '', Page: CartPage },
  '/nosotros': { title: 'HuertoHogar | Nosotros', active: '/nosotros', Page: AboutPage },
  '/blog': { title: 'HuertoHogar | Blog', active: '/blog', Page: BlogPage },
  '/contacto': { title: 'HuertoHogar | Contacto', active: '/contacto', Page: ContactPage },
  '/seguimiento': { title: 'HuertoHogar | Seguimiento', active: '/seguimiento', Page: TrackingPage },
  '/cuenta': { title: 'HuertoHogar | Iniciar sesión', active: '', Page: LoginPage },
  '/registro': { title: 'HuertoHogar | Crear cuenta', active: '', Page: RegisterPage },
  '/perfil': { title: 'HuertoHogar | Mi perfil', active: '', Page: ProfilePage },
}

const adminRoutes = {
  '/admin': ['Dashboard - HuertoHogar', 'Resumen general', AdminDashboardPage],
  '/admin/productos': ['HuertoHogar | Administración de productos', 'Administración de productos', AdminProductsPage],
  '/admin/productos/nuevo': ['HuertoHogar | Nuevo producto', 'Agregar nuevo producto', () => <AdminProductFormPage />],
  '/admin/productos/editar': ['HuertoHogar | Editar producto', 'Editar producto', () => <AdminProductFormPage edit />],
  '/admin/usuarios': ['HuertoHogar | Administración de usuarios', 'Administración de usuarios', AdminUsersPage],
  '/admin/usuarios/nuevo': ['HuertoHogar | Nuevo usuario', 'Registrar usuario', () => <AdminUserFormPage />],
  '/admin/usuarios/editar': ['HuertoHogar | Editar usuario', 'Editar usuario', () => <AdminUserFormPage edit />],
}

function ProtectedAdmin({ title, Page }) {
  const authorized = getSession()?.rol === 'admin'
  useEffect(() => {
    if (!authorized) window.location.replace('/cuenta')
  }, [authorized])
  if (!authorized) return null
  return <AdminShell title={title}><Page /></AdminShell>
}

function NotFoundPage() {
  return <main className="container not-found"><span className="section-kicker">404</span><h2 className="serif">No encontramos esa página</h2><p>La dirección puede haber cambiado o no existir.</p><a className="btn-checkout" href="/">Volver al inicio</a></main>
}

function App() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/'
  const adminRoute = adminRoutes[path]
  const route = publicRoutes[path]
  const routeTitle = adminRoute?.[0] || route?.title || 'HuertoHogar'

  useEffect(() => {
    ensureSeedUsers()
    document.title = routeTitle
  }, [routeTitle])

  if (adminRoute) {
    const [, title, Page] = adminRoute
    return <ProtectedAdmin title={title} Page={Page} />
  }
  if (!route) return <><SiteHeader /><NotFoundPage /><SiteFooter /></>
  const { Page, active } = route
  return <><SiteHeader active={active} /><Page /><SiteFooter /></>
}

export default App
