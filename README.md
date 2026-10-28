# HuertoHogar

Tienda de productos frescos construida con React 19, Vite y Bootstrap 5. Las vistas, estilos e imágenes de la aplicación viven en `src`; las pantallas antiguas en HTML ya no son necesarias para ejecutar el sitio. Las páginas de inicio, catálogo y contacto usan la grilla y componentes responsivos de Bootstrap, combinados con los estilos propios de HuertoHogar.

## Desarrollo

```sh
npm install
npm run dev
```

## Validación

```sh
npm run build
npm run lint
npm run test:run      # pruebas unitarias, una sola ejecución
npm run test:informe  # informe de pruebas en la terminal
npm run test:coverage # cobertura V8 (terminal + coverage-v8/index.html)
```

Las **10 pruebas unitarias** usan **Vitest**, jsdom y React Testing Library, siguiendo la guía de testing del curso: Custom Hooks con `renderHook` y `act`, componentes (props, estado, renderizado condicional y eventos) y los flujos de compra y stock crítico. Están en `src/test` y se describen en `docs/huerto-hogar/PRUEBAS.md`. `npm test` abre Vitest en modo observador; `npm run test:coverage` genera el informe de cobertura V8 en la terminal y en `coverage-v8/index.html`.

## Hooks de React

| Hook | Dónde se usa |
| --- | --- |
| `useState` | Formularios, carrito, checkout, encabezado y la mayoría de las páginas. |
| `useEffect` (con limpieza) | `CabeceraSitio` (escucha eventos del carrito y la sesión) y `useFetch` (cancela la petición). |
| `useRef` | `FiltrosCatalogo` (devuelve el foco al buscador) y `useTransientFeedback` (temporizador). |
| `useMemo` | `CatalogPage` y `CategoriesPage` (filtrado del catálogo). |
| `useCallback` + `React.memo` | `useTransientFeedback` y `TarjetaProducto`. |
| `useReducer` | `CartPage` con `src/js/cartReducer.js` (cambiar cantidad, eliminar, vaciar). |
| Hooks personalizados | `useFetch` (`src/hooks/useFetch.js`; carga las sucursales de `public/data/sucursales.json` en Nosotros) y `useTransientFeedback`. |

## Formularios

- **Registro e inicio de sesión:** React Hook Form con esquemas de Yup (`src/js/validation.js`) conectados mediante `yupResolver`; cada campo muestra su error.
- **Checkout:** enfoque nativo de componentes controlados, con un estado único (`useState`), un manejador genérico `handleChange`, validación manual y `preventDefault` en el envío.

## Rutas

- `/` inicio
- `/catalogo` catálogo y filtros
- `/ofertas` selección de frutas y verduras con precios accesibles
- `/producto?id=FR001` detalle y reseñas
- `/carrito` carrito y confirmación de pedidos
- `/nosotros`, `/blog`, `/contacto`, `/seguimiento`
- `/cuenta`, `/registro`, `/perfil`
- `/bootstrap/alertas`, `/bootstrap/productos`, `/bootstrap/ayuda` (páginas de demostración responsivas con React Bootstrap)
- `/admin`, `/admin/productos`, `/admin/usuarios`
- `/admin/productos/nuevo`, `/admin/productos/editar?id=ID`
- `/admin/usuarios/nuevo`, `/admin/usuarios/editar?id=ID`
- `/admin/ordenes`, `/admin/productos-criticos`, `/admin/categorias`, `/admin/reportes`, `/admin/perfil`
- `/admin/usuarios/historial?id=ID` historial de compras asociado a un usuario

## Organización de páginas

Cada vista principal está en su propio archivo dentro de `src/pages/`: Inicio, Catálogo, Detalle de producto, Carrito, Nosotros, Blog, Contacto, Seguimiento, Iniciar sesión, Registro, Perfil y las vistas del panel administrativo. Las pantallas para crear y editar productos comparten `AdminProductFormPage`; las de crear y editar usuarios comparten `AdminUserFormPage`, porque cambia el modo de uso, no la estructura principal del formulario. `App.jsx` conecta las rutas con estas páginas y conserva fuera de ellas la navegación global y la protección del panel.

## Componentes React

`src/components/` contiene once componentes de interfaz, agrupados entre elementos compartidos y widgets especializados. No todos necesitan aparecer en varias páginas: los componentes de una sola vista encapsulan una pieza con comportamiento o estructura propia.

- `CabeceraSitio`: navegación, estado de sesión y contador del carrito.
- `LogoMarca`: logo de la marca, reutilizado en la cabecera y el pie de página.
- `PieSitio`: enlaces y datos compartidos del sitio.
- `PanelAdmin`: marco que comparten las rutas del panel administrativo.
- `TarjetaProducto`: plantilla de una ficha; inicio y catálogo crean una instancia por producto y reciben la acción de compra desde la página, sin escribir directamente en el almacenamiento.
- `FiltrosCatalogo`: grupo de búsqueda y filtros con estado coordinado del catálogo.
- `CampoFormulario`: etiqueta, control y ayuda, repetidos en formularios de distintas páginas.
- `ControlCantidad`: control de cantidad usado en detalle y carrito.
- `LineaTiempoEstado`: etapas visuales del estado de un pedido.
- `MensajeEstado`: aviso accesible compartido por varios flujos.
- `TablaProductosPedido`: tabla de productos de un pedido, usada en el checkout y en las vistas de compra exitosa y con error.

`src/js/` reúne los módulos JavaScript reutilizables de la aplicación, separados por responsabilidad: `products.js` contiene el catálogo base e imágenes, `storage.js` gestiona persistencia de sesión/carrito/pedidos, `format.js` contiene el formateo de precios y `useTransientFeedback.js` controla los avisos temporales del carrito. Las páginas y componentes React con JSX permanecen organizados en `src/pages/` y `src/components/`; la configuración de Vite se mantiene en la raíz y las pruebas en `src/test/`.

## Cuenta de demostración

- Administrador: `admin@gmail.com` / `Admin123!`
- Cliente: `cliente@hotmail.com` / `Cliente123!`

Los datos se guardan en `localStorage` para la demostración; no hay servidor ni autenticación de producción. Las especificaciones y documentos originales se conservaron en `docs/huerto-hogar/`.