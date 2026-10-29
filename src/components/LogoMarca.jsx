// Logo de HuertoHogar (ícono de hoja y nombre) como enlace; `href` y `size` son opcionales. Se usa en la cabecera y el pie.
export default function LogoMarca({ href = '/', size = 24 }) {
  return (
    <a href={href} className="brand-logo">
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.4 19 2c1 2 2 4.1 2 9 0 4.97-4.03 9-9 9z" />
        <path d="M11 20v-5" />
      </svg>
      <span className="serif">HuertoHogar</span>
    </a>
  )
}
