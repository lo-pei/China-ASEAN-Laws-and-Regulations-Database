# -*- coding: utf-8 -*-
import io, os, sys
sys.stdout.reconfigure(encoding="utf-8")
p = "prototype/assets/js/core/util.js"
s = io.open(p, encoding="utf-8").read()
o = s
s = s.replace('''          if (/[A-Za-z]-$/.test(prev.trim())) {
            merged[prevIdx] = prev.trim().slice(0, -1) + t.trim();
          } else {
            merged[prevIdx] = prev + t;
          }''',
'''          if (/[A-Za-z]-$/.test(prev.trim())) {
            /* 英文行尾连字符：去掉连字符直接拼（如 exam- / ple → example） */
            merged[prevIdx] = prev.trim().slice(0, -1) + t.trim();
          } else if (/[0-9A-Za-z)]\\s*$/.test(prev) && /^[0-9A-Za-z(\\[]/.test(t.trim())) {
            /* 两侧都是拉丁字母/数字：补一个空格，避免 "processes; and(b)" 这种粘连 */
            merged[prevIdx] = prev.replace(/\\s+$/, '') + ' ' + t.trim();
          } else {
            /* 中文与其它情况直接拼，不插空格 */
            merged[prevIdx] = prev + t;
          }''')
if s != o:
    io.open(p, "w", encoding="utf-8").write(s)
    print("  ✓ 已补英文合并空格")
else:
    print("  ! 锚点未命中")
