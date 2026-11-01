import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const read=path=>readFileSync(new URL('../public/'+path,import.meta.url),'utf8');
const context={window:{}};
runInNewContext(read('assets/i18n-data.js'),context);
const entries=context.window.TAMA_TRANSLATIONS;
const locales=['zh-TW','ja','ko','en'];
for(const [source,translations] of Object.entries(entries)){
  for(const locale of locales)assert(typeof translations[locale]==='string'&&translations[locale].trim(),`Missing ${locale}: ${source}`);
}
for(const page of ['index.html','beginner.html','advanced.html']){
  const html=read(page);
  for(const text of html.split(/<[^>]*>/).map(s=>s.trim()).filter(s=>/[\u3400-\u9fff]/.test(s))){
    assert(entries[text],`Untranslated text in ${page}: ${text}`);
  }
  for(const match of html.matchAll(/(?:aria-label|placeholder|title|alt|content)="([^"]+)"/g)){
    if(/[\u3400-\u9fff]/.test(match[1]))assert(entries[match[1]],`Untranslated attribute in ${page}: ${match[1]}`);
  }
  assert(html.includes('assets/i18n-data.js')&&html.includes('assets/i18n.js'),`Missing language scripts: ${page}`);
}
const data=runInNewContext(read('assets/data.js')+'\nDATA');
for(const row of data){assert(entries[row.zh],`Untranslated name: ${row.id}`);if(row.source)assert(entries[row.source],`Untranslated note: ${row.id}`)}
console.log(`Validated ${Object.keys(entries).length} keys in ${locales.length} additional locales, all three pages and ${data.length} entries.`);
