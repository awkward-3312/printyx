# Printyx V13 — Tres mejoras finales

## 1. Revisión de cotización
- Desde el carrito se accede a **Revisar cotización**.
- Muestra todos los productos, variantes, cantidades, enlaces de diseños y precios por cotizar.
- Se puede volver al carrito o editar un producto sin perder los archivos adjuntos.
- Al continuar se abre WhatsApp con el texto prellenado. **El cliente debe presionar Enviar en WhatsApp**.

## 2. Trabajos reales automáticos
- Coloca fotos propias en `public/trabajos/` con nombres como `01-camisa-para-evento.jpg`.
- Archivos soportados: JPG, JPEG, PNG, WEBP y AVIF.
- Al ejecutar `npm run dev` o `npm run build`, el script `scripts/generate-gallery.mjs` crea el listado automáticamente.
- El nombre de cada fotografía se convierte en su título. Numera los archivos (`01-`, `02-`) si quieres controlar el orden.
- Si no hay fotos, la sección se oculta. Cuando agregues alguna, aparecerá automáticamente.
- Las imágenes deben ser trabajos reales, con permiso para publicarlos; no compartir datos privados del cliente.
- En desarrollo, después de agregar imágenes, reinicia `npm run dev` para regenerar el listado.
- En GitHub + Cloudflare Pages, subir las fotografías y hacer commit/push dispara el despliegue, que ejecuta `npm run build` y actualiza la galería.

## 3. Vista previa en redes
- `public/social-printyx.jpg` es la imagen Open Graph de 1200 × 630 para WhatsApp/Facebook.
- `public/favicon.png` es el ícono para la pestaña del navegador.
- El `index.html` contiene metadatos Open Graph, X/Twitter y canonical para `https://printyx-av3.pages.dev/`.
- Si usas un dominio propio, reemplaza esa dirección en `index.html` antes de publicar.
- Las redes sociales pueden conservar temporalmente una vista previa anterior en caché.

## Funcionalidad conservada
- Catálogo, fichas, variantes, carrito editable, políticas, filtros, WhatsApp, Turnstile y Cloudflare R2 se conservan.
- No se modificaron las funciones de R2 ni el funcionamiento de los archivos subidos.
- Revisa la clave pública `TURNSTILE_SITE_KEY` en `src/config.js`: la plantilla no incluye tus claves privadas.
