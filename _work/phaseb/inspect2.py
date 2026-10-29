# -*- coding: utf-8 -*-
import os, sys, re
sys.stdout.reconfigure(encoding="utf-8")
D = r"D:\A项目\Database_China–ASEAN Laws and Regulations Database\_work\models\bge-m3"
p = os.path.join(D, "model.onnx")
data = open(p, "rb").read()
print("  文件大小: %d 字节" % len(data))
# 查 external_data 字符串
for pat in [b"external_data", b".onnx_data", b"location", b"model.onnx_data"]:
    idx = data.find(pat)
    print("  含 %-18s %s" % (pat.decode(), ("位置 " + str(idx)) if idx >= 0 else "否"))
# 打印 location 附近
i = data.find(b"location")
if i >= 0:
    print()
    print("  location 附近: " + repr(data[max(0,i-80):i+120]))
print()
print("=== 试加载 ONNX（看是否报缺权重）===")
sys.path.insert(0, r"D:\A项目\Database_China–ASEAN Laws and Regulations Database\_work\pylibs")
import onnxruntime as ort
try:
    so = ort.SessionOptions()
    so.intra_op_num_threads = 4
    s = ort.InferenceSession(p, so, providers=["CPUExecutionProvider"])
    print("  ✓ 加载成功")
    for i in s.get_inputs(): print("     in  %-20s %s" % (i.name, i.shape))
    for o in s.get_outputs(): print("     out %-20s %s" % (o.name, o.shape))
except Exception as e:
    print("  ✗ 加载失败: %s" % str(e)[:300])
