# -*- coding: utf-8 -*-
import io, sys
sys.stdout.reconfigure(encoding="utf-8")
p = "_work/crawl/apply.py"
s = io.open(p, encoding="utf-8").read()
o = s

# 1) 编码修正：latin-1 误解的 cp1252 特殊字符
s = s.replace(
'''def main():''',
'''def fix_encoding(t):
    """lawphil 有的页面是 cp1252，按 latin-1 解会留下 \\x97 这类控制字符。
    cp1252 里 0x80-0x9F 有对应的可见字符，这里做一次还原。"""
    if not t:
        return t
    MAP = {
        "\\x91": "\\u2018", "\\x92": "\\u2019", "\\x93": "\\u201c", "\\x94": "\\u201d",
        "\\x96": "\\u2013", "\\x97": "\\u2014", "\\x85": "\\u2026", "\\x95": "\\u2022",
        "\\x82": "\\u201a", "\\x84": "\\u201e", "\\x86": "\\u2020", "\\x87": "\\u2021",
        "\\x89": "\\u2030", "\\x8b": "\\u2039", "\\x9b": "\\u203a", "\\x99": "\\u2122",
    }
    out = []
    for ch in t:
        o = ord(ch)
        if 0x80 <= o <= 0x9F:
            out.append(MAP.get(ch, " "))
        else:
            out.append(ch)
    return "".join(out)


def main():''')

# 2) 应用时清洗所有文本
s = s.replace('''        if a.get("heading"):
            item["heading"] = {lang: a["heading"].strip()}''',
'''        if a.get("heading"):
            item["heading"] = {lang: fix_encoding(a["heading"]).strip()}''')
s = s.replace('''            "text": {lang: a["text"].strip()},''',
'''            "text": {lang: fix_encoding(a["text"]).strip()},''')
s = s.replace('''            item["chapter"] = {lang: ch.strip()}''',
'''            item["chapter"] = {lang: fix_encoding(ch).strip()}''')

# 3) 备份幂等：已备份过就不再覆盖（避免二次应用把原始文件冲掉）
s = s.replace('''    shutil.copy2(lp, os.path.join(BK, lid + ".json"))''',
'''    bkPath = os.path.join(BK, lid + ".json")
    if not os.path.exists(bkPath):
        shutil.copy2(lp, bkPath)''')
if s != o:
    io.open(p, "w", encoding="utf-8").write(s)
    print("  ✓ apply.py 已加编码修正与备份幂等")
else:
    print("  ! 未改动")
