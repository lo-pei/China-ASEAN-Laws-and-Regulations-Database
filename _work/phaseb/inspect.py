# -*- coding: utf-8 -*-
import os, sys, json
sys.stdout.reconfigure(encoding="utf-8")
D = r"D:\A项目\Database_China–ASEAN Laws and Regulations Database\_work\models\bge-m3"
print("=== 文件清单 ===")
for f in sorted(os.listdir(D)):
    p = os.path.join(D, f)
    if os.path.isfile(p):
        print("  %-28s %10d 字节" % (f, os.path.getsize(p)))

print()
print("=== model.onnx 头 300 字节 ===")
p = os.path.join(D, "model.onnx")
with open(p, "rb") as fh:
    head = fh.read(300)
print("  " + repr(head[:300]))

print()
print("=== config.json ===")
with open(os.path.join(D, "config.json"), encoding="utf-8") as fh:
    try:
        c = json.load(fh)
        for k in ["model_type","hidden_size","num_hidden_layers","vocab_size","max_position_embeddings","architectures"]:
            if k in c: print("  %-26s %s" % (k, c[k]))
        print("  顶层键: %s" % ", ".join(list(c.keys())[:12]))
    except Exception as e:
        print("  解析失败: %s" % e)
