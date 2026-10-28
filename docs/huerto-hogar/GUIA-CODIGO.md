# Guía de código de HuertoHogar

Esta guía describe la versión activa del proyecto: una tienda construida con React, Vite y Bootstrap. Incluye el propósito de los archivos, la ubicación de páginas y componentes en la interfaz, y los comandos para ejecutar, probar y medir la cobertura del código.

> **Alcance:** por decisión del usuario, esta entrega documenta los archivos en esta guía y no agrega comentarios dentro de los archivos fuente. Las carpetas generadas, como `coverage/`, se explican como reportes; no son código que se deba editar.

## 1. Arquitectura general

1. `index.html` aporta el elemento raíz `#root` y carga `src/main.jsx`.
2. `src/main.jsx` crea la raíz de React, carga Bootstrap y monta `<App />`.
3. `src/App.jsx` selecciona la página según `window.location.pathname`, incorpora la cabecera y el pie de página públicos y protege las rutas administrativas.
4. Las vistas están en `src/pages/`; las piezas reutilizables de interfaz, en `src/components/`.
5. `src/js/` contiene el catálogo, persistencia del navegador, formato de datos, validación y lógica auxiliar.
6. Las hojas de `src/styles/`, `src/App.css` y `src/index.css` definen la apariencia.

La aplicación usa rutas propias basadas en la ruta del navegador, no `react-router-dom`. Los enlaces normales cambian de página y `App.jsx` vuelve a elegir el componente correspondiente. Algunas vistas leen parámetros de consulta, por ejemplo `/producto?id=FR001`.

Los datos de demostración se guardan en `localStorage`. No hay un servidor de aplicación ni una autenticación de producción; por tanto, los datos y las credenciales del proyecto son solamente para la demostración local.

## 2. Ejecutar la aplicación

Abre una terminal en la carpeta raíz del proyecto, donde está `package.json`:

```bash
npm install
npm run dev
```

Vite mostrará la dirección local (normalmente `http://localhost:5173/`). Ábrela en el navegador. El servidor de desarrollo actualiza la página cuando se guardan cambios.

Comandos adicionales:

```bash
npm run build     # genera la versión de producción en dist/
npm run preview   # sirve localmente la última compilación
npm run lint      # revisa el código con oxlint
npm test          # ejecuta Vitest
npm test              # Vitest en modo observador
npm run test:run      # una sola ejecución
npm run test:informe  # informe de pruebas en la terminal
npm run test:coverage # cobertura V8 (terminal + HTML)
```

`npm run preview` se ejecuta después de `npm run build`.

**Windows PowerShell:** si aparece un error indicando que la ejecución de `npm.ps1` está deshabilitada, usa `npm.cmd` en lugar de `npm` (por ejemplo, `npm.cmd run dev` o `npm.cmd test`). No hace falta cambiar la política de ejecución de PowerShell.

## 3. Pruebas y cobertura V8

El proyecto ya incluye `vitest` y el proveedor `@vitest/coverage-v8`. Para ejecutar las pruebas de Vitest con cobertura V8 y guardar el reporte en una carpeta separada:

```bash
npm test -- --coverage.enabled --coverage.provider=v8 --coverage.reportsDirectory=coverage-v8
```

Al terminar, abre `coverage-v8/index.html` para consultar el reporte navegable. También se muestra un resumen en la terminal. Si se omite `--coverage.reportsDirectory=coverage-v8`, Vitest usa `coverage/` como carpeta predeterminada; en este repositorio ya hay archivos de reporte allí, por eso se recomienda la carpeta separada.

Todas las pruebas corren en Vitest, siguiendo la guía de testing del curso (`npm run test:coverage` escribe el reporte en `coverage-v8/`).

La cobertura indica qué partes del código alcanzan las pruebas ejecutadas. En la última ejecución, Vitest pasó **10/10 pruebas en 10 archivos** y V8 registró **23 % de sentencias, 17,8 % de ramas, 26,19 % de funciones y 24,3 % de líneas sobre todo `src/`**: el total es bajo porque se priorizaron los flujos críticos y hay muchas páginas sin pruebas.

## 4. Entrada de la aplicación y estilos globales

| Archivo | Responsabilidad y relación con la página |
| --- | --- |
| `index.html` | Documento HTML de Vite: idioma, metadatos, favicon, contenedor `#root` y carga de `src/main.jsx`. No contiene las páginas React. |
| `src/main.jsx` | Punto de entrada React. Importa Bootstrap, `src/index.css` y `App.jsx`, y renderiza la aplicación en `#root` dentro de `StrictMode`. |
| `src/App.jsx` | Mapa de rutas públicas y administrativas, títulos de pestaña, inicialización de usuarios de demostración, protección del panel, página 404 y composición de cabecera/pie. |
| `src/index.css` | Reglas globales para tipografía, color base, ancho mínimo y altura de `#root`. |
| `src/App.css` | Ajustes transversales y adaptables: cabecera, acciones de sesión y carrito, tarjetas del catálogo, detalle de producto, mensajes, cantidades, reseñas y modales. Complementa las hojas temáticas. |

### Composición y protección de rutas

- En páginas públicas, `App.jsx` dibuja `CabeceraSitio`, la página seleccionada y `PieSitio`.
- En rutas que empiezan por `/admin`, `ProtectedAdmin` comprueba que la sesión tenga el rol `admin`; si no, redirige a `/cuenta`. Las páginas administrativas se muestran dentro de `PanelAdmin`.
- Si la ruta no existe, se muestra la vista 404 entre la cabecera y el pie.
- `App.jsx` también establece el título del documento y llama a `ensureSeedUsers()` para preparar las cuentas de demostración.

## 5. Páginas: archivo y ubicación en el sitio

Cada archivo de esta tabla está dentro de `src/pages/`. La ruta se define en `src/App.jsx`.

