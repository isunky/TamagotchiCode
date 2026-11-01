const languages=new Set(['zh-CN','zh-TW','ja','ko','en']);

export function getShareURL(page,language){
  const path=['/beginner.html','/advanced.html'].includes(page.pathname)?page.pathname:'/';
  const url=new URL(path,'https://tc.sunky.net/');
  url.searchParams.set('lang',languages.has(language)?language:'zh-CN');
  if(/^#[a-z][\w-]*$/i.test(page.hash||''))url.hash=page.hash;
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
