# Printyx V7 — Mockups integrados al catálogo

Esta actualización parte del proyecto V6 y mantiene el carrito, las personalizaciones, WhatsApp, Cloudflare Pages Functions y el almacenamiento R2.

## Imágenes

10 mockups generados y optimizados como WEBP en `public/productos/`. Las referencias se enlazan desde `src/products.js`.

- Camisa → `camisa.webp`
- Taza → `taza.webp`
- Termo → `termo.webp`
- Gorra → `gorra.webp`
- Banner → `banners.webp`
- Cuadro → `cuadro-madera.webp`
- Sticker → `stickers.webp`
- Tote bag → `tote-bag.webp` (producto agregado)
- Cojín → `cojin.webp`
- Mousepad → `mousepad.webp`

Los demás productos mantienen sus imágenes provisionales, sin inventar representaciones. Los mockups son referenciales, no fotografías reales ni plantillas de impresión a escala.

## Instalación

Haz una copia de seguridad de la carpeta existente. Copia el **contenido** de este ZIP en tu proyecto GitHub `printyx`, conservando `.git` y tus configuraciones locales. Si habías cambiado `src/config.js` con la clave pública Turnstile, **guarda ese archivo antes de sobrescribir y restáuralo después**. Las claves privadas deben seguir en Cloudflare, nunca en el repositorio.

Prueba con `npm install`, `npm run dev`, `npm run build` y después publica con `git add .`, `git commit -m "Agregar mockups a Printyx"`, `git push origin main`. Las funciones R2 se prueban en Cloudflare Pages, no en el servidor Vite local.

