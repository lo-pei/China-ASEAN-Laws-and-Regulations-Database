// 括号边际产出：加入某个括号后能立刻解锁多少部（仅统计「唯一缺这一个括号」的法规）
'use strict';
const fs=require('fs'),path=require('path');
const ROOT=path.resolve(__dirname,'..','..','..');
const LAWS=path.join(ROOT,'prototype','data','laws');
function loadLex(){
  const base=JSON.parse(fs.readFileSync(path.join(__dirname,'lexicon-my.json'),'utf8'));
  const lex={types:Object.assign({},base.types),heads:Object.assign({},base.heads),brackets:Object.assign({},base.brackets)};
  for(const f of fs.readdirSync(__dirname).filter(f=>/^lexicon-my-add.*\.json$/.test(f)).sort()){
    const j=JSON.parse(fs.readFileSync(path.join(__dirname,f),'utf8'));
    Object.assign(lex.types,j.types||{});Object.assign(lex.heads,j.heads||{});Object.assign(lex.brackets,j.brackets||{});
  }
  return lex;
}
const LEX=loadLex();
const TYPES=Object.keys(LEX.types).sort((a,b)=>b.length-a.length);
const NUM_RE=/^N[O0]\.?\s*(\d+)$/;
function norm(s){return String(s).replace(/&#8722;|&minus;/gi,'-').replace(/[\u2010-\u2015\u2212]/g,'-').replace(/\s*-\s*/g,'-').replace(/\s+/g,' ').trim().toUpperCase();}
function parse(raw){
  let s=String(raw).replace(/\s+/g,' ').trim(); let year='',extra=[],type='';const brs=[];
  for(let pass=0;pass<2;pass++){
    if(!year){const ym=s.match(/\b(19|20)\d{2}\s*(\(\s*AMENDMENT\s*\))?\s*$/i);if(ym){year=ym[0].match(/\b(19|20)\d{2}/)[0];if(/AMENDMENT/i.test(ym[0]))extra.push('AMENDMENT');s=s.slice(0,ym.index).trim();}}
    if(!type){for(const T of TYPES){const re=new RegExp('\\s'+T.replace(/[-.]/g,'\\$&')+'\\s*$','i');if(re.test(s)){type=T;s=s.replace(re,'').trim();break;}}}
    while(/\([^()]*\)\s*$/.test(s)){const m=s.match(/\(([^()]*)\)\s*$/);brs.unshift(norm(m[1]));s=s.replace(/\s*\([^()]*\)\s*$/,'').trim();}
  }
  return {head:norm(s),brs:brs.concat(extra),type,year};
}
const one={}, two={}, hist={};
let skipHead=0, skipType=0, pool=0;
for(const f of fs.readdirSync(LAWS)){
  if(!f.startsWith('MY-')||!f.endsWith('.json'))continue;
  const d=JSON.parse(fs.readFileSync(path.join(LAWS,f),'utf8'));
  const tt=d.title||{};
  if(String(tt.zh||'').trim())continue;
  const raw=String(tt.en||tt.orig||'').trim();
  if(!raw)continue;
  const p=parse(raw);
  if(!LEX.heads[p.head]){skipHead++;continue;}
  if(!p.type||!LEX.types[p.type]){skipType++;continue;}
  const miss=p.brs.filter(b=>!NUM_RE.test(b)&&!LEX.brackets[b]);
  if(!miss.length)continue;
  pool++;
  hist[miss.length]=(hist[miss.length]||0)+1;
  if(miss.length===1) one[miss[0]]=(one[miss[0]]||0)+1;
  if(miss.length===2) two[miss.join(' + ')]=(two[miss.join(' + ')]||0)+1;
}
console.log('主体已收录但缺括号的法规', pool, '| 主体未收录', skipHead, '| 缺类型词', skipType);
console.log('缺失括号数分布：', Object.entries(hist).sort((a,b)=>a[0]-b[0]).map(([k,v])=>k+'缺:'+v).join('  '));
const rows=Object.entries(one).sort((a,b)=>b[1]-a[1]);
console.log('\n唯一缺 → 单括号边际产出 Top25（翻译 1 条即解锁对应部数）：');
rows.slice(0,25).forEach(([b,n])=>console.log('  ',String(n).padStart(3),b.slice(0,66)));
console.log('  单括号可出合计', rows.reduce((s,x)=>s+x[1],0), '部 /', rows.length, '条');
const rows2=Object.entries(two).sort((a,b)=>b[1]-a[1]);
console.log('\n双缺组合 Top15（补 2 条解锁）：');
rows2.slice(0,15).forEach(([b,n])=>console.log('  ',String(n).padStart(3),b.slice(0,80)));
fs.writeFileSync(path.join(__dirname,'_need_brs_one.json'),JSON.stringify(rows.map(([b,n])=>({b,n})),null,1),'utf8');
fs.writeFileSync(path.join(__dirname,'_need_brs_two.json'),JSON.stringify(rows2.map(([b,n])=>({b,n})),null,1),'utf8');
