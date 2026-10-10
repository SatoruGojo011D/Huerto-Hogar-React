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
import { ensureSeedUsers, getSession } from './js/storage.js'
import { HomePage } from './pages/HomePage.jsx'
import { CatalogPage } from './pages/CatalogPage.jsx'
import { ProductDetailPage } from './pages/ProductDetailPage.jsx'
import { CartPage } from './pages/CartPage.jsx'
import { AboutPage } from './pages/AboutPage.jsx'
import { BlogPage } from './pages/BlogPage.jsx'
import { ContactPage } from './pages/ContactPage.jsx'
import { TrackingPage } from './pages/TrackingPage.jsx'
import { LoginPage } from './pages/LoginPage.jsx'
import { RegisterPage } from './pages/RegisterPage.jsx'
import { ProfilePage } from './pages/ProfilePage.jsx'
import { AdminDashboardPage } from './pages/AdminDashboardPage.jsx'
import { AdminProductsPage } from './pages/AdminProductsPage.jsx'
import { AdminProductFormPage } from './pages/AdminProductFormPage.jsx'
import { AdminUsersPage } from './pages/AdminUsersPage.jsx'
import { AdminUserFormPage } from './pages/AdminUserFormPage.jsx'
import { Pag1Bootstrap } from './pages/Pag1Bootstrap.jsx'
import { Pag2Bootstrap } from './pages/Pag2Bootstrap.jsx'
import { Pag3Bootstrap } from './pages/Pag3Bootstrap.jsx'

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
  '/bootstrap/alertas': { title: 'HuertoHogar | Bootstrap: alertas y botones', active: '', Page: Pag1Bootstrap },
  '/bootstrap/productos': { title: 'HuertoHogar | Bootstrap: productos', active: '', Page: Pag2Bootstrap },
  '/bootstrap/ayuda': { title: 'HuertoHogar | Bootstrap: ayuda', active: '', Page: Pag3Bootstrap },
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
