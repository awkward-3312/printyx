# Printyx V9 — revisión parcial verificable

Esta versión conserva el código de V8 y sustituye las imágenes de **bordado, bóxer y mochila** por mockups individuales de estilo estudio crema, marcador gris.

**Aún NO es una versión visual final**: otros productos tienen ilustraciones provisionales o mockups antiguos y deben regenerarse individualmente, sin collages ni recortes de láminas. No se afirma que los 32 hayan sido rehechos.

Para instalar: haz copia de seguridad, copia el contenido sobre la carpeta del repositorio conservando `.git` y tu configuración privada. Revisa `src/config.js` antes de sobreescribir; conserva Turnstile.

Ejecuta `npm install`, `npm run build` y comprueba en local antes de publicar. Las funciones R2 y el carrito permanecen iguales.


## V10

Esta versión reemplaza 5 mockups pendientes por versiones individuales y coherentes en el estilo aprobado: mameluco, jarra, llavero, rompecabezas y reloj LED.


## Printyx V11 — Actualización visual

Partiendo de Printyx V10, esta versión incorpora **13 imágenes nuevas individuales**: etiquetas para ropa, tarjetas de presentación, brochures, calendarios, lanyards, botones, uniformes (polo), piñatas, centros de mesa, cajas y bolsitas de fiesta, figuras de PVC, flores eternas y arreglos de dulces. Se mantienen las **5 imágenes nuevas de V10** y las demás imágenes existentes.

**Nota:** el carné (`public/productos/carnes.webp`) conserva su mockup anterior; no se generó una imagen independiente nueva para ese artículo.

No se modificaron `src/App.jsx`, `src/products.js`, las funciones de Cloudflare Pages ni R2: solo se sustituyeron imágenes del catálogo y se actualizó este archivo README.

**Antes de reemplazar archivos:** guarda una copia de tu proyecto actual y de `src/config.js` (su clave pública de Turnstile puede estar configurada solo en tu Mac). No compartas nunca la clave secreta Turnstile.

### Prueba y despliegue

```bash
npm install
npm run dev
npm run build
git add .
git commit -m "Actualizar mockups Printyx V11"
git push origin main
```

Al publicar, verifica que la subida a Cloudflare R2 y los enlaces del pedido por WhatsApp sigan funcionando.

Las imágenes de decoración con temática de abejitas son *ejemplos referenciales*, no fotos de trabajos realizados.
