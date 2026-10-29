import io, os, json, re, sys
sys.stdout.reconfigure(encoding="utf-8")
RAG = r"D:\A项目\Database_China–ASEAN Laws and Regulations Database\_work\rag"
for f in ["questions.js","gold.json"]:
    p = os.path.join(RAG, f)
    print("  %-14s %s  %s 字节" % (f, "存在" if os.path.exists(p) else "缺失", os.path.getsize(p) if os.path.exists(p) else 0))
if os.path.exists(os.path.join(RAG,"gold.json")):
    d = json.load(io.open(os.path.join(RAG,"gold.json"), encoding="utf-8"))
    print("  gold 顶层键: %s" % list(d.keys())[:8])
    if isinstance(d, dict):
        k0 = list(d.keys())[0]
        print("  首项: %s → %s" % (k0, json.dumps(d[k0], ensure_ascii=False)[:300]))
if os.path.exists(os.path.join(RAG,"questions.js")):
    s = io.open(os.path.join(RAG,"questions.js"), encoding="utf-8").read()
    print("  questions.js 头 200: %s" % s[:200].replace("\n"," "))
