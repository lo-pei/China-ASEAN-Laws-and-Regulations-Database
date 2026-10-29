const fs=require('fs'),path=require('path'),vm=require('vm');
const PROTO=path.join(process.cwd(),'prototype');
const sb={console,setTimeout,clearTimeout,Date,Math,JSON,RegExp,String,Number,Array,Object,Boolean,parseInt,parseFloat,isNaN,encodeURIComponent,decodeURIComponent,Map,Set,Promise,Error};
sb.window=sb;sb.self=sb;sb.globalThis=sb;vm.createContext(sb);
const html=fs.readFileSync(path.join(PROTO,'index.html'),'utf8');
for(const rel of [...html.matchAll(/<script src="([^"]+)"/g)].map(m=>m[1]).filter(x=>!/^https?:/.test(x))){
  const c=rel.replace(/^\.\//,'').replace(/\?.*$/,'');
  if(/^data\/(intl|cn|fulltext|trans)\//.test(c))continue;
  const p=path.join(PROTO,c);if(!fs.existsSync(p))continue;
  try{vm.runInContext(fs.readFileSync(p,'utf8'),sb,{filename:c});}catch(e){}
}
for(const sub of ['cn','fulltext']){
  const d=path.join(PROTO,'data',sub);if(!fs.existsSync(d))continue;
  for(const f of fs.readdirSync(d).filter(x=>x.endsWith('.js'))){try{vm.runInContext(fs.readFileSync(path.join(d,f),'utf8'),sb,{filename:sub+'/'+f});}catch(e){}}
}
const CALR=sb.CALR; CALR.store.init();
const st=CALR.store.stats();
console.log('  法规 '+st.laws+' / 条文 '+st.articles);
console.log('');
[['缅甸 残疾人权利法','残疾人权利法'],['菲律宾','菲律宾'],['休假','休假与假日法']].forEach(([q,label])=>{
  const r=CALR.search.run({q:q,mode:'keyword',size:4});
  console.log('  检索「'+q+'」→ '+r.items.length+' 条');
  r.items.slice(0,3).forEach((it,i)=>console.log('    '+(i+1)+'. '+String(it.law.country).padEnd(3)+' '+CALR.util.tr(it.law.title).slice(0,34)));
});
