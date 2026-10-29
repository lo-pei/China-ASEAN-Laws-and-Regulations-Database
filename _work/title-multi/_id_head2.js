const fs=require('fs'),path=require('path');
const ROOT=path.resolve(__dirname,'../..');
const b=JSON.parse(fs.readFileSync(path.join(__dirname,'_id_buckets.json'),'utf8'));
const start=parseInt(process.argv[2],10), end=parseInt(process.argv[3],10)||b.phrase.length;
const lawdir=path.join(ROOT,'prototype/data/laws');
for(const u of b.phrase.slice(start,end)){
  for(const id of u.ids){
    const d=JSON.parse(fs.readFileSync(path.join(lawdir,id+'.json'),'utf8'));
    const parts=[];
    for(const a of (d.articles||[])){
      const h=a.heading&&a.heading.id; if(h) parts.push(h);
      const t=a.text&&a.text.id; if(t) parts.push(t);
    }
    const all=parts.join(' ').replace(/\s+/g,' ');
    console.log('### '+id+' | '+(d.docNumber||'-')+' | '+u.s);
    console.log(all.slice(0,420));
    console.log('');
  }
}
