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
npm run test:karma # ejecuta las pruebas de componentes con ChromeHeadless
```

`npm run preview` se ejecuta después de `npm run build`. Para `npm run test:karma` se necesita Google Chrome instalado.

**Windows PowerShell:** si aparece un error indicando que la ejecución de `npm.ps1` está deshabilitada, usa `npm.cmd` en lugar de `npm` (por ejemplo, `npm.cmd run dev` o `npm.cmd test`). No hace falta cambiar la política de ejecución de PowerShell.

## 3. Pruebas y cobertura V8

El proyecto ya incluye `vitest` y el proveedor `@vitest/coverage-v8`. Para ejecutar las pruebas de Vitest con cobertura V8 y guardar el reporte en una carpeta separada:

```bash
npm test -- --coverage.enabled --coverage.provider=v8 --coverage.reportsDirectory=coverage-v8
```

Al terminar, abre `coverage-v8/index.html` para consultar el reporte navegable. También se muestra un resumen en la terminal. Si se omite `--coverage.reportsDirectory=coverage-v8`, Vitest usa `coverage/` como carpeta predeterminada; en este repositorio ya hay archivos de reporte allí, por eso se recomienda la carpeta separada.

La suite de componentes también genera cobertura al ejecutar Karma:

```bash
npm run test:karma
```

El reporte navegable queda en `coverage-karma/html/index.html` y el resumen aparece en la terminal. Karma instrumenta con Istanbul el código de aplicación que carga la suite, no todos los archivos de la aplicación.

La cobertura indica qué partes del código alcanzan las pruebas ejecutadas: no significa que toda la aplicación tenga cobertura completa. En la ejecución revisada para esta guía, Vitest pasó **14/14 pruebas en 10 archivos** y V8 registró **77,45 % de sentencias, 72,97 % de ramas, 78,37 % de funciones y 79,26 % de líneas** en los módulos de lógica alcanzados. Karma/Jasmine pasó **10/10 pruebas** y el reporte Istanbul registró **85,41 % de sentencias, 73,21 % de ramas, 76,92 % de funciones y 90,47 % de líneas** en los módulos cargados por las pruebas de componentes. Son dos mediciones separadas y parciales; no se deben sumar ni presentar como cobertura de toda la aplicación.

## 4. Entrada de la aplicación y estilos globales

| Archivo | Responsabilidad y relación con la página |
| --- | --- |
| `index.html` | Documento HTML de Vite: idioma, metadatos, favicon, contenedor `#root` y carga de `src/main.jsx`. No contiene las páginas React. |
| `src/main.jsx` | Punto de entrada React. Importa Bootstrap, `src/index.css` y `App.jsx`, y renderiza la aplicación en `#root` dentro de `StrictMode`. |
| `src/App.jsx` | Mapa de rutas públicas y administrativas, títulos de pestaña, inicialización de usuarios de demostración, protección del panel, página 404 y composición de cabecera/pie. |
| `src/index.css` | Reglas globales para tipografía, color base, ancho mínimo y altura de `#root`. |
| `src/App.css` | Ajustes transversales y adaptables: cabecera, acciones de sesión y carrito, tarjetas del catálogo, detalle de producto, mensajes, cantidades, reseñas y modales. Complementa las hojas temáticas. |

### Composición y protección de rutas

- En páginas públicas, `App.jsx` dibuja `SiteHeader`, la página seleccionada y `SiteFooter`.
- En rutas que empiezan por `/admin`, `ProtectedAdmin` comprueba que la sesión tenga el rol `admin`; si no, redirige a `/cuenta`. Las páginas administrativas se muestran dentro de `AdminShell`.
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

Las rutas administrativas comparten la estructura visual de `AdminShell`; las dos rutas de formulario reutilizan el mismo componente con una propiedad `edit` para distinguir creación y edición.

## 6. Componentes reutilizables y lugar donde aparecen

Todos están en `src/components/`. Se encargan de una pieza de interfaz o interacción para que las páginas no repitan su implementación.

