// 按前缀族导出：唯一标题 + 首个 id 的 Pasal 1 首句（供人工定题名）
const fs=require('fs'),path=require('path');
const ROOT=path.resolve(__dirname,'../..');
const b=JSON.parse(fs.readFileSync(path.join(__dirname,'_id_buckets.json'),'utf8'));
const re=new RegExp(process.argv[2]);
const from=parseInt(process.argv[3]||'0',10), to=parseInt(process.argv[4]||'999',10);
const lawdir=path.join(ROOT,'prototype/data/laws');
const g=b.long.filter(u=>re.test(u.s)).slice(from,to);
let n=0;
for(const u of g){
  n++;
  const d=JSON.parse(fs.readFileSync(path.join(lawdir,u.ids[0]+'.json'),'utf8'));
  let t='';for(const a of d.articles||[]){t+=(a.heading&&a.heading.id||'')+' '+(a.text&&a.text.id||'')+' ';}
  t=t.replace(/\s+/g,' ');
  const m=t.match(/Pasal\s*1\b([\s\S]{0,330})/);
  console.log('['+n+'] '+u.ids.length+' 条 | '+u.s);
  console.log('    '+d.docNumber+' | '+(m?m[1].trim():t.slice(0,300)));
  console.log('');
}
