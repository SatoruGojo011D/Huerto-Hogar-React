// Tabla de solo lectura con los productos de un pedido (imagen, nombre, precio, cantidad, subtotal). Se usa en el checkout y en la boleta.
import { formatPrice } from '../js/format.js'
import { resolveProductImage } from '../js/products.js'

export default function TablaProductosPedido({ items }) {
  return (
    <div className="table-responsive">
      <table className="table align-middle">
        <thead><tr><th>Imagen</th><th>Nombre</th><th>Precio</th><th>Cantidad</th><th>Subtotal</th></tr></thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td><img src={resolveProductImage(item.imagen)} alt="" width="48" height="48" /></td>
              <td>{item.nombre}</td>
              <td>{formatPrice(item.precio)}</td>
              <td>{item.qty}</td>
              <td>{formatPrice(item.precio * item.qty)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
