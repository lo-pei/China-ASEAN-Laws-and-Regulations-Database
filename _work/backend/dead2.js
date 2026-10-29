const fs=require('fs'),vm=require('vm'),path=require('path');
const PD=path.join(process.cwd(),'prototype/data');
function load(rel){const src=fs.readFileSync(path.join(PD,rel),'utf8');const sb={window:{}};sb.window=sb;sb.self=sb;vm.createContext(sb);vm.runInContext(src,sb,{filename:rel});return sb;}
const laws=new Set(); for(const f of fs.readdirSync(path.join(PD,'laws'))) if(f.endsWith('.json')&&f!=='index.json') laws.add(f.slice(0,-5));
const inl=load('intl-catalog.js').CALR_INTL_CATALOG||{laws:[]};
const dead=(inl.laws||[]).filter(x=>!laws.has(x.id)).map(x=>x.id);
const im=load('intl/manifest.js').CALR_INTL_MANIFEST||{};
console.log('  intl manifest 顶层键: '+Object.keys(im).join(', '));
const byLaw=im.byLaw||{};
console.log('  byLaw 条目: '+Object.keys(byLaw).length);
const inManifest=dead.filter(id=>byLaw[id]);
console.log('  死链 '+dead.length+' 中在 manifest byLaw 的: '+inManifest.length);
// 死链 id 前缀分布
const byP={}; dead.forEach(id=>{const k=id.split('-')[0]; byP[k]=(byP[k]||0)+1;});
console.log('  死链前缀分布: '+JSON.stringify(byP));
// 抽查一条在 dedup-archive 里？
const archDir=path.join(process.cwd(),'_work/dedup-archive');
let archCount=0;
for(const id of dead){ if(fs.existsSync(path.join(archDir,id+'.json'))) archCount++; }
console.log('  死链中在 _work/dedup-archive 的: '+archCount+' / '+dead.length);
// 抽查一条的完整记录
const s=(inl.laws||[]).find(x=>x.id===dead[0]);
console.log('');
console.log('  样例 '+dead[0]+': '+JSON.stringify(s).slice(0,380));
