// 待译条目标题首词分布（找下一个可批量收官的族）
const fs=require('fs'),path=require('path');
const ROOT=path.resolve(__dirname,'../..');
const b=JSON.parse(fs.readFileSync(path.join(__dirname,'_id_buckets.json'),'utf8'));
const lawdir=path.join(ROOT,'prototype/data/laws');
const need=(d)=>['vi','th','ms'].some(k=>!String((d.title||{})[k]||'').trim());
const cnt={};
let pend=0;
for(const u of b.long){
  let p=0;
  for(const id of u.ids){
    const d=JSON.parse(fs.readFileSync(path.join(lawdir,id+'.json'),'utf8'));
    if(need(d)) p++;
  }
  if(!p) continue;
  pend+=p;
  const key=String(u.s).toUpperCase().split(/\s+/).slice(0,3).join(' ');
  (cnt[key]=cnt[key]||{t:0,ids:0});
  cnt[key].t++; cnt[key].ids+=p;
}
console.log('待译总数',pend,'| 前缀组',Object.keys(cnt).length);
Object.entries(cnt).sort((a,b)=>b[1].ids-a[1].ids).slice(0,22)
  .forEach(([k,v])=>console.log(String(v.ids).padStart(4),'条目 /',String(v.t).padStart(4),'标题 |',k));
