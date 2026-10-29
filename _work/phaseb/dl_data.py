# -*- coding: utf-8 -*-
"""下载 bge-m3 的外部权重文件 model.onnx_data（约 1.02 GB）"""
import os
import sys
import time
import urllib.request

sys.stdout.reconfigure(encoding="utf-8")
OUT = r"D:\A项目\Database_China–ASEAN Laws and Regulations Database\_work\models\bge-m3"
URL = "https://hf-mirror.com/BAAI/bge-m3/resolve/main/onnx/model.onnx_data"
NAME = "model.onnx_data"
UA = {"User-Agent": "Mozilla/5.0"}
EXPECT = 1024008192

dst = os.path.join(OUT, NAME)
tmp = dst + ".part"


def size(p):
    return os.path.getsize(p) if os.path.exists(p) else 0


print("  目标: %s" % dst)
print("  已有: %.1f MB" % (size(dst) / 1048576))
if size(dst) == EXPECT:
    print("  ✓ 已完整，跳过")
    sys.exit(0)

t0 = time.time()
have = size(tmp) if os.path.exists(tmp) else 0
headers = dict(UA)
if have:
    headers["Range"] = "bytes=%d-" % have
    print("  断点续传，从 %.1f MB 继续" % (have / 1048576))

try:
    req = urllib.request.Request(URL, headers=headers)
    with urllib.request.urlopen(req, timeout=120) as r:
        total = int(r.headers.get("Content-Length") or 0) + have
        mode = "ab" if have else "wb"
        done = have
        last = 0
        with open(tmp, mode) as fh:
            while True:
                chunk = r.read(1024 * 1024)
                if not chunk:
                    break
                fh.write(chunk)
                done += len(chunk)
                if done - last > 32 * 1024 * 1024:
                    last = done
                    el = time.time() - t0
                    sp = (done - have) / el / 1048576 if el > 0 else 0
                    eta = (total - done) / (sp * 1048576) if sp > 0 else 0
                    print("    %5.1f%%  %.0f/%.0f MB  %.1f MB/s  剩余 %.0fs" % (
                        done * 100.0 / total if total else 0,
                        done / 1048576, total / 1048576, sp, eta), flush=True)
    os.replace(tmp, dst)
    got = size(dst)
    print("  ✓ 完成 %.1f MB（期望 %.1f MB）耗时 %.0fs" % (got / 1048576, EXPECT / 1048576, time.time() - t0))
    if got != EXPECT:
        print("  ⚠ 大小不符，可能不完整")
        sys.exit(2)
except Exception as e:
    print("  ✗ %s" % str(e)[:200])
    print("  已下载 %.1f MB，可重跑本脚本续传" % (size(tmp) / 1048576))
    sys.exit(1)
