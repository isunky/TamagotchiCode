import {getShareURL,copyShareLink,shareNative} from './share-utils.mjs?v=20261101-share1';

function initializeSharing(){
  const t=value=>window.TamaI18n?.t(value)||value;
  const shareIcon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 10.5 6.8-4M8.6 13.5l6.8 4"/></svg>';
  const trigger=document.createElement('button');trigger.type='button';trigger.className='share-trigger';trigger.dataset.noI18n='';trigger.innerHTML=shareIcon+'<span></span>';trigger.setAttribute('aria-haspopup','dialog');
  const dialog=document.createElement('dialog');dialog.className='share-dialog';dialog.id='share-dialog';dialog.dataset.noI18n='';dialog.setAttribute('aria-labelledby','share-heading');dialog.setAttribute('aria-describedby','share-description');
  dialog.innerHTML=`<button type="button" class="share-close"><span aria-hidden="true">×</span></button><div class="share-emblem">${shareIcon}</div><h2 id="share-heading"></h2><p id="share-description"></p><label for="share-url" class="share-label"></label><input id="share-url" readonly type="url" spellcheck="false" dir="ltr"><div class="share-buttons"><button type="button" class="share-copy"></button><button type="button" class="share-native"></button></div><p class="share-status" role="status" aria-live="polite"></p>`;
  document.body.append(trigger,dialog);
  const field=dialog.querySelector('#share-url'),copyButton=dialog.querySelector('.share-copy'),nativeButton=dialog.querySelector('.share-native'),closeButton=dialog.querySelector('.share-close'),status=dialog.querySelector('.share-status');
  let busy=false;
  function shareURL(){return getShareURL(location,window.TamaI18n?.language||document.documentElement.lang)}
  function updateText(){
    trigger.querySelector('span').textContent=t('分享');trigger.setAttribute('aria-label',t('分享当前页面'));
    dialog.querySelector('h2').textContent=t('把这份快乐分享出去');
    dialog.querySelector('#share-description').textContent=t('分享当前图鉴或攻略，链接会保留语言和章节位置。');
    dialog.querySelector('.share-label').textContent=t('页面链接');closeButton.setAttribute('aria-label',t('关闭分享窗口'));
    copyButton.textContent=t('复制链接');nativeButton.textContent=t('系统分享');nativeButton.hidden=typeof navigator.share!=='function';
    field.value=shareURL();status.textContent='';
  }
  trigger.addEventListener('click',()=>{updateText();if(!dialog.open)dialog.showModal()});
  closeButton.addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>trigger.focus({preventScroll:true}));
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
    const result=await shareNative({title:document.title,url:shareURL()},navigator);
    busy=false;nativeButton.disabled=false;
    status.textContent=result==='unavailable'?t('暂时无法打开系统分享，请复制链接。'):'';
  });
  window.addEventListener('tama:languagechange',updateText);
  window.addEventListener('hashchange',()=>{if(dialog.open)field.value=shareURL()});
  updateText();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initializeSharing,{once:true});else initializeSharing();
