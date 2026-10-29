# -*- coding: utf-8 -*-
import io, os, sys
sys.stdout.reconfigure(encoding="utf-8")
os.chdir(r"D:\A项目\Database_China–ASEAN Laws and Regulations Database")
p = "backend/app/main.py"
s = io.open(p, encoding="utf-8").read()
o = s
s = s.replace('''        if isinstance(v, dict):
            for k in ("zh", "en", "orig"):
                if v.get(k):
                    return str(v[k])
            for x in v.values():
                if x:
                    return str(x)
        elif isinstance(v, str) and v.strip():
            return v.strip()
    return ("第" + _fmt_no(no) + "条") if no is not None else ""''',
'''        label = None
        if isinstance(v, dict):
            for k in ("zh", "en", "orig"):
                if v.get(k):
                    label = str(v[k])
                    break
            if label is None:
                for x in v.values():
                    if x:
                        label = str(x)
                        break
        elif isinstance(v, str) and v.strip():
            label = v.strip()
        # 长度守卫：部分泰国/缅甸记录把「整段正文」错写进了 no_label，
        # 这类不是标签，长度超过 24 字符一律丢弃，退回合成标签。
        if label and len(label) <= 24:
            return label
    if no is None:
        return ""
    return "第" + _fmt_no(no) + "条"''')
if s != o:
    io.open(p, "w", encoding="utf-8").write(s)
    print("  ✓ 已加 no_label 长度守卫")
else:
    print("  ! 锚点未命中")

# 顺手修测试脚本多打的「第」
p2 = "_work/phaseb/test-qa.py"
s2 = io.open(p2, encoding="utf-8").read()
s2 = s2.replace('第%-4s', '%-8s')
io.open(p2, "w", encoding="utf-8").write(s2)
print("  ✓ 测试脚本已修正")