| Archivo | Ruta | Qué muestra y dónde aparece |
| --- | --- | --- |
| `HomePage.jsx` | `/` | Página de inicio: sección principal/hero y selección de productos destacados. |
| `CatalogPage.jsx` | `/catalogo` | Catálogo con búsqueda, filtros y resultados en tarjetas de productos. |
| `OffersPage.jsx` | `/ofertas` | Productos con descuento y contenido de ofertas. |
| `ProductDetailPage.jsx` | `/producto?id=...` | Ficha individual: imagen, datos, precio, cantidad, compra y contenido propio del producto. |
| `CartPage.jsx` | `/carrito` | Carrito, cantidades, resumen de compra y flujo de confirmación con comprobante. |
| `AboutPage.jsx` | `/nosotros` | Historia, misión, visión, compromiso, redes y selección de sucursal/mapa. |
| `BlogPage.jsx` | `/blog` | Listado de artículos y lectura del artículo seleccionado. |
| `ContactPage.jsx` | `/contacto` | Datos y formulario de contacto. |
| `TrackingPage.jsx` | `/seguimiento` | Búsqueda de pedido y visualización de sus etapas de entrega. |
| `LoginPage.jsx` | `/cuenta` | Formulario de inicio de sesión. |
| `RegisterPage.jsx` | `/registro` | Formulario para crear una cuenta de cliente. |
| `ProfilePage.jsx` | `/perfil` y `/admin/perfil` | Datos y edición del perfil; `adminMode` adapta su uso desde el panel. |
| `AdminDashboardPage.jsx` | `/admin` | Resumen y cifras principales del panel administrativo. |
| `AdminOrdersPage.jsx` | `/admin/ordenes` | Tabla/listado de órdenes, datos del cliente y estado de pedidos. |
| `AdminProductsPage.jsx` | `/admin/productos` | Administración del catálogo: listado y acciones sobre productos. |
| `AdminProductFormPage.jsx` | `/admin/productos/nuevo`, `/admin/productos/editar?id=...` | Formulario compartido para crear y editar productos, con categoría, precio, descuento, stock e imagen. |
| `AdminCriticalProductsPage.jsx` | `/admin/productos-criticos` | Productos cuyo stock se considera crítico (10 o menos). |
| `AdminCategoriesPage.jsx` | `/admin/categorias` | Consulta y edición de categorías usadas para clasificar productos. |
| `AdminUsersPage.jsx` | `/admin/usuarios` | Administración y listado de cuentas de usuario. |
| `AdminUserFormPage.jsx` | `/admin/usuarios/nuevo`, `/admin/usuarios/editar?id=...` | Formulario compartido para crear y editar usuarios. |
| `AdminUserHistoryPage.jsx` | `/admin/usuarios/historial?id=...` | Historial de compras asociado a un usuario. |
| `AdminReportsPage.jsx` | `/admin/reportes` | Resúmenes e informes de ventas del panel. |
| `Pag1Bootstrap.jsx` | `/bootstrap/alertas` | Página de demostración de alertas y botones de React Bootstrap. |
| `Pag2Bootstrap.jsx` | `/bootstrap/productos` | Página de demostración de productos con React Bootstrap. |
| `Pag3Bootstrap.jsx` | `/bootstrap/ayuda` | Página de demostración de contenido de ayuda con React Bootstrap. |

Las rutas administrativas comparten la estructura visual de `PanelAdmin`; las dos rutas de formulario reutilizan el mismo componente con una propiedad `edit` para distinguir creación y edición.

## 6. Componentes reutilizables: qué hace cada uno, sus parámetros y dónde se usa

Todos están en `src/components/`. Cada componente resuelve una pieza de interfaz para que las páginas no repitan su implementación. En React, los **parámetros** de un componente se llaman **props** (propiedades): son los datos o funciones que el componente padre le entrega al hijo, por ejemplo `<ControlCantidad value={2} onChange={...} />`.

### 6.1 Resumen: ¿cuáles componentes reciben parámetros?

| Componente | ¿Recibe props? | Props | Dónde se le pasan |
| --- | --- | --- | --- |
| `CabeceraSitio` | Sí | `active` | `src/App.jsx` (líneas 117-119) |
| `LogoMarca` | Sí | `href`, `size` | `CabeceraSitio.jsx` (sin props, usa los valores por defecto) y `PieSitio.jsx` (`size={20}`) |
| `PieSitio` | **No** | — | Se usa en `src/App.jsx` (líneas 117-119) sin parámetros |
| `PanelAdmin` | Sí | `title`, `children` | `src/App.jsx` (línea 95) |
| `TarjetaProducto` | Sí | `product`, `featured`, `onAdd` | `HomePage.jsx`, `CatalogPage.jsx`, `CategoriesPage.jsx`, `OffersPage.jsx` |
| `FiltrosCatalogo` | Sí | `categories`, `setCategories`, `prices`, `setPrices`, `search`, `setSearch` | `CatalogPage.jsx` (línea 29) |
| `CampoFormulario` | Sí | `id`, `label`, `children`, `help`, `error`, `className` y cualquier atributo de `<input>` | `LoginPage`, `RegisterPage`, `ProfilePage`, `ContactPage`, `TrackingPage`, `CheckoutPage` |
| `ControlCantidad` | Sí | `value`, `onChange`, `label`, `min`, `max` | `CartPage.jsx` (línea 36) y `ProductDetailPage.jsx` (línea 57) |
| `TablaProductosPedido` | Sí | `items` | `CheckoutPage.jsx` (línea 60) y `PurchaseResultPage.jsx` (línea 17) |
| `MensajeEstado` | Sí | `children`, `variant`, `className` | `LoginPage`, `RegisterPage`, `CartPage`, `CheckoutPage`, `ContactPage`, `TrackingPage`, `AdminUsersPage`, `AdminUserFormPage` |
| `LineaTiempoEstado` | Sí | `status` | `TrackingPage.jsx` |

El único componente sin parámetros es `PieSitio`: su contenido es fijo (enlaces y texto de la cooperativa).

### 6.2 Descripción detallada de cada componente

#### `CabeceraSitio` (`CabeceraSitio.jsx`)
- **Qué hace:** dibuja la cabecera de todas las páginas públicas: logo, menú principal (Inicio, Catálogo, Categorías, Ofertas, Nosotros, Blog, Contacto, Seguimiento), enlace «Mi cuenta» si no hay sesión, «Panel admin» si la sesión es de administrador, saludo «Hola, nombre», botón «Salir» y el ícono de carrito con contador y total.
- **Estado interno:** `cartCount`, `cartTotal` y `session` (`useState`). Un `useEffect` escucha los eventos `storage`, `hh:cart-change` y `hh:session-change` y vuelve a leer el estado; al desmontarse quita los oyentes para no dejar fugas.
- **Props:** `active` (texto, por defecto `''`): la ruta de la página actual; el enlace cuyo `href` coincide recibe la clase `active` (se resalta). `App.jsx` la calcula y la pasa: `<CabeceraSitio active={active} />`.
- **Se muestra:** en la parte superior de todas las vistas públicas (no en el panel admin).

#### `LogoMarca` (`LogoMarca.jsx`)
- **Qué hace:** muestra el ícono de hoja (SVG decorativo con `aria-hidden`) y el nombre «HuertoHogar» dentro de un enlace.
- **Props:** `href` (por defecto `'/'`): destino del enlace; `size` (por defecto `24`): ancho y alto del ícono en píxeles.
- **Se muestra:** en `CabeceraSitio` (tamaño normal) y en `PieSitio` con `size={20}`.

