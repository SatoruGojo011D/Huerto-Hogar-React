# Pruebas unitarias

Todas las pruebas usan **Vitest** con entorno **jsdom** y **React Testing Library**, siguiendo la guía de testing del curso. Son **10 pruebas**, una por archivo. `src/testing/setup.js` limpia el DOM y `localStorage` después de cada prueba.

## Ejecución

```sh
npm test               # Vitest en modo observador
npm run test:run       # una sola ejecución
npm run test:informe   # informe de pruebas en la terminal (una línea por prueba)
npm run test:coverage  # cobertura V8: tabla en la terminal + coverage-v8/index.html
```

## Configuración (`vite.config.js`)

`globals: true`, `environment: 'jsdom'`, `setupFiles` y `coverage` con `provider: 'v8'`, `reporter: ['text', 'json', 'html']` y exclusión de `node_modules/`, `src/main.jsx`, `**/*.d.ts` y las carpetas de pruebas. El `@vitest/coverage-v8` está instalado como dependencia de desarrollo.

## Las 10 pruebas

| N° | Archivo | Qué verifica | Categoría |
| --- | --- | --- | --- |
| 1 | `aviso-temporal.test.jsx` | El Custom Hook se activa con `trigger` y se apaga solo tras la duración (`renderHook`, `act`, temporizadores simulados). | Hook, estado |
| 2 | `carga-datos.test.jsx` | Empieza cargando y entrega los datos (`fetch` simulado con `vi.fn`). | Hook, mocks |
| 3 | `control-cantidad.test.jsx` | `ControlCantidad` informa el valor siguiente y anterior al padre y deshabilita los botones en sus límites. | Props, eventos |
| 4 | `mensaje-estado.test.jsx` | `MensajeEstado` no renderiza vacío y distingue `alert` de `status`. | Renderizado condicional |
| 5 | `filtros-catalogo.test.jsx` | `FiltrosCatalogo` actualiza búsqueda, categorías y precios en un padre con `useState` y devuelve el foco al buscador (`useRef`). | Estado, eventos |
| 6 | `tarjeta-producto.test.jsx` | `TarjetaProducto` muestra precios, descuento y enlace, y llama `onAdd` con el producto. | Renderizado, props, eventos |
| 7 | `calculos-checkout.test.jsx` | IVA 19 % sobre el neto, despacho gratis desde $25.000 y validación del formulario del cliente. | Lógica |
| 8 | `pago-aprobado.test.jsx` | Con pago aprobado registra el pedido, vacía el carrito y va a la compra exitosa. | Flujo |
| 9 | `pago-rechazado.test.jsx` | Con pago rechazado conserva el carrito y va a la vista de error. | Flujo |
| 10 | `stock-critico.test.jsx` | El stock crítico lista solo 10 o menos, sin unidades y de menor a mayor. | Lógica |

Los datos de ejemplo y el padre con estado de los filtros están en `src/testing/`, no en `src/test`.

## Cobertura

La cobertura V8 mide todo `src/`. Con solo 10 pruebas enfocadas en los flujos críticos el total es bajo (cerca de 23 % de sentencias); los módulos probados están casi completos. El informe interactivo está en `coverage-v8/index.html` (verde: líneas ejecutadas; rojo: pendientes). La guía permite fijar umbrales mínimos (`thresholds`) como opción; no se activan porque el total no los alcanzaría.
