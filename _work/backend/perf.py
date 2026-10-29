# -*- coding: utf-8 -*-
"""测浏览器里的真实加载时间（含 catalog 解析）"""
import io, os, sys, subprocess, tempfile, re, json

sys.stdout.reconfigure(encoding="utf-8")
ROOT = r"D:\A项目\Database_China–ASEAN Laws and Regulations Database"
os.chdir(ROOT)
EDGE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
SRC = os.path.join(ROOT, "prototype/index.html")
PROBE = os.path.join(ROOT, "prototype/_probe.html")
URL = "file:///" + ROOT.replace("\\", "/") + "/prototype/"

# 在最前面打点，首页渲染完成后汇报
PROBE_JS = """
<script>
window.__T0 = performance.now();
window.__marks = [];
function mark(name){ window.__marks.push([name, Math.round(performance.now() - window.__T0)]); }
</script>
"""
TAIL = """
<script>
setTimeout(function(){
  var r = {};
  r.marks = window.__marks || [];
  r.domReady = Math.round(performance.now() - window.__T0);
  r.laws = (window.CALR && CALR.store) ? CALR.store.stats().laws : -1;
  r.articles = (window.CALR && CALR.store) ? CALR.store.stats().articles : -1;
  r.nav = performance.getEntriesByType ? performance.getEntriesByType('navigation').length : -1;
  var res = performance.getEntriesByType ? performance.getEntriesByType('resource') : [];
  r.resCount = res.length;
  r.resBytes = res.reduce(function(s, x){ return s + (x.transferSize || 0); }, 0);
  // 最大的几个资源
  r.topRes = res.slice().sort(function(a,b){ return (b.transferSize||0)-(a.transferSize||0); }).slice(0,6)
    .map(function(x){ return { n: (x.name||'').split('/').pop(), kb: Math.round((x.transferSize||0)/1024), ms: Math.round(x.duration||0) }; });
  r.homeStats = document.body.innerText.match(/(\\d[\\d,]*)\\s*部法规/);
  var b = document.createElement('b'); b.id='__p'; b.textContent = JSON.stringify(r); document.body.appendChild(b);
}, 16000);
</script>
"""
s = io.open(SRC, encoding="utf-8").read()
s2 = s.replace("<head>", "<head>" + PROBE_JS, 1)
io.open(PROBE, "w", encoding="utf-8").write(s2.replace("</body>", TAIL + "</body>"))

out = subprocess.run([EDGE, "--headless", "--disable-gpu", "--no-first-run",
    "--user-data-dir=" + os.path.join(tempfile.gettempdir(), "perf1"),
    "--virtual-time-budget=90000", "--window-size=1440,1000", "--dump-dom",
    URL + "_probe.html#/"], capture_output=True)
t = out.stdout.decode("utf-8", "replace")
m = re.search(r'<b id="__p">([^<]*)</b>', t)
print("  === 浏览器加载性能 ===")
if m:
    d = json.loads(m.group(1))
    print("  DOM 就绪(16s 后采样): %s ms" % d.get("domReady"))
    print("  法规 / 条文        : %s / %s" % (d.get("laws"), d.get("articles")))
    print("  资源数             : %s" % d.get("resCount"))
    print("  资源总字节         : %.1f MB" % (d.get("resBytes", 0) / 1048576))
    print("  首页数字           : %s" % d.get("homeStats"))
    print("  最大的资源:")
    for x in (d.get("topRes") or []):
        print("    %-24s %6d KB  %6d ms" % (x["n"][:24], x["kb"], x["ms"]))
else:
    print("  未取到探针")
if os.path.exists(PROBE):
    os.remove(PROBE)
