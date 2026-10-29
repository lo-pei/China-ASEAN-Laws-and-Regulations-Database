const fs=require('fs'),path=require('path');
const ROOT=path.resolve(__dirname,'../..');
const ids=process.argv.slice(2);
const lawdir=path.join(ROOT,'prototype/data/laws');
for(const id of ids){
  const d=JSON.parse(fs.readFileSync(path.join(lawdir,id+'.json'),'utf8'));
  const parts=[];
  for(const a of (d.articles||[])){
    // 保持章节顺序：heading 在 text 前
    const h=a.heading&&a.heading.id; if(h) parts.push('[H]'+h);
    const t=a.text&&a.text.id; if(t) parts.push('[T]'+t);
  }
  const all=parts.join('\n').replace(/\s+/g,' ');
  console.log('###',id,'|',d.docNumber||'-','| orig:',d.title.orig);
  console.log(all.slice(0,700));
  console.log('');
}
