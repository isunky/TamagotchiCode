import {getShareURL,copyShareLink,shareNative} from './share-utils.mjs?v=20261101-share2';

function initializeSharing(){
  const t=value=>window.TamaI18n?.t(value)||value;
  const shareIcon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 10.5 6.8-4M8.6 13.5l6.8 4"/></svg>';
  const trigger=document.createElement('button');trigger.type='button';trigger.className='share-trigger';trigger.dataset.noI18n='';trigger.innerHTML=shareIcon+'<span></span>';trigger.setAttribute('aria-haspopup','dialog');
  const dialog=document.createElement('dialog');dialog.className='share-dialog';dialog.id='share-dialog';dialog.dataset.noI18n='';dialog.setAttribute('aria-labelledby','share-heading');dialog.setAttribute('aria-describedby','share-description');
  dialog.innerHTML=`<button type="button" class="share-close"><span aria-hidden="true">×</span></button><div class="share-emblem">${shareIcon}</div><h2 id="share-heading"></h2><p id="share-description"></p><label for="share-url" class="share-label"></label><input id="share-url" readonly type="url" spellcheck="false" dir="ltr"><div class="share-buttons"><button type="button" class="share-copy"></button><button type="button" class="share-native"></button></div><p class="share-status" role="status" aria-live="polite"></p>`;
  document.body.append(trigger,dialog);
  const field=dialog.querySelector('#share-url'),copyButton=dialog.querySelector('.share-copy'),nativeButton=dialog.querySelector('.share-native'),closeButton=dialog.querySelector('.share-close'),status=dialog.querySelector('.share-status');
  let busy=false,context={},returnFocus=trigger;
  const preview=document.createElement('div');preview.className='share-record-preview';preview.hidden=true;dialog.querySelector('#share-description').after(preview);
  function record(){return context.itemId?window.TamaArchive?.getRecord(context.itemId):null}
  function shareURL(){return getShareURL(location,window.TamaI18n?.language||document.documentElement.lang,context)}
  function shareTitle(){const row=record();return row?`${t(row.zh)} · ${row.code||t('尚未公布')} · Tamagotchi Paradise`:context.section?`${document.getElementById(context.section)?.querySelector('h2')?.firstChild?.textContent||''} · ${document.title}`:document.title}
  function updateText(){
    trigger.querySelector('span').textContent=t('分享');trigger.setAttribute('aria-label',t('分享当前页面'));
    dialog.querySelector('h2').textContent=t('把这份快乐分享出去');
    dialog.querySelector('#share-description').textContent=t(context.itemId?'朋友打开链接即可查看这条代码、图片与适用版本。':context.section?'朋友打开链接后会直接定位到这个章节。':context.guide?'分享这篇攻略，朋友将以你选择的语言阅读。':'分享当前图鉴或攻略，链接会保留语言和章节位置。');
    preview.replaceChildren();const row=record();preview.hidden=!row;
    if(row){
      if(row.localImg){const image=document.createElement('img');image.src=row.localImg;image.alt=t(row.zh);preview.append(image)}
      const details=document.createElement('div'),name=document.createElement('strong'),code=document.createElement('code'),version=document.createElement('small');
      name.textContent=t(row.zh);code.textContent=row.code||t('尚未公布');version.textContent=t(window.TamaArchive.getVersion(row.version));details.append(name,code,version);preview.append(details);
    }
    dialog.querySelector('.share-label').textContent=t('页面链接');closeButton.setAttribute('aria-label',t('关闭分享窗口'));
    copyButton.textContent=t('复制链接');nativeButton.textContent=t('系统分享');nativeButton.hidden=typeof navigator.share!=='function';
    field.value=shareURL();status.textContent='';
  }
  function openShare(next,source){context=next;returnFocus=source;updateText();if(!dialog.open)dialog.showModal()}
  trigger.addEventListener('click',()=>openShare({},trigger));
  document.addEventListener('click',event=>{
    const item=event.target.closest('[data-share-item]');
    if(item&&window.TamaArchive?.getRecord(item.dataset.shareItem)){openShare({itemId:item.dataset.shareItem,hash:'#main'},item);return}
    const guide=event.target.closest('[data-share-guide]');if(guide){openShare({guide:true,hash:''},guide);return}
    const section=event.target.closest('[data-share-section]');if(section)openShare({section:section.dataset.shareSection,hash:'#'+section.dataset.shareSection},section);
  });
  closeButton.addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>{const target=returnFocus?.isConnected?returnFocus:trigger;target.focus({preventScroll:true})});
  dialog.addEventListener('click',event=>{
    if(event.target!==dialog)return;
    const rect=dialog.getBoundingClientRect();
    if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();
  });
  field.addEventListener('click',()=>field.select());
  copyButton.addEventListener('click',async()=>{
    if(busy)return;busy=true;copyButton.disabled=true;
    const value=shareURL();field.value=value;
    const copied=await copyShareLink(value,navigator.clipboard,()=>{field.focus();field.select();return document.execCommand('copy')});
    busy=false;copyButton.disabled=false;
    status.textContent=t(copied?'链接已复制，可以粘贴给朋友了。':'无法自动复制，请选中上方链接手动复制。');
    if(copied)copyButton.focus({preventScroll:true});else{field.focus();field.select()}
  });
  nativeButton.addEventListener('click',async()=>{
    if(busy)return;busy=true;nativeButton.disabled=true;
    const row=record();const data={title:shareTitle(),url:shareURL()};if(row)data.text=`${t(row.zh)} · ${row.code||t('尚未公布')} · ${t(window.TamaArchive.getVersion(row.version))}`;
    const result=await shareNative(data,navigator);
    busy=false;nativeButton.disabled=false;
    status.textContent=result==='unavailable'?t('暂时无法打开系统分享，请复制链接。'):'';
  });
  window.addEventListener('tama:languagechange',updateText);
  window.addEventListener('hashchange',()=>{if(dialog.open)field.value=shareURL()});
  const intro=document.querySelector('.guide-intro');
  if(intro){const button=document.createElement('button');button.type='button';button.className='article-share';button.dataset.shareGuide='';button.setAttribute('aria-haspopup','dialog');button.textContent='分享这篇攻略 ↗';intro.append(button)}
  for(const section of document.querySelectorAll('.chapter[id]')){const button=document.createElement('button');button.type='button';button.className='section-share';button.dataset.shareSection=section.id;button.setAttribute('aria-haspopup','dialog');button.textContent='分享章节 ↗';section.querySelector('h2')?.append(button)}
  window.TamaI18n?.apply();
  updateText();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initializeSharing,{once:true});else initializeSharing();
