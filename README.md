# Printyx · Catálogo web

Proyecto completo React + Vite. Incluye inicio, catálogo, filtros, ficha de producto, carrito y preparación del pedido para WhatsApp.

## Instalación (Mac)

1. Copia todos estos archivos dentro de la carpeta de tu repositorio `printyx` (conserva `.git`).
2. Desde la carpeta del proyecto abre una terminal y ejecuta:

```bash
npm install
npm run dev
```

3. Comprueba que funcione y ejecuta `npm run build`.

## Configuración

- WhatsApp: `src/config.js`, coloca el número real en `WHATSAPP_NUMBER`, en formato `504` + 8 dígitos.
- Productos: `src/products.js`; `price: null` pide cotización, `price: 250` muestra L 250.
- Fotografías: agrégalas a `public/productos/` y define `image: '/productos/nombre.webp'`.
- Instagram: `src/config.js`.

Los productos son demostrativos y los precios quedan pendientes de cotización hasta que los introduzcas.

## Publicación en Cloudflare Pages

Framework: React (Vite) · Build: `npm run build` · Output: `dist` · Branch: `main`.

Luego de probar la web:

```bash
git add .
git commit -m "Restaurar proyecto completo Printyx"
git push origin main
```

No subas `node_modules` ni `dist` a GitHub.
