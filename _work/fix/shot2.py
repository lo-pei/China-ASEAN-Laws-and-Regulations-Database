# -*- coding: utf-8 -*-
import io, os, sys, subprocess, tempfile, re, json
sys.stdout.reconfigure(encoding="utf-8")
ROOT = os.getcwd()
EDGE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
PROBE = os.path.join(ROOT, "prototype/_probe.html")
JS = """
<script>
setTimeout(function(){
  var r = {};
  r.citeBtns = document.querySelectorAll('.article__cite').length;
  r.articles = document.querySelectorAll('.article').length;
  var toc = document.querySelectorAll('[class*=toc] li, .toc li, aside li');
  r.tocItems = toc.length;
  var body = document.body.innerText.replace(/\\s+/g,' ');
  r.head = body.slice(0, 400);
  var m = body.match(/法规正文\\s*共\\s*(\\d+)\\s*条/); r.countLabel = m ? m[1] : null;
  var b = document.createElement('b'); b.id='__p'; b.textContent = JSON.stringify(r); document.body.appendChild(b);
}, 17000);
</script>
"""
s = io.open(os.path.join(ROOT, "prototype/index.html"), encoding="utf-8").read()
io.open(PROBE, "w", encoding="utf-8").write(s.replace("</body>", JS + "</body>"))
out = subprocess.run([EDGE,"--headless","--disable-gpu","--no-first-run",
  "--run-all-compositor-stages-before-draw",
  "--user-data-dir="+tempfile.mkdtemp(prefix="sp_"),
  "--virtual-time-budget=130000","--window-size=1600,1400",
  "--screenshot="+os.path.join(ROOT,"_work/fix/law-split.png"),
  "--dump-dom", "file:///"+ROOT.replace("\\","/")+"/prototype/_probe.html#/law/MY-H075"],
  capture_output=True)
t = out.stdout.decode("utf-8","replace")
m = re.search(r'<b id="__p">([^<]*)</b>', t)
print("  === MY-H075（个人数据保护法，原来「共 1 条」）===")
if m:
    d = json.loads(m.group(1))
    print("  引用按钮数    : %s  %s" % (d.get("citeBtns"), "✓ 已删除" if d.get("citeBtns")==0 else "✗ 仍在"))
    print("  条文数        : %s" % d.get("articles"))
    print("  「法规正文 共N条」: %s" % d.get("countLabel"))
    print("  条文目录项    : %s" % d.get("tocItems"))
else:
    print("  未取到探针")
if os.path.exists(PROBE): os.remove(PROBE)
