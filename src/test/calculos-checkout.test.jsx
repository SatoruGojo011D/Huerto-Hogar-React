// Lógica del checkout: despacho y validación del formulario.
import { describe, expect, test } from 'vitest'
import { calculateTotals, regions, validateCheckout } from '../js/checkout.js'

const cart = [{ id: 'FR001', nombre: 'Manzanas', precio: 1000, qty: 3 }]
const valid = { nombre: 'Ana', apellidos: 'Soto', correo: 'ana@gmail.com', calle: 'Los Olmos 123', region: 'Región de Valparaíso', comuna: 'Quilpué' }

describe('checkout', () => {
  test('suma el IVA al neto, cobra despacho bajo $25.000, lo omite desde ese monto y valida los datos del cliente', () => {
    expect(calculateTotals(cart)).toEqual({ subtotal: 3000, iva: 570, shipping: 2990, total: 6560 })
    expect(calculateTotals([{ precio: 30000, qty: 1 }]).shipping).toBe(0)

    expect(validateCheckout(valid)).toEqual({})
    const errors = validateCheckout({ ...valid, nombre: ' ', correo: 'malo', calle: '', comuna: regions['Región del Biobío'][0] })
    expect(Object.keys(errors).sort()).toEqual(['calle', 'comuna', 'correo', 'nombre'])
  })
})