#### `PieSitio` (`PieSitio.jsx`)
- **Qué hace:** pie de página con el logo, una frase de la cooperativa, la lista de enlaces de navegación (incluidas las páginas de demostración Bootstrap) y las ciudades de reparto.
- **Props:** ninguna. Los enlaces están en un arreglo `navigation` dentro del archivo y se recorren con `map`.
- **Se muestra:** al final de todas las vistas públicas y de la página 404.

#### `PanelAdmin` (`PanelAdmin.jsx`)
- **Qué hace:** esqueleto del panel de administración: barra lateral con la navegación (Dashboard, Órdenes, Productos, Stock crítico, Categorías, Usuarios, Reportes, Perfil), enlace a la tienda, botón «Cerrar sesión», y la zona principal con el título y el nombre de quien inició sesión. Marca como activo el ítem de la ruta actual (y también «Productos»/«Usuarios» cuando se está en sus subrutas, como `/admin/productos/nuevo`).
- **Props:** `title` (texto del encabezado `<h1>`) y `children` (la página administrativa que se coloca en el área de contenido). `App.jsx` lo usa así: `<PanelAdmin title={title}><Page /></PanelAdmin>`.
- **Se muestra:** envolviendo todas las rutas que empiezan por `/admin`, solo si `ProtectedAdmin` confirmó el rol `admin`.

#### `TarjetaProducto` (`TarjetaProducto.jsx`)
- **Qué hace:** tarjeta de un producto: imagen enlazada a `/producto?id=...`, insignia de descuento (`-10%`) cuando `discountPercent > 0`, nombre, precio (tachado el original y destacado el rebajado), unidad y, en la versión normal, stock y origen. El botón añade el producto al carrito y cambia a «✓ Añadido» durante un segundo gracias al hook `useTransientFeedback`. Está envuelto en `memo` para no redibujarse si sus props no cambian.
- **Props:**
  - `product` (objeto obligatorio): `id`, `name`, `image`, `price`, `discountedPrice`, `discountPercent`, `unit`, `stock`, `origin`.
  - `featured` (booleano, por defecto `false`): `true` usa el diseño de «destacado» (sin stock ni superposición «Ver detalles», botón «Añadir al Carrito»).
  - `onAdd` (función): callback que la tarjeta ejecuta con el producto; la tarjeta no escribe el carrito ella misma, lo delega al padre.
- **Se muestra:** `HomePage` (con `featured` y `onAdd={addCartItem}`), `CatalogPage`, `CategoriesPage` y `OffersPage` (versión normal con `onAdd={addCartItem}`).

#### `FiltrosCatalogo` (`FiltrosCatalogo.jsx`)
- **Qué hace:** panel lateral con un buscador de texto, casillas de categoría (frutas, verduras, orgánicos, lácteos) y casillas de rango de precio (menos de $1.000, entre $1.000 y $3.000, más de $3.000), más el botón «Limpiar filtros», que vacía todo y devuelve el foco al buscador usando `useRef`. No guarda los filtros por sí mismo: es un componente **controlado**.
- **Props:** `categories` y `prices` (arreglos con los valores marcados), `search` (texto) y sus funciones de cambio `setCategories`, `setPrices` y `setSearch`. Marcar o desmarcar una casilla agrega o quita el valor del arreglo mediante la función interna `toggle`.
- **Se muestra:** en la columna izquierda de `/catalogo`; `CatalogPage.jsx` mantiene el estado y filtra los productos con él.

#### `CampoFormulario` (`CampoFormulario.jsx`)
- **Qué hace:** representa un campo de formulario completo y accesible: una etiqueta `<label>` vinculada al control mediante `htmlFor`/`id`, el control en sí, un texto de ayuda opcional (`<small class="texto-ayuda">`) y un mensaje de error opcional (`role="alert"`). Si no recibe `children`, crea por sí mismo un `<input>`; si recibe `children` (por ejemplo un `<select>` o `<textarea>`), dibuja ese control en su lugar. Cuando hay error agrega `aria-invalid="true"` y `aria-describedby` apuntando al mensaje, para que los lectores de pantalla lo anuncien.
- **Props:** `id` (identificador que une etiqueta y control), `label` (texto de la etiqueta), `children` (control personalizado, opcional), `help` (ayuda), `error` (mensaje de error), `className` (clase del input) y `...inputProps`: cualquier otro atributo (`name`, `type`, `value`, `onChange`, `required`, `autoComplete`, etc.) se reenvía directamente al `<input>`.
- **Se muestra:** `LoginPage` y `RegisterPage` (con `error` y los métodos de React Hook Form), `ProfilePage`, `ContactPage`, `TrackingPage` y `CheckoutPage` (aquí también como envoltorio de `<select>` y `<textarea>`).

#### `ControlCantidad` (`ControlCantidad.jsx`)
- **Qué hace:** selector de cantidad con botón «−», valor (en un `<output>` con `aria-live`) y botón «+». Antes de avisar al padre limita el número entre `min` y `max` y trata valores no numéricos como `min`. Deshabilita «−» al llegar al mínimo y «+» al llegar al máximo. Es **controlado**: no guarda la cantidad; la muestra tal como el padre la entrega.
- **Props:** `value` (cantidad actual), `onChange` (función que recibe el nuevo valor), `label` (por defecto `'Cantidad'`; se usa en el `aria-label` de los botones: «Aumentar cantidad»), `min` (por defecto `1`) y `max` (por defecto `999`).
- **Se muestra:** en cada línea de `/carrito` (con `label="Cantidad de <producto>"` y un `onChange` que despacha `cambiar_cantidad`) y en el detalle del producto (`onChange={setQuantity}`).

#### `TablaProductosPedido` (`TablaProductosPedido.jsx`)
- **Qué hace:** tabla de solo lectura con las columnas imagen, nombre, precio, cantidad y subtotal (precio × cantidad) de cada producto. Resuelve la imagen con `resolveProductImage` y da formato de pesos con `formatPrice`.
- **Props:** `items` (arreglo de líneas del pedido con `id`, `nombre`, `precio`, `qty` e `imagen`).
- **Se muestra:** en el resumen de `CheckoutPage` (el carrito a pagar) y en `PurchaseResultPage` (el detalle del pedido tras la compra).

