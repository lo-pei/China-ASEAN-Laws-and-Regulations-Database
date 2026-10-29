const fs=require('fs'),path=require('path');
const ROOT=path.resolve(__dirname,'../..');
const b=JSON.parse(fs.readFileSync(path.join(__dirname,'_id_buckets.json'),'utf8'));
const fam=b.long.filter(u=>/^PENGESAHAN PERSETUJUAN ANTARA/i.test(u.s));
for(const u of fam) for(const id of u.ids){
  const d=JSON.parse(fs.readFileSync(path.join(ROOT,'prototype/data/laws',id+'.json'),'utf8'));
  let t='';for(const a of d.articles||[]){t+=(a.text&&a.text.id||'')+' ';}
  t=t.replace(/\s+/g,' ');
  const i=t.search(/[Pp]engesahan\s+[Pp]ersetujuan/i);
  console.log('== '+id+' ['+(d.docNumber||'-')+'] '+d.promulgatedDate);
  console.log('  T: '+d.title.orig);
  console.log('  B: '+(i>=0?t.slice(i,i+460):t.slice(0,460)));
  console.log('');
}
