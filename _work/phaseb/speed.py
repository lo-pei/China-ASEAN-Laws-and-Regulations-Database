# -*- coding: utf-8 -*-
import os, sys, time, sqlite3
sys.stdout.reconfigure(encoding="utf-8")
ROOT = r"D:\A项目\Database_China–ASEAN Laws and Regulations Database"
sys.path.insert(0, os.path.join(ROOT, "_work/pylibs_dml"))
sys.path.append(os.path.join(ROOT, "_work", "pylibs"))
import numpy as np, onnxruntime as ort
from tokenizers import Tokenizer

D = os.path.join(ROOT, "_work", "models", "bge-m3")
con = sqlite3.connect(os.path.join(ROOT, "backend", "data", "calr.db"))
rows = con.execute("SELECT text_zh, text_en, text_orig FROM articles LIMIT 400").fetchall()
con.close()
texts = []
for r in rows:
    t = " ".join(x for x in r if x) or "(空)"
    texts.append(t[:2000])

so = ort.SessionOptions()
so.graph_optimization_level = ort.GraphOptimizationLevel.ORT_ENABLE_ALL
sess = ort.InferenceSession(os.path.join(D, "model.onnx"), so,
                            providers=["DmlExecutionProvider", "CPUExecutionProvider"])
inputs = {i.name for i in sess.get_inputs()}

for MAXLEN, B in [(256,12),(192,16),(256,16),(160,16),(128,24)]:
    tok = Tokenizer.from_file(os.path.join(D, "tokenizer.json"))
    tok.enable_truncation(max_length=MAXLEN)
    tok.enable_padding(length=None, pad_id=1, pad_token="<pad>")
    # 预热
    e = tok.encode_batch(texts[:4]); fd = {"input_ids": np.array([x.ids for x in e], dtype=np.int64),
        "attention_mask": np.array([x.attention_mask for x in e], dtype=np.int64)}
    if "token_type_ids" in inputs: fd["token_type_ids"] = np.zeros_like(fd["input_ids"])
    sess.run(None, fd)
    t0 = time.time(); n = 0
    try:
        for s in range(0, len(texts), B):
            batch = texts[s:s+B]
            e = tok.encode_batch(batch)
            fd = {"input_ids": np.array([x.ids for x in e], dtype=np.int64),
                  "attention_mask": np.array([x.attention_mask for x in e], dtype=np.int64)}
            if "token_type_ids" in inputs: fd["token_type_ids"] = np.zeros_like(fd["input_ids"])
            sess.run(None, fd); n += len(batch)
        dt = time.time()-t0
        print("  maxLen=%-4d batch=%-3d → %5.1f 条/秒   ETA %5.1f 小时" % (
            MAXLEN, B, n/dt, 334779/(n/dt)/3600))
    except Exception as ex:
        print("  maxLen=%-4d batch=%-3d → ✗ %s" % (MAXLEN, B, type(ex).__name__))
