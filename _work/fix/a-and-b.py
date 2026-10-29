# -*- coding: utf-8 -*-
"""
A) 彻底删除条文引用按钮（用户反馈：太丑，不需要）
   移除：law.js 的按钮 HTML / 事件绑定 / CSS / askViaApi 无关，只删按钮相关
B) 把「整部法被塞进 1 条」的法规按条文标记重新切分
"""
import io
import os
import re
import sys

sys.stdout.reconfigure(encoding="utf-8")
ROOT = os.getcwd()

# ============================================================ A 删按钮
print("=== A) 删除条文引用按钮 ===")
P = os.path.join(ROOT, "prototype/assets/js/views/law.js")
s = io.open(P, encoding="utf-8").read()
o = s

# 1) 按钮 HTML
s = s.replace(
    """        /* 条文级引注：复制「第 X 条」粒度的规范引用（写文书、做批注时最常用） */
        '<button class="article__cite" type="button" data-article-cite="' + esc(a.id) + '"' +
          ' title="' + esc(t('复制本条引用')) + '" aria-label="' + esc(t('复制本条引用')) + '">' +
          CALR.ui.icon('copy') + '</button>' +
""", "")
# 兜底：若上面的注释行已被上一次 patch 改过，按按钮本体再删一次
s = re.sub(r"\n[ \t]*'<button class=\"article__cite\"[^\n]*\n[ \t]*' title=\"' \+ esc\(t\('复制本条引用'\)\)[^\n]*\n[ \t]*CALR\.ui\.icon\('copy'\) \+ '</button>' \+\n", "\n", s)

# 2) 事件绑定整块
s = re.sub(
    r"\n[ \t]*/\* 条文级引用：复制「法规 \+ 第 X 条」粒度的引注 \*/\n[ \t]*U\(\)\.\$\$\('\[data-article-cite\]', main\)\.forEach\(function \(b\) \{.*?\n[ \t]*\}\);\n",
    "\n", s, flags=re.S)

if s != o:
    io.open(P, "w", encoding="utf-8").write(s)
    print("  ✓ law.js 已删除按钮 HTML 与事件绑定")
else:
    print("  ! law.js 未改动（可能已删）")

# 3) CSS 整块
P_CSS = os.path.join(ROOT, "prototype/assets/css/views.css")
css = io.open(P_CSS, encoding="utf-8").read()
css2 = re.sub(
    r"/\* -+ 条文引用按钮（重设计） -+ \*/.*?\.article__cite:hover \{[^}]*\}\n",
    "", css, flags=re.S)
css2 = re.sub(r"/\* 触屏设备没有 hover[^*]*\*/\n@media \(hover: none\) \{\n  \.article__cite \{ opacity: \.55; \}\n\}\n", "", css2)
if css2 != css:
    io.open(P_CSS, "w", encoding="utf-8").write(css2)
    print("  ✓ views.css 已删除按钮样式（保留两端对齐）")
else:
    print("  ! views.css 未改动")

# 确认残留
s3 = io.open(P, encoding="utf-8").read()
print("  残留检查：article__cite 出现 %d 次" % s3.count("article__cite"))
css3 = io.open(P_CSS, encoding="utf-8").read()
print("  残留检查：CSS 里 .article__cite %d 次" % css3.count(".article__cite"))
print("  两端对齐仍保留：%s" % ("✓" if "text-align: justify" in css3 else "✗"))

# ============================================================ B 写切分器（仅生成候选报告，不改数据）
print("")
print("=== B) 单条长文本切分可行性（只统计，不改数据）===")
LAWS = os.path.join(ROOT, "prototype", "data", "laws")

# 中文条号：第X条（X 可为中文数字或阿拉伯数字）
RE_ZH_ART = re.compile(r"(?<![第])(第[一二三四五六七八九十百千零〇0-9]+条)")
RE_ZH_ART_SEQ = re.compile(r"第([一二三四五六七八九十百千零〇0-9]+)条")


def zh_to_int(s):
    """中文数字转整数（支持到千位）"""
    s = str(s).strip()
    if s.isdigit():
        return int(s)
    digits = {'零': 0, '〇': 0, '一': 1, '二': 2, '三': 3, '四': 4, '五': 5,
              '六': 6, '七': 7, '八': 8, '九': 9}
    units = {'十': 10, '百': 100, '千': 1000}
    total, cur = 0, 0
    for ch in s:
        if ch in digits:
            cur = digits[ch]
        elif ch in units:
            total += (cur if cur else 1) * units[ch]
            cur = 0
        else:
            return None
    return total + cur


def article_text(a):
    t = a.get("text") or {}
    return " ".join(str(v) for v in t.values() if v)


plans = []
for f in sorted(os.listdir(LAWS)):
    if not f.endswith(".json") or f == "index.json":
        continue
    lid = f[:-5]
    try:
        o = json.load(io.open(os.path.join(LAWS, f), encoding="utf-8"))
    except Exception:
        continue
    arts = o.get("articles") or []
    if len(arts) != 1:
        continue
    blob = article_text(arts[0])
    if len(blob) < 3000:
        continue
    # 找条号标记
    marks = []
    for m in RE_ZH_ART_SEQ.finditer(blob):
        n = zh_to_int(m.group(1))
        if n is None:
            continue
        marks.append((m.start(), n, m.group(0)))
    # 只保留「条号按 1,2,3… 递增」的序列，过滤掉正文里偶然提到的「第X条」引用
    seq = []
    expect = 1
    for pos, n, tok in marks:
        if n == expect:
            seq.append((pos, n, tok))
            expect += 1
    if len(seq) >= 5:
        plans.append({"id": lid, "country": o.get("country"), "chars": len(blob),
                      "splittable": len(seq), "first": seq[0][2], "last": seq[-1][2]})

plans.sort(key=lambda x: -x["splittable"])
print("  可按「第1条、第2条…递增序列」切分的：%d 部" % len(plans))
for p in plans[:25]:
    print("    %-18s %-3s %8d 字  可切 %3d 条  %s→%s" % (
        p["id"], p["country"], p["chars"], p["splittable"], p["first"], p["last"]))
if len(plans) > 25:
    print("    … 共 %d 部" % len(plans))

import json  # noqa: E402  (上面已用，这里显式导入保证顺序可读)
json.dump(plans, io.open(os.path.join(ROOT, "_work/fix/split-plans.json"), "w", encoding="utf-8"),
          ensure_ascii=False, indent=1)
print("")
print("  切分计划已写入 _work/fix/split-plans.json")
