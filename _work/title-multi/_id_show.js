// 打印指定 id 的标题与正文开头（核对实体）
const fs=require('fs'),path=require('path');
const ROOT=path.resolve(__dirname,'../..');
const lawdir=path.join(ROOT,'prototype/data/laws');
for(const id of process.argv.slice(2)){
  const d=JSON.parse(fs.readFileSync(path.join(lawdir,id+'.json'),'utf8'));
  let t='';for(const a of d.articles||[]){t+='#'+(a.heading&&a.heading.id||'')+' '+(a.text&&a.text.id||'')+'\n';}
  console.log('===== '+id+'  ['+(d.docNumber||'-')+'] '+(d.promulgatedDate||'')+' 条数'+(d.articles||[]).length);
  console.log('  orig: '+(d.title||{}).orig);
  console.log('  en  : '+((d.title||{}).en||'（空）'));
  console.log('  body: '+t.replace(/\s+/g,' ').slice(0,700));
  console.log('');
}
