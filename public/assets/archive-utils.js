'use strict';
(() => {
  const normalize=value=>String(value??'').normalize('NFKC').toLowerCase().replace(/[\s\u2010-\u2015\u2212-]+/g,'');
  function indexRows(rows,translations,categories,versions){
    return new Map(rows.map(row=>[row.id,[row.zh,row.en,row.code,row.source,versions[row.version],categories[row.cat].label].flatMap(value=>[value,...Object.values(translations?.[value]||{})]).map(normalize)]));
  }
  function filter(rows,state,{index,used,support}){
    const query=normalize(state.search);
    return rows.filter(row=>(!state.sharedItemId||String(row.id)===String(state.sharedItemId))&&(state.category==='all'||row.cat===state.category)&&(state.version==='*'||support[row.version]?.includes(state.version))&&(!state.hideUsed||!used[row.id])&&(!query||index.get(row.id)?.some(value=>value.includes(query))));
  }
  window.TamaArchiveUtils=Object.freeze({normalize,indexRows,filter});
})();
