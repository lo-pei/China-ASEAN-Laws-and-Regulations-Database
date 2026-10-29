# -*- coding: utf-8 -*-
import io, os, sys
sys.stdout.reconfigure(encoding="utf-8")
os.chdir(r"D:\A项目\Database_China–ASEAN Laws and Regulations Database")
p = "_work/rag/build-bridge.js"
s = io.open(p, encoding="utf-8").read()
o = s
# 限流：每条只取前 22 个中文词 / 前 22 个英文词，避免笛卡尔积爆内存
s = s.replace(
  "    const zhToks = [...new Set(tokStrict(zhText).filter(t => t.length === 2 && /[\\u3400-\\u9fff]/.test(t) && !STOP_ZH.has(t)))];\n"
  "    const enToks = [...new Set(tokStrict(enText).filter(t => /^[a-z]+$/.test(t) && t.length > 3 && !STOP_EN.has(t)))];",
  "    /* 限流：每条条文最多取 22 个中文词 × 22 个英文词，否则共现矩阵会超过 Map 容量上限 */\n"
  "    const zhToks = [...new Set(tokStrict(zhText).filter(t => t.length === 2 && /[\\u3400-\\u9fff]/.test(t) && !STOP_ZH.has(t)))].slice(0, 22);\n"
  "    const enToks = [...new Set(tokStrict(enText).filter(t => /^[a-z]+$/.test(t) && t.length > 3 && !STOP_EN.has(t)))].slice(0, 22);")
if s == o:
    print("  ! 限流锚点未命中")
else:
    io.open(p, "w", encoding="utf-8").write(s)
    print("  ✓ 已加共现限流（22×22）")
