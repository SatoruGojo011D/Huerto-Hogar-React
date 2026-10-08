# HuertoHogar

Tienda de productos frescos construida con React 19 y Vite. Las vistas, estilos e imágenes de la aplicación viven en `src`; las pantallas antiguas en HTML ya no son necesarias para ejecutar el sitio.

## Desarrollo

```sh
npm install
npm run dev
```

## Validación

```sh
npm run build
npm run lint
```

## Rutas

- `/` inicio
- `/catalogo` catálogo y filtros
- `/producto?id=FR001` detalle y reseñas
- `/carrito` carrito y confirmación de pedidos
- `/nosotros`, `/blog`, `/contacto`, `/seguimiento`
- `/cuenta`, `/registro`, `/perfil`
- `/admin`, `/admin/productos`, `/admin/usuarios`
- `/admin/productos/nuevo`, `/admin/productos/editar?id=ID`
- `/admin/usuarios/nuevo`, `/admin/usuarios/editar?id=ID`

## Componentes React

`src/components/` contiene exactamente diez componentes reutilizables:

- `SiteHeader`: navegación, estado de sesión y contador del carrito.
- `SiteFooter`: enlaces y datos compartidos del sitio.
- `AdminShell`: navegación y cabecera del panel administrativo.
- `ProductCard`: ficha de producto y acción de añadir al carrito.
- `CatalogFilters`: búsqueda, filtros y reinicio del catálogo.
- `FormField`: etiqueta, control y texto de ayuda de formularios.
- `QuantityControl`: stepper accesible de cantidades.
- `StatusTimeline`: etapas visuales de seguimiento de pedidos.
- `StatusMessage`: avisos accesibles de éxito o error.
- `OrderReceiptModal`: comprobante de pedido y acceso al seguimiento.

## Cuenta de demostración

- Administrador: `admin@gmail.com` / `Admin123!`
- Cliente: `cliente@hotmail.com` / `Cliente123!`

Los datos se guardan en `localStorage` para la demostración; no hay servidor ni autenticación de producción. Las especificaciones y documentos originales se conservaron en `docs/huerto-hogar/`.