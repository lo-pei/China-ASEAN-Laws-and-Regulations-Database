# -*- coding: utf-8 -*-
r"""把法规标题译文产物从 _work/title/ 落到 prototype/data/title-zh/

产物结构：
  prototype/data/title-zh/
  ├── index.json         覆盖统计 + 批次清单（机器可读）
  ├── titles.zh.json     全量译名导出：id → {zh, en, batch, engine, reviewed}
  ├── PROVENANCE.md      出处与规则说明（人读）
  └── artifacts/         原始交付物
      ├── jobs/<jobId>/          任务包（titles.json + manifest.json）
      ├── returns/<jobId>-RETURN/ 回执包（titles.NNN.json + receipt.json）
      ├── REPORT-2026-10-17.md
      ├── PROMPT-TITLE-ZH.md
      ├── check_zh.py
      ├── PH-7575-EXCEPTIONS.txt
      └── templates/
"""
import io, os, json, glob, re, shutil, sys, subprocess, datetime
TODAY = datetime.date.today().isoformat(), datetime
TODAY = datetime.date.today().isoformat()
sys.stdout.reconfigure(encoding="utf-8")
os.chdir(r"D:\A项目\Database_China–ASEAN Laws and Regulations Database")

SRC = "_work/title"
DST = "prototype/data/title-zh"
ART = os.path.join(DST, "artifacts")

os.makedirs(ART, exist_ok=True)

# ---------- 1) 汇总全量译名 ----------
rows = {}
coverage = {}
for f in sorted(glob.glob("prototype/data/laws/*.json")):
    if os.path.basename(f) == "index.json":
        continue
    o = json.load(io.open(f, encoding="utf-8"))
    t = o.get("title") or {}
    c = o.get("country", "?")
    coverage.setdefault(c, {"total": 0, "zh": 0, "en": 0})
    coverage[c]["total"] += 1
    if t.get("en"):
        coverage[c]["en"] += 1
    if not t.get("zh"):
        continue
    coverage[c]["zh"] += 1
    tt = o.get("titleTranslation") or {}
    rows[o["id"]] = {
        "zh": t["zh"],
        "en": t.get("en"),
        "batch": tt.get("batch"),
        "engine": tt.get("engine"),
        "model": tt.get("model"),
        "reviewed": tt.get("reviewed", False),
    }
print("  已汇总译名 %d 条（全库 %d 部）" % (len(rows), sum(v["total"] for v in coverage.values())))

out = {"formatVersion": "calr-title-zh-v1", "generatedAt": TODAY,
       "count": len(rows), "titles": rows}
io.open(os.path.join(DST, "titles.zh.json"), "w", encoding="utf-8").write(
    json.dumps(out, ensure_ascii=False, indent=0))
print("  ✓ titles.zh.json  (%.1f MB)" % (os.path.getsize(os.path.join(DST, "titles.zh.json")) / 1048576))

# ---------- 2) 批次汇总 ----------
jobs = []
for d in sorted(glob.glob(os.path.join(SRC, "jobs", "*"))):
    if not os.path.isdir(d):
        continue
    mf = os.path.join(d, "manifest.json")
    if not os.path.isfile(mf):
        continue
    try:
        m = json.load(io.open(mf, encoding="utf-8"))
    except Exception:
        continue
    jid = m.get("jobId") or os.path.basename(d)
    ret = os.path.join(SRC, "returns", jid + "-RETURN")
    shards = len(glob.glob(os.path.join(ret, "titles.*.json"))) if os.path.isdir(ret) else 0
    eng = model = None
    if os.path.isdir(ret):
        rp = os.path.join(ret, "receipt.json")
        if os.path.isfile(rp):
            try:
                rc = json.load(io.open(rp, encoding="utf-8"))
                eng = rc.get("engine"); model = rc.get("model")
            except Exception:
                pass
    jobs.append({
        "jobId": jid, "count": m.get("count"), "byCountry": m.get("byCountry"),
        "returnPkg": (jid + "-RETURN") if os.path.isdir(ret) else None,
        "shards": shards, "engine": eng, "model": model,
        "createdAt": m.get("createdAt"),
    })

index = {
    "formatVersion": "calr-title-zh-v1",
    "updatedAt": TODAY,
    "note": "法规标题中文译名的权威导出与交付物归档。译名正文以 prototype/data/laws/<id>.json 的 title.zh 为唯一真源，"
            "本目录为其汇总导出与过程存档。",
    "lawCount": sum(v["total"] for v in coverage.values()),
    "translatedCount": len(rows),
    "coverage": {c: {"total": v["total"], "zh": v["zh"], "en": v["en"],
                     "pct": round(v["zh"] * 100.0 / v["total"], 1),
                     "pctEn": round(v["en"] * 100.0 / v["total"], 1)}
                 for c, v in sorted(coverage.items(), key=lambda x: -x[1]["total"])},
    "batches": jobs,
    "files": ["titles.zh.json", "PROVENANCE.md", "artifacts/", "index.json"],
}
io.open(os.path.join(DST, "index.json"), "w", encoding="utf-8").write(
    json.dumps(index, ensure_ascii=False, indent=1))
print("  ✓ index.json     (%.1f KB)，批次 %d 个" % (
    os.path.getsize(os.path.join(DST, "index.json")) / 1024, len(jobs)))

# ---------- 3) 复制交付物 ----------
copied = 0
size = 0
for kind in ["jobs", "returns"]:
    s = os.path.join(SRC, kind)
    if os.path.isdir(s):
        t = os.path.join(ART, kind)
        shutil.rmtree(t, ignore_errors=True)
        shutil.copytree(s, t)
        n = len([f for r, d, fs in os.walk(t) for f in fs])
        copied += n
for name in ["REPORT-2026-10-17.md", "PROMPT-TITLE-ZH.md", "check_zh.py", "PH-7575-EXCEPTIONS.txt"]:
    s = os.path.join(SRC, name)
    if os.path.isfile(s):
        shutil.copy2(s, os.path.join(ART, name))
        copied += 1
tmpl = os.path.join(SRC, "templates")
if os.path.isdir(tmpl):
    shutil.copytree(tmpl, os.path.join(ART, "templates"), dirs_exist_ok=True)
    copied += len(os.listdir(tmpl))
for r, d, fs in os.walk(ART):
    for f in fs:
        size += os.path.getsize(os.path.join(r, f))
print("  ✓ artifacts/     %d 个文件 / %.2f MB" % (copied, size / 1048576))
print("  总计: %.2f MB" % ((size + os.path.getsize(os.path.join(DST, "titles.zh.json"))) / 1048576))
