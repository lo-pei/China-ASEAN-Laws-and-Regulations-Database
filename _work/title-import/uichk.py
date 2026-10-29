# -*- coding: utf-8 -*-
import io, os, subprocess, tempfile, re, json
edge = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
root = r"D:\A项目\Database_China–ASEAN Laws and Regulations Database"
src = os.path.join(root,"prototype/index.html"); dst = os.path.join(root,"prototype/_probe.html")
s = io.open(src, encoding="utf-8").read()
P = """
<script>(function(){function run(){var r={};
try{
  var t=[].slice.call(document.querySelectorAll('.law-item__title')).slice(0,6).map(function(e){return e.textContent.trim().slice(0,60);});
  r.titles=t;
  r.tags=document.querySelectorAll('.law-item__title .tag').length;
  r.items=document.querySelectorAll('.law-item').length;
}catch(e){r.err=e.message;}
document.title='PROBE|'+JSON.stringify(r);}
if(document.readyState==='complete') setTimeout(run,16000); else window.addEventListener('load',function(){setTimeout(run,16000);});})();</script>
"""
io.open(dst,"w",encoding="utf-8").write(s.replace("</body>", P+"</body>"))
out = subprocess.run([edge,"--headless","--disable-gpu","--no-first-run",
  "--user-data-dir="+os.path.join(tempfile.gettempdir(),"tzh"),
  "--virtual-time-budget=50000","--window-size=1440,1200","--dump-dom",
  "file:///"+root.replace("\\","/")+"/prototype/_probe.html#/search?country=PH"],capture_output=True)
t = out.stdout.decode("utf-8","replace")
m = re.search(r"<title>(PROBE[^<]*)</title>", t)
if m:
    d = json.loads(m.group(1)[6:])
    print("  菲律宾筛选：结果 %s 条" % d.get("items"))
    for x in (d.get("titles") or []): print("     " + x)
os.remove(dst)
