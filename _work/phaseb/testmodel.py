# -*- coding: utf-8 -*-
import sys, os, time
sys.stdout.reconfigure(encoding="utf-8")
sys.path.insert(0, r"D:\A项目\Database_China–ASEAN Laws and Regulations Database\backend")
from app.embedder import Embedder
D = r"D:\A项目\Database_China–ASEAN Laws and Regulations Database\_work\models\bge-m3"
print("=== 文件 ===")
for f in sorted(os.listdir(D)):
    p = os.path.join(D, f)
    if os.path.isfile(p): print("  %-26s %8.1f MB" % (f, os.path.getsize(p)/1048576))
print()
print("=== 加载模型 ===")
t0 = time.time()
emb = Embedder(D)
print("  加载 %.1fs" % (time.time()-t0))
print()
print("=== 试编码（看维度与速度）===")
texts = ["中华人民共和国民法典", "越南外商投资法", "Thai Labour Protection Act", "个人数据保护法", " Arbitration "]
t0 = time.time()
v = emb.encode(texts)
dt = time.time()-t0
print("  维度 %s  形状 %s  耗时 %.2fs（%.1f 条/秒）" % (v.shape[1], v.shape, dt, len(texts)/dt))
print("  是否已 L2 归一化（模长）: %s" % [round(float(x),4) for x in (v**2).sum(axis=1)**0.5])
print()
print("=== 语义相似度抽查（应体现跨语言）===")
import numpy as np
tests = [
  ("中华人民共和国民法典", "泰国 民商法典"),
  ("中华人民共和国民法典", "Civil Code of Vietnam"),
  ("个人数据保护法", "Personal Data Protection Act"),
  ("个人数据保护法", "劳动合同法"),
  ("数据安全", "data security"),
  ("投资促进", "investment promotion"),
]
for a,b in tests:
    va = emb.encode([a]); vb = emb.encode([b])
    print("  %.4f   %s  ↔  %s" % (float((va*vb).sum()), a[:22], b[:30]))