| Archivo | Función y ubicación |
| --- | --- |
| `SiteHeader.jsx` | Cabecera global de las páginas públicas: marca, navegación, sesión, acceso al panel cuando corresponde y carrito con contador. Escucha cambios de sesión y carrito para actualizarse. |
| `SiteFooter.jsx` | Pie de página compartido al final de las vistas públicas y de la página 404. |
| `AdminShell.jsx` | Estructura común de administración: barra lateral, navegación del panel, título y espacio de contenido. Envuelve las páginas administrativas autorizadas. |
| `ProductCard.jsx` | Tarjeta de producto con imagen, nombre, precio/descuento, stock cuando aplica y acción de añadir. Se muestra en los productos destacados del inicio y en los resultados de catálogo y ofertas. Delega la compra a `onAdd`. |
| `CatalogFilters.jsx` | Controles de búsqueda y filtros de categoría/precio en la columna de filtros de `/catalogo`; recibe y actualiza el estado desde `CatalogPage`. |
| `FormField.jsx` | Presentación reutilizable de etiqueta, control y ayuda en formularios de contacto, acceso, registro, perfil y seguimiento. |
| `QuantityControl.jsx` | Selector de cantidad con límites y botones para incrementar/decrementar; se muestra en `/carrito` y en el detalle de producto. |
| `OrderReceiptModal.jsx` | Diálogo del comprobante que aparece al finalizar una compra en `/carrito`, con resumen del pedido y acción de cierre. |
| `StatusMessage.jsx` | Mensaje accesible de estado (por ejemplo, error o éxito), anunciado con `aria-live`. Se usa en formularios y acciones. |
| `StatusTimeline.jsx` | Secuencia visual de estados del pedido: confirmado, preparación, camino y entregado. Se muestra en `/seguimiento`. |

## 7. Lógica y datos (`src/js/`)

| Archivo | Responsabilidad |
| --- | --- |
| `products.js` | Catálogo inicial de productos e imágenes importadas; resuelve imágenes de productos administrados y normaliza/calcula descuentos y precios finales. |
| `storage.js` | Lectura y escritura de `localStorage`, saneamiento básico de valores recuperados, cuentas de demostración, sesión, usuarios, pedidos, carrito y combinación de productos del catálogo base con los administrados. También emite eventos para sincronizar la interfaz. |
| `adminData.js` | Funciones y opciones de datos usadas por el panel, como productos, categorías e imágenes disponibles en el formulario. |
| `format.js` | Formateo de valores monetarios para mostrarlos como precios en pesos chilenos. |
| `delivery.js` | Cálculo de la fecha mínima disponible para coordinar una entrega. |
| `validation.js` | Reglas reutilizables de validación, incluida la expresión de correo aceptada por los formularios. |
| `useTransientFeedback.js` | Hook que activa temporalmente una confirmación visual después de una acción, como añadir un producto. |

### Persistencia de demostración

`storage.js` usa claves de `localStorage` para usuarios (`usuarios_huerto`), pedidos (`hh_pedidos`), sesión (`sesion_activa`) y carrito (`hh_carrito`, junto con su contador). La interfaz notifica cambios del carrito y sesión mediante eventos del navegador para que la cabecera pueda refrescarse. La persistencia local sirve para probar el flujo, pero no reemplaza una API o una base de datos.

## 8. Flujo de compra: qué ocurre al comprar

El recorrido de compra conecta las páginas, los componentes reutilizables y las funciones de almacenamiento. Se puede explicar así:

