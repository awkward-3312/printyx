# Printyx V5 — Archivos de referencia para WhatsApp

Tienda React + Vite con catálogo, personalización y carrito. Conserva las funciones de V4 y agrega selector local de archivos (JPG, PNG, WEBP, SVG, PDF; máximo 5 por selección, 15 MB por archivo).

**Importante:** Los archivos NO se cargan ni se envían automáticamente a WhatsApp. Los nombres se agregan al pedido, y el cliente debe adjuntar los archivos manualmente cuando se abra WhatsApp. No hay almacenamiento de archivos ni base de datos.

## Instalación

1. Haz una copia de tu proyecto actual y conserva su carpeta `.git`.
2. Copia los archivos de este ZIP dentro del repositorio local `printyx`, fusionando y reemplazando los archivos anteriores. No elimines `.git`.
3. En la terminal: `npm install` y `npm run dev`.
4. Prueba la selección de imágenes en una ficha; agrega al carrito; comprueba el texto del pedido en WhatsApp.
5. Ejecuta `npm run build` antes de `git add .`, `git commit -m "Agregar referencias de diseño a Printyx"` y `git push origin main`.

Edita productos en `src/products.js`. El número de WhatsApp está en `src/config.js`.
