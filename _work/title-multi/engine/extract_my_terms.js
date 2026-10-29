// 抽取指定主体范围所需的术语（主体 / 括号限定语 / 类型词）
// 用法：node extract_my_terms.js [topN]  → 写 _terms_my.json
'use strict';
const fs=require('fs'),path=require('path');
const ROOT=path.resolve(__dirname,'..','..','..');
const L=path.join(ROOT,'prototype','data','laws');
const TYPES=['REGULATIONS','REGULATION','ORDER','ORDERS','RULES','RULE','NOTIFICATION','DECLARATION','DIRECTIONS','DIRECTION','BY-LAWS','CONVENTION','AGREEMENT','ACT','ENACTMENT','ORDINANCE'];

function parse(s){
  let body=s.trim();
  const ym=body.match(/\b(19|20)\d{2}\s*(\(\s*AMENDMENT\s*\))?\s*$/i);
  const year=ym?ym[0].replace(/\s+/g,' ').trim():'';
  if(ym) body=body.slice(0,ym.index).trim();
  let type='';
  for(const T of TYPES){ const re=new RegExp('\\s'+T+'\\s*$','i'); if(re.test(body)){ type=T; body=body.replace(re,'').trim(); break; } }
  let head=body; const brs=[];
  while(/\([^()]*\)\s*$/.test(head)){ const m=head.match(/\(([^()]*)\)\s*$/); brs.unshift(m[1].trim().replace(/\s+/g,' ')); head=head.replace(/\s*\([^()]*\)\s*$/,'').trim(); }
  return {head:head.replace(/\s+/g,' '),brs,type,year};
}

const rows=[];
for(const f of fs.readdirSync(L)){
  if(!f.startsWith('MY-')||!f.endsWith('.json')) continue;
  const d=JSON.parse(fs.readFileSync(path.join(L,f),'utf8'));
  const t=d.title||{};
  if(String(t.zh||'').trim()) continue;
  rows.push({id:d.id,s:(t.en||t.orig||'').trim()});
}

const headC={};
for(const r of rows){ const p=parse(r.s); headC[p.head]=(headC[p.head]||0)+1; }
const hs=Object.entries(headC).sort((a,b)=>b[1]-a[1]);
const TOPN=Number(process.argv[2]||6);
const scope=new Set(hs.slice(0,TOPN).map(x=>x[0]));

const heads=[],brMap={},typeMap={},picked=[];
for(const r of rows){
  const p=parse(r.s);
  if(!scope.has(p.head)) continue;
  picked.push({id:r.id,...p,src:r.s});
  heads.push(p.head);
  for(const b of p.brs) brMap[b]=(brMap[b]||0)+1;
  if(p.type) typeMap[p.type]=(typeMap[p.type]||0)+1;
}
const out={
  scope: hs.slice(0,TOPN).map(x=>({head:x[0],n:x[1]})),
  total: picked.length,
  heads: [...new Set(heads)],
  brackets: Object.entries(brMap).sort((a,b)=>b[1]-a[1]).map(([k,v])=>({t:k,n:v})),
  types: Object.entries(typeMap).sort((a,b)=>b[1]-a[1]).map(([k,v])=>({t:k,n:v})),
  items: picked
};
fs.writeFileSync(path.join(__dirname,'_terms_my.json'),JSON.stringify(out,null,1),'utf8');
console.log('范围',TOPN,'个主体 · 覆盖',picked.length,'部');
console.log('括号限定语去重',out.brackets.length);
console.log('类型词',out.types.map(t=>t.t+':'+t.n).join(' '));
console.log('--- 括号清单 ---');
out.brackets.forEach((b,i)=>console.log(String(i+1).padStart(3),String(b.n).padStart(4),b.t));
