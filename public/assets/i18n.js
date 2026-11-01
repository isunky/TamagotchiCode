'use strict';
(() => {
  const dictionaries=window.TAMA_TRANSLATIONS;
  const languages={'zh-CN':'简体中文','zh-TW':'繁體中文',ja:'日本語',ko:'한국어',en:'English'};
  const storageKey='tamaParadiseLanguage_v1';
  const normalize=value=>{const l=String(value||'').toLowerCase();if(['zh-tw','zh-hk','zh-mo','zh-hant'].some(x=>l.startsWith(x)))return 'zh-TW';if(l.startsWith('zh'))return 'zh-CN';return ['ja','ko','en'].find(x=>l.startsWith(x))||null};
  let saved;try{saved=localStorage.getItem(storageKey)}catch(_){}
  let language=normalize(new URL(location.href).searchParams.get('lang'))||normalize(saved)||normalize(navigator.language)||'zh-CN';
  const textCache=new WeakMap(),attributeCache=new WeakMap();
  function t(value){
    const source=String(value??'');if(language==='zh-CN')return source;
    const key=source.trim();let result=dictionaries[key]?.[language];
    if(result===undefined){
      let m=key.match(/^显示 (\d+) \/ (\d+) 条$/);
      if(m)result=({'zh-TW':`顯示 ${m[1]} / ${m[2]} 筆`,en:`${m[1]} of ${m[2]} entries`,ja:`${m[2]}件中${m[1]}件を表示`,ko:`${m[2]}개 중 ${m[1]}개 표시`})[language];
      else if((m=key.match(/^([✦✿◈♥✧☼]) (.+)$/)))result=`${m[1]} ${t(m[2])}`;
      else if((m=key.match(/^已复制 (.+)$/)))result=({'zh-TW':`已複製 ${m[1]}`,en:`Copied ${m[1]}`,ja:`コピーしました：${m[1]}`,ko:`복사했어요: ${m[1]}`})[language];
      else if((m=key.match(/^请手动复制：(.+)$/)))result=({'zh-TW':`請手動複製：${m[1]}`,en:`Copy manually: ${m[1]}`,ja:`手動でコピーしてください：${m[1]}`,ko:`직접 복사해 주세요: ${m[1]}`})[language];
      else if((m=key.match(/^放大查看(.+)$/)))result=({'zh-TW':`放大檢視${t(m[1])}`,en:`Enlarge ${t(m[1])}`,ja:`${t(m[1])}を拡大`,ko:`${t(m[1])} 확대 보기`})[language];
      else if((m=key.match(/^(.+)原图$/)))result=({'zh-TW':`${t(m[1])}原圖`,en:`${t(m[1])} original image`,ja:`${t(m[1])}の元画像`,ko:`${t(m[1])} 원본 이미지`})[language];
    }
    return result===undefined?source:source.replace(key,()=>result);
  }
  function apply(root=document){
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    let node;while((node=walker.nextNode())){
      if(node.parentElement?.closest('script,style,noscript,[data-no-i18n]'))continue;
      const previous=textCache.get(node),source=previous&&node.nodeValue===previous.last?previous.source:node.nodeValue;
      let last=t(source);
      if(language==='en'&&node.parentElement?.matches('.stat small')&&['条','条记录'].includes(source.trim())&&node.parentElement.parentElement.querySelector('strong')?.textContent==='1')last='entry';
      node.nodeValue=last;textCache.set(node,{source,last});
    }
    const selector='[aria-label],[placeholder],[title],[alt],meta[name="description"]';
    for(const element of root.querySelectorAll(selector)){
      if(element.closest('[data-no-i18n]'))continue;
      let cached=attributeCache.get(element);if(!cached){cached={};attributeCache.set(element,cached)}
      for(const attr of ['aria-label','placeholder','title','alt',...(element.matches('meta')?['content']:[])]){
        if(!element.hasAttribute(attr))continue;
        const value=element.getAttribute(attr),previous=cached[attr],source=previous&&value===previous.last?previous.source:value,last=t(source);
        element.setAttribute(attr,last);cached[attr]={source,last};
      }
    }
    for(const a of root.querySelectorAll('a[href]')){
      const raw=a.getAttribute('href');if(raw.startsWith('#'))continue;
      const url=new URL(raw,location.href);
      if(url.origin===location.origin&&/\/(?:index|beginner|advanced)\.html$/.test(url.pathname)){url.searchParams.set('lang',language);a.href=url.href}
    }
    document.documentElement.lang=language;
  }
  const label=document.createElement('label');label.className='language-picker';label.dataset.noI18n='';
  const icon=document.createElement('span');icon.setAttribute('aria-hidden','true');icon.textContent='◎';
  const select=document.createElement('select');select.id='site-language';select.setAttribute('aria-label','语言 / Language');
  for(const [value,name] of Object.entries(languages)){const option=document.createElement('option');option.value=value;option.textContent=name;option.lang=value;select.append(option)}
  select.value=language;label.append(icon,select);
  const header=document.querySelector('.topbar,.guide-header');header?.append(label);
  select.addEventListener('change',()=>{
    language=select.value;try{localStorage.setItem(storageKey,language)}catch(_){}
    const url=new URL(location.href);url.searchParams.set('lang',language);history.replaceState(null,'',url.href);
    apply();window.dispatchEvent(new Event('tama:languagechange'));
  });
  window.TamaI18n={t,apply,get language(){return language}};
  apply();
})();