#### `MensajeEstado` (`MensajeEstado.jsx`)
- **Qué hace:** muestra un mensaje breve de estado accesible. **No renderiza nada** si no recibe contenido. Con `variant="error"` usa `role="alert"` y `aria-live="assertive"` (se anuncia de inmediato); con cualquier otra variante, como `success`, usa `role="status"` y `aria-live="polite"` (se anuncia sin interrumpir).
- **Props:** `children` (el texto del mensaje), `variant` (por defecto `'error'`) y `className` (clases adicionales).
- **Se muestra:** debajo de los formularios y acciones: login, registro, carrito, checkout, contacto, seguimiento y administración de usuarios.

#### `LineaTiempoEstado` (`LineaTiempoEstado.jsx`)
- **Qué hace:** línea de tiempo de cuatro pasos (Confirmado, En preparación, En camino, Entregado). Convierte `status` en un entero entre 0 y 4, marca como activos los pasos anteriores o iguales a ese número y pone `aria-current="step"` en el último alcanzado.
- **Props:** `status` (número del 0 al 4, por defecto `0`; los valores inválidos se tratan como 0).
- **Se muestra:** en `/seguimiento` (`TrackingPage.jsx`), bajo el buscador de pedidos.

### 6.3 Hooks personalizados que apoyan a los componentes (`src/hooks/`)

| Hook | Parámetro | Qué devuelve y dónde se usa |
| --- | --- | --- |
| `useTransientFeedback(duration = 1000)` | `duration`: milisegundos que dura el estado activo | `{ isActive, trigger }`. `trigger()` activa el estado y lo apaga solo tras `duration`; limpia el temporizador al desmontar. Lo usan `TarjetaProducto` y `ProductDetailPage` para el «✓ Añadido». |
| `useFetch(url)` | `url`: dirección a consultar | `{ data, loading, error }`. Pide la URL con `fetch` y cancela con `AbortController` si el componente se desmonta o cambia la URL. Lo usa `AboutPage` para cargar `/data/sucursales.json`. |

## 7. Lógica y datos (`src/js/`)

| Archivo | Responsabilidad |
| --- | --- |
| `products.js` | Catálogo inicial de productos e imágenes importadas; resuelve imágenes de productos administrados y normaliza/calcula descuentos y precios finales. |
| `storage.js` | Lectura y escritura de `localStorage`, saneamiento básico de valores recuperados, cuentas de demostración, sesión, usuarios, pedidos, carrito y combinación de productos del catálogo base con los administrados. También emite eventos para sincronizar la interfaz. |
| `adminData.js` | Funciones y opciones de datos usadas por el panel, como productos, categorías e imágenes disponibles en el formulario. |
| `format.js` | Formateo de valores monetarios para mostrarlos como precios en pesos chilenos. |
| `delivery.js` | Cálculo de la fecha mínima disponible para coordinar una entrega. |
| `validation.js` | Reglas reutilizables de validación, incluida la expresión de correo aceptada por los formularios. |
| `src/hooks/useTransientFeedback.js` | Hook que activa temporalmente una confirmación visual después de una acción, como añadir un producto. |

### Persistencia de demostración

`storage.js` usa claves de `localStorage` para usuarios (`usuarios_huerto`), pedidos (`hh_pedidos`), sesión (`sesion_activa`) y carrito (`hh_carrito`, junto con su contador). La interfaz notifica cambios del carrito y sesión mediante eventos del navegador para que la cabecera pueda refrescarse. La persistencia local sirve para probar el flujo, pero no reemplaza una API o una base de datos.

## 8. Flujo de compra: qué ocurre al comprar

El recorrido de compra conecta las páginas, los componentes reutilizables y las funciones de almacenamiento. Se puede explicar así:

1. **Elegir un producto.** En el inicio, el catálogo y las ofertas se muestran tarjetas `TarjetaProducto`. La tarjeta recibe el producto y la función `addCartItem` por la propiedad `onAdd`. En el detalle (`/producto?id=...`), la página obtiene el producto del catálogo, permite elegir unidades con `ControlCantidad` y llama directamente a `addCartItem`.
2. **Añadirlo al carrito.** `addCartItem` (`src/js/storage.js`) lee el carrito guardado con `getCart()`. Si el mismo identificador ya está, suma la cantidad; si no, crea una línea con identificador, nombre, precio vigente, imagen y cantidad. El precio usa el valor con descuento cuando existe. Luego `saveCart()` guarda el carrito en `hh_carrito`, recalcula el total de unidades en `hh_carrito_cantidad` y emite `hh:cart-change`.
3. **Actualizar el indicador de la cabecera.** `CabeceraSitio` (`src/components/CabeceraSitio.jsx`) obtiene el total con `getItemCount()` y escucha `hh:cart-change` (además del evento `storage`). Por eso el número junto al ícono de carrito refleja la suma de unidades, no la cantidad de líneas distintas. El ícono es un enlace a `/carrito`; `App.jsx` asocia esa ruta con `CartPage`.
4. **Revisar y editar el pedido.** `CartPage` carga las líneas con `getCart()`. `ControlCantidad` permite modificar cada cantidad y el botón de eliminar quita esa línea; ambas acciones llaman a `updateCart()`, que actualiza el estado de React y persiste el resultado mediante `saveCart()`. El subtotal es la suma de precio por cantidad. El despacho cuesta `$2.990 CLP` cuando el subtotal es menor a `$25.000 CLP`; desde ese umbral es gratis. El total mostrado suma subtotal y despacho.
5. **Elegir fecha de entrega.** El campo de fecha conserva su valor en `hh_fecha_entrega`, y `getMinimumDeliveryDate()` establece hoy como fecha mínima seleccionable. Esa fecha se muestra como dato del pedido; en el código actual no es una condición obligatoria para confirmar.
6. **Confirmar.** Al pulsar **Confirmar pedido**, `confirmOrder()` comprueba que haya al menos un producto. Si el carrito está vacío, presenta un mensaje y no registra nada. Si tiene productos, crea el pedido con un código `HH-` y cinco dígitos, fecha de creación, fecha de entrega (o “Fecha por confirmar”), líneas, subtotal, despacho, total, estado inicial y, si hay una sesión, sus datos de cliente. Guarda el pedido más reciente en `hh_ultimo_pedido`, lo agrega al comienzo de `hh_pedidos` y vacía el carrito con `saveCart([])`.
7. **Pagar, mostrar la boleta y permitir seguimiento.** `CartPage` lleva a `/checkout`; `CheckoutPage` valida los datos, simula el pago y guarda el pedido (`js/checkout.js`). `PurchaseResultPage` muestra la compra exitosa con boleta (o el error con opción de reintentar) y su enlace **Ver seguimiento** abre `/seguimiento?codigo=...`. `TrackingPage` busca el código en `hh_pedidos` y representa el estado con `LineaTiempoEstado`.

