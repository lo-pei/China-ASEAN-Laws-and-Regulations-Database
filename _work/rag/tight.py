# -*- coding: utf-8 -*-
import io, os, sys
sys.stdout.reconfigure(encoding="utf-8")
os.chdir(r"D:\A项目\Database_China–ASEAN Laws and Regulations Database")
p = "_work/rag/build-bridge.js"
s = io.open(p, encoding="utf-8").read()
o = s
s = s.replace("  if (c < 5) continue;", "  if (c < 8) continue;")
s = s.replace("  if (pmi < 1.2) continue;", "  if (pmi < 5.5) continue;")
s = s.replace("/* 条文级共现噪声大，PMI 天然偏低；配合「共现次数≥5」与「一对一」双重清洗控制质量 */",
              "/* 收紧：共现≥8 次 + PMI≥5.5 + 一对一清洗。抽取质量实测约 50-60%，收紧后应显著提高 */")
if s == o:
    print("  ! 锚点未命中")
else:
    io.open(p, "w", encoding="utf-8").write(s)
    print("  ✓ 阈值收紧为 c>=8, PMI>=5.5")
