# Printyx V12 — Catálogo y cotización por WhatsApp

Proyecto basado en Printyx V11.3. Incluye **32 productos con sus imágenes**, React + Vite, carrito de cotización y funciones de Cloudflare Pages para almacenar diseños en un bucket privado R2.

## Novedades

1. **Fichas uniformes:** imagen sin recortes, opción de ampliar y formulario desplazable de forma independiente en escritorio. En móvil, la ficha es vertical.
2. **Editar carrito:** botón «Editar» en cada línea. Permite cambiar opciones, personalización, cantidad y gestionar las referencias de diseño que sigan disponibles.
3. **Campos por producto:** ropa (ubicación y medidas), papelería (material, acabado y tamaño), impresión (caras), banners y cuadros (medidas en pulgadas), fiestas (nombre, edad, colores, cantidades y ocasión), regalos (colores y dedicatoria).
4. **Móvil:** fichas adaptadas a pantallas pequeñas, controles táctiles, y carrito a ancho completo.
5. **Políticas:** anticipo, elaboración, aprobación del diseño, entregas y devoluciones legales aplicables.
6. **Filtros:** categorías, búsqueda y ocasión. Las ocasiones se asignan por categoría y son orientativas; personaliza sus listas en `src/App.jsx`.
7. **Cotizaciones claras:** si no hay precios fijos, no se muestra un total engañoso de L 0.00.

## Configuración necesaria

**IMPORTANTE:** Antes de reemplazar tu proyecto actual, guarda una copia de seguridad completa y copia la clave pública de Turnstile de tu `src/config.js` anterior. El archivo incluido en el ZIP puede contener `TURNSTILE_SITE_KEY = ''`, según la versión original conservada. **Nunca coloques la clave secreta de Turnstile dentro del repositorio.**

- WhatsApp: `src/config.js` → `WHATSAPP_NUMBER`, formato `504` + número hondureño de 8 dígitos.
- Turnstile (clave pública): `src/config.js` → `TURNSTILE_SITE_KEY`.
- Cloudflare Pages: binding R2 denominado `PRINTYX_FILES` apuntando a `printyx-pedidos`, y secreto `TURNSTILE_SECRET_KEY` configurado en el entorno de producción.
- R2: mantener el bucket privado y la regla de ciclo de vida de 30 días. Los enlaces no exigen inicio de sesión: cualquier persona que reciba el enlace puede descargarlo durante su vigencia.

## Instalar y ejecutar localmente

```bash
npm install
npm run dev
```

El modo local de Vite **no ejecuta automáticamente** las funciones de Cloudflare Pages. Puedes probar el catálogo, filtros y carrito localmente. Prueba **subidas reales a R2** en tu despliegue de Pages o con un entorno de Workers correctamente configurado.

## Publicación

```bash
npm run build
git add .
git commit -m "Printyx V12: mejoras de fichas, carrito y filtros"
git push origin main
```

En Cloudflare Pages, para Vite: comando `npm run build` y directorio de salida `dist`.

## Pruebas recomendadas

1. Abre un producto, añade opciones y guárdalo en el carrito.
2. Pulsa «Editar», modifica un dato y confirma que aparezca en el mensaje de WhatsApp.
3. Edita un producto que ya tenga archivo R2 sin volver a subirlo; conserva el enlace.
4. Cambia de categoría, ocasión y búsqueda; usa «Limpiar filtros».
5. Revisa el modal, la imagen ampliada, el carrito y las políticas desde un móvil.
6. Confirma que los archivos cargan en R2 y que el mensaje contiene sus enlaces.

## Editar tu catálogo

- Artículos, fotos, precios y variantes: `src/products.js`.
- Imágenes: `public/productos/`, una imagen individual por producto.
- Preguntas específicas: `src/ProductCustomizationFields.jsx`.
- Filtros por ocasión: `occasionByCategory` en `src/App.jsx`.
- Políticas públicas: sección `policies-section` en `src/App.jsx`.
- Estilos responsivos: `src/styles.css`.

**Nota de privacidad:** retirar un adjunto del carrito no borra inmediatamente el archivo ya cargado a R2; el archivo dejará de ser parte del pedido, pero el ciclo de vida de R2 sigue eliminándolo al final de su período de retención. No se realizan cobros online ni seguimiento de pedidos.
