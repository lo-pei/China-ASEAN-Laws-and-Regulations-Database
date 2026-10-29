# -*- coding: utf-8 -*-
"""从 Git 暂存区（index）生成 title-zh 导出，保证提交内 laws 与 titles.zh.json 自洽。
工作区可能仍有后台 title 任务在写，故不能用工作区文件。
"""
import subprocess, json, os, io, collections, datetime

PROJ = r"D:\A项目\Database_China–ASEAN Laws and Regulations Database"
os.chdir(PROJ)
TZ = os.path.join(PROJ, "prototype", "data", "title-zh")
TITLES = os.path.join(TZ, "titles.zh.json")
INDEX = os.path.join(TZ, "index.json")
BATCH = "ingest-2026-10-29"
NOW = datetime.datetime.now().strftime("%Y-%m-%dT%H:%M:%S")


def load(p):
    return json.load(io.open(p, encoding="utf-8"))


def dump(p, obj):
    io.open(p, "w", encoding="utf-8", newline="\n").write(json.dumps(obj, ensure_ascii=False, indent=1) + "\n")


# ls-files --stage 输出：100644 <sha> 0\tpath
out = subprocess.check_output(["git", "ls-files", "--stage", "--", "prototype/data/laws"], cwd=PROJ)
entries = []
for line in out.decode("utf-8", "replace").splitlines():
    if not line.strip():
        continue
    meta, path = line.split("\t", 1)
    parts = meta.split()
    if len(parts) < 2:
        continue
    sha = parts[1]
    if path.endswith(".json") and not path.endswith("/index.json"):
        entries.append((sha, path))
print("staged law blobs:", len(entries))

import tempfile
inp = tempfile.NamedTemporaryFile(delete=False)
outp = tempfile.NamedTemporaryFile(delete=False)
try:
    for sha, _ in entries:
        inp.write((sha + "\n").encode())
    inp.close()
    with open(inp.name, "rb") as fin, open(outp.name, "wb") as fout:
        subprocess.run(["git", "cat-file", "--batch"], cwd=PROJ, stdin=fin, stdout=fout, check=True)
    laws = []
    with open(outp.name, "rb") as f:
        for sha, path in entries:
            header = f.readline().decode()
            if not header:
                raise SystemExit("cat-file EOF")
            parts_h = header.split()
            if len(parts_h) < 3 or parts_h[1] != "blob":
                raise SystemExit("bad cat-file header: " + header)
            size = int(parts_h[2])
            data = f.read(size)
            f.read(1)
            try:
                laws.append(json.loads(data.decode("utf-8")))
            except Exception as e:
                print("BAD", path, e)
finally:
    try: os.unlink(inp.name)
    except Exception: pass
    try: os.unlink(outp.name)
    except Exception: pass

old = load(TITLES) if os.path.exists(TITLES) else {}
old_titles = old.get("titles") or {}
idx = load(INDEX)

titles = {}
kept = added = changed = 0
for o in laws:
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
dump(TITLES, {
    "formatVersion": old.get("formatVersion") or "calr-title-zh-v1",
    "generatedAt": NOW,
    "count": len(titles),
    "titles": dict(sorted(titles.items())),
})

cov_total = collections.Counter()
cov_zh = collections.Counter()
for o in laws:
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
if added + changed:
    batches.append({
        "name": BATCH,
        "count": added + changed,
        "engine": "source-extract",
        "note": "2026-10-29 新入库法规的中文标题（laws/<id>.json 的 title.zh 为真源）",
    })
idx["updatedAt"] = NOW
idx["lawCount"] = len(laws)
idx["translatedCount"] = len(titles)
idx["coverage"] = coverage
idx["batches"] = batches
dump(INDEX, idx)

print("staged laws", len(laws), "titles", len(titles), "kept", kept, "changed", changed, "added", added, "removed", removed)
print("coverage", {k: v["pct"] for k, v in coverage.items()})
