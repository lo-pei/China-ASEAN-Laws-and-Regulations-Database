const fs=require('fs'),path=require('path');
const ROOT=path.resolve(__dirname,'../..');
const b=JSON.parse(fs.readFileSync(path.join(__dirname,'_id_buckets.json'),'utf8'));
const start=parseInt(process.argv[2]||'785',10), end=parseInt(process.argv[3]||'835',10);
const slice=b.phrase.slice(start,end);
const lawdir=path.join(ROOT,'prototype/data/laws');
function getText(d){
  const out=[];
  for(const a of (d.articles||[])){
    const t=a.text&&a.text.id; if(t) out.push(t);
    const h=a.heading&&a.heading.id; if(h) out.push(h);
  }
  return out.join('\n');
}
for(const it of slice){
  for(const id of it.ids){
    const p=path.join(lawdir,id+'.json');
    let d; try{d=JSON.parse(fs.readFileSync(p,'utf8'));}catch(e){console.log('###',id,'MISSING');continue;}
    const txt=getText(d);
    const m=txt.match(/Menetapkan\s*:?\s*([\s\S]{0,400})/i);
    console.log('###',id,'| doc='+(d.docNumber||''),'| arts='+((d.articles||[]).length),'| ch='+(d.chars||0));
    console.log('TITLE:',it.s);
    console.log('MENETAPKAN:', m?m[1].replace(/\s+/g,' ').trim():'(无)');
    console.log('');
  }
}
