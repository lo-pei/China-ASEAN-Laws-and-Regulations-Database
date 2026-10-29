// 计算「再译哪个主体最划算」：主体未收录、但类型与全部括号已可解析的法规数
'use strict';
const fs=require('fs'),path=require('path');
const ROOT=path.resolve(__dirname,'..','..','..');
const LAWS=path.join(ROOT,'prototype','data','laws');
const LEX=JSON.parse(fs.readFileSync(path.join(__dirname,'lexicon-my.json'),'utf8'));
const TYPES=Object.keys(LEX.types).sort((a,b)=>b.length-a.length);
const NUM_RE=/^N[O0]\.?\s*(\d+)$/;
function norm(s){return String(s).replace(/&#8722;|&minus;/gi,'-').replace(/[\u2010-\u2015\u2212]/g,'-').replace(/\s*-\s*/g,'-').replace(/\s+/g,' ').trim().toUpperCase();}
function parse(raw){
  let s=String(raw).replace(/\s+/g,' ').trim(); let year='',extra=[];
  const ym=s.match(/\b(19|20)\d{2}\s*(\(\s*AMENDMENT\s*\))?\s*$/i);
  if(ym){ year=ym[0].match(/\b(19|20)\d{2}/)[0]; if(/AMENDMENT/i.test(ym[0])) extra.push('AMENDMENT'); s=s.slice(0,ym.index).trim(); }
  let type='';
  for(const T of TYPES){ const re=new RegExp('\\s'+T.replace(/[-.]/g,'\\$&')+'\\s*$','i'); if(re.test(s)){ type=T; s=s.replace(re,'').trim(); break; } }
  let head=s; const brs=[];
  while(/\([^()]*\)\s*$/.test(head)){ const m=head.match(/\(([^()]*)\)\s*$/); brs.unshift(norm(m[1])); head=head.replace(/\s*\([^()]*\)\s*$/,'').trim(); }
  return {head:norm(head),brs:brs.concat(extra),type,year};
}
const perHead={}, missBr={};
for(const f of fs.readdirSync(LAWS)){
  if(!f.startsWith('MY-')||!f.endsWith('.json')) continue;
  const d=JSON.parse(fs.readFileSync(path.join(LAWS,f),'utf8'));
  const tt=d.title||{};
  if(String(tt.zh||'').trim()) continue;
  const p=parse(String(tt.en||tt.orig||''));
  if(LEX.heads[p.head]) continue;                 // 已收录主体，不在本次分析
  if(!p.type) continue;
  const missing=p.brs.filter(b=>!NUM_RE.test(b)&&!LEX.brackets[b]);
  for(const b of missing) missBr[b]=(missBr[b]||0)+1;
  const o=perHead[p.head]||(perHead[p.head]={laws:0,ready:0,brSet:new Set()});
  o.laws++;
  if(missing.length===0) o.ready++;
  for(const b of missing) o.brSet.add(b);
}
const rows=Object.entries(perHead).sort((a,b)=>b[1].ready-a[1].ready||b[1].laws-a[1].laws);
console.log('未收录主体',rows.length,'| 其中「括号已全覆盖、只差主体译名」的:');
let sum=0;
rows.filter(r=>r[1].ready>0).slice(0,30).forEach(([h,o])=>{ sum+=o.ready; console.log('  可直接出',String(o.ready).padStart(4),'/',String(o.laws).padStart(4),'部 ·',h.slice(0,60)); });
console.log('  合计可直接出',sum,'部（只需译主体名）');
const near=rows.filter(r=>r[1].ready===0).map(([h,o])=>({h,laws:o.laws,need:o.brSet.size}));
near.sort((a,b)=>a.need-b.need||b.laws-a.laws);
console.log('\n差 1 个括号即可出量的主体：');
near.filter(x=>x.need===1).slice(0,20).forEach(x=>console.log('  ',String(x.laws).padStart(3),'部 ·',x.h.slice(0,55)));
console.log('\n全库新增括号需求（按出现次数）：');
Object.entries(missBr).sort((a,b)=>b[1]-a[1]).slice(0,30).forEach(([b,n])=>console.log('  ',String(n).padStart(3),b.slice(0,70)));
