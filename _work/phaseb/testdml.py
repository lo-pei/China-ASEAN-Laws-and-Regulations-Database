# -*- coding: utf-8 -*-
import sys, os, time
sys.stdout.reconfigure(encoding="utf-8")
sys.path.insert(0, r"D:\A项目\Database_China–ASEAN Laws and Regulations Database\_work\pylibs_dml")
sys.path.append(r"D:\A项目\Database_China–ASEAN Laws and Regulations Database\_work\pylibs")
import numpy as np
import onnxruntime as ort
from tokenizers import Tokenizer

D = r"D:\A项目\Database_China–ASEAN Laws and Regulations Database\_work\models\bge-m3"
tok = Tokenizer.from_file(os.path.join(D, "tokenizer.json"))
tok.enable_truncation(max_length=512)
tok.enable_padding(length=None, pad_id=1, pad_token="<pad>")

print("=== 用 DirectML 建 session ===")
t0 = time.time()
so = ort.SessionOptions()
so.graph_optimization_level = ort.GraphOptimizationLevel.ORT_ENABLE_ALL
try:
    sess = ort.InferenceSession(os.path.join(D, "model.onnx"), so,
                                providers=["DmlExecutionProvider", "CPUExecutionProvider"])
    print("  加载 %.1fs  实际 provider: %s" % (time.time()-t0, sess.get_providers()))
except Exception as e:
    print("  ✗ 失败: %s" % str(e)[:300])
    sys.exit(1)

inputs = {i.name for i in sess.get_inputs()}
print("  输入: %s" % sorted(inputs))

texts = ["中华人民共和国民法典", "越南外商投资法", "Thai Labour Protection Act 1998",
         "个人数据保护法", "Arbitration Ordinance", "劳动合同", "外商投资准入负面清单",
         "缅甸仲裁法", "数据出境安全评估办法", "个人信息保护法"] * 4   # 40 条

print()
print("=== 预热 ===")
enc = tok.encode_batch(texts[:2])
feed = {"input_ids": np.array([e.ids for e in enc], dtype=np.int64),
        "attention_mask": np.array([e.attention_mask for e in enc], dtype=np.int64)}
if "token_type_ids" in inputs: feed["token_type_ids"] = np.zeros_like(feed["input_ids"])
t0=time.time(); out = sess.run(None, feed)
print("  预热 %.1fs  输出形状 %s" % (time.time()-t0, out[0].shape))

print()
print("=== 吞吐测试（batch=8）===")
for B in [8, 16, 32]:
    t0 = time.time()
    n = 0
    for s in range(0, len(texts), B):
        batch = texts[s:s+B]
        e = tok.encode_batch(batch)
        fd = {"input_ids": np.array([x.ids for x in e], dtype=np.int64),
              "attention_mask": np.array([x.attention_mask for x in e], dtype=np.int64)}
        if "token_type_ids" in inputs: fd["token_type_ids"] = np.zeros_like(fd["input_ids"])
        sess.run(None, fd)
        n += len(batch)
    dt = time.time()-t0
    print("  batch=%-3d  %d 条 %.2fs → %.1f 条/秒" % (B, n, dt, n/dt))
