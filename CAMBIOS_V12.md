# Cambios de V11.3 a V12

Archivos modificados: `src/App.jsx`, `src/ProductCustomizationFields.jsx`, `src/styles.css`, `README.md`.

Archivos preservados: `functions/api/files.js`, `functions/api/files/[id].js`, `src/products.js`, `src/config.js`, `public/productos/*`, `public/printyx-logo.png`, configuración de Vite y dependencias.

La V12 conserva la misma API `/api/files`, la variable `PRINTYX_FILES`, el sistema de validación Turnstile y la creación del enlace de WhatsApp. No se agrega base de datos, pasarela de pago ni sistema de seguimiento.

**Compatibilidad con carritos existentes:** cuando el carrito fue creado en una versión antigua, la edición reconstruye las opciones principales a partir del resumen almacenado. Para pedidos nuevos V12 se conservan `choices`, `details` y `files` de manera estructurada para una edición precisa. En cualquier caso revisa el resumen antes de enviarlo a WhatsApp.

**Aviso:** la subida de un archivo es una operación del servidor que ocurre al agregar o guardar. Eliminar un artículo del carrito NO elimina el archivo de R2 de inmediato; depende de la regla de vencimiento configurada.
