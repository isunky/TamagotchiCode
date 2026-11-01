const languages=new Set(['zh-CN','zh-TW','ja','ko','en']);

export function getShareURL(page,language,options={}){
  const path=['/beginner.html','/advanced.html'].includes(page.pathname)?page.pathname:'/';
  const url=new URL(path,'https://tc.sunky.net/');
  url.searchParams.set('lang',languages.has(language)?language:'zh-CN');
  const item=options.itemId??new URLSearchParams(page.search||'').get('item');
  if(path==='/'&&/^[1-9]\d*$/.test(String(item))&&Number.isSafeInteger(Number(item)))url.searchParams.set('item',String(item));
  const hash=options.hash??page.hash;
  if(/^#[a-z][\w-]*$/i.test(hash||''))url.hash=hash;
  return url.href;
}

export async function copyShareLink(url,clipboard,fallback){
  if(typeof clipboard?.writeText==='function'){
    try{await clipboard.writeText(url);return true}catch(_){}
  }
  try{return Boolean(fallback())}catch(_){return false}
}

export async function shareNative(data,platform){
  if(typeof platform?.share!=='function')return 'unavailable';
  try{
    if(typeof platform.canShare==='function'&&!platform.canShare(data))return 'unavailable';
    await platform.share(data);return 'opened';
  }catch(error){return error?.name==='AbortError'?'cancelled':'unavailable'}
}
