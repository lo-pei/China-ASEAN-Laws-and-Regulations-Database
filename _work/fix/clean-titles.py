# -*- coding: utf-8 -*-
import io, os, json, sys, time
sys.stdout.reconfigure(encoding="utf-8")
os.chdir(os.getcwd())
LAWS = os.path.join("prototype", "data", "laws")
have = set(f[:-5] for f in os.listdir(LAWS) if f.endswith(".json") and f != "index.json")
p = "prototype/data/title-zh/titles.zh.json"
tz = json.load(io.open(p, encoding="utf-8"))
before = len(tz.get("titles") or {})
orphans = [k for k in list(tz["titles"].keys()) if k not in have]
for k in orphans:
    del tz["titles"][k]
tz["count"] = len(tz["titles"])
tz["generatedAt"] = time.strftime("%Y-%m-%dT%H:%M:%S")
io.open(p, "w", encoding="utf-8").write(json.dumps(tz, ensure_ascii=False, indent=1))
print("  titles.zh.json: %d → %d（清掉孤儿 %d）" % (before, tz["count"], len(orphans)))
ip = "prototype/data/title-zh/index.json"
idx = json.load(io.open(ip, encoding="utf-8"))
idx["translatedCount"] = tz["count"]
idx["updatedAt"] = time.strftime("%Y-%m-%dT%H:%M:%S")
io.open(ip, "w", encoding="utf-8").write(json.dumps(idx, ensure_ascii=False, indent=1))
print("  index.json translatedCount → %d" % idx["translatedCount"])
print("  法规总数: %d" % len(have))
