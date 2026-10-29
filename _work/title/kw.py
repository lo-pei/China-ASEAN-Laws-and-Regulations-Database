# -*- coding: utf-8 -*-
import io, os, json, glob, re, sys
from collections import Counter
sys.stdout.reconfigure(encoding="utf-8")
KW = r"\b(data|privacy|personal|protection|company|companies|corporation|investment|investments|labou?r|employment|income|tax|taxation|competition|consumer|intellectual|property|copyright|patent|trademark|arbitration|mediation|banking|bank|insurance|securities|finance|financial|trade|foreign|contract|cyber|electronic|digital|telecommunications|energy|environment|mining|agriculture|fisheries|shipping|maritime|aviation|construction|health|education|migration|immigration|citizenship|anti-|money laundering|terrorism|corruption|bribery|criminal|penal|evidence|procedure|court|courts|judiciary|insolvency|bankruptcy|winding|reorganization|merger|acquisition|listing|disclosure|accounting|audit|company)\b"
rows = []
for f in glob.glob("prototype/data/laws/*.json"):
    if os.path.basename(f) == "index.json": continue
    try: o = json.load(io.open(f, encoding="utf-8"))
    except: continue
    t = o.get("title") or {}
    if t.get("zh"): continue
    src = t.get("en")
    if not src: continue
    if re.search(r"[\u0e00-\u0e7f\u1000-\u109f\u1780-\u17ff]", src): continue
    if re.search(KW, src, re.I):
        rows.append((o.get("country"), o["id"], len(o.get("articles") or []), src.strip()))
print("  含核心法律概念的英文标题：%d 条" % len(rows))
print("")
for c, n in Counter(r[0] for r in rows).most_common():
    print("    %-4s %4d" % (c, n))
print("")
print("=== 按国家抽样（每国 8 条）===")
seen = Counter()
for c, lid, n, src in rows:
    if seen[c] >= 8: continue
    seen[c] += 1
    print("  %-10s %s" % (c, src[:100]))
