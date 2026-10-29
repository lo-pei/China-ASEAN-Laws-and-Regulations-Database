# -*- coding: utf-8 -*-
import io, os, sys
sys.stdout.reconfigure(encoding="utf-8")
p = "_work/fix/remove-junk.py"
s = io.open(p, encoding="utf-8").read()
o = s
s = s.replace('''    "生效日期：", "修订日期：", "版本：", "语种：", "备注：",
]''',
'''    "生效日期：", "修订日期：", "版本：", "语种：", "备注：",
    # Markdown 表格形式的元数据头（另一批采集产物的写法）
    "本文件为自动采集的元数据头", "原始文件未被改写", "逐字照录于同目录下的原始文件",
    "| 原文标题 |", "| 官方页面标注标题 |", "官方页面标注标题", "| 项目 | 内容 |",
    "| 中文译名 |", "| 英文译名 |", "| 法律领域 |", "| 颁布机构 |",
]''')
if s != o:
    io.open(p, "w", encoding="utf-8").write(s)
    print("  ✓ 已补 Markdown 表格式元数据标记")
else:
    print("  ! 锚点未命中")
