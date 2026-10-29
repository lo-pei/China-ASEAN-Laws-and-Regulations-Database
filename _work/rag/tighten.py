# -*- coding: utf-8 -*-
import io, os, sys
sys.stdout.reconfigure(encoding="utf-8")
os.chdir(r"D:\A项目\Database_China–ASEAN Laws and Regulations Database")
p = "_work/rag/gold.js"
s = io.open(p, encoding="utf-8").read()
old = """  // 只保留「命中概念最多」的那一档，避免把泛泛提及也算金标
  const maxN = hits.reduce((m, h) => Math.max(m, h.n), 0);
  const top = hits.filter(h => h.n === maxN);
  return { hits, gold: top, maxN };"""
new = """  // 收紧：优先要求「至少命中 2 个不同概念词」；若没有，再退回单关键词（并标记为弱）
  const maxN = hits.reduce((m, h) => Math.max(m, h.n), 0);
  let strong = hits.filter(h => h.n >= 2);
  let weak = false;
  if (!strong.length) { strong = hits.slice(); weak = true; }
  // 若仍过宽（>120），按命中数降序取前 80，避免"泛泛提及"主导
  let gold = strong;
  if (gold.length > 120) {
    gold = strong.slice().sort((a, b) => b.n - a.n || a.articleId.localeCompare(b.articleId)).slice(0, 80);
  }
  return { hits, gold, maxN, weak };"""
if old in s:
    s = s.replace(old, new, 1)
    print("  ✓ 收紧标注口径（≥2 个概念词；过宽则按命中数取前 80）")
else:
    print("  ! 锚点未命中")
# 记录 weak 标记
s = s.replace("""    maxN: r.maxN,
    goldCount: r.gold.length,""",
"""    maxN: r.maxN,
    weak: !!r.weak,
    goldCount: r.gold.length,""")
io.open(p, "w", encoding="utf-8").write(s)
print("  复核：weak 字段=%s；≥2 逻辑=%s" % ("weak: !!r.weak" in io.open(p, encoding="utf-8").read(), "h.n >= 2" in io.open(p, encoding="utf-8").read()))
