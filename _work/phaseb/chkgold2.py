import io, os, json, sys
sys.stdout.reconfigure(encoding="utf-8")
RAG = r"D:\A项目\Database_China–ASEAN Laws and Regulations Database\_work\rag"
g = json.load(io.open(os.path.join(RAG,"gold.json"), encoding="utf-8"))
print("  gold 类型: %s  长度 %d" % (type(g).__name__, len(g)))
print("  首项: %s" % json.dumps(g[0], ensure_ascii=False)[:600])
print()
s = io.open(os.path.join(RAG,"questions.js"), encoding="utf-8").read()
import re
m = re.search(r"=\s*(\[.*\])", s, re.S)
qs = json.loads(m.group(1))
print("  questions 长度 %d" % len(qs))
print("  首项: %s" % json.dumps(qs[0], ensure_ascii=False)[:400])
