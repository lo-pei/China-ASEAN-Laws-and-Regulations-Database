# -*- coding: utf-8 -*-
"""从 hf-mirror 下载 BAAI/bge-m3 的 ONNX 模型与分词器文件"""
import os
import sys
import time
import urllib.request

sys.stdout.reconfigure(encoding="utf-8")

MIRROR = "https://hf-mirror.com/BAAI/bge-m3/resolve/main/"
OUT = r"D:\A项目\Database_China–ASEAN Laws and Regulations Database\_work\models\bge-m3"
os.makedirs(OUT, exist_ok=True)

FILES = [
    ("onnx/model.onnx", "model.onnx"),
    ("config.json", "config.json"),
    ("tokenizer.json", "tokenizer.json"),
    ("tokenizer_config.json", "tokenizer_config.json"),
    ("special_tokens_map.json", "special_tokens_map.json"),
]

UA = {"User-Agent": "Mozilla/5.0"}


def fetch(rel, name):
    dst = os.path.join(OUT, name)
    if os.path.exists(dst) and os.path.getsize(dst) > 1024:
        print("  跳过（已存在）%-28s %.1f MB" % (name, os.path.getsize(dst) / 1048576), flush=True)
        return True
    url = MIRROR + rel
    tmp = dst + ".part"
    t0 = time.time()
    try:
        req = urllib.request.Request(url, headers=UA)
        with urllib.request.urlopen(req, timeout=60) as r:
            total = int(r.headers.get("Content-Length") or 0)
            done = 0
            with open(tmp, "wb") as fh:
                while True:
                    chunk = r.read(1024 * 512)
                    if not chunk:
                        break
                    fh.write(chunk)
                    done += len(chunk)
                    if total and done % (1024 * 1024 * 32) < 1024 * 512:
                        pct = done * 100.0 / total
                        print("    %-24s %5.1f%%  %.0f/%.0f MB  %.0fs" % (
                            name, pct, done / 1048576, total / 1048576, time.time() - t0), flush=True)
        os.replace(tmp, dst)
        print("  ✓ %-28s %.1f MB  %.0fs" % (name, os.path.getsize(dst) / 1048576, time.time() - t0), flush=True)
        return True
    except Exception as e:
        print("  ✗ %-28s %s" % (name, e), flush=True)
        if os.path.exists(tmp):
            try:
                os.remove(tmp)
            except Exception:
                pass
        return False


ok = 0
for rel, name in FILES:
    if fetch(rel, name):
        ok += 1

print("", flush=True)
print("  完成 %d/%d" % (ok, len(FILES)), flush=True)
total = sum(os.path.getsize(os.path.join(OUT, f)) for f in os.listdir(OUT) if os.path.isfile(os.path.join(OUT, f)))
print("  目录 %s" % OUT, flush=True)
print("  总大小 %.1f MB" % (total / 1048576), flush=True)
