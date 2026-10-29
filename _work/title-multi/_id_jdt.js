// JENIS DAN TARIF 族专项：导出待译条目（缺 vi/th/ms 任一）的标题与正文机构名
const fs=require('fs'),path=require('path');
const ROOT=path.resolve(__dirname,'../..');
const b=JSON.parse(fs.readFileSync(path.join(__dirname,'_id_buckets.json'),'utf8'));
const lawdir=path.join(ROOT,'prototype/data/laws');
const RE=/^JENIS DAN TARIF ATAS JENIS PENERIMAAN NEGARA BUKAN PAJAK|^Jenis dan Tarif atas Jenis Penerimaan Negara Bukan Pajak|^TARIF ATAS JENIS PENERIMAAN NEGARA BUKAN PAJAK|^JENIS DAN TARIF ATAS PENERIMAAN NEGARA BUKAN PAJAK/i;
const fam=b.long.filter(u=>RE.test(u.s));
const need=(d)=>['vi','th','ms'].some(k=>!String((d.title||{})[k]||'').trim());
let rows=[],pend=0,tot=0;
for(const u of fam){
  for(const id of u.ids){
    tot++;
    const d=JSON.parse(fs.readFileSync(path.join(lawdir,id+'.json'),'utf8'));
    if(!need(d)) continue;
    pend++;
    let t='';for(const a of d.articles||[]){t+=(a.heading&&a.heading.id||'')+' '+(a.text&&a.text.id||'')+' ';}
    t=t.replace(/\s+/g,' ');
    const m=t.match(/yang berlaku (?:pada|di lingkungan)[^.,;:]{0,130}/i);
    rows.push({id,doc:d.docNumber||'',t:(d.title||{}).orig||'',body:m?m[0]:'',en:(d.title||{}).en||''});
  }
}
console.log('族条目',tot,'| 待译',pend,'| 已译',tot-pend);
for(const r of rows){
  console.log('--- '+r.id+'  ['+r.doc+']');
  console.log('  T: '+r.t);
  if(r.en) console.log('  E: '+r.en);
  console.log('  B: '+(r.body||'（无）'));
}