**Importante para explicarlo con precisión:** este proyecto registra un pedido de demostración en el almacenamiento local del navegador. No procesa un pago real, no envía el pedido a un servidor y no descuenta ni valida inventario al confirmar. El botón dice “Confirmar pedido”, pero no está conectado a una pasarela de pago.

## 9. Conexiones entre controles y código

| Control o acción visible | Con qué está conectado | Resultado |
| --- | --- | --- |
| Ícono/botón de carrito en la cabecera | Enlace `href="/carrito"` de `CabeceraSitio` → ruta `/carrito` en `App.jsx` → `CartPage` | Abre el carrito. El contador consulta `getItemCount()` y se actualiza al recibir `hh:cart-change`. |
| “Añadir” en una tarjeta de producto | `TarjetaProducto` → propiedad `onAdd` → `addCartItem()` | Agrega una unidad o aumenta la cantidad de ese producto; muestra una confirmación visual temporal. |
| “Añadir al Carrito” en la ficha | `ProductDetailPage` → `ControlCantidad` + `addCartItem(displayProduct, quantity)` | Agrega al carrito la cantidad seleccionada. |
| Filtros y búsqueda del catálogo | `FiltrosCatalogo` → estado de `CatalogPage` → filtrado de `getCatalogProducts()` | Cambia los productos visibles por categoría, rango de precio o texto. |
| Botones `+` y `−` del carrito | `ControlCantidad` → `onChange` de `CartPage` → `updateCart()` → `saveCart()` | Cambia unidades, subtotal, despacho, total y contador de la cabecera. El rango permitido es de 1 a 999 unidades por línea. |
| Botón de eliminar del carrito | Acción en `CartPage` → `updateCart()` → `saveCart()` | Quita el producto y recalcula los importes y el contador. |
| Campo “Fecha de entrega” del carrito | Estado `delivery` de `CartPage` → `writeStorage('hh_fecha_entrega', ...)` | Conserva la fecha elegida en el navegador para mostrarla al crear el pedido. |
| “Confirmar pedido” | `CartPage.confirmOrder()` → `createOrder()` → `writeStorage()` | Registra el pedido localmente, vacía el carrito y abre el comprobante; no cobra. |
| “Ver seguimiento” del comprobante | Enlace a `/seguimiento?codigo=...` → `TrackingPage` → `getOrders()` | Consulta el pedido por su código y muestra su etapa. |
| “Salir” | `CabeceraSitio.logout()` → elimina `sesion_activa` → evento `hh:session-change` | Cierra la sesión local, actualiza la cabecera y vuelve al inicio. |

### Respuesta modelo para una evaluación oral

> “El proceso empieza cuando añado un producto desde una tarjeta o desde su detalle. Ambos caminos llaman a `addCartItem` de `storage.js`, que identifica el producto por su ID: si ya estaba, aumenta su cantidad; si no, crea una línea con el precio vigente y sus datos. `saveCart` persiste el carrito en `localStorage`, guarda el total de unidades y emite un evento. La cabecera escucha ese evento y actualiza el contador. El ícono del carrito es un enlace a `/carrito`, ruta que `App.jsx` conecta con `CartPage`. Allí puedo cambiar cantidades o eliminar productos; cada cambio se vuelve a guardar, y la página calcula subtotal, despacho y total. Al confirmar, se valida que el carrito no esté vacío, se construye y guarda el pedido, se vacía el carrito y aparece el comprobante. Desde ese comprobante paso el código a seguimiento. Es un flujo funcional de demostración local: no realiza un cobro real ni usa un servidor.”

## 10. Revisión de la rúbrica

La pauta tiene una parte grupal (Situación evaluativa 1) y una presentación individual (Situación evaluativa 2). Esta tabla relaciona los ocho indicadores con evidencia y con el estado comprobable del repositorio. Los indicadores individuales evalúan la presentación de cada estudiante y no pueden darse por aprobados solo porque exista código o una guía.

| Indicador | Estado del proyecto revisado | Evidencia y alcance |
| --- | --- | --- |
| **Grupal IE2.1.1** | Diseño frontend funcional con framework JavaScript. | **Cumplido en la implementación revisada.** React y Vite organizan rutas, páginas, componentes, lógica y estilos; el build de producción termina correctamente. La tienda es una demostración frontend local, no un servicio con backend. |
| **Grupal IE2.1.2** | Componentes React con props/estado y diseño responsivo mediante Bootstrap. | **Cumplido en el código revisado.** `TarjetaProducto` recibe `product`, `featured` y `onAdd`; `ControlCantidad` recibe `value` y `onChange`; páginas gestionan estado con hooks. `main.jsx` importa Bootstrap CSS, la interfaz usa grilla responsive (`col-12`, `col-sm-6`, `col-xl-4`) y CSS propio con `@media`. |
| **Grupal IE2.2.1** | Pruebas unitarias de componentes y hooks (10 pruebas). | **Cumplido en la última ejecución.** Hay 10 pruebas en `src/test` (una por archivo) y `npm run test:run` terminó con **10/10**. Se usa Vitest porque es lo que enseña la guía de testing del curso; la rúbrica nombra Jasmine y Karma, así que conviene confirmar con el docente que Vitest es válido. |
| **Grupal IE2.3.1** | Configuración, pruebas, mocks, análisis de resultados y cobertura. | **Implementado, con cobertura parcial.** `vite.config.js` configura Vitest con jsdom, `setup.js`, `renderHook`/`act` para hooks, `vi.fn` y `vi.stubGlobal` como mocks y cobertura V8 (`text`, `json`, `html`). La cobertura no es exhaustiva para toda la aplicación. |
| **Individual IE2.1.3** | Exponer el diseño y construcción de la aplicación frontend. | **No verificable desde el repositorio.** El código y las preguntas de la sección 11 dan material para explicar arquitectura, navegación, componentes y compra; cada estudiante debe exponerlo con claridad. |
| **Individual IE2.1.4** | Mostrar componentes, props, estado y responsividad Bootstrap. | **No verificable hasta la presentación.** El proyecto incluye ejemplos demostrables de props, estado y grilla adaptable; el/la estudiante debe mostrarlos y explicar el flujo. |
| **Individual IE2.2.2** | Demostrar las 10 pruebas Vitest y su aporte a la calidad. | **Preparado, pero depende de la demostración individual.** Las pruebas pasan; se deben ejecutar y explicar las acciones y expectativas durante la presentación. |
| **Individual IE2.3.2** | Explicar configuración, pruebas, mocks y análisis de resultados. | **Preparado, pero depende de la explicación individual.** La configuración y los reportes están disponibles; el/la estudiante debe explicar qué mide cada uno y sus límites. |

