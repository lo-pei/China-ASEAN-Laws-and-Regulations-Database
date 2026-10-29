# -*- coding: utf-8 -*-
import os, sys, time
sys.stdout.reconfigure(encoding="utf-8")
ROOT = r"D:\A项目\Database_China–ASEAN Laws and Regulations Database"
sys.path.insert(0, os.path.join(ROOT, "backend"))
from app import db, search as bm25_mod, vectors as vec_mod, embedder, hybrid

def t(it):
    tt = it.get("title") or {}
    return tt.get("zh") or tt.get("en") or tt.get("orig") or "(无标题)"

print("=== 国别识别测试 ===")
for q in ["越南外商投资准入","泰国劳动保护","缅甸仲裁","中国公司注册资本","民法典","东盟数据保护"]:
    print("  %-22s → %s" % (q, bm25_mod.detect_countries(q)))

print()
print("=== 融合后的国别约束效果 ===")
for q in ["越南外商投资准入","泰国劳动保护","缅甸仲裁"]:
    h = hybrid.hybrid_search(q, size=5)
    print("  ══ %s ══ 共 %d 条" % (q, h["total"]))
    for i, it in enumerate(h["items"], 1):
        print("    %d. %s %-36s rrf=%s" % (i, it["country"].ljust(3), t(it)[:36],
              it.get("debug",{}).get("rrf")))
