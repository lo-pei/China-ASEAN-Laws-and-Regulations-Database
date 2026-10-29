# -*- coding: utf-8 -*-
import io, os, re, sys
sys.stdout.reconfigure(encoding="utf-8")
p = "_work/fix/split-laws.py"
s = io.open(p, encoding="utf-8").read()
o = s
s = s.replace('''            body = blob[pos:end].strip()''',
'''            body = blob[pos:end].strip()
            # 剥掉正文开头的条号标记：头部已经有 noLabel（「第 N 条」），
            # 正文里再来一次就是「第 2 条 第 2 条 适用范围」这种重复。
            body = re.sub(r"^第\\s*[一二三四五六七八九十百千零〇0-9]{1,6}\\s*条[\\s、.．:：]*", "", body)
            body = re.sub(r"^Section\\s+\\d{1,4}[\\s.．:：]*", "", body, flags=re.I)
            body = re.sub(r"^\\d{1,4}\\.\\s+", "", body)''')
if s != o:
    io.open(p, "w", encoding="utf-8").write(s)
    print("  ✓ 已加「剥掉正文开头条号」逻辑")
else:
    print("  ! 锚点未命中")
