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
  try{vm.runInContext(fs.readFileSync(p,'utf8'),sandbox,{filename:c});}catch(e){}
}
const CALR=sandbox.CALR;
CALR.store.init();
const t0=Date.now();
const r=CALR.search.run({q:'泰国劳动法关于经济补偿金怎么规定？',mode:'semantic',size:5});
console.log('  首次检索耗时: '+(Date.now()-t0)+'ms');
r.items.forEach((it,i)=>console.log('   ['+(i+1)+'] '+it.score.toFixed(2)+'  '+CALR.util.tr(it.law.title).slice(0,30)+'  ('+(it.law.articles||[]).length+'条)'));
