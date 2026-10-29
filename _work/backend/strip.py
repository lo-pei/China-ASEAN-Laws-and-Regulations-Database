# -*- coding: utf-8 -*-
import io, os, sys
sys.stdout.reconfigure(encoding="utf-8")
os.chdir(r"D:\A项目\Database_China–ASEAN Laws and Regulations Database")
p = "_work/backend/fix-catalogs.js"
s = io.open(p, encoding="utf-8").read()
o = s
# INTL 条目：剥掉 App 0 次引用的字段（实测 .trace/.completeness/.titleNote/.fulltextKey/
# .promulgatedDatePrecision/.traceSuperseded/.titleRaw/.titleFixed/.textQuality 均为 0 次）
s = s.replace("""    textLang: o.language || null,
    textQuality: o.textQuality || null,
    amendedNote: o.amendedNote || null,
  };""",
"""    textLang: o.language || null,
    amendedNote: o.amendedNote || null,
    /* 以下字段在 App 代码中引用次数为 0（实测 grep），不放进 catalog 以缩小体积：
       trace / completeness / titleNote / fulltextKey / promulgatedDatePrecision /
       traceSuperseded / titleRaw / titleFixed / textQuality。
       它们仍完整保留在权威存储 prototype/data/laws/<id>.json 里。 */
  };""")
if s != o:
    io.open(p, "w", encoding="utf-8").write(s)
    print("  ✓ 已剥掉 INTL 零引用字段")
else:
    print("  ! 锚点未命中")
