// Reductor del carrito: concentra los cambios posibles del estado en acciones con nombre.
export function cartReducer(cart, accion) {
  switch (accion.tipo) {
    case 'cambiar_cantidad':
      return cart.map((item) => (item.id === accion.id ? { ...item, qty: accion.qty } : item))
    case 'eliminar':
      return cart.filter((item) => item.id !== accion.id)
    case 'vaciar':
      return []
    default:
      throw new Error(`Acción desconocida: ${accion.tipo}`)
  }
}
