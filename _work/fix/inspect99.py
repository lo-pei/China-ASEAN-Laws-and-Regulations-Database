# -*- coding: utf-8 -*-
import io, os, json, sys
sys.stdout.reconfigure(encoding="utf-8")
os.chdir(os.getcwd())
for lid in ["MY-H099", "MY-H088"]:
    p = os.path.join("prototype", "data", "laws", lid + ".json")
    if not os.path.exists(p):
        print("  %s 不存在" % lid); continue
    o = json.load(io.open(p, encoding="utf-8"))
    arts = o.get("articles") or []
    print("=" * 70)
    print("  %s  条文 %d" % (lid, len(arts)))
    T = o.get("title") or {}
    print("  title: %s" % json.dumps(T, ensure_ascii=False)[:160])
    for i, a in enumerate(arts):
        t = a.get("text") or {}
        blob = " ".join(str(v) for v in t.values() if v)
        print("  条文#%d no=%s 字数 %d" % (i, a.get("no"), len(blob)))
        print("    正文前 400 字:")
        print("    " + blob[:400].replace("\n", " | "))
