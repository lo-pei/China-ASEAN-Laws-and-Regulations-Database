const fs=require('fs'), path=require('path');
function walk(d, out){ for(const f of fs.readdirSync(d)){ const p=path.join(d,f); const st=fs.statSync(p);
  if(st.isDirectory()) walk(p,out); else if(/\.(js|html)$/.test(f)) out.push(p); } return out; }
const files=walk('prototype/assets/js',[]).concat(['prototype/index.html']);
const PATTERNS=[
 ['登录入口','header__login'],['登录按钮',"'登录'"],['搜案例','搜案例'],['案例检索入口','案例检索'],
 ['首页类型按钮','data-hero-type'],['口号','东盟法律，一库通查'],['定位句','覆盖东盟十一国'],
 ['旧电话','0771'],['旧工作时间','工作日 8:00']
];
let total=0;
for(const [name,pat] of PATTERNS){
  const hits=[];
  for(const f of files){
    const lines=fs.readFileSync(f,'utf8').split('\n');
    lines.forEach((l,i)=>{ if(l.indexOf(pat)>=0) hits.push(f+':'+(i+1)); });
  }
  if(hits.length){ total+=hits.length; console.log('  HIT ['+name+'] '+hits.join(', ')); }
}
console.log(total?('\n合计命中 '+total+' 处'):'\n全部禁用项：CLEAN');
