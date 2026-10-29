// 按前缀族导出待译条目：标题 + 首个 id 的 Pasal 1 首段（供定实体）
const fs=require('fs'),path=require('path');
const ROOT=path.resolve(__dirname,'../..');
const b=JSON.parse(fs.readFileSync(path.join(__dirname,'_id_buckets.json'),'utf8'));
const re=new RegExp(process.argv[2],'i');
const lawdir=path.join(ROOT,'prototype/data/laws');
const need=(d)=>['vi','th','ms'].some(k=>!String((d.title||{})[k]||'').trim());
const fam=b.long.filter(u=>re.test(u.s));
let tot=0,pend=0;
const rows=[];
for(const u of fam) for(const id of u.ids){
  tot++;
  const d=JSON.parse(fs.readFileSync(path.join(lawdir,id+'.json'),'utf8'));
  if(!need(d)) continue;
  pend++;
  let t='';for(const a of d.articles||[]){t+='#'+(a.heading&&a.heading.id||'')+' '+(a.text&&a.text.id||'')+' ';}
  t=t.replace(/\s+/g,' ');
  const m=t.match(/Pasal\s*1\b[\s\S]{0,300}/);
  rows.push({id,doc:d.docNumber||'-',yr:d.promulgatedDate||'',t:(d.title||{}).orig||'',body:m?m[0]:t.slice(0,300)});
}
console.log('族标题',fam.length,'| 条目',tot,'| 待译',pend,'| 唯一标题',new Set(rows.map(r=>r.t)).size);
for(const r of rows){
  console.log('--- '+r.id+'  ['+r.doc+'] '+r.yr);
  console.log('  T: '+r.t);
  console.log('  B: '+r.body);
}
