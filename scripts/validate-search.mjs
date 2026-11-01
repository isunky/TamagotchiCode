import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const read=file=>readFileSync(new URL('../public/assets/'+file,import.meta.url),'utf8');
const context={window:{}};runInNewContext(read('archive-utils.js'),context);runInNewContext(read('i18n-data.js'),context);
const {normalize,indexRows,filter}=context.window.TamaArchiveUtils;
const rows=runInNewContext(read('data.js')+'\nDATA');
const app=read('app.js');const {CATS,VERS,VERSION_SUPPORT}=runInNewContext(app.slice(0,app.indexOf('const SRC_PAGE'))+'\n({CATS,VERS,VERSION_SUPPORT})');
const original=JSON.stringify(rows),index=indexRows(rows,context.window.TAMA_TRANSLATIONS,CATS,VERS);
const find=(state={},used={})=>filter(rows,{category:'all',version:'*',search:'',hideUsed:false,sharedItemId:null,...state},{index,used,support:VERSION_SUPPORT});
assert.equal(normalize(' ５３６８－４７４３ '),'53684743');
for(const search of ['5368 4743','５３６８－４７４３','5368–4743','5368‑4743','TACOS','タコス','ﾀｺｽ','타코','墨西哥卷饼']){
 const found=find({search});assert.equal(found.length,1,search);assert.equal(found[0].id,21,search);
}
assert.equal(find({search:'Tacos',hideUsed:true},{21:true}).length,0);
assert.equal(find({category:'food'}).length,2);
assert(find({version:'land'}).every(row=>VERSION_SUPPORT[row.version].includes('land')));
assert.equal(find({version:'land',search:'5463 8572'}).length,0);
assert(!find({search:'Cosmitchi'})[0].code);
assert.equal(find({sharedItemId:'62',search:'Academic Cap'})[0].id,62);
assert.equal(find({search:'no-such-item-123'}).length,0);
assert.equal(JSON.stringify(rows),original,'Searching must not mutate archive data');
console.log('Validated multilingual/full-width search, category/device/used filters, shared items and unchanged data.');
