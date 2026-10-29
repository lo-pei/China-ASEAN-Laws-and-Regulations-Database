# -*- coding: utf-8 -*-
import io, sys
sys.stdout.reconfigure(encoding="utf-8")
p = "_work/recrawl/build.py"
s = io.open(p, encoding="utf-8").read()
OLD = '''def has_consecutive(text):
    """一条里出现连续递增的 3 个以上条号 = 真的漏切"""
    expect, run = None, 0
    for m in RE_NO.finditer(text):
        n = cn2int(m.group(1))
        if n is None:
            continue
        if expect is not None and n == expect:
            run += 1
        else:
            run = 1
        expect = n + 1
        if run >= 3:
            return True
    return False'''
NEW = '''# 真正的漏切：条号出现在行首，且后面跟着空白 + 标题（「第五条  公司章程要求」）
# 而「第一百零三条、第一百零四条、第一百零五条」这种是引用，条号后面直接是顿号，不算。
RE_HEADING_MARK = re.compile(
    r"(?m)^[ \\t]*(?:第\\s*[一二三四五六七八九十百千零〇0-9]{1,6}\\s*条"
    r"|Article\\s+\\d{1,5}|Section\\s+\\d{1,5})[ \\t\\u3000]+\\S")


def has_consecutive(text):
    """判定「一条里塞了多条」。
    第一版只看连续递增的条号，结果把「第 103 条、第 104 条、第 105 条」这种
    连续引用全判成漏切 —— 抽查 6 部里 5 部是误判。
    改为：必须同时满足
      ① 行首出现条号
      ② 条号后跟空白 + 标题（正文引用不会带标题）
      ③ 至少两处这样的行首条号（单处可能只是排版巧合）
    """
    marks = RE_HEADING_MARK.findall(text)
    if len(marks) < 2:
        return False
    return True'''
if OLD in s:
    s = s.replace(OLD, NEW, 1)
    io.open(p, "w", encoding="utf-8").write(s)
    print("  ✓ P3 判据已收紧")
else:
    print("  ! 未命中")