1. **Elegir un producto.** En el inicio, el catálogo y las ofertas se muestran tarjetas `ProductCard`. La tarjeta recibe el producto y la función `addCartItem` por la propiedad `onAdd`. En el detalle (`/producto?id=...`), la página obtiene el producto del catálogo, permite elegir unidades con `QuantityControl` y llama directamente a `addCartItem`.
2. **Añadirlo al carrito.** `addCartItem` (`src/js/storage.js`) lee el carrito guardado con `getCart()`. Si el mismo identificador ya está, suma la cantidad; si no, crea una línea con identificador, nombre, precio vigente, imagen y cantidad. El precio usa el valor con descuento cuando existe. Luego `saveCart()` guarda el carrito en `hh_carrito`, recalcula el total de unidades en `hh_carrito_cantidad` y emite `hh:cart-change`.
3. **Actualizar el indicador de la cabecera.** `SiteHeader` (`src/components/SiteHeader.jsx`) obtiene el total con `getItemCount()` y escucha `hh:cart-change` (además del evento `storage`). Por eso el número junto al ícono de carrito refleja la suma de unidades, no la cantidad de líneas distintas. El ícono es un enlace a `/carrito`; `App.jsx` asocia esa ruta con `CartPage`.
4. **Revisar y editar el pedido.** `CartPage` carga las líneas con `getCart()`. `QuantityControl` permite modificar cada cantidad y el botón de eliminar quita esa línea; ambas acciones llaman a `updateCart()`, que actualiza el estado de React y persiste el resultado mediante `saveCart()`. El subtotal es la suma de precio por cantidad. El despacho cuesta `$2.990 CLP` cuando el subtotal es menor a `$25.000 CLP`; desde ese umbral es gratis. El total mostrado suma subtotal y despacho.
5. **Elegir fecha de entrega.** El campo de fecha conserva su valor en `hh_fecha_entrega`, y `getMinimumDeliveryDate()` establece hoy como fecha mínima seleccionable. Esa fecha se muestra como dato del pedido; en el código actual no es una condición obligatoria para confirmar.
6. **Confirmar.** Al pulsar **Confirmar pedido**, `confirmOrder()` comprueba que haya al menos un producto. Si el carrito está vacío, presenta un mensaje y no registra nada. Si tiene productos, crea el pedido con un código `HH-` y cinco dígitos, fecha de creación, fecha de entrega (o “Fecha por confirmar”), líneas, subtotal, despacho, total, estado inicial y, si hay una sesión, sus datos de cliente. Guarda el pedido más reciente en `hh_ultimo_pedido`, lo agrega al comienzo de `hh_pedidos` y vacía el carrito con `saveCart([])`.
7. **Mostrar comprobante y permitir seguimiento.** `CartPage` entrega el pedido a `OrderReceiptModal`. El diálogo enseña el código, la entrega y el total, y su enlace **Ver seguimiento** abre `/seguimiento?codigo=...`. `TrackingPage` busca el código en `hh_pedidos` y representa el estado con `StatusTimeline`.

**Importante para explicarlo con precisión:** este proyecto registra un pedido de demostración en el almacenamiento local del navegador. No procesa un pago real, no envía el pedido a un servidor y no descuenta ni valida inventario al confirmar. El botón dice “Confirmar pedido”, pero no está conectado a una pasarela de pago.

## 9. Conexiones entre controles y código

| Control o acción visible | Con qué está conectado | Resultado |
| --- | --- | --- |
| Ícono/botón de carrito en la cabecera | Enlace `href="/carrito"` de `SiteHeader` → ruta `/carrito` en `App.jsx` → `CartPage` | Abre el carrito. El contador consulta `getItemCount()` y se actualiza al recibir `hh:cart-change`. |
| “Añadir” en una tarjeta de producto | `ProductCard` → propiedad `onAdd` → `addCartItem()` | Agrega una unidad o aumenta la cantidad de ese producto; muestra una confirmación visual temporal. |
| “Añadir al Carrito” en la ficha | `ProductDetailPage` → `QuantityControl` + `addCartItem(displayProduct, quantity)` | Agrega al carrito la cantidad seleccionada. |
| Filtros y búsqueda del catálogo | `CatalogFilters` → estado de `CatalogPage` → filtrado de `getCatalogProducts()` | Cambia los productos visibles por categoría, rango de precio o texto. |
| Botones `+` y `−` del carrito | `QuantityControl` → `onChange` de `CartPage` → `updateCart()` → `saveCart()` | Cambia unidades, subtotal, despacho, total y contador de la cabecera. El rango permitido es de 1 a 999 unidades por línea. |
| Botón de eliminar del carrito | Acción en `CartPage` → `updateCart()` → `saveCart()` | Quita el producto y recalcula los importes y el contador. |
| Campo “Fecha de entrega” del carrito | Estado `delivery` de `CartPage` → `writeStorage('hh_fecha_entrega', ...)` | Conserva la fecha elegida en el navegador para mostrarla al crear el pedido. |
| “Confirmar pedido” | `CartPage.confirmOrder()` → `createOrder()` → `writeStorage()` | Registra el pedido localmente, vacía el carrito y abre el comprobante; no cobra. |
| “Ver seguimiento” del comprobante | Enlace a `/seguimiento?codigo=...` → `TrackingPage` → `getOrders()` | Consulta el pedido por su código y muestra su etapa. |
| “Salir” | `SiteHeader.logout()` → elimina `sesion_activa` → evento `hh:session-change` | Cierra la sesión local, actualiza la cabecera y vuelve al inicio. |

