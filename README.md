# Printyx V6 — Archivos privados con R2 (30 días)

## Preparación antes de publicar

1. **No borres `.git`** al copiar el contenido de este proyecto a tu carpeta `printyx`.
2. En Cloudflare R2, el bucket `printyx-pedidos` debe estar **privado** y tener una regla de ciclo de vida que elimine objetos tras **30 días**.
3. En Cloudflare Pages → `printyx` → Settings → Bindings, el bucket debe estar vinculado con nombre **`PRINTYX_FILES`** (Production).
4. En **Cloudflare Turnstile**, crea un widget para el hostname `printyx-av3.pages.dev` y para cualquier dominio propio. Copia su **Site key** (pública) en `src/config.js` → `TURNSTILE_SITE_KEY`. No subas la **Secret key** a GitHub.
5. En Cloudflare Pages → Settings → Variables and Secrets, agrega **`TURNSTILE_SECRET_KEY`** como secreto de Production con la **Secret key** que te dio Turnstile. Si usas Preview deployments, haz lo mismo para Preview con los hostnames correspondientes.
6. Ejecuta `npm install`, `npm run build`; sube los cambios a GitHub con `git add . && git commit -m "Integrar R2 para archivos" && git push origin main`.
7. Verifica que el despliegue es Success. En la web publicada selecciona un producto, adjunta un archivo de prueba sin datos privados, completa Turnstile, agrega el producto al carrito y confirma que el enlace descargue el archivo. Comprueba que aparece en R2.

## Importante

- `npm run dev` sirve para comprobar el diseño, **pero no activa** la API de `/functions` de Cloudflare. Las subidas reales se prueban en el sitio publicado. Se puede usar Wrangler Pages Dev para pruebas locales avanzadas.
- Archivos admitidos: JPG, PNG, WEBP y PDF; máximo 5 de 15 MB cada uno. SVG no se admite por seguridad.
- El contenido se conserva en un **bucket privado**, pero **cualquiera que posea el enlace secreto puede descargarlo** mientras siga vigente. No es un sistema de cuentas ni de autenticación del propietario del pedido.
- Los enlaces dejan de funcionar a los 30 días; Cloudflare R2 elimina los objetos mediante la regla de ciclo de vida normalmente dentro de las 24 horas siguientes.
- Los archivos quedan en R2 aunque el usuario abandone WhatsApp o quite el artículo del carrito. Caducan según la misma regla de 30 días.
- Para una tienda pública, Turnstile es obligatorio en esta implementación y conviene añadir límites de solicitudes en las reglas de seguridad de Cloudflare y monitorear el uso y la facturación de R2.
- No hay análisis antivirus: no abras archivos desconocidos sin precaución.
- No conserves datos personales sensibles; informa al cliente del tratamiento de los archivos.
