# -*- coding: utf-8 -*-
import io, os, sys
sys.stdout.reconfigure(encoding="utf-8")
os.chdir(r"D:\A项目\Database_China–ASEAN Laws and Regulations Database")
p = "backend/app/search.py"
s = io.open(p, encoding="utf-8").read()
o = s
# 后面那段旧的「门槛」逻辑删掉（已在上面做过），并把 total 改为 total_after_floor 兜底
s = s.replace("""    # ---- 相关性门槛：与前端一致，低于最高分 15% 的丢掉 ----
    order_all = sorted(scores.items(), key=lambda x: -x[1])
    if order_all:
        top = order_all[0][1]
        floor = top * 0.15
        order_all = [(lid, s) for lid, s in order_all if s >= floor]
    order = order_all
""", """    # 加权后重新排序（此时只有前 CAND_LIMIT 名参与，total 用上面算好的全量数）
    order = sorted(scores.items(), key=lambda x: -x[1])
""")
if s != o:
    io.open(p, "w", encoding="utf-8").write(s)
    print("  ✓ 已删除重复的门槛块")
else:
    print("  ! 门槛块锚点未命中")
# total 赋值
s = io.open(p, encoding="utf-8").read()
s2 = s.replace("""    total = len(order)""", """    total = max(len(order), total_after_floor)""")
if s2 != s:
    io.open(p, "w", encoding="utf-8").write(s2)
    print("  ✓ total 已改为全量口径")
else:
    print("  - total 已是全量口径")