### Respuesta modelo para una evaluación oral

> “El proceso empieza cuando añado un producto desde una tarjeta o desde su detalle. Ambos caminos llaman a `addCartItem` de `storage.js`, que identifica el producto por su ID: si ya estaba, aumenta su cantidad; si no, crea una línea con el precio vigente y sus datos. `saveCart` persiste el carrito en `localStorage`, guarda el total de unidades y emite un evento. La cabecera escucha ese evento y actualiza el contador. El ícono del carrito es un enlace a `/carrito`, ruta que `App.jsx` conecta con `CartPage`. Allí puedo cambiar cantidades o eliminar productos; cada cambio se vuelve a guardar, y la página calcula subtotal, despacho y total. Al confirmar, se valida que el carrito no esté vacío, se construye y guarda el pedido, se vacía el carrito y aparece el comprobante. Desde ese comprobante paso el código a seguimiento. Es un flujo funcional de demostración local: no realiza un cobro real ni usa un servidor.”

## 10. Revisión de la rúbrica

La pauta tiene una parte grupal (Situación evaluativa 1) y una presentación individual (Situación evaluativa 2). Esta tabla relaciona los ocho indicadores con evidencia y con el estado comprobable del repositorio. Los indicadores individuales evalúan la presentación de cada estudiante y no pueden darse por aprobados solo porque exista código o una guía.

| Indicador | Estado del proyecto revisado | Evidencia y alcance |
| --- | --- | --- |
| **Grupal IE2.1.1** | Diseño frontend funcional con framework JavaScript. | **Cumplido en la implementación revisada.** React y Vite organizan rutas, páginas, componentes, lógica y estilos; el build de producción termina correctamente. La tienda es una demostración frontend local, no un servicio con backend. |
| **Grupal IE2.1.2** | Componentes React con props/estado y diseño responsivo mediante Bootstrap. | **Cumplido en el código revisado.** `ProductCard` recibe `product`, `featured` y `onAdd`; `QuantityControl` recibe `value` y `onChange`; páginas gestionan estado con hooks. `main.jsx` importa Bootstrap CSS, la interfaz usa grilla responsive (`col-12`, `col-sm-6`, `col-xl-4`) y CSS propio con `@media`. |
| **Grupal IE2.2.1** | Diez pruebas unitarias de componentes con Jasmine/Karma. | **Cumplido en la última ejecución.** `components.karma.jsx` contiene 10 casos y `npm run test:karma` terminó con **10/10 SUCCESS** en ChromeHeadless. |
| **Grupal IE2.3.1** | Configuración, pruebas, mocks, análisis de resultados y cobertura. | **Implementado, con cobertura parcial.** Karma configura Jasmine, Webpack/Babel, ChromeHeadless e Istanbul; hay spies Jasmine y mocks de almacenamiento para Vitest. Ambas suites producen resultados y reportes de cobertura descritos en la sección 3. La cobertura no es exhaustiva para toda la aplicación. |
| **Individual IE2.1.3** | Exponer el diseño y construcción de la aplicación frontend. | **No verificable desde el repositorio.** El código y las preguntas de la sección 11 dan material para explicar arquitectura, navegación, componentes y compra; cada estudiante debe exponerlo con claridad. |
| **Individual IE2.1.4** | Mostrar componentes, props, estado y responsividad Bootstrap. | **No verificable hasta la presentación.** El proyecto incluye ejemplos demostrables de props, estado y grilla adaptable; el/la estudiante debe mostrarlos y explicar el flujo. |
| **Individual IE2.2.2** | Demostrar las diez pruebas Jasmine/Karma y su aporte a la calidad. | **Preparado, pero depende de la demostración individual.** Las diez pruebas pasan; se deben ejecutar y explicar las acciones y expectativas durante la presentación. |
| **Individual IE2.3.2** | Explicar configuración, pruebas, mocks y análisis de resultados. | **Preparado, pero depende de la explicación individual.** La configuración y los reportes están disponibles; el/la estudiante debe explicar qué mide cada uno y sus límites. |

