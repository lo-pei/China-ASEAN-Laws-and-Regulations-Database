const fs=require('fs'), vm=require('vm'), path=require('path');
let lawZh=0;
for(const f of fs.readdirSync('prototype/data/laws')){
  if(!f.endsWith('.json')||f==='index.json') continue;
  const o=JSON.parse(fs.readFileSync('prototype/data/laws/'+f,'utf8'));
  if((o.title||{}).zh) lawZh++;
}
let packZh=0, packTotal=0;
for(const d of ['intl','cn','fulltext']){
  for(const f of fs.readdirSync('prototype/data/'+d)){
    if(!f.endsWith('.js')||f==='manifest.js') continue;
    const c={window:{}}; c.window=c; vm.createContext(c);
    try{ vm.runInContext(fs.readFileSync('prototype/data/'+d+'/'+f,'utf8'),c); }catch(e){ continue; }
    const K=Object.keys(c).find(k=>k.startsWith('CALR_')&&k!=='CALR_INTL_MANIFEST'&&k!=='CALR_FULLTEXT_MANIFEST');
    const T=c[K]||{};
    for(const id of Object.keys(T)){
      packTotal++;
      if((T[id].title||{}).zh) packZh++;
    }
  }
}
console.log('  laws/ 有中文标题: '+lawZh);
console.log('  分卷 总法规: '+packTotal+'，带中文标题: '+packZh);
