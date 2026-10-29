# -*- coding: utf-8 -*-
import io, os, sys
sys.stdout.reconfigure(encoding="utf-8")
os.chdir(r"D:\A项目\Database_China–ASEAN Laws and Regulations Database")
p = "_work/backend/fix-catalogs.js"
s = io.open(p, encoding="utf-8").read()
o = s
# 在 meta 里记录被移除的死链（审计留痕）
s = s.replace("""  syncedWithLaws: 'Phase A-1 补齐 catalog 与 laws/ 的差异（2026-10-23）',
});""",
"""  syncedWithLaws: 'Phase A-1 补齐 catalog 与 laws/ 的差异（2026-10-23）',
  removedDeadLinks: deadINL.length,
  removedDeadLinksNote: '这些条目 coverage=catalog、source.url 为空、harvest.files 指向「4乱码数据」，收集失败且无正文分卷，删除以免点进去是空页。完整 id 清单见 _work/backend/removed-dead-links.json',
  addedFromLaws: addINL.length,
});""")
if s != o:
    io.open(p, "w", encoding="utf-8").write(s)
    print("  ✓ 已加审计字段")
else:
    print("  ! 锚点未命中")
# 再补一段：写移除清单
s2 = io.open(p, encoding="utf-8").read()
if "removed-dead-links.json" not in s2.split("console.log('')")[0]:
    s2 = s2.replace("if (DRY) {",
"""// 记录被移除的死链 id（审计）
fs.writeFileSync(path.join(ROOT, '_work', 'backend', 'removed-dead-links.json'),
  JSON.stringify({ removedAt: new Date().toISOString(), count: deadINL.length, ids: deadINL.map(x => x.id) }, null, 1), 'utf8');

if (DRY) {""")
    io.open(p, "w", encoding="utf-8").write(s2)
    print("  ✓ 已加移除清单导出")
