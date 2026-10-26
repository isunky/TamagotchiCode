'use strict';
const CATS={all:{label:'全部代码',emoji:'✦'},lab:{label:'实验室角色码',emoji:'✿'},food:{label:'食物',emoji:'◈'},snack:{label:'零食',emoji:'♥'},deco:{label:'装饰道具',emoji:'✧'},toy:{label:'户外玩具',emoji:'☼'}};
const VERS={all:'全版本通用',jgt:'翡翠森林／热带／冰川限定',tg:'热带／冰川限定',neon:'霓虹星球版限定',lwsj:'陆地／海洋／天空／翡翠森林限定'};
const VERSION_SUPPORT={all:['land','water','sky','jade','tropics','glacier','neon'],jgt:['jade','tropics','glacier'],tg:['tropics','glacier'],neon:['neon'],lwsj:['land','water','sky','jade']};
const SRC_PAGE='https://tamagotchi.fandom.com/wiki/Tamagotchi_Paradise/List_of_Codes';
let category='all',view='grid',search='',version='*',hideUsed=false;
let used={};try{used=JSON.parse(localStorage.getItem('tamaParadiseUsed_v1')||'{}')||{};if(typeof used!=='object'||Array.isArray(used))used={}}catch(_){used={}}
const $=s=>document.querySelector(s);const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const imgurl=r=>r.localImg||'';

