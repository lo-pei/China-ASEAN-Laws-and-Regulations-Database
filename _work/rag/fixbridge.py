# -*- coding: utf-8 -*-
import io, os, sys
sys.stdout.reconfigure(encoding="utf-8")
os.chdir(r"D:\A项目\Database_China–ASEAN Laws and Regulations Database")
p = "_work/rag/build-bridge.js"
s = io.open(p, encoding="utf-8").read()
o = s

# ① PMI 阈值放宽 + 共现次数要求
s = s.replace("""  if (c < 3) continue;
  const [z, e] = k.split('|');
  const dz = dfZh.get(z) || 1, de = dfEn.get(e) || 1;
  const pmi = Math.log((c / pairs) / ((dz / pairs) * (de / pairs)));
  if (pmi < 4.0) continue;                        // 阈值偏严，避免噪声""",
"""  if (c < 5) continue;
  const [z, e] = k.split('|');
  const dz = dfZh.get(z) || 1, de = dfEn.get(e) || 1;
  const pmi = Math.log((c / pairs) / ((dz / pairs) * (de / pairs)));
  /* 条文级共现噪声大，PMI 天然偏低；配合「共现次数≥5」与「一对一」双重清洗控制质量 */
  if (pmi < 1.2) continue;""")

# ② 修 MANUAL_LOCAL 的遍历（语言名 → 词对数组）
s = s.replace("""for (const [en, loc] of Object.entries(MANUAL_LOCAL)) {
  for (const lang of Object.keys(loc)) {
    for (const [e, l] of loc[lang]) {
      addTerm(e, 'en', e, 'curated');
      addTerm(e, lang, l, 'curated');
      addTerm(l, lang, l, 'curated');
      addTerm(l, 'en', e, 'curated');
    }
  }
}""",
"""for (const lang of Object.keys(MANUAL_LOCAL)) {
  for (const [e, l] of MANUAL_LOCAL[lang]) {
    addTerm(e, 'en', e, 'curated');
    addTerm(e, lang, l, 'curated');
    addTerm(l, lang, l, 'curated');
    addTerm(l, 'en', e, 'curated');
  }
}""")

if s != o:
    io.open(p, "w", encoding="utf-8").write(s)
    print("  ✓ 修复 PMI 阈值 与 MANUAL_LOCAL 遍历")
else:
    print("  ! 未命中")
