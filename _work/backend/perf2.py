# -*- coding: utf-8 -*-
import io, os, sys, subprocess, tempfile, re, json
sys.stdout.reconfigure(encoding="utf-8")
ROOT = r"D:\A项目\Database_China–ASEAN Laws and Regulations Database"
os.chdir(ROOT)
EDGE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
SRC = os.path.join(ROOT, "prototype/index.html"); PROBE = os.path.join(ROOT, "prototype/_probe.html")
URL = "file:///" + ROOT.replace("\\","/") + "/prototype/"
s = io.open(SRC, encoding="utf-8").read()
# 在最前打点：脚本开始执行的时间
HEAD = '<script>window.__T0=Date.now();window.__ready=null;window.__readyDetail={};</script>'
TAIL = """
<script>
(function poll(){
  if (window.CALR && CALR.store && CALR.store.stats) {
    var st = null;
    try { st = CALR.store.stats(); } catch(e){}
    if (st && st.laws > 0 && window.__ready === null) {
      window.__ready = Date.now() - window.__T0;
      window.__readyDetail = { laws: st.laws, articles: st.articles };
    }
  }
  if (window.__ready === null) return setTimeout(poll, 40);
  // 再等一下首页渲染完，抓首页数字
  setTimeout(function(){
    var m = document.body.innerText.match(/([\\d,]+)\\s*部法规/);
    var m2 = document.body.innerText.match(/([\\d,]+)\\s*条条文/);
    var r = { readyMs: window.__ready, laws: window.__readyDetail.laws, articles: window.__readyDetail.articles,
              homeLaws: m ? m[1] : null, homeArticles: m2 ? m2[1] : null };
    var b = document.createElement('b'); b.id='__p'; b.textContent = JSON.stringify(r); document.body.appendChild(b);
  }, 3000);
})();
</script>
"""
io.open(PROBE, "w", encoding="utf-8").write(s.replace("<head>", "<head>"+HEAD, 1).replace("</body>", TAIL+"</body>"))
out = subprocess.run([EDGE,"--headless","--disable-gpu","--no-first-run",
  "--user-data-dir="+os.path.join(tempfile.gettempdir(),"perf2"),
  "--virtual-time-budget=90000","--window-size=1440,1000","--dump-dom",
  URL+"_probe.html#/"],capture_output=True)
t = out.stdout.decode("utf-8","replace")
m = re.search(r'<b id="__p">([^<]*)</b>', t)
print("  === 首页就绪耗时 ===")
if m:
    d = json.loads(m.group(1))
    print("  store 就绪        : %s ms" % d.get("readyMs"))
    print("  法规 / 条文       : %s / %s" % (d.get("laws"), d.get("articles")))
    print("  首页显示 法规     : %s" % d.get("homeLaws"))
    print("  首页显示 条文     : %s" % d.get("homeArticles"))
else:
    print("  未取到探针")
if os.path.exists(PROBE): os.remove(PROBE)
