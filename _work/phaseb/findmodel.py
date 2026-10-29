# -*- coding: utf-8 -*-
import sys, json, urllib.request, urllib.parse
sys.stdout.reconfigure(encoding="utf-8")

print("=== hf-mirror 上 bge-m3 的 ONNX 分支 ===")
def head(u):
    try:
        req = urllib.request.Request(u, method="HEAD", headers={"User-Agent":"Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=15) as r: return r.status
    except Exception as e: return str(e)[:50]

for u in [
  "https://hf-mirror.com/BAAI/bge-m3/resolve/main/onnx/model.onnx",
  "https://hf-mirror.com/BAAI/bge-m3/resolve/main/onnx/model_quantized.onnx",
  "https://hf-mirror.com/Xenova/bge-m3/resolve/main/onnx/model_quantized.onnx",
  "https://hf-mirror.com/BAAI/bge-m3/resolve/main/config.json",
]:
    print("  %-72s %s" % (u.split("hf-mirror.com")[-1], head(u)))

print()
print("=== modelscope 搜索 embedding 模型 ===")
def api(url):
    try:
        req = urllib.request.Request(url, headers={"User-Agent":"Mozilla/5.0","Content-Type":"application/json"})
        with urllib.request.urlopen(req, timeout=20) as r: return json.loads(r.read().decode("utf-8"))
    except Exception as e: return {"err": str(e)[:80]}

for q in ["bge-m3","bge-m3 onnx","multilingual embedding"]:
    d = api("https://modelscope.cn/api/v1/dolphin/models?PageSize=5&PageNumber=1&Query=" + urllib.parse.quote(q))
    print("  查询「%s」:" % q)
    if "err" in d: print("      err %s" % d["err"]); continue
    for it in (d.get("Data",{}) or {}).get("Model",{}).get("Models",[]) or []:
        print("      %-40s %s" % (it.get("Name","")[:40], (it.get("ChineseName") or "")[:30]))
