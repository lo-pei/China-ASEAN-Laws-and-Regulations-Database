// 导出待译主体/括号清单（供人工填译）
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
const perHead={}, missBr={}, nearMap={};
for(const f of fs.readdirSync(LAWS)){
  if(!f.startsWith('MY-')||!f.endsWith('.json'))continue;
  const d=JSON.parse(fs.readFileSync(path.join(LAWS,f),'utf8'));
  const tt=d.title||{};
  if(String(tt.zh||'').trim())continue;
  const raw=String(tt.en||tt.orig||'').trim();
  if(!raw)continue;
  const p=parse(raw);
  if(!p.type)continue;
  if(LEX.heads[p.head])continue;
  const missing=p.brs.filter(b=>!NUM_RE.test(b)&&!LEX.brackets[b]);
  for(const b of missing)missBr[b]=(missBr[b]||0)+1;
  const o=perHead[p.head]||(perHead[p.head]={laws:0,ready:0,brs:new Set()});
  o.laws++; if(missing.length===0)o.ready++;
  for(const b of missing)o.brs.add(b);
}
const heads=Object.entries(perHead).map(([h,o])=>({h,laws:o.laws,ready:o.ready,need:o.brs.size}))
  .sort((a,b)=>b.ready-a.ready||b.laws-a.laws);
const direct=heads.filter(x=>x.ready>0);
const near=heads.filter(x=>x.ready===0&&x.need===1);
const brRows=Object.entries(missBr).sort((a,b)=>b[1]-a[1]);
console.log('主体总数',heads.length,'| ready>0',direct.length,'合计',direct.reduce((s,x)=>s+x.ready,0),'部');
console.log('ready 分布：', [1,2,3,5,10,20].map(t=>'≥'+t+':'+direct.filter(x=>x.ready>=t).length).join(' '));
console.log('差1括号主体',near.length,'合计可出',near.reduce((s,x)=>s+x.laws,0),'部');
console.log('括号需求条目',brRows.length,'总需',brRows.reduce((s,x)=>s+x[1],0));
fs.writeFileSync(path.join(__dirname,'_need_heads.json'),JSON.stringify(direct,null,1),'utf8');
fs.writeFileSync(path.join(__dirname,'_need_brs.json'),JSON.stringify(brRows.map(([b,n])=>({b,n})),null,1),'utf8');
fs.writeFileSync(path.join(__dirname,'_need_near.json'),JSON.stringify(near,null,1),'utf8');
console.log('已写 _need_heads.json / _need_brs.json / _need_near.json');
