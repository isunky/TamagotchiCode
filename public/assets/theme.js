'use strict';
(() => {
  const key='tamaParadiseTheme_v1',choices=['system','dark','light'];
  const media=window.matchMedia('(prefers-color-scheme: dark)');
  const normalize=value=>choices.includes(value)?value:'system';
  let mode='system';try{mode=normalize(localStorage.getItem(key))}catch(_){}
  let button;
  const icons={
    system:'<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8m-4-4v4"/>',
    dark:'<path d="M20.6 13.3A8.7 8.7 0 0 1 10.7 3.4 8.8 8.8 0 1 0 20.6 13.3Z"/>',
    light:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.4 1.4m11.2 11.2L19 19M5 19l1.4-1.4M17.6 6.4 19 5"/>'
  };
  const descriptions={system:'外观：跟随系统；切换到深色模式',dark:'外观：深色模式；切换到浅色模式',light:'外观：浅色模式；切换到跟随系统'};
  function updateButton(){
    if(!button)return;
    const label=window.TamaI18n?.t(descriptions[mode])||descriptions[mode];
    button.setAttribute('aria-label',label);button.title=label;
    button.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+icons[mode]+'</svg>';
  }
  function apply(){
    const actual=mode==='system'?(media.matches?'dark':'light'):mode;
    const root=document.documentElement;root.dataset.theme=actual;root.dataset.themePreference=mode;root.style.colorScheme=actual;
    const chrome=document.querySelector('meta[name="theme-color"]');if(chrome)chrome.content=actual==='dark'?'#191620':'#faf9f6';
    const scheme=document.querySelector('meta[name="color-scheme"]');if(scheme)scheme.content=actual;
    updateButton();
  }
  apply();
  const systemChanged=()=>{if(mode==='system')apply()};
  if(media.addEventListener)media.addEventListener('change',systemChanged);else media.addListener(systemChanged);
  window.addEventListener('storage',event=>{if(event.key===key||event.key===null){mode=normalize(event.newValue);apply()}});
  window.addEventListener('tama:languagechange',updateButton);
  function mount(){
    button=document.createElement('button');button.type='button';button.id='theme-toggle';button.className='theme-toggle';button.dataset.noI18n='';
    const header=document.querySelector('.topbar,.guide-header');
    if(header){let controls=header.querySelector('.site-preferences');if(!controls){controls=document.createElement('div');controls.className='site-preferences';const language=header.querySelector('.language-picker');if(language)controls.append(language);header.append(controls)}controls.append(button)}
    button.addEventListener('click',()=>{mode=choices[(choices.indexOf(mode)+1)%choices.length];try{localStorage.setItem(key,mode)}catch(_){}apply()});
    apply();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();
