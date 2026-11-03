# Printyx V14 — Mejoras finales de experiencia

Partimos de V13 y conservamos el flujo de cotización en WhatsApp, funciones de Cloudflare R2, 32 productos y mockups.

## 1. Botón fijo en móvil
Al abrir una ficha desde celular, el botón **Agregar al carrito** (o **Guardar cambios**) queda en una barra fija en la parte baja del modal. En computadoras se conserva el botón dentro del formulario; no se duplican botones visibles en una misma pantalla.

## 2. Confirmaciones y errores
Se muestra un aviso discreto al actualizar cantidades, subir archivos, agregar o editar productos y eliminar artículos del carrito. Los errores de validación permanecen en el formulario, con desplazamiento hacia el mensaje, y se respeta el estado de carga de archivos.

## 3. Accesibilidad
- Contornos de foco en botones, enlaces y campos; también en los campos de texto.
- Navegación por Tab atrapada dentro del diálogo activo; intento de restaurar el foco al control previo al cerrar.
- Cierre con Escape, compatibilidad con movimiento reducido y metas accesibles de tamaño táctil.
- Indicadores de foto activa (`aria-pressed`), diálogo nombrado y avisos con `role="status"`.

## 4. Trabajos reales en fichas individuales
**Coloca fotos reales en `public/trabajos/`**, usando el ID exacto del producto al inicio del archivo. El generador del proyecto durante `npm run dev` o `npm run build` reconoce la foto automáticamente y la muestra:
- En la sección general **Trabajos reales**.
- En la ficha del producto correspondiente, **después del mockup**, en una galería de miniaturas.

**Ejemplos:**
- `camisa-01.jpg` / `camisa-02.webp` → Camisas personalizadas
- `taza-01.jpg` → Tazas personalizadas
- `tote-bag-01.jpg` → Tote bags
- `centros-mesa-01.webp` → Centros de mesa
- `arreglo-dulces-01.jpg` → Arreglos de dulces
- `piniatas-01.jpg` → Piñatas

Los IDs están en `src/products.js`. Los archivos cuyos nombres no comiencen por un ID válido se verán **solo en la galería general** (como en V13). No hace falta modificar código cuando agregues fotos nuevas. Evita fotografías de terceros o datos personales sin autorización.

Las fotos del cliente enviadas por las fichas van a R2, son diferentes de las fotografías públicas en `public/trabajos/` y siguen la configuración de 30 días.

## Instalación
1. Haz copia de seguridad de V13, incluida `src/config.js`. Conserva `.git`.
2. Extrae este ZIP y copia los archivos dentro de tu repositorio local.
3. Restaura tu **clave pública de Turnstile** en `src/config.js` si la tienes definida ahí. Nunca coloques la clave privada en el código.
4. Ejecuta `npm install`, `npm run dev` y `npm run build`.
5. Prueba la subida a R2 en la **web publicada** (Vite local no sirve las Functions de Pages de manera predeterminada).
6. Confirma que el botón fijo no tape campos, que puedas abrir miniaturas y que los avisos de confirmación se muestren. Después publica con Git.

## Notas de pruebas
Se validaron el generador de galería con archivos de muestra, el vínculo de IDs y los 32 mockups existentes. **La compilación total de Vite no pudo completarse aquí** porque el registro de npm no fue accesible; realiza `npm install && npm run build` en tu Mac antes de subir a producción.
