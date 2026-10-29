const fs=require('fs'), path=require('path');
const D=path.join(process.cwd(),'prototype/data');
for(const sub of ['fulltext','intl','cn','trans','laws']){
  const p=path.join(D,sub);
  if(!fs.existsSync(p)){ console.log('  '+sub+': 不存在'); continue; }
  const files=fs.readdirSync(p);
  const js=files.filter(f=>f.endsWith('.js'));
  let bytes=0; js.forEach(f=>bytes+=fs.statSync(path.join(p,f)).size);
  console.log('  '+sub.padEnd(10)+' 文件 '+String(files.length).padStart(6)+'  js '+String(js.length).padStart(5)+'  合计 '+(bytes/1048576).toFixed(1)+' MB');
  console.log('      样例: '+files.slice(0,4).join(', '));
}
// 看一个 pack 的头部，确认它挂到什么全局变量
const sample=path.join(D,'fulltext');
if(fs.existsSync(sample)){
  const f=fs.readdirSync(sample).filter(x=>x.endsWith('.js'))[0];
  if(f){ const h=fs.readFileSync(path.join(sample,f),'utf8').slice(0,260); console.log(''); console.log('  '+f+' 头部:'); console.log('    '+h.replace(/\n/g,' ').slice(0,240)); }
}
