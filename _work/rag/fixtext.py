# -*- coding: utf-8 -*-
import io, os, sys
sys.stdout.reconfigure(encoding="utf-8")
os.chdir(r"D:\A项目\Database_China–ASEAN Laws and Regulations Database")
# 1) build-bridge.js
p = "_work/rag/build-bridge.js"
s = io.open(p, encoding="utf-8").read()
o = s
s = s.replace("    const enText = ta.text;",
              "    /* trans 的 text 是 {en:\"...\"} 对象，不是字符串 */\n"
              "    const enText = (ta.text && typeof ta.text === 'object') ? (ta.text[tr.targetLang] || ta.text.en || '') : ta.text;")
if s == o:
    print("  ! build-bridge 锚点未命中")
else:
    io.open(p, "w", encoding="utf-8").write(s)
    print("  ✓ build-bridge 已修正 text 提取")

# 2) pmi2.js 同步
p2 = "_work/rag/pmi2.js"
s2 = io.open(p2, encoding="utf-8").read()
o2 = s2
s2 = s2.replace("    const enText = ta.text;",
                "    const enText = (ta.text && typeof ta.text === 'object') ? (ta.text[tr.targetLang] || ta.text.en || '') : ta.text;")
if s2 == o2:
    print("  ! pmi2 锚点未命中")
else:
    io.open(p2, "w", encoding="utf-8").write(s2)
    print("  ✓ pmi2 已修正 text 提取")
