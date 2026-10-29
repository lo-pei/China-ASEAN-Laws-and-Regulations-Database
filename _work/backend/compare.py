# -*- coding: utf-8 -*-
"""对比：旧 catalog（备份）vs 新 catalog 的首屏就绪耗时"""
import io, os, sys, subprocess, tempfile, re, json, shutil

sys.stdout.reconfigure(encoding="utf-8")
ROOT = r"D:\A项目\Database_China–ASEAN Laws and Regulations Database"
os.chdir(ROOT)
EDGE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
SRC = os.path.join(ROOT, "prototype/index.html")
PROBE = os.path.join(ROOT, "prototype/_probe.html")
URL = "file:///" + ROOT.replace("\\", "/") + "/prototype/"
PD = os.path.join(ROOT, "prototype/data")
BK = os.path.join(ROOT, "_work/backend")

HEAD = '<script>window.__T0=Date.now();window.__ready=null;window.__d={};</script>'
TAIL = """
<script>
(function poll(){
  if (window.CALR && CALR.store && CALR.store.stats) {
    try { var st = CALR.store.stats();
      if (st.laws > 0 && window.__ready === null) { window.__ready = Date.now() - window.__T0; window.__d = st; }
    } catch(e){}
  }
  if (window.__ready === null) return setTimeout(poll, 40);
  var r = { readyMs: window.__ready, laws: window.__d.laws, articles: window.__d.articles };
  var b = document.createElement('b'); b.id='__p'; b.textContent = JSON.stringify(r); document.body.appendChild(b);
})();
</script>
"""

s = io.open(SRC, encoding="utf-8").read()
io.open(PROBE, "w", encoding="utf-8").write(s.replace("<head>", "<head>" + HEAD, 1).replace("</body>", TAIL + "</body>"))


def run(tag):
    out = subprocess.run([EDGE, "--headless", "--disable-gpu", "--no-first-run",
        "--user-data-dir=" + os.path.join(tempfile.gettempdir(), "cmp_" + tag),
        "--virtual-time-budget=90000", "--window-size=1440,1000", "--dump-dom",
        URL + "_probe.html#/"], capture_output=True)
    t = out.stdout.decode("utf-8", "replace")
    m = re.search(r'<b id="__p">([^<]*)</b>', t)
    return json.loads(m.group(1)) if m else None


print("  === 新 catalog（current）===")
d1 = run("new")
print("    " + json.dumps(d1, ensure_ascii=False))

# 临时换回旧 catalog
shutil.copy(os.path.join(PD, "cn-catalog.js"), os.path.join(BK, "cn-catalog.new.js"))
shutil.copy(os.path.join(PD, "intl-catalog.js"), os.path.join(BK, "intl-catalog.new.js"))
shutil.copy(os.path.join(BK, "cn-catalog.js.bak"), os.path.join(PD, "cn-catalog.js"))
shutil.copy(os.path.join(BK, "intl-catalog.js.bak"), os.path.join(PD, "intl-catalog.js"))
try:
    print("")
    print("  === 旧 catalog（baseline）===")
    d2 = run("old")
    print("    " + json.dumps(d2, ensure_ascii=False))
finally:
    # 恢复新 catalog
    shutil.copy(os.path.join(BK, "cn-catalog.new.js"), os.path.join(PD, "cn-catalog.js"))
    shutil.copy(os.path.join(BK, "intl-catalog.new.js"), os.path.join(PD, "intl-catalog.js"))
    print("")
    print("  已恢复新 catalog")

if d1 and d2:
    print("")
    print("  === 对比 ===")
    print("    旧: %s ms / 法规 %s" % (d2.get("readyMs"), d2.get("laws")))
    print("    新: %s ms / 法规 %s" % (d1.get("readyMs"), d1.get("laws")))
    print("    增量: +%s ms（+%s 部法规）" % (d1["readyMs"] - d2["readyMs"], d1["laws"] - d2["laws"]))
if os.path.exists(PROBE):
    os.remove(PROBE)