**Validación realizada en esta revisión:** `npm run build` terminó correctamente, `npm run lint` no reportó problemas, `npm test` pasó **14/14** y `npm run test:karma` pasó **10/10**. En navegador, a **375 px** de ancho no se observó desbordamiento horizontal en inicio; también se comprobó que la tarjeta de manzanas ahora muestra `$1.200 CLP` como precio anterior y `$1.080 CLP` como precio rebajado.

### Brechas que aún no se deben presentar como resueltas

- El proyecto importa **Bootstrap CSS** y usa sus clases utilitarias y grilla; también tiene reglas responsivas propias. Aunque `react-bootstrap` figura como dependencia, la interfaz descrita aquí demuestra el uso del CSS de Bootstrap y no depende de componentes importados desde esa biblioteca.
- La cobertura V8 y la de Istanbul corresponden a suites y módulos medidos distintos; no equivalen a una medición completa del frontend.
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

> “Las propiedades llevan datos o callbacks del padre al hijo. Por ejemplo, `CatalogPage` entrega a `ProductCard` el objeto `product` y `addCartItem` como `onAdd`; la tarjeta no escribe el almacenamiento directamente, sino que llama al callback recibido. `QuantityControl` también es controlado: recibe `value` y `onChange`; el padre conserva el estado y decide qué hacer con la nueva cantidad. En páginas se usan hooks como `useState` para datos que cambian y provocan el render correspondiente.”

**5. ¿Cómo se implementó el diseño responsivo y qué aporta Bootstrap?**

> “`main.jsx` importa la hoja de Bootstrap 5. Las vistas usan la grilla responsive: en el catálogo, por ejemplo, las tarjetas ocupan todo el ancho en móvil, dos columnas desde `sm` y tres desde `xl`, usando `col-12 col-sm-6 col-xl-4`. Además, CSS propio define ajustes con `@media` para cabecera, carrito, administración y otras áreas. Así Bootstrap aporta una base de grilla/utilidades y el CSS del proyecto adapta detalles particulares.”

### Pruebas unitarias, mocks y resultados

**6. ¿Cómo se configuró y cómo se ejecuta la suite de componentes?**

> “Karma está configurado en `karma.conf.cjs` con Jasmine como framework, `karma-entry.jsx` como entrada, Webpack y Babel para transformar JSX, y ChromeHeadless como navegador sin interfaz. `npm run test:karma` ejecuta una sola corrida. En la última ejecución se compilaron los casos y ChromeHeadless informó 10 de 10 exitosos.”
> “Además, Babel instrumenta el código fuente que carga esa suite con Istanbul; Karma presenta el resumen y crea el reporte HTML `coverage-karma/html/index.html` para inspeccionar líneas, funciones, ramas y sentencias cubiertas.”

**7. ¿Qué 10 pruebas de componentes se hicieron y qué validan?**

