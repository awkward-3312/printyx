// POST /api/files — Cloudflare Pages Function; el bucket R2 nunca es público.
const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
const allowed = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
]);
const maxFile = 15 * 1024 * 1024;
const maxBody = 80 * 1024 * 1024;
export async function onRequestPost({ request, env }) {
  if (!env.PRINTYX_FILES || !env.TURNSTILE_SECRET_KEY)
    return json({ error: 'Servidor sin configurar: R2 o Turnstile.' }, 503);
  const size = Number(request.headers.get('content-length') || 0);
  if (size > maxBody)
    return json({ error: 'El total de archivos excede 80 MB.' }, 413);
  let form;
  try {
    form = await request.formData();
  } catch {
    return json({ error: 'Formulario inválido.' }, 400);
  }
  const token = form.get('turnstileToken');
  if (typeof token !== 'string' || !token)
    return json({ error: 'Completa la verificación de seguridad.' }, 403);
  const verification = new FormData();
  verification.append('secret', env.TURNSTILE_SECRET_KEY);
  verification.append('response', token);
  verification.append(
    'remoteip',
    request.headers.get('CF-Connecting-IP') || ''
  );
  let verified;
  try {
    const response = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      { method: 'POST', body: verification }
    );
    verified = await response.json();
  } catch {
    return json({ error: 'No se pudo verificar el acceso.' }, 502);
  }
  if (!verified.success)
    return json(
      { error: 'La verificación expiró o falló. Vuelve a intentarlo.' },
      403
    );
  const files = form.getAll('files');
  if (files.length < 1 || files.length > 5)
    return json({ error: 'Adjunta entre 1 y 5 archivos.' }, 400);
  if (
    files.some(
      (f) =>
        typeof f === 'string' ||
        !allowed.has(f.type) ||
        f.size < 1 ||
        f.size > maxFile
    )
  )
    return json(
      {
        error: 'Solo se admiten JPG, PNG, WEBP o PDF de hasta 15 MB cada uno.',
      },
      400
    );
  const expiry = Date.now() + 30 * 24 * 60 * 60 * 1000;
  const uploaded = [];
  try {
    for (const file of files) {
      const id = Array.from(crypto.getRandomValues(new Uint8Array(32)), (b) =>
        b.toString(16).padStart(2, '0')
      ).join('');
      const key = `pedidos/${id}`;
      const name = (file.name || 'archivo')
        .replace(/[\\/\r\n\x00-\x1f]/g, '_')
        .slice(0, 120);
      await env.PRINTYX_FILES.put(key, file.stream(), {
        httpMetadata: { contentType: 'application/octet-stream' },
        customMetadata: {
          filename: name,
          expiresAt: String(expiry),
          originalType: file.type,
        },
      });
      uploaded.push({
        key,
        name,
        url: new URL(`/api/files/${id}`, request.url).toString(),
      });
    }
    return json(
      {
        files: uploaded.map(({ name, url }) => ({ name, url })),
        expiresAt: new Date(expiry).toISOString(),
      },
      201
    );
  } catch {
    // Ante fallos parciales, elimina los objetos recién creados.
    await Promise.allSettled(
      uploaded.map(({ key }) => env.PRINTYX_FILES.delete(key))
    );
    return json(
      {
        error:
          'Hubo un problema al guardar los archivos. No se completó el pedido.',
      },
      500
    );
  }
}
export function onRequest() {
  return json({ error: 'Método no permitido.' }, 405);
}
