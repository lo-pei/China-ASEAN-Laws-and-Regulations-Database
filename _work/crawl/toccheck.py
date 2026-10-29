# -*- coding: utf-8 -*-
import io, os, sys, subprocess, tempfile, re, json
sys.stdout.reconfigure(encoding="utf-8")
ROOT = os.getcwd()
EDGE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
PROBE = os.path.join(ROOT, "prototype/_probe.html")
JS = r"""
<script>
setTimeout(function(){
  var g=[].slice.call(document.querySelectorAll('.toc-group__name')).map(function(h){return h.innerText.trim();});
  var c=[].slice.call(document.querySelectorAll('.toc-group__count')).map(function(h){return h.innerText.trim();});
  var body=document.body.innerText||'';
  var m=body.match(/法规正文\s*共\s*(\d+)\s*条/);
  var r={label:m?m[1]:null, groups:g.length, counts:c.map(function(x){return parseInt(x,10)||0;}),
         sum:c.reduce(function(a,x){return a+(parseInt(x,10)||0);},0),
         first:g.slice(0,3), errs:[]};
  var b=document.createElement('b');b.id='__p';b.textContent=JSON.stringify(r);document.body.appendChild(b);
},23000);
</script>
"""
s=io.open(os.path.join(ROOT,"prototype/index.html"),encoding="utf-8").read()
io.open(PROBE,"w",encoding="utf-8").write(s.replace("</head>",JS+"</head>",1))
for name, hash_ in [("PH-H359 中央银行法","#/law/PH-H359"), ("PH-H10362","#/law/PH-H10362")]:
    out=subprocess.run([EDGE,"--headless","--disable-gpu","--no-first-run",
      "--force-device-scale-factor=1","--user-data-dir="+tempfile.mkdtemp(prefix="t9_"),
      "--virtual-time-budget=170000","--window-size=1512,1000",
      "--screenshot="+os.path.join(ROOT,"_work/crawl/%s.png" % name.split()[0]),
      "--dump-dom","http://127.0.0.1:8000/_probe.html"+hash_],capture_output=True)
    t=out.stdout.decode("utf-8","replace"); m=re.search(r'<b id="__p">([^<]*)</b>',t)
    print("  %-16s" % name, end="")
    if m:
        d=json.loads(m.group(1))
        print("正文 %s 条  目录 %d 组  合计 %d 条" % (d["label"], d["groups"], d["sum"]))
        for x in d["first"]: print("      · %s" % x[:60])
    else: print("✗ 未取到探针")
if os.path.exists(PROBE): os.remove(PROBE)
