const fs=require('fs'),path=require('path');
const NOW=require('./_ph_gen2.js'),BASE=require('./_ph_gen2_base.js');
const {nom}=require('./_ph_nom.js'),FR=require('./_ph_fr.js');
const ROOT=path.resolve(__dirname,'..','..');
const DATADIR=path.join(ROOT,'prototype','data','laws');
function mk(G){return (en)=>{const p=G.parse(en);if(p&&p.out)return p.out;const c=nom(en);if(c){const p2=G.parse(c);if(p2&&p2.out)return p2.out;}const r=FR.parse(en);return r&&r.out?r.out:null;};}
const A=mk(NOW),B=mk(BASE);
const rows=[];
for(const f of fs.readdirSync(DATADIR)){
 if(!f.startsWith('PH-'))continue;
 let j;try{j=JSON.parse(fs.readFileSync(path.join(DATADIR,f),'utf8'))}catch(e){continue}
 const en=String((j.title||{}).en||'').replace(/\s+/g,' ').trim(); if(!en)continue;
 const a=A(en),b=B(en);
 if(!a&&b) rows.push({id:j.id,en:en,out:b});
}
console.log('仅基线能出',rows.length);
fs.writeFileSync(path.join(__dirname,'_ph_only_base.json'),JSON.stringify(rows,null,1),'utf8');
rows.slice(0,45).forEach(r=>console.log('- '+r.id+'  '+r.en.slice(0,150)+'\n   '+r.out.vi.slice(0,170)));