**Validación realizada en esta revisión:** `npm run build` terminó correctamente, `npm run lint` no reportó problemas, `npm run test:run` pasó **10/10**. En navegador, a **375 px** de ancho no se observó desbordamiento horizontal en inicio; también se comprobó que la tarjeta de manzanas ahora muestra `$1.200 CLP` como precio anterior y `$1.080 CLP` como precio rebajado.

### Brechas que aún no se deben presentar como resueltas

- El proyecto importa **Bootstrap CSS** y usa sus clases utilitarias y grilla; también tiene reglas responsivas propias. Aunque `react-bootstrap` figura como dependencia, la interfaz descrita aquí demuestra el uso del CSS de Bootstrap y no depende de componentes importados desde esa biblioteca.
- La cobertura V8 mide todo `src/`; las páginas sin pruebas reducen el total, por lo que no equivale a una medición completa del frontend.
- Los criterios individuales no se pueden corregir solo modificando el software: cada integrante debe poder presentar y responder preguntas por sí mismo.
- El carrito, los usuarios de prueba y los pedidos se guardan en `localStorage`; en consecuencia, la aplicación es una demostración frontend y no un sistema conectado a un backend o una pasarela de pago.

## 11. Preguntas individuales y respuestas para practicar

Las respuestas son modelos para comprender y adaptar al exponer. Conviene poder señalar el archivo y demostrar el comportamiento, en vez de memorizar únicamente el texto.

### Diseño y construcción frontend

**1. ¿Cómo está diseñada y organizada la aplicación?**

> “Es una aplicación frontend construida con React y Vite. `index.html` contiene el nodo `root`; `main.jsx` importa Bootstrap CSS y monta React; `App.jsx` decide qué página mostrar según la ruta. Separé las vistas en `pages`, piezas reutilizables en `components`, lógica de datos y persistencia en `js`, y estilos por sección en `styles`. Eso permite ubicar cada responsabilidad y reutilizar componentes, por ejemplo la tarjeta de producto en inicio, catálogo y ofertas.”

**2. ¿Cómo navega entre páginas y dónde se conectan los controles con sus destinos?**

> “No usamos `react-router-dom`: `App.jsx` tiene mapas de rutas y compara `window.location.pathname`. Los enlaces son enlaces normales del navegador. Por ejemplo, el ícono de carrito apunta a `/carrito`, y el mapa de rutas hace que esa URL renderice `CartPage`. La ficha usa un parámetro de consulta, como `/producto?id=FR001`, que `ProductDetailPage` lee con `URLSearchParams`.”

**3. ¿Qué sucede desde que se añade un producto hasta que se consulta el pedido?**

> “La tarjeta o la ficha llama a `addCartItem`; esa función consolida la cantidad por ID y `saveCart` persiste el carrito y emite el evento que actualiza el contador del encabezado. En `/carrito` se recalculan cantidades e importes. Al confirmar, se guarda un pedido local con código, datos y estado inicial, se vacía el carrito y aparece el comprobante. El código abre la vista de seguimiento. Es importante precisar que se trata de una simulación local: no se cobra ni se contacta un servidor.”

### Componentes, props, estado y responsividad

**4. ¿Cómo se comunican las propiedades y el estado entre componentes?**

> “Las propiedades llevan datos o callbacks del padre al hijo. Por ejemplo, `CatalogPage` entrega a `TarjetaProducto` el objeto `product` y `addCartItem` como `onAdd`; la tarjeta no escribe el almacenamiento directamente, sino que llama al callback recibido. `ControlCantidad` también es controlado: recibe `value` y `onChange`; el padre conserva el estado y decide qué hacer con la nueva cantidad. En páginas se usan hooks como `useState` para datos que cambian y provocan el render correspondiente.”

**5. ¿Cómo se implementó el diseño responsivo y qué aporta Bootstrap?**

> “`main.jsx` importa la hoja de Bootstrap 5. Las vistas usan la grilla responsive: en el catálogo, por ejemplo, las tarjetas ocupan todo el ancho en móvil, dos columnas desde `sm` y tres desde `xl`, usando `col-12 col-sm-6 col-xl-4`. Además, CSS propio define ajustes con `@media` para cabecera, carrito, administración y otras áreas. Así Bootstrap aporta una base de grilla/utilidades y el CSS del proyecto adapta detalles particulares.”

### Pruebas unitarias, mocks y resultados

**6. ¿Cómo se configuró y cómo se ejecuta la suite?**

> “Vitest se configura en `vite.config.js`: `globals`, entorno jsdom, `src/testing/setup.js` (limpia el DOM y `localStorage`) y cobertura V8 con reporteros `text`, `json` y `html`. Los componentes se prueban con React Testing Library y los Custom Hooks con `renderHook` y `act`. `npm run test:run` ejecuta una vez y `npm run test:coverage` agrega la cobertura.”

**7. ¿Qué 10 pruebas se hicieron y qué validan?**

> “(1) `useTransientFeedback` con `renderHook`, `act` y temporizadores simulados; (2) `useFetch` con `fetch` simulado; (3) `ControlCantidad`; (4) `MensajeEstado`; (5) `FiltrosCatalogo` con un padre con estado y el foco con `useRef`; (6) `TarjetaProducto`; (7) despacho y validación del checkout; (8) y (9) pago aprobado y rechazado; y (10) el stock crítico. Están en `src/test`.”

**8. ¿Qué es un mock o un spy y dónde se utiliza en este proyecto?**

> “Se usa para aislar la unidad bajo prueba y controlar dependencias externas o callbacks. Con `vi.fn()` de Vitest se puede comprobar que `onChange`, `onAdd` o los setters se llamen con los argumentos esperados, sin ejecutar una acción real del padre. Además, `vi.stubGlobal('fetch', vi.fn(...))` reemplaza `fetch` en la prueba de `useFetch`, y `src/testing/setup.js` vacía `localStorage` después de cada prueba para que ninguna dependa del almacenamiento de otra.”

**9. ¿Qué tipos de prueba hay en Vitest?**

> “Hay pruebas de hooks (`renderHook`), de componentes, de lógica y de flujos, todas con Vitest, el mismo comando y el mismo reporte V8.”

**10. ¿Cómo se interpreta el informe de cobertura y qué conclusión se puede presentar?**

