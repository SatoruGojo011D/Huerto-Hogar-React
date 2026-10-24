# Pruebas unitarias de componentes React

Las pruebas de componentes se ejecutan con Karma, Jasmine y React Testing Library. El archivo `karma-entry.jsx` carga la suite `components/components.karma.jsx`, que contiene exactamente 10 casos Jasmine. La extensión `.karma.jsx` mantiene esta suite separada del patrón de descubrimiento de Vitest. Las pruebas existentes de utilidades permanecen en Vitest.

## Ejecución

Desde la raíz del proyecto, con Google Chrome instalado:

```sh
npm run test:karma
```

Para ejecutar también las pruebas existentes de persistencia y lógica de datos:

```sh
npm test
```

La suite Karma también mide la cobertura del código fuente cargado por sus pruebas. Al terminar, revisa el resumen de cobertura en la terminal o abre `coverage-karma/html/index.html` para consultar el reporte HTML. La medición cubre los módulos instrumentados que ejecuta esta suite; no representa automáticamente todos los componentes y páginas de la aplicación.

## Descripción de pruebas

### `QuantityControl` informa el incremento

La prueba renderiza el control con valor inicial 1, pulsa el botón accesible “Aumentar cantidad” y comprueba que se notifica el valor 2 mediante la propiedad `onChange`. Verifica que el componente controlado comunique la nueva cantidad a su componente padre.

### `ProductCard` delega la acción de añadir al carrito

La prueba renderiza una tarjeta con un producto de ejemplo, pulsa “Añadir” y comprueba que se invoque `onAdd` con el mismo objeto de producto. Verifica la interacción principal de compra sin que la tarjeta gestione directamente la persistencia.

Las otras pruebas verifican el decremento y límites del control de cantidad, accesibilidad de mensajes y estados, etapas del seguimiento, asociación de etiqueta/campo y comportamiento de búsqueda y limpieza de filtros.
