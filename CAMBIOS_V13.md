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



----

¡Es muy sencillo! 💙 En Printyx V13 preparé el sistema para que reconozca automáticamente las fotografías por su nombre, sin necesidad de modificar el código.

Eso sí, hay una diferencia importante: actualmente el nombre determina el título que aparece en la galería, pero no vincula automáticamente la fotografía con la ficha del producto.

## Cómo debes nombrar las imágenes

Te recomiendo utilizar este formato:

`01-nombre-del-producto.jpg`

Por ejemplo:

| Producto                 | Nombre del archivo                |
| ------------------------ | --------------------------------- |
| Camisas                  | `01-camisas-personalizadas.jpg`   |
| Tazas                    | `02-tazas-personalizadas.webp`    |
| Termos                   | `03-termos-personalizados.jpg`    |
| Gorras                   | `04-gorras-personalizadas.jpg`    |
| Piñatas                  | `05-pinatas-personalizadas.jpg`   |
| Centros de mesa          | `06-centros-de-mesa.jpg`          |
| Flores eternas           | `07-flores-eternas.jpg`           |
| Arreglos de dulces       | `08-arreglos-de-dulces.jpg`       |
| Tarjetas de presentación | `09-tarjetas-de-presentacion.jpg` |
| Uniformes                | `10-uniformes-personalizados.jpg` |

El número sirve para ordenar las fotografías. El resto del nombre se convierte automáticamente en un título.

Por ejemplo, `06-centros-de-mesa.jpg` aparecerá como Centros de mesa.

## ¿Y si tienes varias fotografías del mismo producto?

Puedes utilizar:

```
01-camisas-personalizadas.jpg
02-camisas-personalizadas.jpg
03-camisas-personalizadas.jpg
04-tazas-personalizadas.jpg
05-tazas-personalizadas.jpg
```

Todas aparecerán como fotografías independientes dentro de Trabajos reales.

## ¿Dónde debes colocarlas?

printyx

public

trabajos

01-camisas-personalizadas.jpg

02-tazas-personalizadas.webp

Al agregar nuevas imágenes y publicar los cambios en GitHub, Cloudflare actualizará automáticamente la galería.

## Una mejora que te recomendaría

En una próxima actualización podríamos hacer que las fotografías reales también aparezcan dentro de la ficha del producto correspondiente, junto al mockup.

Por ejemplo, al abrir Camisas personalizadas, el cliente podría deslizar entre el mockup y las fotografías de camisas que Printyx ya ha realizado.

Para eso utilizaríamos nombres como `camisa-01.jpg`, `camisa-02.jpg` y `taza-01.jpg`, relacionándolos con los identificadores de `src/products.js`.

Así tendríamos lo mejor de ambos mundos: un catálogo visualmente uniforme y ejemplos reales de lo que Printyx puede hacer.

Por ahora, en V13, tus fotografías se mostrarán en la sección general «Trabajos reales», no dentro de cada producto.