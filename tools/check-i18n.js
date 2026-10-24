const fs=require('fs'),vm=require('vm');
function load(f){const c={window:{},document:{}};vm.createContext(c);vm.runInContext(fs.readFileSync(f,'utf8'),c);const k=Object.keys(c.window)[0];return c.window[k];}
const en=load('prototype/data/i18n-en.js');
const need=Object.keys(en);
['vi','th','id','ms'].forEach(l=>{
  const t=load('prototype/data/i18n-'+l+'.js');
  const missing=need.filter(k=>!t[k]);
  console.log(l+': keys='+Object.keys(t).length+' missing='+missing.length);
});
