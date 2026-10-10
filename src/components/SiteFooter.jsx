const navigation = [
  ['Inicio', '/'],
  ['Catálogo', '/catalogo'],
  ['Nosotros', '/nosotros'],
  ['Blog', '/blog'],
  ['Contacto', '/contacto'],
  ['Seguimiento', '/seguimiento'],
  ['Mi cuenta', '/cuenta'],
  ['Mi perfil', '/perfil'],
  ['Bootstrap: alertas', '/bootstrap/alertas'],
  ['Bootstrap: productos', '/bootstrap/productos'],
  ['Bootstrap: ayuda', '/bootstrap/ayuda'],
]

export default function SiteFooter() {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-brand">
          <a href="/" className="brand-logo">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.4 19 2c1 2 2 4.1 2 9 0 4.97-4.03 9-9 9z" />
              <path d="M11 20v-5" />
            </svg>
            <span className="serif">HuertoHogar</span>
          </a>
          <p>Cooperativa de pequeños productores chilenos. Cosechamos el día previo a tu entrega.</p>
        </div>
        <div className="footer-col"><ul>{navigation.map(([label, href]) => <li key={href}><a href={href}>{label}</a></li>)}</ul></div>
        <div className="footer-col"><h4 className="serif">Reparto</h4><p>Santiago · Viña del Mar<br />Concepción · Puerto Montt</p></div>
      </div>
    </footer>
  )
}