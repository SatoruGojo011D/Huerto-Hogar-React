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
npm test
```

La carpeta `src/test/` contiene 10 pruebas unitarias independientes, una por archivo, para almacenamiento, catálogo, sesiones y carrito. Por ejemplo, verifica que el carrito normalice precios y cantidades inválidos antes de usarlos, y que agregar un producto existente incremente su cantidad en lugar de crear una línea duplicada.

## Rutas

- `/` inicio
- `/catalogo` catálogo y filtros
- `/producto?id=FR001` detalle y reseñas
- `/carrito` carrito y confirmación de pedidos
- `/nosotros`, `/blog`, `/contacto`, `/seguimiento`
- `/cuenta`, `/registro`, `/perfil`
- `/bootstrap/alertas`, `/bootstrap/productos`, `/bootstrap/ayuda` (páginas de demostración responsivas con React Bootstrap)
- `/admin`, `/admin/productos`, `/admin/usuarios`
- `/admin/productos/nuevo`, `/admin/productos/editar?id=ID`
- `/admin/usuarios/nuevo`, `/admin/usuarios/editar?id=ID`

## Organización de páginas

Cada vista principal está en su propio archivo dentro de `src/pages/`: Inicio, Catálogo, Detalle de producto, Carrito, Nosotros, Blog, Contacto, Seguimiento, Iniciar sesión, Registro, Perfil y las vistas del panel administrativo. Las pantallas para crear y editar productos comparten `AdminProductFormPage`; las de crear y editar usuarios comparten `AdminUserFormPage`, porque cambia el modo de uso, no la estructura principal del formulario. `App.jsx` conecta las rutas con estas páginas y conserva fuera de ellas la navegación global y la protección del panel.

## Componentes React

`src/components/` contiene diez componentes de interfaz, agrupados entre elementos compartidos y widgets especializados. No todos necesitan aparecer en varias páginas: los componentes de una sola vista encapsulan una pieza con comportamiento o estructura propia.

- `SiteHeader`: navegación, estado de sesión y contador del carrito.
- `SiteFooter`: enlaces y datos compartidos del sitio.
- `AdminShell`: marco que comparten las rutas del panel administrativo.
- `ProductCard`: plantilla de una ficha; inicio y catálogo crean una instancia por producto y reciben la acción de compra desde la página, sin escribir directamente en el almacenamiento.
- `CatalogFilters`: grupo de búsqueda y filtros con estado coordinado del catálogo.
- `FormField`: etiqueta, control y ayuda, repetidos en formularios de distintas páginas.
- `QuantityControl`: control de cantidad usado en detalle y carrito.
- `StatusTimeline`: etapas visuales del estado de un pedido.
- `StatusMessage`: aviso accesible compartido por varios flujos.
- `OrderReceiptModal`: comprobante autocontenido que aparece al confirmar una compra.

`src/js/` reúne los módulos JavaScript reutilizables de la aplicación, separados por responsabilidad: `products.js` contiene el catálogo base e imágenes, `storage.js` gestiona persistencia de sesión/carrito/pedidos, `format.js` contiene el formateo de precios y `useTransientFeedback.js` controla los avisos temporales del carrito. Las páginas y componentes React con JSX permanecen organizados en `src/pages/` y `src/components/`; la configuración de Vite se mantiene en la raíz y las pruebas en `src/test/`.

## Cuenta de demostración

- Administrador: `admin@gmail.com` / `Admin123!`
- Cliente: `cliente@hotmail.com` / `Cliente123!`

Los datos se guardan en `localStorage` para la demostración; no hay servidor ni autenticación de producción. Las especificaciones y documentos originales se conservaron en `docs/huerto-hogar/`.