// GET /api/files/:id — enlace secreto de alta entropía, sin listado público.
export async function onRequestGet({ params, env }) {
  const id = String(params.id || '');
  if (!/^[a-f0-9]{64}$/.test(id))
    return new Response('No encontrado', { status: 404 });
  if (!env.PRINTYX_FILES)
    return new Response('Servicio no disponible', { status: 503 });
  const obj = await env.PRINTYX_FILES.get(`pedidos/${id}`);
  if (!obj)
    return new Response('Archivo no encontrado o eliminado', { status: 404 });
  const expiry = Number(obj.customMetadata?.expiresAt || 0);
  if (!expiry || Date.now() >= expiry)
    return new Response('El enlace de este archivo ha vencido', {
      status: 410,
      headers: { 'Cache-Control': 'no-store' },
    });
  const name = (obj.customMetadata?.filename || 'archivo').replace(
    /[\r\n"\\]/g,
    '_'
  );
  return new Response(obj.body, {
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${name.replace(/[^\x20-\x7E]/g, '_')}"; filename*=UTF-8''${encodeURIComponent(name)}`,
      'Content-Length': String(obj.size),
      'Cache-Control': 'private, no-store',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'no-referrer',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}
