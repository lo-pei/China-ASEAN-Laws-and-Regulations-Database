// 检查分卷里是否带中文标题
const fs=require('fs'), vm=require('vm');
const c={window:{}}; c.window=c; vm.createContext(c);
vm.runInContext(fs.readFileSync('prototype/data/intl/manifest.js','utf8'),c);
const m=c.CALR_INTL_MANIFEST;
// 取几个 PH / SG 法规看它们落在哪个分卷
const picks=['PH-H10362','PH-H3402','SG-H795','BN-CAP-39-2015-COMPANIES-ACT','TH-LABOR-1998'];
picks.forEach(id=>{
  const pack=(m.byLaw||{})[id];
  if(!pack){ console.log('  '+id+' 不在 intl manifest'); return; }
  const p='prototype/data/intl/'+pack+'.js';
  if(!fs.existsSync(p)){ console.log('  '+id+' → 分卷文件缺失 '+p); return; }
  const c2={window:{}}; c2.window=c2; vm.createContext(c2);
  try{ vm.runInContext(fs.readFileSync(p,'utf8'),c2); }catch(e){ console.log('  '+id+' 加载失败'); return; }
  const T=c2.CALR_INTL||{};
  const o=T[id];
  if(!o){ console.log('  '+id+' 在分卷 '+pack+' 中未找到'); return; }
  const t=o.title||{};
  console.log('  '+id.padEnd(32)+' 分卷='+String(pack).padEnd(10)+' title.zh='+JSON.stringify(t.zh||null).slice(0,50));
});
