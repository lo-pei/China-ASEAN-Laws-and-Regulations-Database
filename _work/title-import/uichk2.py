# -*- coding: utf-8 -*-
import io, os, subprocess, tempfile, re, json
edge = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
root = r"D:\A项目\Database_China–ASEAN Laws and Regulations Database"
src = os.path.join(root,"prototype/index.html"); dst = os.path.join(root,"prototype/_probe.html")
s = io.open(src, encoding="utf-8").read()
P = """
<script>(function(){function run(){var r={};
try{
  r.titles=[].slice.call(document.querySelectorAll('.law-item__title')).slice(0,8).map(function(e){return e.textContent.trim().slice(0,52);});
  r.tags=document.querySelectorAll('.law-item__title .tag').length;
  r.items=document.querySelectorAll('.law-item').length;
  var zh=0; document.querySelectorAll('.law-item__title').forEach(function(e){
    if(/[\\u4e00-\\u9fff]/.test(e.textContent)) zh++;
  });
  r.zhCount=zh;
}catch(e){r.err=e.message;}
document.title='PROBE|'+JSON.stringify(r);}
if(document.readyState==='complete') setTimeout(run,16000); else window.addEventListener('load',function(){setTimeout(run,16000);});})();</script>
"""
io.open(dst,"w",encoding="utf-8").write(s.replace("</body>", P+"</body>"))
for tag,hash_ in [("PH","#/search?country=PH"),("SG","#/search?country=SG"),("BN","#/search?country=BN")]:
    out = subprocess.run([edge,"--headless","--disable-gpu","--no-first-run",
      "--user-data-dir="+os.path.join(tempfile.gettempdir(),"tzh2-"+tag),
      "--virtual-time-budget=50000","--window-size=1440,1200","--dump-dom",
      "file:///"+root.replace("\\","/")+"/prototype/_probe.html"+hash_],capture_output=True)
    t = out.stdout.decode("utf-8","replace")
    m = re.search(r"<title>(PROBE[^<]*)</title>", t)
    print("=== %s ===" % tag)
    if m:
        d = json.loads(m.group(1)[6:])
        print("  结果 %s 条，其中含中文标题 %s 条" % (d.get("items"), d.get("zhCount")))
        for x in (d.get("titles") or [])[:5]: print("     " + x)
    else:
        print("  未取到")
os.remove(dst)
print("  探针已删除: " + str(not os.path.exists(dst)))
