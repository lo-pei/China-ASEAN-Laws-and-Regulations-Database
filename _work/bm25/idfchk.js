const fs=require('fs'),path=require('path'),vm=require('vm');
const PROTO=path.join(process.cwd(),'prototype');
const sandbox={console,setTimeout,clearTimeout,Date,Math,JSON,RegExp,String,Number,Array,Object,Boolean,parseInt,parseFloat,isNaN,encodeURIComponent,decodeURIComponent,Map,Set,Promise,Error};
sandbox.window=sandbox;sandbox.self=sandbox;sandbox.globalThis=sandbox;
vm.createContext(sandbox);
const html=fs.readFileSync(path.join(PROTO,'index.html'),'utf8');
const srcs=[...html.matchAll(/<script src="([^"]+)"/g)].map(m=>m[1]).filter(x=>!/^https?:/.test(x));
for(const rel of srcs){
  const c=rel.replace(/^\.\//,'').replace(/\?.*$/,'');
  if(/^data\/(intl|cn|fulltext)\//.test(c)) continue;
  const p=path.join(PROTO,c); if(!fs.existsSync(p))continue;
  try{vm.runInContext(fs.readFileSync(p,'utf8'),sandbox,{filename:c});}catch(e){ if(process.env.V) console.log('  ! '+c+': '+e.message); }
}
const idf=sandbox.CALR_BM25_IDF;
console.log('  CALR_BM25_IDF 存在: '+!!idf);
if(idf){
  console.log('  N='+idf.N+'  avgLen='+idf.avgLen+'  df 词项='+Object.keys(idf.df).length);
  // 抽查几个词的 df，确认跨语种都覆盖
  ['经济补偿','补偿','ค่าชดเชย','severance','注册资本','vốn','annual return','ข้อมูล'].forEach(t=>{
    console.log('    df("'+t+'") = '+(idf.df[t]!==undefined?idf.df[t]:'不存在'));
  });
}
CALR=sandbox.CALR; CALR.store.init();
const r=CALR.search.run({q:'泰国劳动法关于经济补偿金怎么规定？',mode:'semantic',size:5});
console.log('');
console.log('  泰国经济补偿金 top5:');
r.items.forEach((it,i)=>console.log('   ['+(i+1)+'] '+it.score.toFixed(2)+'  '+CALR.util.tr(it.law.title).slice(0,26)));
