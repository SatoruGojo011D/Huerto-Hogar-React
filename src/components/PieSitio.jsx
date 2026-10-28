import LogoMarca from './LogoMarca.jsx'

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

export default function PieSitio() {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-brand">
          <LogoMarca size={20} />
          <p>Cooperativa de pequeños productores chilenos. Cosechamos el día previo a tu entrega.</p>
        </div>
        <div className="footer-col"><ul>{navigation.map(([label, href]) => <li key={href}><a href={href}>{label}</a></li>)}</ul></div>
        <div className="footer-col"><h4 className="serif">Reparto</h4><p>Santiago · Viña del Mar<br />Concepción · Puerto Montt</p></div>
      </div>
    </footer>
  )
}