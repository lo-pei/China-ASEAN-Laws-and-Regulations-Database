// 抽取每条「PENETAPAN PERPPU …」法规正文中 Perppu 的完整法定名称
const fs=require('fs'),path=require('path');
const ROOT=path.resolve(__dirname,'../..');
const b=JSON.parse(fs.readFileSync(path.join(__dirname,'_id_buckets.json'),'utf8'));
const lawdir=path.join(ROOT,'prototype/data/laws');
const fam=b.long.filter(u=>/^PENETAPAN PERATURAN PEMERINTAH PENGGANTI/i.test(u.s));
for(const u of fam) for(const id of u.ids){
  const d=JSON.parse(fs.readFileSync(path.join(lawdir,id+'.json'),'utf8'));
  let t='';for(const a of d.articles||[]){t+=(a.text&&a.text.id||'')+' ';}
  t=t.replace(/\s+/g,' ');
  // 主匹配：Pengganti Undang-Undang Nomor X Tahun Y tentang …（到 (Lembaran 或 ditetapkan）
  let m=t.match(/Pengganti\s*Undang[\s-]*Undang\s*Nomor\s*(\d+)\s*Tahun\s*([0-9OolI]{4})\s*(?:tentang|TENTANG)\s*([\s\S]{0,400}?)(?:\(Lembaran|ditetapkan|,\s*dan melampirkan)/i);
  console.log('== '+id+' ['+(d.docNumber||'-')+'] '+d.promulgatedDate+'  标题长 '+String(d.title.orig).length);
  if(m) console.log('  P: Nomor '+m[1]+' Tahun '+m[2]+' tentang '+m[3].trim());
  else console.log('  P: （未匹配）');
  console.log('  T: '+d.title.orig);
}
