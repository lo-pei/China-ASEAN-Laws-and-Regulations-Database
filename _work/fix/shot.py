# -*- coding: utf-8 -*-
"""截图确认三处修复效果"""
import io
import os
import sys
import subprocess
import tempfile
import re
import json

sys.stdout.reconfigure(encoding="utf-8")
ROOT = os.getcwd()
OUT = os.path.join(ROOT, "_work", "fix")
os.makedirs(OUT, exist_ok=True)
EDGE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
PROBE = os.path.join(ROOT, "prototype/_probe.html")
URL = "file:///" + ROOT.replace("\\", "/") + "/prototype/"

JS = """
<script>
setTimeout(function(){
  var r = {};
  // 引用按钮数量与可见性
  var btns = document.querySelectorAll('.article__cite');
  r.citeBtns = btns.length;
  if (btns.length) {
    var cs = getComputedStyle(btns[0]);
    r.defaultOpacity = cs.opacity;
    r.hasSvg = !!btns[0].querySelector('svg');
    r.btnText = btns[0].textContent.trim();
  }
  // 正文对齐
  var p = document.querySelector('.article__p');
  if (p) { r.textAlign = getComputedStyle(p).textAlign; }
  // 断行修复：看某条长条文被拆成几段
  var arts = document.querySelectorAll('.article');
  r.articles = arts.length;
  var lens = [];
  for (var i = 0; i < Math.min(arts.length, 12); i++) {
    var ps = arts[i].querySelectorAll('.article__p');
    lens.push(ps.length);
  }
  r.parasPerArticle = lens;
  var b = document.createElement('b'); b.id='__p'; b.textContent = JSON.stringify(r); document.body.appendChild(b);
}, 16000);
</script>
"""

s = io.open(os.path.join(ROOT, "prototype/index.html"), encoding="utf-8").read()
io.open(PROBE, "w", encoding="utf-8").write(s.replace("</body>", JS + "</body>"))

out = subprocess.run([EDGE, "--headless", "--disable-gpu", "--no-first-run",
    "--run-all-compositor-stages-before-draw",
    "--user-data-dir=" + tempfile.mkdtemp(prefix="fx_"),
    "--virtual-time-budget=120000", "--window-size=1600,1400",
    "--screenshot=" + os.path.join(OUT, "law-after.png"),
    "--dump-dom",
    URL + "_probe.html#/law/MY-PDPA-2010"], capture_output=True)

t = out.stdout.decode("utf-8", "replace")
m = re.search(r'<b id="__p">([^<]*)</b>', t)
print("  === 法规详情页检查（MY-PDPA-2010，马来西亚个人数据保护法）===")
if m:
    d = json.loads(m.group(1))
    print("  引用按钮数量      : %s" % d.get("citeBtns"))
    print("  默认 opacity      : %s  %s" % (d.get("defaultOpacity"),
          "✓ 默认隐藏" if d.get("defaultOpacity") == "0" else "✗ 仍可见"))
    print("  按钮是图标        : %s" % ("✓" if d.get("hasSvg") else "✗ 仍是文字：" + str(d.get("btnText"))))
    print("  正文 text-align   : %s  %s" % (d.get("textAlign"),
          "✓ 两端对齐" if d.get("textAlign") == "justify" else "✗"))
    print("  条文数            : %s" % d.get("articles"))
    print("  前 12 条的段落数  : %s" % d.get("parasPerArticle"))
else:
    print("  未取到探针")

png = os.path.join(OUT, "law-after.png")
print("")
print("  截图: %.0f KB" % (os.path.getsize(png) / 1024 if os.path.exists(png) else 0))
if os.path.exists(PROBE):
    os.remove(PROBE)
