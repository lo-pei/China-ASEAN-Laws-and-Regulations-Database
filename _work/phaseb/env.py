# -*- coding: utf-8 -*-
import sys, os, subprocess, time, shutil
sys.stdout.reconfigure(encoding="utf-8")
sys.path.insert(0, r"_work\pylibs")
print("=== 硬件 ===")
try:
    r = subprocess.run(["wmic","path","win32_VideoController","get","name"], capture_output=True, timeout=20)
    txt = r.stdout.decode("gbk","replace")
    for ln in txt.split("\n"):
        ln = ln.strip()
        if ln and "Name" not in ln: print("  GPU: " + ln)
except Exception as e:
    print("  查 GPU 失败: %s" % e)
print("  CPU 核数: %d" % os.cpu_count())
total, used, free = shutil.disk_usage("D:\\")
print("  D 盘剩余: %.1f GB" % (free/1024**3))

print()
print("=== 已有依赖 ===")
for m in ["torch","sentence_transformers","transformers","numpy","onnxruntime","faiss"]:
    try:
        mod=__import__(m); print("  OK  %-22s %s" % (m, getattr(mod,"__version__","")))
    except Exception:
        print("  --  %-22s 未安装" % m)

print()
print("=== 网络 ===")
import urllib.request
for u in ["https://huggingface.co","https://hf-mirror.com","https://pypi.org","https://modelscope.cn"]:
    try:
        t0=time.time()
        with urllib.request.urlopen(u, timeout=8) as r:
            print("  OK  %-28s %d  %.1fs" % (u, r.status, time.time()-t0))
    except Exception as e:
        print("  --  %-28s %s" % (u, str(e)[:60]))
