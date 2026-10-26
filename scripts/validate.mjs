import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { runInNewContext } from 'node:vm';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const publicDir = path.join(root, 'public');
const read = file => readFileSync(path.join(publicDir, file), 'utf8');
const data = runInNewContext(`${read('assets/data.js')}\nDATA;`);
const sources = JSON.parse(read('assets/image-sources.json'));
assert.equal(new Set(data.map(row => row.id)).size, data.length, 'IDs must be unique');
const knownCategories = new Set(['lab', 'food', 'snack', 'deco', 'toy']);
const knownVersions = new Set(['all', 'jgt', 'tg', 'neon', 'lwsj']);
for (const row of data) {
  assert(knownCategories.has(row.cat) && knownVersions.has(row.version), `Invalid category/version: ${row.id}`);
  assert(row.zh && row.en, `Missing name: ${row.id}`);
  assert(!row.code || /^[A-Z0-9]{4} [A-Z0-9]{4}$/.test(row.code), `Invalid code format: ${row.id}`);
  assert(row.cat === 'lab' || /^\d{4} \d{4}$/.test(row.code), `Shop code must be numeric: ${row.id}`);
  if (row.img) {
    assert(row.localImg?.startsWith('./assets/images/'), `Nonlocal image: ${row.id}`);
    assert(existsSync(path.join(publicDir, row.localImg)), `Missing image: ${row.localImg}`);
    assert(sources.some(source => './' + source.path === row.localImg), `Unattributed image: ${row.id}`);
  }
}
for (const source of sources) {
  const bytes = readFileSync(path.join(publicDir, source.path));
  assert.equal(bytes.length, source.bytes);
  assert.equal(createHash('sha256').update(bytes).digest('hex'), source.sha256);
  assert.equal(bytes.toString('ascii', 0, 4), 'RIFF');
  assert.equal(bytes.toString('ascii', 8, 12), 'WEBP');
}
for (const match of read('index.html').matchAll(/(?:src|href)="(\.\/[^"#]+)"/g)) {
  assert(existsSync(path.join(publicDir, match[1])), `Broken HTML asset: ${match[1]}`);
}
assert(!/https?:\/\//.test(read('assets/app.js').replace(/const SRC_PAGE=.*;/, '')), 'App should not request external assets');
assert(!/src="https?:/.test(read('index.html')), 'HTML should not request external assets');
console.log(`Validated ${data.length} records and ${sources.length} local images, including SHA-256 and asset links.`);
