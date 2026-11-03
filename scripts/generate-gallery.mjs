import { readdir, writeFile, mkdir, readFile } from 'node:fs/promises';
import { extname, basename } from 'node:path';

const folder = new URL('../public/trabajos/', import.meta.url);
const output = new URL('../src/trabajos.generated.json', import.meta.url);
const source = new URL('../src/products.js', import.meta.url);
const extensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);
const slug = (value) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
const content = await readFile(source, 'utf8');
const ids = [...content.matchAll(/\bid:\s*['"]([^'"]+)['"]/g)].map((m) => m[1]);
const sortedIds = [...ids].sort((a, b) => b.length - a.length);
await mkdir(folder, { recursive: true });
const entries = (await readdir(folder, { withFileTypes: true })).filter(
  (e) => e.isFile() && extensions.has(extname(e.name).toLowerCase())
);
const gallery = entries
  .sort((a, b) => a.name.localeCompare(b.name, 'es', { numeric: true }))
  .map(({ name }) => {
    const fileSlug = slug(basename(name, extname(name)));
    // Esquema: id-del-producto-01.jpg, p. ej., tote-bag-02.webp.
    // Las fotografías con cualquier otro nombre siguen en la galería general.
    const productId =
      sortedIds.find(
        (id) => fileSlug === id || fileSlug.startsWith(`${id}-`)
      ) || null;
    const title =
      basename(name, extname(name))
        .replace(/^[0-9]+[-_ ]*/, '')
        .replace(/[-_]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/^./, (c) => c.toLocaleUpperCase('es')) ||
      'Trabajo personalizado';
    return { src: '/trabajos/' + encodeURIComponent(name), title, productId };
  });
await writeFile(output, JSON.stringify(gallery, null, 2) + '\n', 'utf8');
console.log(
  `Printyx: ${gallery.length} trabajos reales (${gallery.filter((p) => p.productId).length} asociados a fichas).`
);