> “El informe V8 registra líneas, sentencias, funciones y ramas alcanzadas. El total de `src/` es bajo (cerca de 22 %) porque con 10 pruebas se priorizaron los flujos críticos; los módulos probados, como `checkout.js` o `useTransientFeedback.js`, están casi completos. Presento ambos datos con su alcance.”

### Guion breve de demostración individual

1. Explicar la ruta de entrada: `index.html` → `main.jsx` → `App.jsx`.
2. Mostrar un producto y añadirlo desde tarjeta o detalle; señalar `TarjetaProducto`, `onAdd` y `addCartItem`.
3. Abrir el ícono del carrito; cambiar cantidad y explicar `ControlCantidad`, `saveCart` y el contador.
4. Ir a pagar desde el carrito, completar el checkout (región y comuna dependientes) y mostrar la vista de compra exitosa o la de error con reintento.
5. Ejecutar `npm run test:informe` para enseñar las 10 pruebas y `npm run test:coverage` para el informe V8; aclarar que el total de `src/` incluye páginas sin pruebas.

## 12. Hojas de estilo (`src/styles/`)

`App.jsx` importa las hojas compartidas. Estas clases y estilos determinan la apariencia de la página donde se rendericen los componentes correspondientes.

| Archivo | Área de la interfaz |
| --- | --- |
| `variables.css` | Colores, tipografías y variables visuales que reutilizan las demás hojas. |
| `reset.css` | Normalización y reglas base para que los elementos comiencen con estilos consistentes. |
| `header.css` | Barra superior, marca, navegación y estados de la cabecera. |
| `footer.css` | Columnas, marca y enlaces del pie de página. |
| `buttons.css` | Botones y variantes compartidas. |
| `home.css` | Hero, bloques y tarjetas destacadas de inicio. |
| `catalogo.css` | Filtros y cuadrícula de resultados del catálogo. |
| `carrito.css` | Líneas del carrito, selector de unidades, resumen y comprobante de compra. |
| `forms.css` | Campos, etiquetas, ayudas y mensajes de formularios. |
| `perfil.css` | Secciones del perfil de cliente y de administración. |
| `seguimiento.css` | Búsqueda y línea de progreso del pedido. |
| `producto-detalle.css` | Distribución de imagen, información y compra del detalle de producto. |
| `nosotros.css` | Historia, misión/visión, sucursales y secciones informativas. |
| `blog.css` | Tarjetas y contenido de artículos del blog. |
| `admin.css` | Panel administrativo: barra lateral, cabecera, tablas, estadísticas, formularios y selector de imágenes. |

`src/App.css` añade correcciones y reglas responsivas que cruzan más de una sección (por ejemplo, ajustes de tarjetas y cabecera en pantallas estrechas); `src/index.css` define los estilos mínimos de documento y raíz.

## 13. Pruebas unitarias (`src/test/`)

Hay **10 archivos de prueba**, cada uno con **1 prueba**: **10/10 aprobadas**. Se ejecutan con `npm run test:run`.

**Herramientas:** Vitest (ejecuta las pruebas), jsdom (simula el navegador) y React Testing Library (dibuja los componentes y simula clics y escritura).

**Idea general:** cada prueba hace tres pasos.
1. **Preparar:** dibuja el componente con datos de ejemplo.
2. **Actuar:** hace lo que haría una persona (clic, escribir) o deja pasar el tiempo.
3. **Comprobar:** con `expect` revisa que el resultado sea el esperado.

**Palabras que aparecen:**
- **Mock (`vi.fn()`):** una función falsa que anota si fue llamada y con qué valor.
- **Componente controlado:** no guarda el valor; lo recibe del padre y le avisa cuando algo cambia.
- **Temporizador falso:** permite adelantar el reloj sin esperar de verdad.

**Ayudantes (carpeta `src/testing/`):** `setup.js` limpia la pantalla y `localStorage` después de cada prueba; `productFixture.js` crea un producto de ejemplo; `PadreFiltros.jsx` es un padre simple que sirve para probar los filtros.

### 13.1 Resumen

| N.º | Archivo | Qué prueba | En una frase |
| --- | --- | --- | --- |
| 1 | `aviso-temporal.test.jsx` | Hook del «✓ Añadido» | Se activa y se apaga solo a los 1000 ms |
| 2 | `carga-datos.test.jsx` | Hook que carga datos | Pasa de «cargando» a «datos listos» |
| 3 | `control-cantidad.test.jsx` | `ControlCantidad` | Los botones + y − avisan al padre y respetan mínimo y máximo |
| 4 | `mensaje-estado.test.jsx` | `MensajeEstado` | No muestra nada vacío y distingue error de éxito |
| 5 | `filtros-catalogo.test.jsx` | `FiltrosCatalogo` | Los filtros actualizan al padre y «Limpiar» los borra |
| 6 | `tarjeta-producto.test.jsx` | `TarjetaProducto` | Muestra precio y descuento y avisa al añadir |
| 7 | `calculos-checkout.test.jsx` | Cálculos del checkout | IVA, despacho y validación del formulario |
| 8 | `pago-aprobado.test.jsx` | Pago aprobado | Guarda el pedido y vacía el carrito |
| 9 | `pago-rechazado.test.jsx` | Pago rechazado | No guarda pedido y conserva el carrito |
| 10 | `stock-critico.test.jsx` | Stock crítico | Lista solo productos con 10 o menos unidades |

### 13.2 Cada prueba explicada

#### 1. `useTransientFeedback` — el aviso temporal
- **Qué es:** el hook que hace aparecer «✓ Añadido» un momento en `TarjetaProducto`.
- **Qué hace la prueba:** lo activa y adelanta el reloj.
- **Qué comprueba:** empieza apagado, al activarlo se enciende, sigue encendido a los 999 ms y se apaga a los 1000 ms.
- **Por qué sirve:** prueba que dura justo el tiempo indicado.

#### 2. `useFetch` — carga de datos
- **Qué es:** el hook que `AboutPage` usa para leer las sucursales.
- **Qué hace la prueba:** cambia `fetch` por uno falso que responde `[{ ciudad: 'Santiago' }]`.
- **Qué comprueba:** al inicio `loading` es verdadero y `data` es nulo; al terminar `loading` es falso, `data` trae Santiago y no hay error.
- **Por qué sirve:** verifica los dos estados del hook sin usar internet.

#### 3. `ControlCantidad` — selector de cantidad
- **Qué es:** los botones − y + del carrito y del detalle.
- **Qué hace la prueba:** pulsa «Aumentar» y «Disminuir» con valor 2 (mínimo 1, máximo 3).
- **Qué comprueba:** avisa al padre con 3 y con 1; el número mostrado sigue en 2 hasta que el padre lo cambie; con valor 3 el + queda deshabilitado y con valor 1 el − queda deshabilitado.
- **Por qué sirve:** confirma que respeta los límites y que no guarda la cantidad por sí mismo.

