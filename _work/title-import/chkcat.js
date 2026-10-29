const fs=require('fs'), vm=require('vm');
const c={window:{}}; c.window=c; vm.createContext(c);
vm.runInContext(fs.readFileSync('prototype/data/intl-catalog.js','utf8'),c);
const cat=c.CALR_INTL_CATALOG;
let tot=0, zh=0;
for(const L of cat.laws){ tot++; if((L.title||{}).zh) zh++; }
console.log('  intl-catalog: '+tot+' 条，中文 '+zh+'（'+(zh*100/tot).toFixed(1)+'%）');
const byid={}; cat.laws.forEach(l=>byid[l.id]=l);
['PH-H10691','PH-H10692','PH-H10694','SG-H795','BN-CAP-39-2015-COMPANIES-ACT','CN-PIA-001'].forEach(id=>{
  const L=byid[id];
  console.log('  '+id.padEnd(34)+' zh='+JSON.stringify((L&&(L.title||{}).zh)||null).slice(0,58));
});
