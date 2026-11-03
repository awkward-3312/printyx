import { readdir, writeFile, mkdir } from 'node:fs/promises';
import { join, extname, basename } from 'node:path';
const folder = new URL('../public/trabajos/', import.meta.url);
const output = new URL('../src/trabajos.generated.json', import.meta.url);
const extensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);
await mkdir(folder, {recursive:true});
const entries = (await readdir(folder, {withFileTypes:true})).filter(e => e.isFile() && extensions.has(extname(e.name).toLowerCase()));
const gallery = entries.sort((a,b)=>a.name.localeCompare(b.name,'es')).map(({name})=>({
  src:'/trabajos/'+encodeURIComponent(name),
  title:basename(name, extname(name)).replace(/^[0-9]+[-_ ]*/, '').replace(/[-_]+/g,' ').replace(/\s+/g,' ').trim().replace(/^./, c=>c.toLocaleUpperCase('es')) || 'Trabajo personalizado'
}));
await writeFile(output, JSON.stringify(gallery,null,2)+'\n','utf8');
console.log(`Printyx: ${gallery.length} fotografías de trabajos reales incluidas.`);