#### 4. `MensajeEstado` — mensajes de estado
- **Qué es:** el texto de error o éxito bajo los formularios.
- **Qué hace la prueba:** lo dibuja sin texto, con texto de error y con texto de éxito.
- **Qué comprueba:** sin texto no aparece nada; un error se marca como `alert` y un éxito como `status`.
- **Por qué sirve:** asegura que no queden mensajes vacíos y que los lectores de pantalla los anuncien bien.

#### 5. `FiltrosCatalogo` — filtros del catálogo
- **Qué es:** el panel con buscador, categorías y precios de `/catalogo`.
- **Qué hace la prueba:** escribe «manzana», marca dos categorías y un precio, desmarca una categoría y pulsa «Limpiar filtros».
- **Qué comprueba:** el padre recibe cada cambio; al limpiar todo queda vacío y el cursor vuelve al buscador.
- **Por qué sirve:** prueba que el componente y su padre se comunican bien.

#### 6. `TarjetaProducto` — tarjeta de producto
- **Qué es:** la tarjeta que se ve en inicio, catálogo y ofertas.
- **Qué hace la prueba:** la dibuja con un producto de ejemplo y pulsa «Añadir».
- **Qué comprueba:** se ven el nombre, el precio tachado ($1.000), el precio con descuento ($900), la insignia -10 %, el stock y el enlace al detalle; al pulsar, llama a `onAdd` una vez con el producto y el botón dice «✓ Añadido».
- **Por qué sirve:** cubre lo que se muestra y la acción principal de la tarjeta.

#### 7. `checkout` — cálculos y validación
- **Qué es:** las funciones `calculateTotals` y `validateCheckout`.
- **Qué hace la prueba:** les entrega un carrito y datos de cliente de ejemplo.
- **Qué comprueba:** 3 × $1.000 da IVA 570, despacho 2.990 y total 6.560; con $30.000 el despacho es 0; datos correctos no dan errores y datos malos dan error en nombre, correo, calle y comuna.
- **Por qué sirve:** protege las reglas del dinero con números concretos.

#### 8. Pago aprobado
- **Qué es:** la página de pago cuando la pasarela aprueba.
- **Qué hace la prueba:** llena nombre, apellidos, correo y calle, y pulsa «Pagar ahora».
- **Qué comprueba:** se guarda el pedido, va a `/compra/exitosa`, el carrito queda vacío, el total suma bien y el stock de Manzanas Fuji baja a 30.
- **Por qué sirve:** recorre toda la compra exitosa de principio a fin.

#### 9. Pago rechazado
- **Qué es:** la misma página cuando la pasarela rechaza.
- **Qué hace la prueba:** hace los mismos pasos que la anterior pero con pago rechazado.
- **Qué comprueba:** no se guarda ningún pedido, va a `/compra/error` y el carrito sigue con su producto.
- **Por qué sirve:** demuestra que un pago fallido no pierde el carrito y se puede reintentar.

#### 10. Stock crítico
- **Qué es:** la página `/admin/productos-criticos`.
- **Qué hace la prueba:** guarda tres productos con stock 8 kg, 3 y 11 y abre la página.
- **Qué comprueba:** solo aparecen los de stock 3 y 8, en ese orden, mostrando solo el número; el de 11 no sale.
- **Por qué sirve:** verifica el límite de 10 unidades, el orden y que ignora la unidad «kg».

### 13.3 Resultado y cobertura

Última ejecución: **10 archivos, 10 pruebas, todas aprobadas**. La cobertura V8 de todo `src/` es baja (cerca de 23 % de sentencias) porque se probaron primero los componentes reutilizables y el flujo de compra; las páginas sin prueba explican la diferencia. El reporte se genera con `npm run test:coverage` y se abre en `coverage-v8/index.html`.

## 14. Imágenes (`src/img/` y `public/`)

Los archivos dentro de `src/img/` se importan desde el código, por lo que Vite puede incluirlos en la compilación. Las fotos de productos se utilizan en tarjetas, ofertas y detalle según el producto elegido; `hero-campo.png` sirve como imagen de la sección principal de inicio.

| Archivo | Uso |
| --- | --- |
| `espinaca.png` | Imagen del producto espinacas. |
| `hero-campo.png` | Imagen del hero de inicio. |
| `leche.jpg` | Imagen del producto leche. |
| `manzanas-fuji.png` | Imagen del producto manzanas Fuji y fallback de imagen. |
| `miel-organica.png` | Imagen del producto miel orgánica. |
| `naranjas.jpg` | Imagen del producto naranjas. |
| `pimentones.jpg` | Imagen del producto pimientos. |
| `platanos.jpg` | Imagen del producto plátanos. |
| `quinoa.jpg` | Imagen del producto quinua. |
| `zanahorias.png` | Imagen del producto zanahorias. |

`public/favicon.svg` es el icono del sitio y se sirve desde la raíz como `/favicon.svg`.

## 15. Archivos de configuración y documentación del proyecto

| Archivo | Para qué sirve |
| --- | --- |
| `package.json` | Nombre del proyecto, dependencias y comandos npm: Vite, Vitest, jsdom, React Testing Library, React Hook Form, Yup y cobertura V8. |
| `package-lock.json` | Versiones concretas del árbol de dependencias para instalaciones reproducibles. |
| `vite.config.js` | Configuración de Vite, plugin de React y de Vitest (jsdom, setup y cobertura V8 con `text`, `json` y `html`). |
| `.oxlintrc.json` | Reglas/opciones de Oxlint. |
| `.gitignore` | Rutas y archivos locales que Git debe ignorar, como `node_modules/` y `dist/`. |
| `README.md` | Resumen del proyecto, rutas principales, comandos y credenciales locales de demostración. |
| `docs/huerto-hogar/GUIA-CODIGO.md` | Esta guía de estructura, funcionamiento, ejecución y pruebas. |

## 16. Carpeta `coverage-v8/`

`coverage-v8/` contiene el reporte HTML de cobertura V8 generado por Vitest (`index.html`, hojas de estilo y un HTML por archivo fuente) y `clover.xml`. No son componentes ni recursos que se importen para ejecutar React.

No edites manualmente esos archivos: se regeneran con `npm run test:coverage`.

## 17. CUENTA DE PRUEBA ADMIN

Cuenta de prueba: admin@gmail.com / Admin123!