const fs=require('fs'),path=require('path');
const LAWS=path.join(process.cwd(),'prototype/data/laws');
const files=fs.readdirSync(LAWS).filter(f=>f.endsWith('.json')&&f!=='index.json');
let multi=0,total=0,multiInItem=0;
const langCombo={};
for(const f of files){
  let o; try{o=JSON.parse(fs.readFileSync(path.join(LAWS,f),'utf8'));}catch(e){continue;}
  for(const a of (o.articles||[])){
    const t=a.text||{};
    const keys=Object.keys(t).filter(k=>t[k]);
    total++;
    if(keys.length>=2){ multiInItem++; langCombo[keys.sort().join('+')]=(langCombo[keys.sort().join('+')]||0)+1; }
  }
  // 法规级：是否有同一法规的不同语言版本？
  const lawLangs=new Set();
  for(const a of (o.articles||[])) Object.keys(a.text||{}).filter(k=>a.text[k]).forEach(k=>lawLangs.add(k));
  if(lawLangs.size>=2) multi++;
}
console.log('  条文总数            : '+total);
console.log('  条文内多语言(≥2)    : '+multiInItem+'  ('+(multiInItem*100.0/Math.max(1,total)).toFixed(2)+'%)');
console.log('  法规内含多语言条文  : '+multi+' / '+files.length);
console.log('');
console.log('  多语言组合 top10:');
Object.entries(langCombo).sort((a,b)=>b[1]-a[1]).slice(0,10).forEach(([k,v])=>console.log('    '+k.padEnd(14)+v));
