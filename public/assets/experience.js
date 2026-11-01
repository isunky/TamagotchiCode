'use strict';
(() => {
  function init(){
    const t=value=>window.TamaI18n?.t(value)||value;
    const top=document.createElement('button');top.type='button';top.className='back-top';top.dataset.noI18n='';top.hidden=true;top.textContent='↑';
    const localize=()=>{top.title=t('返回顶部');top.setAttribute('aria-label',t('返回顶部'))};localize();window.addEventListener('tama:languagechange',localize);document.body.append(top);
    top.addEventListener('click',()=>{document.querySelector('header .brand')?.focus({preventScroll:true});window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})});
    const article=document.querySelector('#article'),chapters=Array.from(document.querySelectorAll('.chapter[id]')),links=Array.from(document.querySelectorAll('aside nav a[href^="#"]'));
    let bar;
    if(article){const track=document.createElement('div');track.className='reading-track';track.setAttribute('aria-hidden','true');bar=document.createElement('span');track.append(bar);document.body.append(track)}
    let ticking=false;
    function update(){
      ticking=false;top.hidden=window.scrollY<500;
      if(!article)return;
      const rect=article.getBoundingClientRect(),distance=Math.max(1,rect.height-window.innerHeight+70),progress=Math.min(1,Math.max(0,(70-rect.top)/distance));
      bar.style.transform=`scaleX(${progress})`;
      const active=[...chapters].reverse().find(section=>section.getBoundingClientRect().top<=150)||chapters[0];
      for(const link of links){if(link.hash==='#'+active?.id){link.setAttribute('aria-current','location')}else link.removeAttribute('aria-current')}
    }
    const schedule=()=>{if(!ticking){ticking=true;requestAnimationFrame(update)}};
    window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);window.addEventListener('tama:languagechange',schedule);window.addEventListener('load',schedule,{once:true});update();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
