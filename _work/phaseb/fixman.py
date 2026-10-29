# -*- coding: utf-8 -*-
import io, os, json, sys, time
sys.stdout.reconfigure(encoding="utf-8")
os.chdir(r"D:\A项目\Database_China–ASEAN Laws and Regulations Database")

# 1) 补丁：manifest 合并写入（不要覆盖另一级别）
p = "_work/phaseb/embed.py"
s = io.open(p, encoding="utf-8").read()
o = s
s = s.replace(
'''    manifest = {"model": "BAAI/bge-m3", "maxLen": MAX_LEN,
                "quant": "int8-symmetric-per-row", "createdAt": time.strftime("%Y-%m-%dT%H:%M:%S")}''',
'''    # manifest 必须「合并」而不是覆盖：法规级和条文级分别在不同次运行中产生，
    # 覆盖会让先跑完的那一级从 manifest 里消失，向量文件还在但读不到。
    man_path = os.path.join(OUT, "manifest.json")
    manifest = {}
    if os.path.exists(man_path):
        try:
            with open(man_path, encoding="utf-8") as _f:
                manifest = json.load(_f) or {}
        except Exception:
            manifest = {}
    manifest.update({"model": "BAAI/bge-m3", "maxLen": MAX_LEN,
                     "quant": "int8-symmetric-per-row",
                     "createdAt": time.strftime("%Y-%m-%dT%H:%M:%S")})''')
if s != o:
    io.open(p, "w", encoding="utf-8").write(s)
    print("  ✓ embed.py manifest 改为合并写入")
else:
    print("  ! 锚点未命中")

# 2) 立即修复当前 manifest：把 law 段补回去
V = "backend/data/vectors"
mp = os.path.join(V, "manifest.json")
man = {}
if os.path.exists(mp):
    try: man = json.load(io.open(mp, encoding="utf-8"))
    except Exception: man = {}
if "law" not in man and os.path.exists(os.path.join(V, "law_vecs.i8.npy")):
    import numpy as np
    q = np.load(os.path.join(V, "law_vecs.i8.npy"), mmap_mode="r")
    man["model"] = man.get("model") or "BAAI/bge-m3"
    man["quant"] = man.get("quant") or "int8-symmetric-per-row"
    man["law"] = {"count": int(q.shape[0]), "dim": int(q.shape[1])}
    io.open(mp, "w", encoding="utf-8").write(json.dumps(man, ensure_ascii=False, indent=1))
    print("  ✓ 已把 law 段补回 manifest：%d × %d" % (q.shape[0], q.shape[1]))
else:
    print("  - manifest 已有 law 段" if "law" in man else "  ! 找不到 law 向量文件")
print("  当前 manifest: %s" % json.dumps(man, ensure_ascii=False))