> “La suite prueba: (1) incremento en `QuantityControl`; (2) decremento; (3) límites mínimo y máximo; (4) que `StatusMessage` no renderice vacío; (5) rol de alerta y anuncio accesible para error; (6) rol de estado y anuncio para éxito; (7) pasos completados y paso actual en `StatusTimeline`; (8) asociación entre etiqueta y campo en `FormField`; (9) búsqueda y limpieza de filtros en `CatalogFilters`; y (10) que `ProductCard` llame `onAdd` con el producto correcto. Se pueden ver los eventos simulados y las expectativas en `src/test/components/components.karma.jsx`.”

**8. ¿Qué es un mock o un spy y dónde se utiliza en este proyecto?**

> “Se usa para aislar la unidad bajo prueba y controlar dependencias externas o callbacks. En Karma, `jasmine.createSpy` permite comprobar que `onChange`, `onAdd` o los setters se llamen con los argumentos esperados, sin ejecutar una acción real del padre. En Vitest, `src/test/testUtils.js` reemplaza `localStorage` y parte de `window` con funciones simuladas y un mapa en memoria; así cada prueba puede preparar datos y verificar escrituras/eventos sin depender del almacenamiento real del navegador.”

**9. ¿Qué diferencia hay entre las pruebas de Vitest y las de Karma/Jasmine?**

> “Vitest ejecuta las pruebas de lógica de catálogo, carrito, sesión y almacenamiento con `npm test`; en la ejecución revisada pasaron 14 pruebas en 10 archivos. Karma/Jasmine ejecuta por separado los 10 casos de componentes React en ChromeHeadless. No se deben sumar como si fueran una única corrida ni confundir el reporte V8 con la suite de Karma.”

**10. ¿Cómo se interpreta el informe de cobertura y qué conclusión se puede presentar?**

> “El informe V8 registra líneas, sentencias, funciones y ramas alcanzadas por las pruebas Vitest. En esta ejecución reportó 79,26 % de líneas, 77,45 % de sentencias, 78,37 % de funciones y 72,97 % de ramas. Significa que queda código sin ejecutar por estas pruebas; no significa que el 79,26 % de toda la aplicación esté probado, porque la medición se concentra en los módulos instrumentados y no incluye Karma. Las pruebas pasaron, pero aún hay margen para agregar casos y subir la cobertura.”
>
> “Por separado, Karma/Istanbul ejecutó 10 de 10 casos y reportó 90,47 % de líneas y 73,21 % de ramas en los módulos cargados por la suite de componentes. Ese porcentaje tampoco representa toda la app: mide solo el código instrumentado que realmente entró en esa suite. No mezclo ni sumo ambos porcentajes; los presento con su herramienta, alcance y limitación.”

### Guion breve de demostración individual

1. Explicar la ruta de entrada: `index.html` → `main.jsx` → `App.jsx`.
2. Mostrar un producto y añadirlo desde tarjeta o detalle; señalar `ProductCard`, `onAdd` y `addCartItem`.
3. Abrir el ícono del carrito; cambiar cantidad y explicar `QuantityControl`, `saveCart` y el contador.
4. Confirmar un pedido de demostración, enseñar el comprobante y abrir el seguimiento; aclarar que no existe pago/backend real.
5. Ejecutar `npm run test:karma` para enseñar los 10 casos y `npm test` para la suite de lógica; si preguntan por cobertura, ejecutar el comando V8 de la sección 3 y explicar su alcance parcial.

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

## 13. Pruebas (`src/test/`)

Las pruebas Vitest (`*.test.js`) verifican funciones de catálogo, carrito, almacenamiento y sesión. `npm test` las ejecuta.

