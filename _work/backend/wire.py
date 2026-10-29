# -*- coding: utf-8 -*-
import io, os, sys
sys.stdout.reconfigure(encoding="utf-8")
os.chdir(r"D:\A项目\Database_China–ASEAN Laws and Regulations Database")
p = "prototype/index.html"
s = io.open(p, encoding="utf-8").read()
if "core/api.js" in s:
    print("  已接入，跳过")
else:
    # 插到 store.js 之后（store 是数据层，api 在其后即可）
    anchor = '<script src="assets/js/core/store.js"></script>'
    if anchor in s:
        s = s.replace(anchor, anchor + '\n  <script src="assets/js/core/api.js"></script>', 1)
        io.open(p, "w", encoding="utf-8").write(s)
        print("  ✓ 已在 store.js 之后插入 core/api.js")
    else:
        print("  ! 未找到 store.js 锚点")