let timeout;
function showToast(text){const node=$('#toast');node.textContent=text;node.classList.add('on');clearTimeout(timeout);timeout=setTimeout(()=>node.classList.remove('on'),1900)}
function codeText(r){return r.code?`<span class="code">${esc(r.code)}</span>`:'<span class="code pending">尚未公布</span>'}
function imageHTML(r,cl='sprite'){return r.img?`<img class="${cl}" src="${esc(imgurl(r))}" alt="${esc(r.zh)}原图" loading="lazy" decoding="async" referrerpolicy="no-referrer" data-zoom="${r.id}" role="button" tabindex="0" aria-label="放大查看${esc(r.zh)}">`:'<div class="no-img"><span class="ico">◇</span><span>原页未提供图片</span></div>'}
function filterRows(){let q=search.toLowerCase().replace(/\s+/g,'');return DATA.filter(r=>(category==='all'||r.cat===category)&&(version==='*'||VERSION_SUPPORT[r.version].includes(version))&&(!hideUsed||!used[r.id])&&(!q||[r.zh,r.en,r.code,r.source,VERS[r.version],CATS[r.cat].label].some(s=>String(s||'').toLowerCase().replace(/\s+/g,'').includes(q))))}
function drawTabs(){const counts={all:DATA.length};for(let c of ['lab','food','snack','deco','toy'])counts[c]=DATA.filter(r=>r.cat===c).length;$('#tabs').innerHTML=Object.entries(CATS).map(([id,item])=>`<button class="tab ${category===id?'active':''}" data-cat="${id}" type="button">${item.emoji} ${item.label}<span class="count">${counts[id]}</span></button>`).join('')}
function card(r){const label=CATS[r.cat].label;return `<article class="item ${used[r.id]?'used':''}" data-cat="${r.cat}"><div class="item-top"><span class="cat-label">${label}</span>${imageHTML(r)}</div><div class="item-body"><div class="item-name">${esc(r.zh)}</div><div class="item-en" title="${esc(r.en)}">${esc(r.en)}</div><div class="edition ${r.version==='all'?'':'restricted'}" title="${VERS[r.version]}">${VERS[r.version]}</div><div class="codebox">${codeText(r)}<button type="button" class="copy" data-copy="${r.id}" ${r.code?'':'disabled'}>${r.code?'复制':'待发布'}</button></div><div class="item-note" title="${esc(r.source||'输入代码可查看此角色的拓麻细胞信息')}">${esc(r.source||'输入代码可查看该角色的拓麻细胞信息')}</div><div class="item-foot"><a class="source-btn" href="${SRC_PAGE}" target="_blank" rel="noopener noreferrer">↗ 原始资料</a><label class="mark"><input type="checkbox" data-used="${r.id}" ${used[r.id]?'checked':''}> 已使用</label></div></div></article>`}
function tableHTML(rows){return `<table><thead><tr><th>原始图片</th><th>物品／角色名称</th><th>类别</th><th>适用版本</th><th>兑换码</th><th>获取途径或说明</th><th>使用</th></tr></thead><tbody>${rows.map(r=>`<tr class="${used[r.id]?'used':''}"><td>${imageHTML(r,'tiny-img')}</td><td><div class="t-name">${esc(r.zh)}</div><small>${esc(r.en)}</small></td><td>${CATS[r.cat].label}</td><td>${VERS[r.version]}</td><td style="white-space:nowrap">${codeText(r)} <button type="button" data-copy="${r.id}" class="copy" ${r.code?'':'disabled'}>${r.code?'复制':'待发布'}</button></td><td style="max-width:265px;line-height:1.6">${esc(r.source||'输入后查看角色拓麻细胞信息')}</td><td><label class="mark"><input type="checkbox" data-used="${r.id}" ${used[r.id]?'checked':''}> 已使用</label></td></tr>`).join('')}</tbody></table>`}
function render(){const rows=filterRows();$('#list-title').textContent=CATS[category].label;$('#result-count').textContent=`显示 ${rows.length} / ${DATA.length} 条`;$('#empty').style.display=rows.length?'none':'block';$('#grid').style.display=view==='grid'&&rows.length?'grid':'none';$('#table-view').style.display=view==='table'&&rows.length?'block':'none';if(view==='grid'){$('#grid').innerHTML=rows.map(card).join('');$('#table-view').innerHTML=''}else{$('#grid').innerHTML='';$('#table-view').innerHTML=tableHTML(rows)};document.querySelectorAll('.tab').forEach(n=>{n.classList.toggle('active',n.dataset.cat===category);n.setAttribute('aria-pressed',String(n.dataset.cat===category))});$('#view-grid').classList.toggle('active',view==='grid');$('#view-table').classList.toggle('active',view==='table');$('#view-grid').setAttribute('aria-pressed',String(view==='grid'));$('#view-table').setAttribute('aria-pressed',String(view==='table'));try{localStorage.setItem('tamaParadisePrefs_v1',JSON.stringify({version,view}))}catch(_){}}
async function copyText(value){if(navigator.clipboard&&window.isSecureContext){try{await navigator.clipboard.writeText(value);return true}catch(_){}}const previousFocus=document.activeElement;const area=document.createElement('textarea');area.value=value;area.setAttribute('readonly','');area.style.cssText='position:fixed;opacity:0;left:-9999px;top:0';document.body.appendChild(area);area.focus();area.select();let ok=false;try{ok=document.execCommand('copy')}catch(_){}area.remove();previousFocus?.focus();return ok}
document.addEventListener('click',async e=>{const tab=e.target.closest('[data-cat]');if(tab&&tab.classList.contains('tab')){category=tab.dataset.cat;render();return}const copy=e.target.closest('[data-copy]');if(copy){let r=DATA.find(x=>String(x.id)===copy.dataset.copy);if(r?.code){const success=await copyText(r.code);showToast(success?`已复制 ${r.code}`:`请手动复制：${r.code}`)}return}const zoom=e.target.closest('[data-zoom]');if(zoom){const r=DATA.find(x=>String(x.id)===zoom.dataset.zoom);if(r?.img)openZoom(r,zoom);return}if(e.target=== $('#lightbox')||e.target.closest('.close-lightbox'))closeZoom()});
document.addEventListener('change',e=>{if(e.target.matches('[data-used]')){used[e.target.dataset.used]=e.target.checked;try{localStorage.setItem('tamaParadiseUsed_v1',JSON.stringify(used))}catch(_){}render();document.querySelector(`[data-used="${e.target.dataset.used}"]`)?.focus()}});
let zoomTrigger=null;
function openZoom(row,trigger){
  zoomTrigger=trigger;
  $('#big-image').src=imgurl(row);
  $('#big-image').alt=row.zh+' / '+row.en;
  $('#big-caption').textContent=row.zh+' / '+row.en;
  $('#lightbox').classList.add('open');
  document.querySelector('.shell').inert=true;
  document.body.style.overflow='hidden';
  $('.close-lightbox').focus();
}
function closeZoom(){
  if(!$('#lightbox').classList.contains('open'))return;
  $('#lightbox').classList.remove('open');
  $('#big-image').removeAttribute('src');
  document.querySelector('.shell').inert=false;
  document.body.style.overflow='';
  zoomTrigger?.focus();
}
document.addEventListener('keydown',e=>{
  if($('#lightbox').classList.contains('open')){
    if(e.key==='Escape')closeZoom();
    if(e.key==='Tab'){e.preventDefault();$('.close-lightbox').focus()}
    return;
  }
  if((e.key==='Enter'||e.key===' ')&&e.target.matches('[data-zoom]')){
    e.preventDefault();openZoom(DATA.find(r=>String(r.id)===e.target.dataset.zoom),e.target);
  }
});
// Broken local files get a readable placeholder instead of a broken image icon.
document.addEventListener('error',e=>{
  if(!e.target.matches('img[data-zoom]'))return;
  e.target.hidden=true;
  const placeholder=document.createElement('span');
  placeholder.className='no-img';placeholder.textContent='图片暂时无法加载';
  e.target.after(placeholder);
},true);
try{
  const prefs=JSON.parse(localStorage.getItem('tamaParadisePrefs_v1')||'{}');
  if(prefs&&['grid','table'].includes(prefs.view))view=prefs.view;
  if(prefs&&Array.from($('#version').options).some(o=>o.value===prefs.version))version=prefs.version;
}catch(_){}
$('#version').value=version;
const stats=document.querySelectorAll('.stat strong');
[DATA.length,DATA.filter(r=>r.code).length,new Set(DATA.map(r=>r.cat)).size,DATA.filter(r=>!r.code).length].forEach((n,i)=>stats[i].textContent=n);
$('#search').addEventListener('input',e=>{search=e.target.value.trim();render()});$('#version').addEventListener('change',e=>{version=e.target.value;render()});$('#hide-used').addEventListener('change',e=>{hideUsed=e.target.checked;render()});$('#view-grid').addEventListener('click',()=>{view='grid';render()});$('#view-table').addEventListener('click',()=>{view='table';render()});$('#reset').addEventListener('click',()=>{category='all';search='';version='*';hideUsed=false;$('#search').value='';$('#version').value='*';$('#hide-used').checked=false;render()});drawTabs();render();
