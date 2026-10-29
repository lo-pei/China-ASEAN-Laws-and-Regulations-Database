# -*- coding: utf-8 -*-
"""扫描越南语法规语料实况（为制定 VI→EN 规范与任务包做准备）"""
import os, glob, io, json, collections

PROJ = glob.glob(r"D:\A*\Database_China*")[0]
LAWS = os.path.join(PROJ, "prototype", "data", "laws")

files = [f for f in os.listdir(LAWS) if f.endswith(".json") and f != "index.json"]

recs = []
for f in files:
    try:
        o = json.load(io.open(os.path.join(LAWS, f), encoding="utf-8"))
    except Exception:
        continue
    recs.append(o)

def is_vi(o):
    lang = (o.get("language") or "").lower()
    cid = o.get("id") or ""
    cname = o.get("countryName") or ""
    return lang == "vi" or cid.startswith("VN-") or "越南" in cname or "Viet" in cname

vi = [o for o in recs if is_vi(o)]
print("laws/ 总数 %d ; 越南语候选 %d 部" % (len(recs), len(vi)))

print("\n--- 语言键分布 ---")
print(dict(collections.Counter((o.get("language") or "?") for o in vi)))
print("--- 国别名分布 ---")
print(dict(collections.Counter((o.get("countryName") or "?") for o in vi)))
print("--- ID 前缀分布 ---")
print(dict(collections.Counter((o.get("id") or "?").split("-")[0] for o in vi)))
print("--- 层/分卷 ---")
print("layer:", dict(collections.Counter(o.get("layer") for o in vi)))
print("pack :", dict(collections.Counter(o.get("pack") for o in vi)))

tot_art = 0
tot_chars = 0
multi_lang = 0
no_art = 0
dup_no = 0
chaptered = 0
key_cnt = collections.Counter()
for o in vi:
    arts = o.get("articles") or []
    tot_art += len(arts)
    if not arts:
        no_art += 1
    seen = set()
    d = 0
    for a in arts:
        t = a.get("text")
        if isinstance(t, dict):
            for k in t:
                key_cnt[k] += 1
            if len(t) > 1:
                multi_lang += 1
            tot_chars += sum(len(v or "") for v in t.values())
        else:
            tot_chars += len(str(t or ""))
        if a.get("chapter"):
            chaptered += 1
        n = a.get("no")
        if n in seen:
            d += 1
        seen.add(n)
    if d:
        dup_no += 1

print("\n--- 规模 ---")
print("条文合计 %d / 正文字符合计 %d / 空法规 %d 部" % (tot_art, tot_chars, no_art))
print("text 语言键计数:", dict(key_cnt))
print("多语种条文数 %d / 含章节条文 %d" % (multi_lang, chaptered))
print("存在重复条号的法规 %d 部" % dup_no)

print("\n--- 最大 12 部 ---")
for o in sorted(vi, key=lambda x: -len(x.get("articles") or []))[:12]:
    t = o.get("title") or {}
    print("  %-16s %5d 条  %s" % (o.get("id"), len(o.get("articles") or []),
                                  (t.get("vi") or t.get("en") or t.get("zh") or "")[:60]))

print("\n--- 样本记录结构 ---")
if vi:
    s = vi[0]
    print("id:", s.get("id"), "| language:", s.get("language"), "| pack:", s.get("pack"))
    print("title keys:", list((s.get("title") or {}).keys()))
    a0 = (s.get("articles") or [{}])[0]
    print("article keys:", list(a0.keys()))
    print("article sample:", json.dumps(a0, ensure_ascii=False)[:500])

# 导出清单
inv = [{
    "lawId": o.get("id"),
    "title": (o.get("title") or {}).get("vi") or (o.get("title") or {}).get("en") or (o.get("title") or {}).get("zh"),
    "articleCount": len(o.get("articles") or []),
    "language": o.get("language"),
    "pack": o.get("pack"),
    "chaptered": any(a.get("chapter") for a in (o.get("articles") or [])),
} for o in vi]
inv.sort(key=lambda x: x["lawId"])
p = os.path.join(PROJ, "_work", "vi-en")
os.makedirs(p, exist_ok=True)
io.open(os.path.join(p, "vi_inventory.json"), "w", encoding="utf-8", newline="\n").write(
    json.dumps(inv, ensure_ascii=False, indent=1))
print("\n清单已写 _work/vi-en/vi_inventory.json（%d 部）" % len(inv))
