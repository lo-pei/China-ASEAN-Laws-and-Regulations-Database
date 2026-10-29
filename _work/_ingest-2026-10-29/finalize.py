# -*- coding: utf-8 -*-
"""收尾 2026-10-29 入库：
1) 修复新法规中重复的 article.id（只改 id，不改 no/noLabel/text）；
2) 用 laws/<id>.json 的 title.zh 重建 title-zh/titles.zh.json 与 index.json。
"""
import os, io, json, glob, collections, datetime, shutil

PROJ = r"D:\A项目\Database_China–ASEAN Laws and Regulations Database"
LAWS = os.path.join(PROJ, "prototype", "data", "laws")
TZ = os.path.join(PROJ, "prototype", "data", "title-zh")
TITLES = os.path.join(TZ, "titles.zh.json")
INDEX = os.path.join(TZ, "index.json")
BACK = os.path.join(PROJ, "_work", "_ingest-2026-10-29", "backup")
TODAY = datetime.date.today().isoformat()
NOW = datetime.datetime.now().strftime("%Y-%m-%dT%H:%M:%S")
BATCH = "ingest-2026-10-29"


def load(p):
    return json.load(io.open(p, encoding="utf-8-sig"))


def dump(p, obj):
    io.open(p, "w", encoding="utf-8", newline="\n").write(json.dumps(obj, ensure_ascii=False, indent=1) + "\n")


os.makedirs(BACK, exist_ok=True)
for p in (TITLES, INDEX):
    if os.path.exists(p):
        shutil.copy2(p, os.path.join(BACK, os.path.basename(p)))

# ---------- 1. article.id 去重 ----------
fixed_laws = 0
fixed_articles = 0
for fp in sorted(glob.glob(os.path.join(LAWS, "*.json"))):
    if fp.endswith("index.json"):
        continue
    o = load(fp)
    arts = o.get("articles") or []
    seen = set()
    changed = False
    for a in arts:
        aid = a.get("id")
        if aid is None:
            continue
        if aid in seen:
            base = aid
            k = 2
            while ("%s-d%d" % (base, k)) in seen:
                k += 1
            a["id"] = "%s-d%d" % (base, k)
            fixed_articles += 1
            changed = True
        seen.add(a["id"])
    if changed:
        dump(fp, o)
        fixed_laws += 1
print("article.id 去重: laws=%d articles=%d" % (fixed_laws, fixed_articles))

# ---------- 2. title-zh 导出同步 ----------
old = load(TITLES) if os.path.exists(TITLES) else {}
old_titles = old.get("titles") or {}
idx = load(INDEX)

titles = {}
kept = added = changed = 0
for fp in sorted(glob.glob(os.path.join(LAWS, "*.json"))):
    if fp.endswith("index.json"):
        continue
    o = load(fp)
    t = o.get("title") or {}
    z = t.get("zh") if isinstance(t, dict) else None
    if not z:
        continue
    z = str(z)
    prev = old_titles.get(o["id"])
    if prev and str(prev.get("zh") or "") == z:
        titles[o["id"]] = prev
        kept += 1
    else:
        en = t.get("en")
        titles[o["id"]] = {
            "zh": z,
            "en": str(en) if en else None,
            "batch": BATCH,
            "engine": "source-extract",
            "model": None,
            "reviewed": False,
        }
        if prev:
            changed += 1
        else:
            added += 1

removed = len([k for k in old_titles if k not in titles])
new_titles = {
    "formatVersion": old.get("formatVersion") or "calr-title-zh-v1",
    "generatedAt": NOW,
    "count": len(titles),
    "titles": dict(sorted(titles.items())),
}
dump(TITLES, new_titles)

# 覆盖率
cov_total = collections.Counter()
cov_zh = collections.Counter()
for fp in glob.glob(os.path.join(LAWS, "*.json")):
    if fp.endswith("index.json"):
        continue
    o = load(fp)
    c = o.get("country") or "?"
    cov_total[c] += 1
    if o["id"] in titles:
        cov_zh[c] += 1
coverage = {}
for c in sorted(cov_total):
    total = cov_total[c]
    zh = cov_zh[c]
    coverage[c] = {"total": total, "zh": zh, "pct": round(100.0 * zh / total, 1) if total else 0.0}

batches = [b for b in (idx.get("batches") or []) if b.get("name") != BATCH]
batch_count = added + changed
if batch_count:
    batches.append({
        "name": BATCH,
        "count": batch_count,
        "engine": "source-extract",
        "note": "2026-10-29 新入库法规的中文标题（laws/<id>.json 的 title.zh 为真源）",
    })

idx["updatedAt"] = NOW
idx["lawCount"] = sum(cov_total.values())
idx["translatedCount"] = len(titles)
idx["coverage"] = coverage
idx["batches"] = batches
dump(INDEX, idx)

print("title-zh: titles=%d kept=%d changed=%d added=%d removed=%d" % (len(titles), kept, changed, added, removed))
print("coverage:", {k: v["pct"] for k, v in coverage.items()})
