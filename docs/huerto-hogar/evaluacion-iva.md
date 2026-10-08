# ¿Cómo agregar el IVA?

Cuando un profesor te pregunta: **"agregame el iva"**, lo que normalmente quiere decir es que a un precio base le debes sumar un porcentaje de IVA. En Chile, por ejemplo, el IVA es 19%.

## Fórmula

La fórmula general es:

```text
precio con IVA = precio sin IVA * (1 + iva)
```

Si el IVA es 19%, entonces:

```text
precio con IVA = precio sin IVA * 1.19
```

---

## Ejemplo sencillo

Supongamos que un producto cuesta $100.000 sin IVA.

### Cálculo:

```text
100000 * 1.19 = 119000
```

Esto significa que:

- Precio sin IVA: $100.000
- IVA: $19.000
- Total con IVA: $119.000

---

## Cómo hacerlo en JavaScript

```javascript
function agregarIVA(precio, porcentajeIva = 0.19) {
  const total = precio * (1 + porcentajeIva);
  return total;
}

const precioSinIva = 100000;
const totalConIva = agregarIVA(precioSinIva);

console.log("Precio sin IVA:", precioSinIva);
console.log("Total con IVA:", totalConIva);
```

### Resultado en consola:

```text
Precio sin IVA: 100000
Total con IVA: 119000
```

---

## También se puede calcular así

```javascript
const precioSinIva = 1500;
const iva = 0.19;
const total = precioSinIva + (precioSinIva * iva);

console.log(total);
```

### Resultado:

```text
1785
```

Porque:

```text
1500 + (1500 * 0.19) = 1500 + 285 = 1785
```

---

## Explicación breve para responder en clase

Si me preguntaran: **"agregame el iva"**, yo diría:

> Para agregar el IVA a un precio, se multiplica el valor por 1 más el porcentaje del IVA. Por ejemplo, si el precio es $100.000 y el IVA es 19%, entonces $100.000 x 1.19 = $119.000.

---

## Ejemplo aplicado a un carrito o producto

```javascript
const subtotal = 25000;
const iva = 0.19;
const total = subtotal * (1 + iva);

console.log(`El total con IVA es: $${total}`);
```

### Resultado:

```text
El total con IVA es: $29750
```

---

## Conclusión

Agregar el IVA es sencillo:

- Se toma el precio base.
- Se multiplica por el porcentaje de IVA.
- Se suma al precio original.

La forma más práctica es:

```javascript
const total = precio * 1.19;
```

si el IVA es del 19%.

Esto es lo que normalmente se usa en proyectos web, tiendas online y cálculo de precios.
