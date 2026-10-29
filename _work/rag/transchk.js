const fs=require('fs'),path=require('path'),vm=require('vm');
const PROTO=path.join(process.cwd(),'prototype');
const DIR=path.join(PROTO,'data/trans');
const files=fs.readdirSync(DIR).filter(f=>f.endsWith('.js'));
console.log('  trans 文件数: '+files.length);
const sb={window:{}}; sb.window=sb; sb.self=sb; vm.createContext(sb);
let loaded=0;
for(const f of files){
  try{ vm.runInContext(fs.readFileSync(path.join(DIR,f),'utf8'),sb,{filename:f}); loaded++; }catch(e){ console.log('  ! '+f+': '+e.message); }
}
console.log('  载入 '+loaded+' 个');
const T=sb.CALR_TRANS||{};
const M=sb.CALR_TRANS_MANIFEST||{};
const lawIds=Object.keys(T);
console.log('  CALR_TRANS 法规数: '+lawIds.length);
let entries=0, withZh=0, withEn=0, both=0;
const samples=[];
for(const lid of lawIds){
  const obj=T[lid];
  const arts=(obj&&obj.articles)||obj||[];
  const list=Array.isArray(arts)?arts:[];
  for(const a of list){
    entries++;
    const zh=a.zh||a.orig||a.source||'';
    const en=a.en||a.trans||a.text||'';
    if(zh) withZh++;
    if(en) withEn++;
    if(zh&&en){ both++; if(samples.length<3) samples.push({zh:String(zh).slice(0,60),en:String(en).slice(0,90)}); }
  }
}
console.log('  条目总数: '+entries+'  有中文: '+withZh+'  有英文: '+withEn+'  中英都有: '+both);
console.log('');
console.log('  样例:');
samples.forEach(s=>{ console.log('    ZH: '+s.zh); console.log('    EN: '+s.en); console.log(''); });
// 看一个法规的结构
const k0=lawIds[0];
if(k0){
  console.log('  法规 '+k0+' 顶层键: '+Object.keys(T[k0]).join(','));
  const a=T[k0].articles||T[k0];
  const first=Array.isArray(a)?a[0]:null;
  if(first) console.log('  条目字段: '+Object.keys(first).join(','));
}
