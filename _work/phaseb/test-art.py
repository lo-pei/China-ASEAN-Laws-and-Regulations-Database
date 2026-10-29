# -*- coding: utf-8 -*-
"""验证条文级向量：能否准确召回「具体哪一条」"""
import os
import sys
import time

sys.stdout.reconfigure(encoding="utf-8")
ROOT = r"D:\A项目\Database_China–ASEAN Laws and Regulations Database"
sys.path.insert(0, os.path.join(ROOT, "backend"))
os.chdir(ROOT)

from app import db, vectors as vec_mod, embedder  # noqa: E402

print("  " + vec_mod.stats_text())
emb = embedder.get()
print("  模型: %s" % ("已加载" if emb else "不可用"))
print("")

QUERIES = [
    "数据安全法里关于数据分类分级保护的规定",
    "个人信息处理者处理个人信息应当取得同意",
    "民法典关于合同解除的规定",
    "外商投资准入负面清单",
    "劳动法关于加班工资的规定",
    "泰国个人数据保护法关于跨境传输",
    "仲裁裁决的撤销情形",
    "公司注册资本认缴期限",
]


def title_of(lid):
    r = db.row("SELECT country, title_zh, title_en FROM laws WHERE id=?", (lid,))
    if not r:
        return "?", "?"
    return r["country"], (r["title_zh"] or r["title_en"] or lid)


print("  ══ 条文级向量召回（每查询取前 5 条）══")
for q in QUERIES:
    t0 = time.time()
    qv = emb.encode([q])[0]
    hits = vec_mod.search_articles(qv, topk=5)
    ms = (time.time() - t0) * 1000
    print("")
    print("  ▸ %s  (%.0fms)" % (q, ms))
    for meta, sc in hits:
        lid = meta["law_id"]
        c, ti = title_of(lid)
        # 取该条文正文前 60 字
        r = db.row("SELECT text_zh, text_en, text_orig FROM articles "
                   "WHERE law_id=? AND no=? AND IFNULL(dup_index,1)=IFNULL(?,1)", (lid, meta["no"], meta["dup_index"]))
        body = ""
        if r:
            body = (r["text_zh"] or r["text_en"] or r["text_orig"] or "")[:64]
        print("      %.4f  %s %-26s 第%-4s  %s" % (
            sc, c, ti[:26], meta["no"], body.replace("\n", " ")))
