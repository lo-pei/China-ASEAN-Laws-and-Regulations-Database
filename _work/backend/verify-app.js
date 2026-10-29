const fs=require('fs'),path=require('path'),vm=require('vm');
const PROTO=path.join(process.cwd(),'prototype');
const sb={console,setTimeout,clearTimeout,Date,Math,JSON,RegExp,String,Number,Array,Object,Boolean,parseInt,parseFloat,isNaN,encodeURIComponent,decodeURIComponent,Map,Set,Promise,Error};
sb.window=sb;sb.self=sb;sb.globalThis=sb;vm.createContext(sb);
const html=fs.readFileSync(path.join(PROTO,'index.html'),'utf8');
const srcs=[...html.matchAll(/<script src="([^"]+)"/g)].map(m=>m[1]).filter(x=>!/^https?:/.test(x));
const t0=Date.now();
for(const rel of srcs){
  const c=rel.replace(/^\.\//,'').replace(/\?.*$/,'');
  if(/^data\/(intl|cn|fulltext|trans)\//.test(c))continue;
  const p=path.join(PROTO,c);if(!fs.existsSync(p))continue;
  try{vm.runInContext(fs.readFileSync(p,'utf8'),sb,{filename:c});}catch(e){console.log('  ! '+c+': '+e.message);}
}
const tLoad=Date.now()-t0;
const CALR=sb.CALR;
const t1=Date.now(); CALR.store.init(); const tInit=Date.now()-t1;
const st=CALR.store.stats();
console.log('  脚本加载 '+tLoad+'ms   store.init '+tInit+'ms');
console.log('  法规 '+st.laws+' / 条文 '+st.articles);
const laws=CALR.store.laws();
const byC={}; laws.forEach(l=>byC[l.country]=(byC[l.country]||0)+1);
console.log('  按国别: '+JSON.stringify(byC));
console.log('');
// 抽查：之前搜不到的
const checks=['MM-H120','MM-H121','MM-H126'];
checks.forEach(id=>{
  const l=laws.find(x=>x.id===id);
  console.log('  '+id+' : '+(l?('✓ 标题='+CALR.util.tr(l.title)+'  country='+l.country):'✗ 仍不可见'));
});
// PH 数量
console.log('  PH 法规数: '+(byC['PH']||0));