| Archivo | Qué comprueba |
| --- | --- |
| `add-cart-item.test.js` | Añadir un producto nuevo al carrito. |
| `add-existing-cart-item.test.js` | Incrementar la cantidad cuando el producto ya está en el carrito. |
| `get-cart-normalization.test.js` | Normalización y tratamiento de valores del carrito leídos desde almacenamiento. |
| `get-catalog-products.test.js` | Construcción del catálogo a partir de productos base y datos guardados. |
| `get-users.test.js` | Lectura y validación básica de usuarios persistidos. |
| `read-storage-fallback.test.js` | Uso del valor alternativo cuando no hay un valor guardado. |
| `read-storage-invalid-json.test.js` | Uso del valor alternativo cuando el contenido guardado no es JSON válido. |
| `save-cart.test.js` | Persistencia del carrito y actualización del contador/evento relacionado. |
| `session.test.js` | Lectura, guardado y notificación de cambios de sesión. |
| `write-storage.test.js` | Serialización y escritura en `localStorage`. |
| `testUtils.js` | Utilidades compartidas para preparar y aislar el almacenamiento en pruebas. |
| `components/components.karma.jsx` | Diez casos Jasmine de componentes React mediante React Testing Library: cantidad, mensajes accesibles, timeline, etiquetas, filtros y callback de tarjeta. |
| `karma-entry.jsx` | Entrada de Karma que carga la suite de componentes anterior. |
| `PRUEBAS.md` | Explica cómo ejecutar y qué cubren las pruebas de componentes Karma/Jasmine. |

Las pruebas de componentes usan Karma + Jasmine + React Testing Library y se ejecutan por separado con `npm run test:karma`. `karma.conf.cjs` configura ChromeHeadless y Babel/Webpack para esta suite. La suite Vitest usa spies/mocks para las funciones y el almacenamiento; el reporte V8 descrito arriba se calcula solo al ejecutar Vitest.

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
| `package.json` | Nombre del proyecto, dependencias y comandos npm: Vite, Vitest, Karma/Jasmine, instrumentación de cobertura Istanbul y lint. |
| `package-lock.json` | Versiones concretas del árbol de dependencias para instalaciones reproducibles. |
| `vite.config.js` | Configuración de Vite y activación del plugin de React. |
| `karma.conf.cjs` | Configuración CommonJS de Karma, Jasmine, Webpack/Babel, instrumentación Istanbul, reportes de cobertura y ChromeHeadless para las pruebas de componentes. |
| `.oxlintrc.json` | Reglas/opciones de Oxlint. |
| `.gitignore` | Rutas y archivos locales que Git debe ignorar, como `node_modules/` y `dist/`. |
| `README.md` | Resumen del proyecto, rutas principales, comandos y credenciales locales de demostración. |
| `docs/huerto-hogar/GUIA-CODIGO.md` | Esta guía de estructura, funcionamiento, ejecución y pruebas. |
| `docs/huerto-hogar/rubrica.md` | Rúbrica de evaluación grupal e individual usada para organizar la sección de preparación de esta guía. |
| `docs/huerto-hogar/evaluacion-iva.md` | Documento de evaluación relacionado con IVA. |
| `docs/huerto-hogar/Especificacion_Requerimientos_HuertoHogar_IEEE830_V2 (1).docx` | Especificación de requerimientos del proyecto en formato Word. |
| `docs/huerto-hogar/Planilla_Requerimientos_HuertoHogar.xlsx` | Planilla de requerimientos en formato Excel. |

## 16. Carpeta `coverage/`

`coverage/` contiene archivos de salida para un reporte HTML de cobertura, no componentes ni recursos que se importen para ejecutar React. El reporte tiene una portada (`index.html`), hojas y scripts de presentación (`base.css`, `prettify.css`, `prettify.js`, `sorter.js`, `block-navigation.js`), iconos (`favicon.png`, `sort-arrow-sprite.png`) y páginas navegables bajo `img/`, `js/` y `test/` para los archivos que aparecen en ese reporte.

No edites manualmente esos archivos: se regeneran al producir un reporte. El comando de esta guía usa `coverage-v8/` para mantener separada la salida nueva de la carpeta `coverage/` existente.

## 17. CUENTA DE PRUEBA ADMIN

Cuenta de prueba: admin@gmail.com / Admin123!